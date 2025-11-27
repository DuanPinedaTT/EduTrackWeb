import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Alert, Table, Badge, Button, ListGroup, Toast, ToastContainer } from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { PortalEstudiante } from "../services/api.js";
import { useNotifications } from "../contexts/NotificationContext.jsx";

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

const formatTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
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

export default function StudentDashboard() {
  const [resumen, setResumen] = useState(null);
  const [loadingResumen, setLoadingResumen] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);

  const location = useLocation();
  const { subscribe, dismissByDestino } = useNotifications();
  const notificationRefs = useRef({});

  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [notas, setNotas] = useState({ columnas: [], promedio: null });
  const [loadingNotas, setLoadingNotas] = useState(false);
  const [materias, setMaterias] = useState([]);
  const [selectedMateria, setSelectedMateria] = useState(null);

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

  const loadNotas = async (periodoValue = selectedPeriod, materiaId = selectedMateria) => {
    try {
      setLoadingNotas(true);
      setError(null);
      const res = await PortalEstudiante.notas(periodoValue, materiaId);
      const materiasList = Array.isArray(res.data?.materias) ? res.data.materias : [];
      setMaterias(materiasList);

      const firstMateriaId = materiasList.length
        ? pickProp(materiasList[0], "Id") ?? pickProp(materiasList[0], "id")
        : null;
      const resolvedMateriaRaw = res.data?.cursoId ?? materiaId ?? firstMateriaId ?? null;
      const resolvedMateria =
        resolvedMateriaRaw === null || resolvedMateriaRaw === undefined
          ? null
          : Number(resolvedMateriaRaw);

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
      setError(err.response?.data || "No se pudo cargar las notas");
      const fallbackMateria = materiaId == null ? null : Number(materiaId);
      setNotas({ columnas: [], promedio: null, cursoId: Number.isNaN(fallbackMateria) ? null : fallbackMateria });
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
    notificationRefs.current = {
      loadResumen,
      loadNotas,
      selectedPeriod,
      selectedMateria
    };
  });

  useEffect(() => {
    loadResumen();
    loadAsistencias();
    loadComunicaciones();
    loadNotas(null, null);
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    const target = document.querySelector(location.hash);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  useEffect(() => {
    if (typeof subscribe !== "function") return undefined;

    const unsubscribe = subscribe("nota", (payload) => {
      const data = pickProp(payload, "Data") ?? pickProp(payload, "data") ?? {};
      const periodoValue = pickProp(data, "Periodo") ?? pickProp(data, "periodo") ?? null;
      const cursoIdValue = pickProp(data, "CursoId") ?? pickProp(data, "cursoId") ?? null;
      const cursoNombreValue =
        pickProp(data, "CursoNombre") ?? pickProp(data, "cursoNombre") ?? pickProp(data, "Curso") ?? pickProp(data, "curso") ?? null;
      const valorValue = pickProp(data, "Valor") ?? pickProp(data, "valor");
      const timestampValue =
        pickProp(payload, "Timestamp") ?? pickProp(payload, "timestamp") ?? pickProp(data, "timestamp") ?? new Date().toISOString();

      const toastEntry = {
        id: `${Date.now()}-${Math.random()}`,
        title: pickProp(payload, "Title") || "Nueva nota registrada",
        message: pickProp(payload, "Message") || "Se actualizó una calificación.",
        valor: valorValue,
        periodo: periodoValue,
        cursoId: cursoIdValue,
        cursoNombre: cursoNombreValue,
        timestamp: timestampValue
      };

      setToasts((prev) => {
        const next = [...prev, toastEntry];
        return next.slice(-3);
      });

      const { loadResumen: loadResumenFn, loadNotas: loadNotasFn, selectedPeriod: currentPeriod, selectedMateria: currentMateria } = notificationRefs.current;
      loadResumenFn?.();
      if (typeof loadNotasFn === "function") {
        loadNotasFn(currentPeriod, currentMateria);
      }
    });

    return unsubscribe;
  }, [subscribe]);

  useEffect(() => {
    if (typeof subscribe !== "function") return undefined;

    const unsubscribe = subscribe("comunicacion", (payload) => {
      const data = pickProp(payload, "Data") ?? pickProp(payload, "data") ?? {};
      const destinoId = pickProp(data, "DestinoId") ?? pickProp(data, "destinoId") ?? `${Date.now()}-${Math.random()}`;
      const timestampValue =
        pickProp(payload, "Timestamp") ?? pickProp(payload, "timestamp") ?? pickProp(data, "timestamp") ?? new Date().toISOString();
      const remitente = pickProp(data, "RemitenteNombre") ?? pickProp(data, "remitenteNombre") ?? "Docente";
      const message = pickProp(data, "Mensaje") ?? pickProp(data, "mensaje") ?? payload?.Message ?? "Tienes una nueva comunicación.";
      const title = pickProp(payload, "Title") ?? pickProp(data, "Titulo") ?? pickProp(data, "titulo") ?? "Nueva comunicación";

      const nuevo = {
        Id: destinoId,
        Leido: false,
        Remitente: remitente,
        Titulo: title,
        Mensaje: message,
        CreadaEn: timestampValue
      };

      setComunicaciones((prev) => {
        const filtered = prev.filter((c) => (c.Id ?? c.id) !== destinoId);
        return [nuevo, ...filtered];
      });
    });

    return unsubscribe;
  }, [subscribe]);

  useEffect(() => {
    if (typeof subscribe !== "function") return undefined;

    const unsubscribe = subscribe("comunicacion-leida", (payload) => {
      const data = pickProp(payload, "Data") ?? pickProp(payload, "data") ?? {};
      const destinoId = pickProp(data, "DestinoId") ?? pickProp(data, "destinoId");
      if (!destinoId) return;
      setComunicaciones((prev) =>
        prev.map((c) =>
          c.Id === destinoId || c.id === destinoId
            ? { ...c, Leido: true, leido: true, LeidoEn: new Date().toISOString(), leidoEn: new Date().toISOString() }
            : c
        )
      );
    });

    return unsubscribe;
  }, [subscribe]);

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
      await PortalEstudiante.marcarComunicacionLeida(destinoId);
      const timestamp = new Date().toISOString();
      setComunicaciones((prev) =>
        prev.map((c) =>
          c.Id === destinoId || c.id === destinoId ? { ...c, Leido: true, leido: true, LeidoEn: timestamp, leidoEn: timestamp } : c
        )
      );
      dismissByDestino(destinoId);
    } catch (err) {
      setError(err.response?.data || "No se pudo marcar como leído");
    } finally {
      setMarkingId(null);
    }
  };

  const handleMateriaClick = (cursoId) => {
    if (cursoId == null) return;
    const normalizedId = Number(cursoId);
    if (Number.isNaN(normalizedId)) return;
    setSelectedMateria(normalizedId);
    loadNotas(selectedPeriod, normalizedId);
  };

  const handlePeriodoClick = (periodoId) => {
    setSelectedPeriod(periodoId);
    loadNotas(periodoId, selectedMateria);
  };

  const dismissToast = (toastId) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  };

  if (loadingResumen) return <LoadingSpinner message="Cargando portal estudiantil..." />;

  return (
    <>
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
        <>
          <Row className="mb-4">
            <Col>
              <div className="glass-card border-0 p-4 d-flex flex-wrap justify-content-between gap-3 align-items-center">
                <div>
                  <p className="text-muted mb-1">Hola, {pickProp(resumen.estudiante, "Nombre") || "Estudiante"}</p>
                  <h3 className="mb-0">Tu desempeño general es {promedioLabel.text.toLowerCase()}</h3>
                </div>
                <div className="d-flex gap-4">
                  <div>
                    <p className="text-muted mb-1">Promedio general</p>
                    <h4 className="mb-0">{notas?.promedio ?? resumen.promedioGeneral ?? "-"}</h4>
                  </div>
                  <div>
                    <p className="text-muted mb-1">Periodo actual</p>
                    <span className="chip">{periodoResumenLabel}</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={4} className="mb-3">
              <Card className="h-100 glass-card border-0">
                <Card.Body>
                  <Card.Title>Perfil</Card.Title>
                  <ListGroup variant="flush" className="mt-3">
                    {(() => {
                      const estudiante = resumen.estudiante || {};
                      const estudianteNombre = pickProp(estudiante, "Nombre");
                      const estudianteDocumento = pickProp(estudiante, "Documento");
                      const estudianteGrado = pickProp(estudiante, "Grado");
                      const estudianteGrupo = pickProp(estudiante, "Grupo");
                      return (
                        <>
                          <ListGroup.Item className="px-0">
                            <strong>Nombre:</strong> {estudianteNombre || "-"}
                          </ListGroup.Item>
                          <ListGroup.Item className="px-0">
                            <strong>Documento:</strong> {estudianteDocumento || "-"}
                          </ListGroup.Item>
                          <ListGroup.Item className="px-0">
                            <strong>Grado:</strong> {estudianteGrado || "-"}
                          </ListGroup.Item>
                          <ListGroup.Item className="px-0">
                            <strong>Grupo:</strong> {estudianteGrupo || "-"}
                          </ListGroup.Item>
                        </>
                      );
                    })()}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="h-100 glass-card border-0">
                <Card.Body>
                  <Card.Title>Curso actual</Card.Title>
                  {(() => {
                    const curso = resumen.curso;
                    if (!curso) {
                      return <p className="text-muted mt-3">Aún no tienes curso asignado.</p>;
                    }
                    const nombre = pickProp(curso, "Nombre") || "Curso";
                    const grado = pickProp(curso, "Grado") || "-";
                    const grupo = pickProp(curso, "Grupo") || "-";
                    return (
                      <>
                        <p className="mb-1 mt-3">{nombre}</p>
                        <p className="text-muted mb-2">
                          {grado} • Grupo {grupo}
                        </p>
                        <Badge bg={promedioLabel.variant}>{promedioLabel.text}</Badge>
                      </>
                    );
                  })()}
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="h-100 glass-card border-0">
                <Card.Body>
                  <Card.Title>Últimas asistencias</Card.Title>
                  {asistencias.length === 0 ? (
                    <p className="text-muted mt-3">Sin registros recientes.</p>
                  ) : (
                    <ListGroup variant="flush" className="mt-3">
                      {asistencias.slice(0, 3).map((a, idx) => {
                        const id = pickProp(a, "Id") ?? idx;
                        const fecha = pickProp(a, "Fecha");
                        const curso = pickProp(a, "Curso") || "-";
                        const estado = pickProp(a, "Estado") || "Sin estado";
                        const estadoVariant = estado === "Presente" ? "success" : estado === "Tarde" ? "warning" : "danger";
                        return (
                          <ListGroup.Item key={id} className="px-0">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <strong>{formatDate(fecha)}</strong>
                                <small className="d-block text-muted">{curso}</small>
                              </div>
                              <Badge bg={estadoVariant}>{estado}</Badge>
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

      <Row className="mb-4" id="notas">
        <Col>
          <Card className="glass-card border-0">
            <Card.Body>
              <div className="d-flex flex-wrap justify-content-between gap-3 mb-3 align-items-start">
                <div>
                  <Card.Title className="mb-0">Notas por asignatura</Card.Title>
                  <small className="text-muted d-block">{materiaDescripcion}</small>
                  <small className="text-muted">
                    {selectedPeriod ? `Mostrando resultados del ${periodoResumenLabel}.` : "Consulta tus calificaciones ponderadas."}
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
                <div className="d-flex gap-2 flex-wrap mb-3 subject-tabs">
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
                        variant="light"
                        className={`pill-button ${isActive ? "active" : ""}`}
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

              <div className="d-flex gap-2 flex-wrap mb-3 period-switcher">
                  {PERIODOS.map((p) => (
                    <Button
                      key={p.id ?? "all"}
                      size="sm"
                      variant="light"
                      className={`pill-button ${selectedPeriod === p.id ? "active" : ""}`}
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
                  Aún no hay columnas configuradas para el periodo seleccionado.
                </Alert>
              ) : (
                <div className="table-card" style={{ overflowX: "auto" }}>
                  <Table hover responsive className="mb-0">
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
                        const id = pickProp(col, "Id") ?? `${pickProp(col, "Nombre") ?? "col"}-${idx}`;
                        const nombre = pickProp(col, "Nombre") || "-";
                        const periodo = pickProp(col, "Periodo") ?? "-";
                        const peso = pickProp(col, "Peso") ?? 0;
                        const valor = pickProp(col, "Valor");
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

      <Row className="mb-4" id="asistencias">
        <Col>
          <Card className="glass-card border-0">
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
                      {asistencias.map((a, idx) => {
                        const id = pickProp(a, "Id") ?? idx;
                        const fecha = pickProp(a, "Fecha");
                        const curso = pickProp(a, "Curso") || "-";
                        const periodo = pickProp(a, "Periodo") ?? "-";
                        const estado = pickProp(a, "Estado") || "Sin estado";
                        const observacion = pickProp(a, "Observacion") || "-";
                        const estadoVariant = estado === "Presente" ? "success" : estado === "Tarde" ? "warning" : "danger";
                        return (
                          <tr key={id}>
                            <td>{formatDate(fecha)}</td>
                            <td>{curso}</td>
                            <td>{periodo}</td>
                            <td>
                              <Badge bg={estadoVariant}>{estado}</Badge>
                            </td>
                            <td>{observacion}</td>
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

      <Row id="comunicaciones" className="mb-4">
        <Col>
          <Card className="glass-card border-0">
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

      <ToastContainer
        position="bottom-end"
        className="position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 1080 }}
      >
        {toasts.map((toast) => {
          const valorNumber = Number(toast.valor);
          const valorLabel = Number.isFinite(valorNumber) ? valorNumber.toFixed(2) : toast.valor;
          const cursoLabel = toast.cursoNombre || (toast.cursoId ? `Curso #${toast.cursoId}` : null);
          return (
            <Toast key={toast.id} onClose={() => dismissToast(toast.id)} delay={6000} autohide bg="light">
              <Toast.Header closeButton>
                <strong className="me-auto">{toast.title}</strong>
                <small>{formatTime(toast.timestamp)}</small>
              </Toast.Header>
              <Toast.Body>
                <div>{toast.message}</div>
                {(toast.valor != null || toast.periodo || cursoLabel) && (
                  <div className="small text-muted mt-2">
                    {toast.valor != null && (
                      <span>
                        Nota: <strong>{valorLabel}</strong>
                      </span>
                    )}
                    {toast.periodo && (
                      <span>
                        {toast.valor != null ? " • " : ""}Periodo {toast.periodo}
                      </span>
                    )}
                    {cursoLabel && (
                      <span>
                        {(toast.valor != null || toast.periodo) ? " • " : ""}Asignatura: {cursoLabel}
                      </span>
                    )}
                  </div>
                )}
              </Toast.Body>
            </Toast>
          );
        })}
      </ToastContainer>
    </>
  );
}
