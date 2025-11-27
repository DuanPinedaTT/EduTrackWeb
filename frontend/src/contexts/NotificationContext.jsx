import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useAuth } from "./AuthContext.jsx";

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

export function NotificationProvider({ children }) {
  const { token } = useAuth();
  const [status, setStatus] = useState("disconnected");
  const [lastNotification, setLastNotification] = useState(null);
  const [inbox, setInbox] = useState([]);
  const listenersRef = useRef([]);
  const connectionRef = useRef(null);

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

  const dispatch = useCallback((payload) => {
    setLastNotification(payload);
    const typeValue = pickProp(payload, "type");
    const normalizedType = typeof typeValue === "string" ? typeValue.toLowerCase() : "";
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
    enqueueInboxItem(payload, normalizedType);
  }, [enqueueInboxItem]);

  useEffect(() => {
    listenersRef.current = listenersRef.current.filter((listener) => typeof listener?.handler === "function");
  });

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

  const markAsRead = useCallback((key) => {
    if (!key) return;
    setInbox((prev) => prev.filter((item) => item.key !== key));
  }, []);

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
