import React, { useMemo, useState } from "react";
import { Dropdown, Button, Spinner } from "react-bootstrap";
import { FiBell } from "react-icons/fi";
import { useNotifications } from "../contexts/NotificationContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { PortalEstudiante, PortalTutor } from "../services/api.js";

const pickProp = (obj, prop) => {
  if (!obj) return undefined;
  const lower = prop.charAt(0).toLowerCase() + prop.slice(1);
  const upper = prop.charAt(0).toUpperCase() + prop.slice(1);
  if (Object.prototype.hasOwnProperty.call(obj, prop)) return obj[prop];
  if (Object.prototype.hasOwnProperty.call(obj, lower)) return obj[lower];
  if (Object.prototype.hasOwnProperty.call(obj, upper)) return obj[upper];
  return undefined;
};

const formatRelativeTime = (value) => {
  if (!value) return "ahora";
  const target = new Date(value);
  if (Number.isNaN(target.getTime())) return "ahora";
  const diffMs = Date.now() - target.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return "hace unos segundos";
  if (diffMinutes === 1) return "hace 1 min";
  if (diffMinutes < 60) return `hace ${diffMinutes} min`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours === 1) return "hace 1 hora";
  if (diffHours < 24) return `hace ${diffHours} horas`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "ayer";
  if (diffDays < 7) return `hace ${diffDays} días`;
  return target.toLocaleDateString();
};

export default function NotificationBell() {
  const { inbox, markAsRead } = useNotifications();
  const { user } = useAuth();
  const isTeacher = user?.rol === "docente";
  const [loadingKey, setLoadingKey] = useState(null);

  const ordered = useMemo(
    () => [...inbox].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [inbox]
  );

  const unreadCount = ordered.length;

  const handleMarkRead = async (item) => {
    if (!item) return;
    const destinoId = pickProp(item.data, "DestinoId") ?? pickProp(item.data, "destinoId");
    const isStudent = user?.rol === "estudiante";
    const isTutor = user?.rol === "tutor";

    if (destinoId && (isStudent || isTutor)) {
      try {
        setLoadingKey(item.key);
        if (isStudent) {
          await PortalEstudiante.marcarComunicacionLeida(destinoId);
        } else if (isTutor) {
          await PortalTutor.marcarComunicacionLeida(destinoId);
        }
      } catch (err) {
        console.error("No se pudo marcar la comunicación como leída", err);
      } finally {
        setLoadingKey(null);
      }
    }

    markAsRead(item.key, { destinoId });
  };

  return (
    <Dropdown align="end" className="notification-bell">
      <Dropdown.Toggle
        variant="light"
        size="sm"
        className={`notification-bell-toggle ${unreadCount > 0 ? "has-unread" : ""}`}
      >
        <FiBell />
        {unreadCount > 0 && (
          <span className="badge rounded-pill bg-danger ms-2" style={{ fontSize: "0.7rem" }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Dropdown.Toggle>
      <Dropdown.Menu className="notification-bell-menu shadow-sm p-0" style={{ minWidth: "320px" }}>
        <div className="px-3 py-2 border-bottom">
          <strong>Notificaciones</strong>
          <small className="d-block text-muted">Actualizaciones en tiempo real</small>
        </div>
        {ordered.length === 0 ? (
          <div className="px-3 py-3 text-muted small">No tienes notificaciones recientes.</div>
        ) : (
          ordered.map((item) => {
            const data = item.data || {};
            const asignaturaNombre = pickProp(data, "AsignaturaNombre") ?? pickProp(data, "asignaturaNombre");
            const cursoNombre = pickProp(data, "CursoNombre") ?? pickProp(data, "cursoNombre");
            const displayAsignatura = asignaturaNombre || cursoNombre;
            const docenteNombre = pickProp(data, "DocenteNombre") ?? pickProp(data, "docenteNombre");
            const remitenteNombre = docenteNombre
              ?? pickProp(data, "RemitenteNombre")
              ?? pickProp(data, "remitenteNombre")
              ?? pickProp(data, "Remitente")
              ?? pickProp(data, "remitente");
            const estudianteNombre = pickProp(data, "EstudianteNombre") ?? pickProp(data, "estudianteNombre");
            const tutorNombre = pickProp(data, "TutorNombre") ?? pickProp(data, "tutorNombre");
            const destinatarioNombre = estudianteNombre || tutorNombre;
            const showDocenteLine = !isTeacher && remitenteNombre;
            const showDestinatarioLine = isTeacher && destinatarioNombre;
            return (
              <div key={item.key} className="px-3 py-2 border-bottom notification-entry small">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-semibold">{item.payload?.title || "Nueva notificación"}</div>
                    <div className="text-muted">{item.payload?.message || "Tienes un mensaje nuevo."}</div>
                  </div>
                </div>
                {displayAsignatura && (
                  <div className="mt-1 text-muted">Asignatura: {displayAsignatura}</div>
                )}
                {showDocenteLine && (
                  <div className="text-muted">Docente: {remitenteNombre}</div>
                )}
                {showDestinatarioLine && (
                  <div className="text-muted">Estudiante: {destinatarioNombre}</div>
                )}
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <small className="text-muted">{formatRelativeTime(item.timestamp)}</small>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0"
                    onClick={() => handleMarkRead(item)}
                    disabled={loadingKey === item.key}
                  >
                    {loadingKey === item.key ? <Spinner size="sm" animation="border" /> : "Marcar leído"}
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}
