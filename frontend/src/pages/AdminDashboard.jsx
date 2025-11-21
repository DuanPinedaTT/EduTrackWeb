import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Alert,
  Card,
  Table,
  ListGroup,
  Badge,
  ProgressBar
} from "react-bootstrap";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import { FaUsers, FaBook, FaChalkboardTeacher, FaBell } from "react-icons/fa";
import api from "../services/api.js";
import StatsCard from "../components/StatsCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const formatter = new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short" });

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payload, setPayload] = useState({
    stats: null,
    asignaturas: [],
    periodos: [],
    cursos: [],
    docentes: [],
    notificaciones: []
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, asignRes, periodRes, cursosRes, docentesRes, notiRes] = await Promise.all([
        api.get("/Estadisticas"),
        api.get("/Asignaturas"),
        api.get("/Periodos"),
        api.get("/cursos"),
        api.get("/usuarios?rol=docente"),
        api.get("/Notificaciones?leida=false")
      ]);

      setPayload({
        stats: statsRes.data,
        asignaturas: asignRes.data || [],
        periodos: periodRes.data || [],
        cursos: cursosRes.data || [],
        docentes: docentesRes.data || [],
        notificaciones: notiRes.data || []
      });
    } catch (err) {
      setError(err.response?.data || "Error cargando estadísticas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const cursosPorGrado = useMemo(() => {
    const grouped = payload.cursos.reduce((acc, curso) => {
      const key = curso.gradoNombre || "Sin grado";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(grouped).map(([nombre, total]) => ({ nombre, total }));
  }, [payload.cursos]);

  const docentesRecientes = useMemo(() => {
    return [...(payload.docentes || [])]
      .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
      .slice(0, 5);
  }, [payload.docentes]);

  const alertas = useMemo(() => {
    return (payload.notificaciones || []).slice(0, 4);
  }, [payload.notificaciones]);

  const periodoActivo = payload.periodos.find((p) => p.activo);

  const progresoPeriodo = () => {
    if (!periodoActivo) return 0;
    const inicio = new Date(periodoActivo.fechaInicio);
    const fin = new Date(periodoActivo.fechaFin);
    const hoy = new Date();
    if (hoy <= inicio) return 0;
    if (hoy >= fin) return 100;
    const total = fin.getTime() - inicio.getTime();
    const transcurrido = hoy.getTime() - inicio.getTime();
    return Math.min(100, Math.max(0, Math.round((transcurrido / total) * 100)));
  };

  if (loading) return <LoadingSpinner message="Cargando panel..." />;

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
            <div>
              <h3 className="mb-1">Panel de administración</h3>
              <p className="text-muted mb-0">
                Resumen consolidado de docentes, cursos, periodos y alertas.
              </p>
            </div>
            <small className="text-muted">Última actualización: {formatter.format(new Date())}</small>
          </div>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {String(error)}
            </Alert>
          </Col>
        </Row>
      )}

      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <StatsCard
            title="Docentes activos"
            value={payload.stats?.totalDocentes ?? 0}
            color="primary"
            icon={<FaChalkboardTeacher />}
          />
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <StatsCard
            title="Cursos registrados"
            value={payload.stats?.totalCursos ?? 0}
            color="secondary"
            icon={<FaBook />}
          />
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <StatsCard
            title="Estudiantes"
            value={payload.stats?.totalEstudiantes ?? 0}
            color="accent"
            icon={<FaUsers />}
          />
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <StatsCard
            title="Asignaturas"
            value={payload.asignaturas.length}
            color="success"
            icon={<FaBook />}
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={8} className="mb-3">
          <Card className="card-surface h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <Card.Title className="mb-0">Distribución de cursos por grado</Card.Title>
                  <small className="text-muted">Agrupado según la configuración actual</small>
                </div>
              </div>
              {cursosPorGrado.length === 0 ? (
                <div className="text-center text-muted py-4">No hay cursos registrados.</div>
              ) : (
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={cursosPorGrado}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                      <XAxis dataKey="nombre" stroke="#6c757d" />
                      <YAxis allowDecimals={false} stroke="#6c757d" />
                      <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                      <Bar dataKey="total" fill="#0d6efd" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-3">
          <Card className="card-surface h-100">
            <Card.Body>
              <Card.Title className="mb-3">Periodos académicos</Card.Title>
              {periodoActivo ? (
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>{periodoActivo.nombre}</strong>
                    <Badge bg="success">Activo</Badge>
                  </div>
                  <small className="text-muted d-block mb-2">
                    {formatter.format(new Date(periodoActivo.fechaInicio))} → {formatter.format(new Date(periodoActivo.fechaFin))}
                  </small>
                  <ProgressBar now={progresoPeriodo()} label={`${progresoPeriodo()}%`} visuallyHidden={false} />
                </div>
              ) : (
                <div className="text-muted mb-3">No hay un periodo activo.</div>
              )}
              <ListGroup variant="flush">
                {payload.periodos.slice(0, 4).map((periodo) => (
                  <ListGroup.Item key={periodo.id} className="px-0 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">{periodo.nombre}</div>
                      <small className="text-muted">
                        {formatter.format(new Date(periodo.fechaInicio))} · {formatter.format(new Date(periodo.fechaFin))}
                      </small>
                    </div>
                    <Badge bg={periodo.activo ? "success" : "secondary"}>
                      {periodo.activo ? "En curso" : `Orden ${periodo.orden}`}
                    </Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={6} className="mb-3">
          <Card className="card-surface h-100">
            <Card.Body>
              <Card.Title className="mb-3">Docentes más recientes</Card.Title>
              {docentesRecientes.length === 0 ? (
                <div className="text-muted">No hay docentes registrados.</div>
              ) : (
                <Table hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Especialidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docentesRecientes.map((docente) => (
                      <tr key={docente.id}>
                        <td>{docente.nombre} {docente.apellido}</td>
                        <td>{docente.email}</td>
                        <td>{docente.especialidad || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-3">
          <Card className="card-surface h-100">
            <Card.Body>
              <Card.Title className="mb-3 d-flex align-items-center gap-2">
                <FaBell /> Centro de alertas
              </Card.Title>
              {alertas.length === 0 ? (
                <div className="text-muted">No hay notificaciones pendientes.</div>
              ) : (
                <ListGroup variant="flush">
                  {alertas.map((alerta) => (
                    <ListGroup.Item key={alerta.id} className="px-0">
                      <div className="d-flex justify-content-between">
                        <div>
                          <strong>{alerta.titulo}</strong>
                          <p className="mb-0 text-muted" style={{ fontSize: "0.85rem" }}>{alerta.mensaje}</p>
                        </div>
                        <small className="text-muted">
                          {formatter.format(new Date(alerta.fechaEnvio))}
                        </small>
                      </div>
                      <Badge bg="warning" text="dark" className="mt-2">{alerta.tipo || "General"}</Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
