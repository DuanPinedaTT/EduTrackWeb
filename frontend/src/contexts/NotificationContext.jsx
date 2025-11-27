import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useAuth } from "./AuthContext.jsx";

const NotificationContext = createContext({
  status: "disconnected",
  lastNotification: null,
  subscribe: () => () => {}
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
  const listenersRef = useRef([]);
  const connectionRef = useRef(null);

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
  }, []);

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

  const value = useMemo(
    () => ({
      status,
      lastNotification,
      subscribe
    }),
    [lastNotification, status, subscribe]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  return useContext(NotificationContext);
}
