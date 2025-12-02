import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useAuth } from "./AuthContext.jsx";
import { PortalEstudiante, PortalTutor } from "../services/api.js";

const NotificationContext = createContext({
  status: "disconnected",
  lastNotification: null,
  subscribe: () => () => {},
  inbox: [],
  markAsRead: () => {},
  dismissByDestino: () => {}
});

const resolveHubUrl = () => {
  const explicit = import.meta.env.VITE_NOTIFICATIONS_URL;
  if (explicit) {
    return explicit;
  }
  const apiBase = import.meta.env.VITE_API_BASE_URL;
  if (apiBase) {
    return `${apiBase.replace(/\/$/, "")}/hubs/notifications`;
  }
  return "/hubs/notifications";
};

const pickProp = (obj, prop) => {
  if (!obj) return undefined;
  const lower = prop.charAt(0).toLowerCase() + prop.slice(1);
  const upper = prop.charAt(0).toUpperCase() + prop.slice(1);
  if (Object.prototype.hasOwnProperty.call(obj, prop)) return obj[prop];
  if (Object.prototype.hasOwnProperty.call(obj, lower)) return obj[lower];
  if (Object.prototype.hasOwnProperty.call(obj, upper)) return obj[upper];
  return undefined;
};

const createListenerId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random()}`;
};

// Administra la conexión SignalR y entrega utilidades de notificaciones en toda la app.
export function NotificationProvider({ children }) {
  const { token, user } = useAuth();
  const [status, setStatus] = useState("disconnected");
  const [lastNotification, setLastNotification] = useState(null);
  const [inbox, setInbox] = useState([]);
  const listenersRef = useRef([]);
  const connectionRef = useRef(null);
  const seededInboxRef = useRef(false);

  const enqueueInboxItem = useCallback((payload, normalizedType) => {
    if (normalizedType !== "comunicacion") {
      return;
    }

    const data = pickProp(payload, "Data") ?? pickProp(payload, "data") ?? {};
    const destinoId = pickProp(data, "DestinoId") ?? pickProp(data, "destinoId");
    const timestampValue =
      pickProp(payload, "Timestamp") ?? pickProp(payload, "timestamp") ?? pickProp(data, "timestamp") ?? new Date().toISOString();
    const key = destinoId ?? `${normalizedType}-${timestampValue}`;

    setInbox((prev) => {
      const filtered = prev.filter((item) => item.key !== key);
      const entry = {
        key,
        clientId: createListenerId(),
        type: normalizedType,
        payload,
        data,
        timestamp: timestampValue,
        read: false
      };
      return [entry, ...filtered].slice(0, 20);
    });
  }, []);

  const deliverToListeners = useCallback((normalizedType, payload) => {
    listenersRef.current.forEach((listener) => {
      if (!listener?.handler) {
        return;
      }
      if (!listener.type || listener.type === normalizedType) {
        try {
          listener.handler(payload);
        } catch (err) {
          console.error("Failed to deliver notification", err);
        }
      }
    });
  }, []);

  const dispatch = useCallback((payload) => {
    setLastNotification(payload);
    const typeValue = pickProp(payload, "type");
    const normalizedType = typeof typeValue === "string" ? typeValue.toLowerCase() : "";
    deliverToListeners(normalizedType, payload);
    enqueueInboxItem(payload, normalizedType);
  }, [enqueueInboxItem, deliverToListeners]);

  const emitLocalEvent = useCallback((type, data = {}) => {
    if (!type) return;
    const normalizedType = type.toLowerCase();
    const timestamp = new Date().toISOString();
    const payload = {
      type: normalizedType,
      Type: normalizedType,
      data,
      Data: data,
      timestamp,
      Timestamp: timestamp
    };
    deliverToListeners(normalizedType, payload);
  }, [deliverToListeners]);

  // Limpia listeners inválidos para evitar ejecuciones fantasma.
  useEffect(() => {
    listenersRef.current = listenersRef.current.filter((listener) => typeof listener?.handler === "function");
  });

  // Maneja el ciclo de vida de la conexión SignalR según el token disponible.
  useEffect(() => {
    let isCancelled = false;

    const cleanupConnection = async () => {
      if (!connectionRef.current) return;
      try {
        connectionRef.current.off("notification");
        await connectionRef.current.stop();
      } catch (err) {
        console.debug("Notification hub stop failed", err);
      }
      connectionRef.current = null;
    };

    if (!token) {
      cleanupConnection();
      setStatus("disconnected");
      return () => {
        isCancelled = true;
      };
    }

    const connection = new HubConnectionBuilder()
      .withUrl(resolveHubUrl(), {
        accessTokenFactory: () => token
      })
      .configureLogging(LogLevel.Warning)
      .withAutomaticReconnect()
      .build();

    connection.on("notification", (payload) => dispatch(payload));
    connection.onreconnecting(() => {
      if (!isCancelled) setStatus("reconnecting");
    });
    connection.onreconnected(() => {
      if (!isCancelled) setStatus("connected");
    });
    connection.onclose(() => {
      if (!isCancelled) setStatus("disconnected");
    });

    connectionRef.current = connection;

    const startConnection = async (attempt = 0) => {
      try {
        await connection.start();
        if (!isCancelled) {
          setStatus("connected");
        }
      } catch (err) {
        console.error("SignalR connection failed", err);
        if (!isCancelled) {
          setStatus("error");
          const timeout = Math.min(10000, 1000 * (attempt + 1));
          setTimeout(() => startConnection(attempt + 1), timeout);
        }
      }
    };

    setStatus("connecting");
    startConnection();

    return () => {
      isCancelled = true;
      cleanupConnection();
    };
  }, [token, dispatch]);

  // Permite a componentes suscribirse a un tipo específico (o todos) y devuelve un unsubscribe.
  const subscribe = useCallback((typeOrHandler, maybeHandler) => {
    const type = typeof typeOrHandler === "string" ? typeOrHandler.toLowerCase() : null;
    const handler = typeof typeOrHandler === "function" ? typeOrHandler : maybeHandler;

    if (typeof handler !== "function") {
      return () => {};
    }

    const listener = {
      id: createListenerId(),
      type,
      handler
    };

    listenersRef.current.push(listener);

    return () => {
      listenersRef.current = listenersRef.current.filter((item) => item.id !== listener.id);
    };
  }, []);

  // Quita notificaciones del inbox local y dispara eventos "comunicacion-leida" para otros paneles.
  const markAsRead = useCallback((key, options = {}) => {
    if (!key) return;
    let emitPayload = null;
    setInbox((prev) => {
      const target = prev.find((item) => item.key === key);
      const remaining = prev.filter((item) => item.key !== key);
      if (target && target.type === "comunicacion") {
        const destinoId = options.destinoId
          ?? pickProp(target.data, "DestinoId")
          ?? pickProp(target.data, "destinoId");
        if (destinoId) {
          emitPayload = { destinoId };
        }
      }
      return remaining;
    });
    if (emitPayload) {
      emitLocalEvent("comunicacion-leida", emitPayload);
    }
  }, [emitLocalEvent]);

  // Elimina cualquier notificación vinculada a un destino específico (ej. cuando se lee desde otro lugar).
  const dismissByDestino = useCallback((destinoId) => {
    if (destinoId == null) return;
    setInbox((prev) =>
      prev.filter((item) => {
        const itemDestino = pickProp(item.data, "DestinoId") ?? pickProp(item.data, "destinoId");
        if (itemDestino == null) return true;
        return itemDestino !== destinoId;
      })
    );
  }, []);

  // Pre-carga el inbox con comunicaciones no leídas cuando el usuario es estudiante/tutor.
  const seedInboxFromApi = useCallback(async () => {
    if (seededInboxRef.current) return;
    if (!token) return;
    const rol = user?.rol;
    const isStudent = rol === "estudiante";
    const isTutor = rol === "tutor";
    if (!isStudent && !isTutor) return;

    try {
      const res = isStudent ? await PortalEstudiante.comunicaciones() : await PortalTutor.comunicaciones();
      const data = Array.isArray(res.data) ? res.data : [];
      const unread = data.filter((item) => !(item.Leido ?? item.leido));
      if (unread.length === 0) {
        seededInboxRef.current = true;
        return;
      }

      setInbox((prev) => {
        const existingKeys = new Set(prev.map((item) => item.key));
        const hydrated = [...prev];

        unread.forEach((com) => {
          const destinoId = com.Id ?? com.id;
          if (!destinoId || existingKeys.has(String(destinoId))) {
            return;
          }

          const timestampValue = com.CreadaEn ?? com.creadaEn ?? new Date().toISOString();
          const docenteNombre = com.DocenteNombre ?? com.docenteNombre ?? com.Remitente ?? com.remitente;
          const titleValue = com.Titulo ?? com.titulo ?? "Nueva comunicación";
          const messageValue = com.Mensaje ?? com.mensaje ?? "Tienes una nueva comunicación.";
          const payloadData = {
            DestinoId: destinoId,
            destinoId,
            RemitenteNombre: docenteNombre,
            remitenteNombre: docenteNombre,
            DocenteNombre: docenteNombre,
            docenteNombre,
            titulo: com.Titulo ?? com.titulo,
            mensaje: com.Mensaje ?? com.mensaje,
            tipo: com.Tipo ?? com.tipo,
            estudianteId: isStudent ? (com.EstudianteId ?? null) : null,
            tutorId: isTutor ? (com.TutorId ?? null) : null
          };

          const payload = {
            type: "comunicacion",
            title: titleValue,
            Title: titleValue,
            message: messageValue,
            Message: messageValue,
            Data: payloadData,
            Timestamp: timestampValue
          };

          hydrated.push({
            key: String(destinoId),
            clientId: createListenerId(),
            type: "comunicacion",
            payload,
            data: payloadData,
            timestamp: timestampValue,
            read: false
          });
        });

        return hydrated.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      });

      seededInboxRef.current = true;
    } catch (err) {
      console.debug("No se pudo precargar el inbox", err);
    }
  }, [token, user?.rol]);

  useEffect(() => {
    if (!token) {
      seededInboxRef.current = false;
      setInbox([]);
      return;
    }
    seedInboxFromApi();
  }, [token, seedInboxFromApi]);

  const value = useMemo(
    () => ({
      status,
      lastNotification,
      subscribe,
      inbox,
      markAsRead,
      dismissByDestino
    }),
    [inbox, lastNotification, status, subscribe, markAsRead, dismissByDestino]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  return useContext(NotificationContext);
}
