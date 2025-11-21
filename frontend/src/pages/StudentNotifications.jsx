import React, { useEffect, useMemo, useState } from "react";
import { Alert, Badge, Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import useStudentProfile from "../hooks/useStudentProfile.js";
import { Notificaciones } from "../services/api.js";

const tipoColor = {
  general: "secondary",
  tarea: "info",
  evaluacion: "danger",
  proyecto: "warning",
  urgente: "dark"
};

export default function StudentNotifications() {
  const { profile, loadingProfile, profileError } = useStudentProfile();
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [filterUnread, setFilterUnread] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!profile?.id) {
        setLoadingData(false);
        return;
      }
      setLoadingData(true);
      setError(null);
      try {
        const requests = [Notificaciones.list({ estudianteId: profile.id })];
        if (profile.cursoActual?.id) {
          requests.push(Notificaciones.list({ cursoId: profile.cursoActual.id }));
        }
        const responses = await Promise.all(requests);
        const all = [];
        responses.forEach((res) => {
          (Array.isArray(res.data) ? res.data : []).forEach((notif) => {
            if (!all.find((n) => n.id === notif.id)) {
              all.push(notif);
            }
          });
        });
        all.sort((a, b) => new Date(b.fechaEnvio) - new Date(a.fechaEnvio));
        setNotifications(all);
      } catch (err) {
        setError(err.response?.data || "No se pudieron cargar las notificaciones");
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, [profile]);

  const filtered = useMemo(() => {
    return filterUnread ? notifications.filter((n) => !n.leida) : notifications;
  }, [notifications, filterUnread]);

  const markAsRead = async (notificationId) => {
    try {
      await Notificaciones.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === notificationId ? { ...notif, leida: true } : notif))
      );
    } catch (err) {
      setError(err.response?.data || "No se pudo marcar como leída la notificación");
    }
  };

  if (loadingProfile || loadingData) {
    return <LoadingSpinner message="Cargando notificaciones..." />;
  }

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="mb-0">Mis notificaciones</h3>
              <small className="text-muted">Revisa los avisos de tus docentes.</small>
            </div>
            <div>
              <Button
                variant={filterUnread ? "secondary" : "outline-secondary"}
                onClick={() => setFilterUnread((prev) => !prev)}
              >
                {filterUnread ? "Ver todas" : "Solo pendientes"}
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {profileError && (
        <Row className="mb-3">
          <Col>
            <Alert variant="warning">{String(profileError)}</Alert>
          </Col>
        </Row>
      )}

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {String(error)}
            </Alert>
          </Col>
        </Row>
      )}

      <Card className="shadow-sm">
        <Card.Body>
          {filtered.length === 0 ? (
            <Alert variant="info">No hay notificaciones para mostrar.</Alert>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Fecha</th>
                    <th>Título</th>
                    <th>Tipo</th>
                    <th>Mensaje</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((notif) => (
                    <tr key={notif.id}>
                      <td>{new Date(notif.fechaEnvio).toLocaleString()}</td>
                      <td>{notif.titulo}</td>
                      <td>
                        <Badge bg={tipoColor[notif.tipo] || "secondary"}>{notif.tipo}</Badge>
                      </td>
                      <td>{notif.mensaje}</td>
                      <td>
                        {notif.leida ? (
                          <Badge bg="success">Leída</Badge>
                        ) : (
                          <Button size="sm" variant="outline-primary" onClick={() => markAsRead(notif.id)}>
                            Marcar como leída
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
