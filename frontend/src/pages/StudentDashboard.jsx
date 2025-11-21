import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Card,
  Col,
  Container,
  ProgressBar,
  Row,
  Table
} from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import useStudentProfile from "../hooks/useStudentProfile.js";
import { Asistencias, Notas, Notificaciones, Observaciones } from "../services/api.js";

const ATTENDANCE_STATUS = {
  1: { label: "Presente", variant: "success" },
  2: { label: "Ausente", variant: "danger" },
  3: { label: "Tardanza", variant: "warning" }
};

export default function StudentDashboard() {
  const { profile, loadingProfile, profileError } = useStudentProfile();
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [observations, setObservations] = useState([]);
  const [gradeInfo, setGradeInfo] = useState({ promedio: null, pendientes: 0 });

  useEffect(() => {
    const loadData = async () => {
      if (!profile) {
        setLoadingData(false);
        return;
      }

      setLoadingData(true);
      setError(null);
      try {
        const requests = [
          Asistencias.list({ estudianteId: profile.id }),
          Observaciones.list({ estudianteId: profile.id }),
          Notificaciones.list({ estudianteId: profile.id })
        ];

        const hasCurso = Boolean(profile.cursoActual?.id);
        if (hasCurso) {
          requests.push(Notificaciones.list({ cursoId: profile.cursoActual.id }));
          requests.push(Notas.listByCurso(profile.cursoActual.id));
        }

        const responses = await Promise.all(requests);
        const [attendanceRes, observationsRes, notifEstudianteRes] = responses;

        setAttendanceRecords(Array.isArray(attendanceRes.data) ? attendanceRes.data : []);
        setObservations(Array.isArray(observationsRes.data) ? observationsRes.data : []);

        const notifList = [...(Array.isArray(notifEstudianteRes.data) ? notifEstudianteRes.data : [])];
        if (hasCurso) {
          const generalRes = responses[3];
          const notasRes = responses[4];
          if (generalRes) {
            const map = new Map(notifList.map((n) => [n.id, n]));
            (Array.isArray(generalRes.data) ? generalRes.data : []).forEach((item) => {
              if (!map.has(item.id)) map.set(item.id, item);
            });
            setNotifications(Array.from(map.values()).sort((a, b) => new Date(b.fechaEnvio) - new Date(a.fechaEnvio)));
          } else {
            setNotifications(notifList.sort((a, b) => new Date(b.fechaEnvio) - new Date(a.fechaEnvio)));
          }

          if (notasRes && Array.isArray(notasRes.data)) {
            const row = notasRes.data.find((est) => est.id === profile.id);
            const promedio = row?.promedio ?? null;
            const pendientes = (row?.notas || []).filter((n) => n.valor == null).length;
            setGradeInfo({ promedio, pendientes });
          }
        } else {
          setNotifications(notifList.sort((a, b) => new Date(b.fechaEnvio) - new Date(a.fechaEnvio)));
          setGradeInfo({ promedio: null, pendientes: 0 });
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data || "No se pudo cargar el resumen del estudiante");
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [profile]);

  const attendanceSummary = useMemo(() => {
    const total = attendanceRecords.length;
    const presentes = attendanceRecords.filter((r) => r.estado === 1).length;
    const ausentes = attendanceRecords.filter((r) => r.estado === 2).length;
    const tardanzas = attendanceRecords.filter((r) => r.estado === 3).length;
    const porcentaje = total ? Math.round((presentes / total) * 100) : 0;
    return { total, presentes, ausentes, tardanzas, porcentaje };
  }, [attendanceRecords]);

  const lastNotifications = useMemo(() => notifications.slice(0, 5), [notifications]);
  const lastAttendance = useMemo(() => attendanceRecords.slice(0, 5), [attendanceRecords]);
  const criticalObservations = useMemo(() => observations.slice(0, 3), [observations]);

  if (loadingProfile || loadingData) {
    return <LoadingSpinner message="Cargando panel del estudiante..." />;
  }

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="mb-0">Bienvenido, {profile?.nombre}</h3>
              <small className="text-muted">
                {profile?.cursoActual
                  ? `${profile.cursoActual.gradoNombre || ""} · ${profile.cursoActual.nombre}`
                  : "No tienes un curso asignado por el momento."}
              </small>
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

      <Row className="mb-3">
        <Col md={3} className="mb-3">
          <Card className="card-surface shadow-sm h-100">
            <Card.Body>
              <small className="text-muted text-uppercase">Promedio general</small>
              <h2 className="mt-2">{gradeInfo.promedio != null ? gradeInfo.promedio.toFixed(2) : "--"}</h2>
              <p className="text-muted mb-0">Resumen del curso actual</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="card-surface shadow-sm h-100">
            <Card.Body>
              <small className="text-muted text-uppercase">Asistencia</small>
              <h2 className="mt-2">{attendanceSummary.porcentaje}%</h2>
              <ProgressBar now={attendanceSummary.porcentaje} />
              <p className="text-muted mb-0">{attendanceSummary.presentes} presencias</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="card-surface shadow-sm h-100">
            <Card.Body>
              <small className="text-muted text-uppercase">Pendientes</small>
              <h2 className="mt-2">{gradeInfo.pendientes}</h2>
              <p className="text-muted mb-0">Evaluaciones sin calificar</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="card-surface shadow-sm h-100">
            <Card.Body>
              <small className="text-muted text-uppercase">Alertas</small>
              <h2 className="mt-2">{observations.length}</h2>
              <p className="text-muted mb-0">Observaciones registradas</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={7} className="mb-3">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-primary text-white">
              Últimos registros de asistencia
            </Card.Header>
            <Card.Body>
              {lastAttendance.length === 0 ? (
                <Alert variant="info">Aún no hay registros de asistencia.</Alert>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Observación</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lastAttendance.map((item) => {
                        const meta = ATTENDANCE_STATUS[item.estado] || ATTENDANCE_STATUS[1];
                        return (
                          <tr key={item.id}>
                            <td>{new Date(item.fecha).toLocaleDateString()}</td>
                            <td>
                              <Badge bg={meta.variant}>{meta.label}</Badge>
                            </td>
                            <td>{item.observacion || "-"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={5} className="mb-3">
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-secondary text-white">Notificaciones recientes</Card.Header>
            <Card.Body>
              {lastNotifications.length === 0 ? (
                <p className="text-muted">Sin notificaciones.</p>
              ) : (
                <ul className="list-unstyled mb-0">
                  {lastNotifications.map((notif) => (
                    <li key={notif.id} className="mb-3">
                      <div className="d-flex justify-content-between">
                        <strong>{notif.titulo}</strong>
                        <small className="text-muted">{new Date(notif.fechaEnvio).toLocaleDateString()}</small>
                      </div>
                      <p className="mb-1 text-muted">{notif.mensaje}</p>
                      <Badge bg={notif.leida ? "success" : "warning"} text={notif.leida ? undefined : "dark"}>
                        {notif.leida ? "Leída" : "Pendiente"}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              Observaciones recientes
            </Card.Header>
            <Card.Body>
              {criticalObservations.length === 0 ? (
                <Alert variant="success">¡Buen trabajo! No hay observaciones activas.</Alert>
              ) : (
                <div className="table-responsive">
                  <Table className="align-middle">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Profesor</th>
                        <th>Tipo</th>
                        <th>Comentario</th>
                      </tr>
                    </thead>
                    <tbody>
                      {criticalObservations.map((obs) => (
                        <tr key={obs.id}>
                          <td>{new Date(obs.fecha).toLocaleDateString()}</td>
                          <td>{obs.profesor || "-"}</td>
                          <td>
                            <Badge bg="info">{obs.tipo}</Badge>
                          </td>
                          <td>{obs.comentario}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
