import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Alert, Table, Badge, Button, ListGroup, Dropdown } from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { PortalTutor } from "../services/api.js";

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

const pickProp = (obj, prop) => {
  if (!obj || !prop) return undefined;
  const lower = prop.charAt(0).toLowerCase() + prop.slice(1);
  const upper = prop.charAt(0).toUpperCase() + prop.slice(1);
  const candidates = [prop, lower, upper];
  for (const key of candidates) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return obj[key];
    }
  }
  return undefined;
};

export default function ParentDashboard() {
  const [hijos, setHijos] = useState([]);
  const [loadingHijos, setLoadingHijos] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();

  const [selectedChildId, setSelectedChildId] = useState(null);
  const selectedChild = useMemo(() => hijos.find((h) => h.EstudianteId === selectedChildId || h.estudianteId === selectedChildId), [hijos, selectedChildId]);

  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [notas, setNotas] = useState({ columnas: [], promedio: null });
  const [loadingNotas, setLoadingNotas] = useState(false);
  const [materias, setMaterias] = useState([]);
  const [selectedMateria, setSelectedMateria] = useState(null);
  const [asistencias, setAsistencias] = useState([]);

  const [comunicaciones, setComunicaciones] = useState([]);
  const [markingId, setMarkingId] = useState(null);

  const loadHijos = async () => {
    try {
      setLoadingHijos(true);
      setError(null);
      const res = await PortalTutor.hijos();
      const data = Array.isArray(res.data) ? res.data : [];
      setHijos(data);
      if (data.length > 0) {
        setSelectedChildId(data[0].EstudianteId || data[0].estudianteId);
      }
    } catch (err) {
      setError(err.response?.data || "No se pudieron cargar los estudiantes a cargo");
    } finally {
      setLoadingHijos(false);
    }
  };

  const loadNotas = async (studentIdParam = selectedChildId, periodoValue = selectedPeriod, materiaId = selectedMateria) => {
    if (!studentIdParam) return;
    try {
      setLoadingNotas(true);
      setError(null);
      const res = await PortalTutor.notas(studentIdParam, periodoValue, materiaId);
      const materiasList = Array.isArray(res.data?.materias) ? res.data.materias : [];
      setMaterias(materiasList);

      const firstMateriaId = materiasList.length
        ? pickProp(materiasList[0], "Id") ?? pickProp(materiasList[0], "id")
        : null;

      const resolvedMateriaRaw = res.data?.cursoId ?? materiaId ?? firstMateriaId ?? null;
      const resolvedMateria = resolvedMateriaRaw == null ? null : Number(resolvedMateriaRaw);
      const normalizedMateria = Number.isNaN(resolvedMateria) ? null : resolvedMateria;

      if (normalizedMateria !== selectedMateria) {
        setSelectedMateria(normalizedMateria);
      }

      const normalizedPeriodo = periodoValue ?? null;
      if (normalizedPeriodo !== selectedPeriod) {
        setSelectedPeriod(normalizedPeriodo);
      }

      setNotas({
        columnas: res.data?.columnas || [],
        promedio: res.data?.promedio ?? null,
        cursoId: normalizedMateria
      });
    } catch (err) {
      setError(err.response?.data || "No se pudo cargar las notas del estudiante");
      setNotas({ columnas: [], promedio: null, cursoId: null });
    } finally {
      setLoadingNotas(false);
    }
  };

  const loadAsistencias = async (studentId) => {
    if (!studentId) return;
    try {
      const res = await PortalTutor.asistencias(studentId);
      setAsistencias(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data || "No se pudo cargar la asistencia");
    }
  };

  const loadComunicaciones = async () => {
    try {
      const res = await PortalTutor.comunicaciones();
      setComunicaciones(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data || "No se pudieron cargar las comunicaciones");
    }
  };

  useEffect(() => {
    loadHijos();
    loadComunicaciones();
  }, []);

  useEffect(() => {
    if (!selectedChildId) return;
    setSelectedPeriod(null);
    setSelectedMateria(null);
    setMaterias([]);
    setNotas({ columnas: [], promedio: null, cursoId: null });
    loadNotas(selectedChildId, null, null);
    loadAsistencias(selectedChildId);
  }, [selectedChildId]);

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
  const showingSinglePeriod = selectedPeriod !== null;
  const periodoResumenLabel = selectedPeriod ? `Periodo ${selectedPeriod}` : "Todos los periodos";
  const selectedMateriaInfo = useMemo(() => {
    if (!selectedMateria) return null;
    return (
      materias.find((m) => {
        const idValue = pickProp(m, "Id") ?? pickProp(m, "id");
        const numericId = idValue == null ? null : Number(idValue);
        return numericId === selectedMateria;
      }) || null
    );
  }, [materias, selectedMateria]);
  const materiaDescripcion = selectedMateriaInfo
    ? `${pickProp(selectedMateriaInfo, "Nombre") || pickProp(selectedMateriaInfo, "Curso") || "Materia"}${pickProp(selectedMateriaInfo, "Grado") ? ` • ${pickProp(selectedMateriaInfo, "Grado")}` : ""}${pickProp(selectedMateriaInfo, "Grupo") ? ` (${pickProp(selectedMateriaInfo, "Grupo")})` : ""}`
    : "Selecciona una asignatura";

  const handleMarcarLeido = async (destinoId) => {
    try {
      setMarkingId(destinoId);
      await PortalTutor.marcarComunicacionLeida(destinoId);
      setComunicaciones((prev) =>
        prev.map((c) => (c.Id === destinoId || c.id === destinoId ? { ...c, Leido: true, LeidoEn: new Date().toISOString() } : c))
      );
    } catch (err) {
      setError(err.response?.data || "No se pudo marcar como leído");
    } finally {
      setMarkingId(null);
    }
  };

  const handleMateriaClick = (cursoId) => {
    if (!selectedChildId || cursoId == null) return;
    const normalizedId = Number(cursoId);
    if (Number.isNaN(normalizedId)) return;
    setSelectedMateria(normalizedId);
    loadNotas(selectedChildId, selectedPeriod, normalizedId);
  };

  const handlePeriodoClick = (periodoId) => {
    if (!selectedChildId) return;
    setSelectedPeriod(periodoId);
    loadNotas(selectedChildId, periodoId, selectedMateria);
  };

  if (loadingHijos) return <LoadingSpinner message="Cargando portal para tutores..." />;

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h3 className="mb-1">Portal de Familias</h3>
          <p className="text-muted mb-0">Monitorea el progreso académico y comunicaciones de tus estudiantes.</p>
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

      {hijos.length === 0 ? (
        <Alert variant="light">No tienes estudiantes asociados a tu cuenta todavía.</Alert>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={4} className="mb-3">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>Estudiantes a cargo</Card.Title>
                  <ListGroup className="mt-3">
                    {hijos.map((hijo) => {
                      const id = hijo.EstudianteId || hijo.estudianteId;
                      const active = id === selectedChildId;
                      return (
                        <ListGroup.Item
                          key={id}
                          action
                          active={active}
                          onClick={() => setSelectedChildId(id)}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <strong>{hijo.Nombre || hijo.nombre}</strong>
                              <small className="d-block text-muted">
                                {hijo.Grado || hijo.grado || ""} • Grupo {hijo.Grupo || hijo.grupo || "-"}
                              </small>
                            </div>
                            {(hijo.EsPrincipal || hijo.esPrincipal) && <Badge bg="info">Principal</Badge>}
                          </div>
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            <Col md={8} className="mb-3">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>Resumen académico</Card.Title>
                  {selectedChild ? (
                    <>
                      <div className="d-flex justify-content-between flex-wrap align-items-center mb-3">
                        <div>
                          <h5 className="mb-0">{selectedChild.Nombre || selectedChild.nombre}</h5>
                          <small className="text-muted">{selectedChild.Grado || selectedChild.grado} • Grupo {selectedChild.Grupo || selectedChild.grupo}</small>
                        </div>
                        <Dropdown>
                          <Dropdown.Toggle size="sm" variant="outline-secondary">
                            {PERIODOS.find((p) => p.id === selectedPeriod)?.nombre || "Periodo"}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {PERIODOS.map((p) => (
                              <Dropdown.Item key={p.id ?? "all"} onClick={() => handlePeriodoClick(p.id)}>
                                {p.nombre}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                      <Badge bg={promedioLabel.variant}>{promedioLabel.text}</Badge>
                    </>
                  ) : (
                    <p className="text-muted">Selecciona un estudiante para ver detalles.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {selectedChild && (
            <>
              <Row className="mb-4" id="parent-notas">
                <Col>
                  <Card className="shadow-sm">
                    <Card.Body>
                      <div className="d-flex flex-wrap justify-content-between gap-3 mb-3 align-items-start">
                        <div>
                          <Card.Title className="mb-0">Notas por asignatura</Card.Title>
                          <small className="text-muted d-block">{materiaDescripcion}</small>
                          <small className="text-muted">
                            {selectedPeriod ? `Mostrando resultados del ${periodoResumenLabel}.` : "Consulta las calificaciones ponderadas."}
                          </small>
                        </div>
                        <div className="text-end">
                          <small className="text-muted d-block">Promedio {periodoResumenLabel}</small>
                          <Badge bg={promedioLabel.variant} className="fs-6">
                            {promedioLabel.text}
                          </Badge>
                        </div>
                      </div>

                      {materias.length > 0 && (
                        <div className="d-flex gap-2 flex-wrap mb-3">
                          {materias.map((materia) => {
                            const idValue = pickProp(materia, "Id") ?? pickProp(materia, "id");
                            if (idValue == null) return null;
                            const numericId = Number(idValue);
                            const nombre = pickProp(materia, "Nombre") || pickProp(materia, "Curso") || "Materia";
                            const grado = pickProp(materia, "Grado");
                            const grupo = pickProp(materia, "Grupo");
                            const isActive = numericId === selectedMateria;
                            return (
                              <Button
                                key={`${nombre}-${numericId}`}
                                size="sm"
                                variant={isActive ? "secondary" : "outline-secondary"}
                                onClick={() => handleMateriaClick(numericId)}
                              >
                                {nombre}
                                {grado ? ` • ${grado}` : ""}
                                {grupo ? ` (${grupo})` : ""}
                              </Button>
                            );
                          })}
                        </div>
                      )}

                      <div className="d-flex gap-2 flex-wrap mb-3">
                        {PERIODOS.map((p) => (
                          <Button
                            key={p.id ?? "all"}
                            size="sm"
                            variant={selectedPeriod === p.id ? "primary" : "outline-secondary"}
                            onClick={() => handlePeriodoClick(p.id)}
                          >
                            {p.nombre}
                          </Button>
                        ))}
                      </div>

                      {loadingNotas ? (
                        <LoadingSpinner message="Cargando notas..." />
                      ) : notas.columnas.length === 0 ? (
                        <Alert variant="light" className="mb-0">
                          No hay notas configuradas para el periodo seleccionado.
                        </Alert>
                      ) : (
                        <div style={{ overflowX: "auto" }}>
                          <Table responsive hover>
                            <thead>
                              <tr>
                                <th>Actividad</th>
                                {!showingSinglePeriod && <th>Periodo</th>}
                                <th>Peso</th>
                                <th>Nota</th>
                              </tr>
                            </thead>
                            <tbody>
                              {notas.columnas.map((col, idx) => {
                                const nombre = pickProp(col, "Nombre") || "-";
                                const periodo = pickProp(col, "Periodo") ?? "-";
                                const peso = pickProp(col, "Peso") ?? 0;
                                const valor = pickProp(col, "Valor");
                                const id = pickProp(col, "Id") ?? `${nombre}-${idx}`;
                                return (
                                  <tr key={id}>
                                    <td>{nombre}</td>
                                    {!showingSinglePeriod && <td>{periodo}</td>}
                                    <td>{peso ? `${peso}%` : "-"}</td>
                                    <td>
                                      {valor != null ? (
                                        <Badge bg={valor >= 3 ? "success" : "danger"}>{Number(valor).toFixed(2)}</Badge>
                                      ) : (
                                        <Badge bg="secondary">Pendiente</Badge>
                                      )}
                                    </td>
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
              </Row>

              <Row className="mb-4" id="parent-asistencias">
                <Col>
                  <Card className="shadow-sm">
                    <Card.Body>
                      <Card.Title>Asistencias del estudiante</Card.Title>
                      {asistencias.length === 0 ? (
                        <Alert variant="light" className="mt-3 mb-0">
                          No se encontraron registros de asistencia.
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
                              {asistencias.map((a) => {
                                const estado = a.Estado || a.estado;
                                const badgeVariant = estado === "Presente" ? "success" : estado === "Tarde" ? "warning" : "danger";
                                return (
                                  <tr key={a.Id || a.id}>
                                    <td>{formatDate(a.Fecha || a.fecha)}</td>
                                    <td>{a.Curso || a.curso}</td>
                                    <td>{a.Periodo || a.periodo}</td>
                                    <td>
                                      <Badge bg={badgeVariant}>{estado}</Badge>
                                    </td>
                                    <td>{a.Observacion || a.observacion || "-"}</td>
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
              </Row>
            </>
          )}

          <Row id="parent-comunicaciones">
            <Col>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Comunicaciones para la familia</Card.Title>
                  {comunicaciones.length === 0 ? (
                    <Alert variant="light" className="mt-3 mb-0">
                      No tienes comunicaciones pendientes.
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
        </>
      )}
    </Container>
  );
}
