import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Alert, Table, Badge, Button, ListGroup } from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { PortalEstudiante } from "../services/api.js";

const PERIODOS = [
  { id: null, nombre: "Todos" },
  { id: 1, nombre: "Periodo 1" },
  { id: 2, nombre: "Periodo 2" },
  { id: 3, nombre: "Periodo 3" },
  { id: 4, nombre: "Periodo 4" }
];

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

export default function StudentDashboard() {
  const [resumen, setResumen] = useState(null);
  const [loadingResumen, setLoadingResumen] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();

  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [notas, setNotas] = useState({ columnas: [], promedio: null });
  const [loadingNotas, setLoadingNotas] = useState(false);

  const [asistencias, setAsistencias] = useState([]);
  const [comunicaciones, setComunicaciones] = useState([]);
  const [markingId, setMarkingId] = useState(null);

  const loadResumen = async () => {
    try {
      setLoadingResumen(true);
      setError(null);
      const res = await PortalEstudiante.resumen();
      setResumen(res.data);
    } catch (err) {
      setError(err.response?.data || "No se pudo cargar el resumen");
    } finally {
      setLoadingResumen(false);
    }
  };

  const loadNotas = async (periodo) => {
    try {
      setLoadingNotas(true);
      setError(null);
      const res = await PortalEstudiante.notas(periodo);
      setNotas({
        columnas: res.data?.columnas || [],
        promedio: res.data?.promedio ?? null,
        cursoId: res.data?.cursoId ?? null
      });
    } catch (err) {
      setError(err.response?.data || "No se pudo cargar las notas");
    } finally {
      setLoadingNotas(false);
    }
  };

  const loadAsistencias = async () => {
    try {
      const res = await PortalEstudiante.asistencias();
      setAsistencias(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data || "No se pudo cargar las asistencias");
    }
  };

  const loadComunicaciones = async () => {
    try {
      const res = await PortalEstudiante.comunicaciones();
      setComunicaciones(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data || "No se pudieron cargar las comunicaciones");
    }
  };

  useEffect(() => {
    loadResumen();
    loadAsistencias();
    loadComunicaciones();
  }, []);

  useEffect(() => {
    loadNotas(selectedPeriod);
  }, [selectedPeriod]);

  useEffect(() => {
    if (!location.hash) return;
    const target = document.querySelector(location.hash);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  const promedioLabel = useMemo(() => {
    if (notas.promedio == null) return { text: "Sin cálculo", variant: "secondary" };
    if (notas.promedio >= 4) return { text: `${notas.promedio.toFixed(2)} Excelente`, variant: "success" };
    if (notas.promedio >= 3) return { text: `${notas.promedio.toFixed(2)} Aceptable`, variant: "primary" };
    return { text: `${notas.promedio.toFixed(2)} En riesgo`, variant: "danger" };
  }, [notas.promedio]);

  const handleMarcarLeido = async (destinoId) => {
    try {
      setMarkingId(destinoId);
      await PortalEstudiante.marcarComunicacionLeida(destinoId);
      setComunicaciones((prev) =>
        prev.map((c) => (c.Id === destinoId || c.id === destinoId ? { ...c, Leido: true, LeidoEn: new Date().toISOString() } : c))
      );
    } catch (err) {
      setError(err.response?.data || "No se pudo marcar como leído");
    } finally {
      setMarkingId(null);
    }
  };

  if (loadingResumen) return <LoadingSpinner message="Cargando portal estudiantil..." />;

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h3 className="mb-1">Portal del Estudiante</h3>
          <p className="text-muted mb-0">Consulta tus promedios, asistencias y comunicaciones recientes.</p>
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

      {resumen && (
        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>Perfil</Card.Title>
                <ListGroup variant="flush" className="mt-3">
                  <ListGroup.Item className="px-0">
                    <strong>Nombre:</strong> {resumen.estudiante?.nombre || resumen.estudiante?.Nombre}
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0">
                    <strong>Documento:</strong> {resumen.estudiante?.documento || resumen.estudiante?.Documento}
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0">
                    <strong>Grado:</strong> {resumen.estudiante?.Grado || "-"}
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0">
                    <strong>Grupo:</strong> {resumen.estudiante?.Grupo || "-"}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>Curso actual</Card.Title>
                {resumen.curso ? (
                  <>
                    <p className="mb-1 mt-3">{resumen.curso.Nombre}</p>
                    <p className="text-muted mb-2">{resumen.curso.Grado} • Grupo {resumen.curso.Grupo}</p>
                    <Badge bg={promedioLabel.variant}>{promedioLabel.text}</Badge>
                  </>
                ) : (
                  <p className="text-muted mt-3">Aún no tienes curso asignado.</p>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>Últimas asistencias</Card.Title>
                {asistencias.length === 0 ? (
                  <p className="text-muted mt-3">Sin registros recientes.</p>
                ) : (
                  <ListGroup variant="flush" className="mt-3">
                    {asistencias.slice(0, 3).map((a) => (
                      <ListGroup.Item key={a.Id || a.id} className="px-0">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{formatDate(a.Fecha)}</strong>
                            <small className="d-block text-muted">{a.Curso}</small>
                          </div>
                          <Badge bg={a.Estado === "Presente" ? "success" : a.Estado === "Tarde" ? "warning" : "danger"}>
                            {a.Estado}
                          </Badge>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Row className="mb-4" id="notas">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between flex-wrap align-items-center mb-3">
                <div>
                  <Card.Title className="mb-0">Notas por periodo</Card.Title>
                  <small className="text-muted">Consulta tus calificaciones ponderadas.</small>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  {PERIODOS.map((p) => (
                    <Button
                      key={p.id ?? "all"}
                      size="sm"
                      variant={selectedPeriod === p.id ? "primary" : "outline-secondary"}
                      onClick={() => setSelectedPeriod(p.id)}
                    >
                      {p.nombre}
                    </Button>
                  ))}
                </div>
              </div>

              {loadingNotas ? (
                <LoadingSpinner message="Cargando notas..." />
              ) : notas.columnas.length === 0 ? (
                <Alert variant="light" className="mb-0">
                  Aún no hay columnas configuradas para el periodo seleccionado.
                </Alert>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <Table hover responsive>
                    <thead>
                      <tr>
                        <th>Actividad</th>
                        <th>Periodo</th>
                        <th>Peso</th>
                        <th>Nota</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notas.columnas.map((col) => (
                        <tr key={col.Id || col.id}>
                          <td>{col.Nombre}</td>
                          <td>{col.Periodo}</td>
                          <td>{col.Peso}%</td>
                          <td>
                            {col.Valor != null ? (
                              <Badge bg={col.Valor >= 3 ? "success" : "danger"}>{col.Valor.toFixed(2)}</Badge>
                            ) : (
                              <Badge bg="secondary">Pendiente</Badge>
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
        </Col>
      </Row>

      <Row className="mb-4" id="asistencias">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Historial de asistencias</Card.Title>
              <small className="text-muted">Últimos 200 registros.</small>
              {asistencias.length === 0 ? (
                <Alert variant="light" className="mt-3 mb-0">
                  No se encontraron asistencias registradas.
                </Alert>
              ) : (
                <div style={{ overflowX: "auto" }} className="mt-3">
                  <Table striped responsive size="sm">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Curso</th>
                        <th>Periodo</th>
                        <th>Estado</th>
                        <th>Observación</th>
                      </tr>
                    </thead>
                    <tbody>
                      {asistencias.map((a) => (
                        <tr key={a.Id || a.id}>
                          <td>{formatDate(a.Fecha)}</td>
                          <td>{a.Curso}</td>
                          <td>{a.Periodo}</td>
                          <td>
                            <Badge bg={a.Estado === "Presente" ? "success" : a.Estado === "Tarde" ? "warning" : "danger"}>{a.Estado}</Badge>
                          </td>
                          <td>{a.Observacion || "-"}</td>
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

      <Row id="comunicaciones" className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Comunicaciones recientes</Card.Title>
              {comunicaciones.length === 0 ? (
                <Alert variant="light" className="mt-3 mb-0">
                  No tienes comunicaciones recientes.
                </Alert>
              ) : (
                <ListGroup variant="flush" className="mt-3">
                  {comunicaciones.map((com) => {
                    const id = com.Id ?? com.id;
                    const leido = com.Leido ?? com.leido;
                    return (
                      <ListGroup.Item key={id} className="px-0">
                        <div className="d-flex justify-content-between flex-wrap align-items-start">
                          <div>
                            <div className="d-flex align-items-center gap-2">
                              <strong>{com.Titulo || com.titulo}</strong>
                              {!leido && <Badge bg="warning" text="dark">Nuevo</Badge>}
                            </div>
                            <small className="text-muted d-block">
                              {com.Remitente || com.remitente} • {formatDate(com.CreadaEn || com.creadaEn)}
                            </small>
                            <p className="mb-1 mt-2">{com.Mensaje || com.mensaje}</p>
                          </div>
                          {!leido && (
                            <Button
                              size="sm"
                              variant="outline-primary"
                              disabled={markingId === id}
                              onClick={() => handleMarcarLeido(id)}
                            >
                              {markingId === id ? "Marcando..." : "Marcar leído"}
                            </Button>
                          )}
                        </div>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
