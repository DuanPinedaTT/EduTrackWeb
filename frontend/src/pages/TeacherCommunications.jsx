import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup, Badge, Spinner, Collapse } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext.jsx";
import api, { Comunicaciones } from "../services/api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import PageHero from "../components/PageHero.jsx";

// Centro docente de comunicaciones; redacta mensajes segmentados y revisa historial.
const MENSAJE_TIPOS = [
  { id: "general", label: "General" },
  { id: "academico", label: "Académico" },
  { id: "convivencia", label: "Convivencia" },
  { id: "urgente", label: "Urgente" }
];

const formatDateTime = (value, options = { dateStyle: "medium", timeStyle: "short" }) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, options);
};

export default function TeacherCommunications() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [assignmentsError, setAssignmentsError] = useState(null);

  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courseStudents, setCourseStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  const [form, setForm] = useState({
    titulo: "",
    mensaje: "",
    tipo: "general",
    incluirTutores: false,
    alcance: "curso"
  });
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);

  // Carga las asignaciones del docente y preselecciona el primer curso.
  useEffect(() => {
    if (!user?.id) return;

    const loadAssignments = async () => {
      try {
        setAssignmentsLoading(true);
        setAssignmentsError(null);
        const res = await api.get(`/CursoAsignaturas/docente/${user.id}`);
        const data = Array.isArray(res.data) ? res.data : [];
        setAssignments(data);
        if (data.length > 0) {
          setSelectedCourseId(data[0].cursoId);
        }
      } catch (err) {
        setAssignmentsError(err.response?.data || "No se pudieron cargar tus asignaturas");
      } finally {
        setAssignmentsLoading(false);
      }
    };

    loadAssignments();
  }, [user?.id]);

  // Cuando cambia el curso se consulta la lista de estudiantes y se marcan todos por defecto.
  useEffect(() => {
    if (!selectedCourseId) {
      setCourseStudents([]);
      setSelectedStudents(new Set());
      return;
    }

    let cancel = false;
    const loadStudents = async () => {
      try {
        setStudentsLoading(true);
        const res = await api.get(`/Cursos/${selectedCourseId}/students`);
        if (cancel) return;
        const data = Array.isArray(res.data)
          ? res.data.map((student) => ({
              id: student.Id ?? student.id,
              nombre: student.Nombre ?? student.nombre,
              documento: student.Documento ?? student.documento
            }))
          : [];
        setCourseStudents(data);
        setSelectedStudents(new Set(data.map((s) => s.id)));
      } catch (err) {
        if (!cancel) {
          setCourseStudents([]);
          setSelectedStudents(new Set());
        }
      } finally {
        if (!cancel) setStudentsLoading(false);
      }
    };

    loadStudents();
    return () => {
      cancel = true;
    };
  }, [selectedCourseId]);

  // Historial inicial de comunicaciones enviadas.
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setHistoryLoading(true);
        const res = await Comunicaciones.emitidas();
        setHistory(Array.isArray(res.data) ? res.data : []);
        setExpandedHistoryId(null);
      } catch (err) {
        console.error("No se pudo cargar el historial", err);
      } finally {
        setHistoryLoading(false);
      }
    };

    loadHistory();
  }, []);

  // Si el alcance vuelve a ser todo el curso, se resetea la selección manual.
  useEffect(() => {
    if (form.alcance === "curso" && courseStudents.length > 0) {
      setSelectedStudents(new Set(courseStudents.map((s) => s.id)));
    }
  }, [form.alcance, courseStudents]);

  const handleToggleStudent = (studentId) => {
    setSelectedStudents((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedStudents(new Set(courseStudents.map((s) => s.id)));
  };

  const handleClearSelection = () => {
    setSelectedStudents(new Set());
  };

  const selectedCourse = assignments.find((a) => a.cursoId === selectedCourseId);
  const destinatariosCount = form.alcance === "curso" ? courseStudents.length : selectedStudents.size;
  const formValid =
    selectedCourseId &&
    form.titulo.trim().length >= 3 &&
    form.mensaje.trim().length >= 10 &&
    destinatariosCount > 0;

  // Envía la comunicación y recarga el historial.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) return;

    const payload = {
      Titulo: form.titulo,
      Mensaje: form.mensaje,
      Tipo: form.tipo,
      CursoId: selectedCourseId,
      EstudianteIds:
        form.alcance === "curso"
          ? []
          : Array.from(selectedStudents),
      IncluirTutores: form.incluirTutores
    };

    try {
      setSending(true);
      setSendResult(null);
      const res = await Comunicaciones.crear(payload);
      setSendResult({ type: "success", message: `Comunicación enviada a ${res.data?.destinatarios ?? destinatariosCount} destinos.` });
      setForm((prev) => ({ ...prev, titulo: "", mensaje: "" }));
      await refreshHistory();
    } catch (err) {
      setSendResult({ type: "danger", message: err.response?.data || "No se pudo enviar la comunicación" });
    } finally {
      setSending(false);
    }
  };

  const refreshHistory = async () => {
    try {
      const res = await Comunicaciones.emitidas();
      setHistory(Array.isArray(res.data) ? res.data : []);
      setExpandedHistoryId(null);
    } catch (err) {
      console.error("Error recargando historial", err);
    }
  };

  const handleToggleHistory = (id) => {
    setExpandedHistoryId((prev) => (prev === id ? null : id));
  };

  const selectedCourseLabel = selectedCourse
    ? `${selectedCourse.asignaturaNombre || "Asignatura"} · ${selectedCourse.gradoNombre || "Sin grado"} (${selectedCourse.grupo || "-"})`
    : "Selecciona un curso";

  if (assignmentsLoading) return <LoadingSpinner message="Preparando tu bandeja de comunicaciones..." />;

  if (assignmentsError) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{String(assignmentsError)}</Alert>
      </Container>
    );
  }

  if (assignments.length === 0) {
    return (
      <Container className="py-5">
        <Alert variant="light">Aún no tienes cursos asignados para enviar comunicaciones.</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="pb-5">
      <Row className="mb-4">
        <Col>
          <PageHero
            eyebrow="Centro de comunicaciones"
            title={selectedCourseLabel}
            description="Gestiona mensajes segmentados a estudiantes y tutores desde un único lugar."
            stats={[
              { label: "Cursos asignados", value: assignments.length },
              { label: "Destinatarios actuales", value: destinatariosCount }
            ]}
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={7} className="mb-3">
          <Card className="glass-card border-0 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0">Redactar mensaje</Card.Title>
                {selectedCourse && (
                  <Badge bg="light" text="dark">
                    {(selectedCourse.gradoNombre || "Sin grado")} • {selectedCourse.grupo ? `Grupo ${selectedCourse.grupo}` : "Sin grupo"}
                  </Badge>
                )}
              </div>

              {sendResult && (
                <Alert variant={sendResult.type} onClose={() => setSendResult(null)} dismissible>
                  {sendResult.message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Curso</Form.Label>
                  <Form.Select
                    value={selectedCourseId ?? ""}
                    onChange={(e) => setSelectedCourseId(Number(e.target.value) || null)}
                    required
                  >
                    {assignments.map((assignment) => (
                      <option key={assignment.cursoId} value={assignment.cursoId}>
                        {assignment.asignaturaNombre || "Sin asignatura"} • {assignment.gradoNombre || "Sin grado"} ({assignment.grupo || "-"})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Tipo de mensaje</Form.Label>
                      <Form.Select
                        value={form.tipo}
                        onChange={(e) => setForm((prev) => ({ ...prev, tipo: e.target.value }))}
                      >
                        {MENSAJE_TIPOS.map((tipo) => (
                          <option key={tipo.id} value={tipo.id}>
                            {tipo.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Enviar a</Form.Label>
                      <Form.Select
                        value={form.alcance}
                        onChange={(e) => setForm((prev) => ({ ...prev, alcance: e.target.value }))}
                      >
                        <option value="curso">Todo el curso</option>
                        <option value="seleccion">Estudiantes seleccionados</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mt-3">
                  <Form.Check
                    type="switch"
                    label="Enviar también al tutor"
                    checked={form.incluirTutores}
                    onChange={(e) => setForm((prev) => ({ ...prev, incluirTutores: e.target.checked }))}
                  />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    value={form.titulo}
                    onChange={(e) => setForm((prev) => ({ ...prev, titulo: e.target.value }))}
                    placeholder="Ej. Recordatorio de evaluación"
                    maxLength={120}
                    required
                  />
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Mensaje</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    value={form.mensaje}
                    onChange={(e) => setForm((prev) => ({ ...prev, mensaje: e.target.value }))}
                    placeholder="Escribe la comunicación..."
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div>
                    <small className="text-muted">
                      Destinatarios estimados: <strong>{destinatariosCount}</strong>
                    </small>
                  </div>
                  <Button type="submit" disabled={!formValid || sending} className="pill-button active" variant="light">
                    {sending ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" /> Enviando...
                      </>
                    ) : (
                      "Enviar comunicación"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5} className="mb-3">
          <Card className="glass-card border-0 h-100">
            <Card.Body>
              <Card.Title>Destinatarios</Card.Title>
              {studentsLoading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" />
                </div>
              ) : courseStudents.length === 0 ? (
                <Alert variant="light" className="mt-3 mb-0">
                  No hay estudiantes inscritos en este curso.
                </Alert>
              ) : (
                <>
                  {form.alcance === "seleccion" && (
                    <div className="d-flex gap-2 flex-wrap mb-3">
                      <Button size="sm" variant="light" className="pill-button" onClick={handleSelectAll}>
                        Seleccionar todos
                      </Button>
                      <Button size="sm" variant="light" className="pill-button" onClick={handleClearSelection}>
                        Limpiar selección
                      </Button>
                    </div>
                  )}
                  <ListGroup variant="flush" className="destinatarios-list">
                    {courseStudents.map((student) => {
                      return (
                        <ListGroup.Item key={student.id} className="px-0">
                          <div className="d-flex align-items-center gap-3">
                            {form.alcance === "seleccion" ? (
                              <Form.Check
                                type="checkbox"
                                checked={selectedStudents.has(student.id)}
                                onChange={() => handleToggleStudent(student.id)}
                              />
                            ) : (
                              <Form.Check type="checkbox" checked disabled />
                            )}
                            <div>
                              <strong>{student.nombre}</strong>
                              <small className="d-block text-muted">{student.documento}</small>
                            </div>
                          </div>
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="glass-card border-0">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0">Historial reciente</Card.Title>
                <Button size="sm" variant="light" className="pill-button" onClick={refreshHistory} disabled={historyLoading}>
                  {historyLoading ? "Actualizando..." : "Refrescar"}
                </Button>
              </div>

              {history.length === 0 ? (
                <Alert variant="light" className="mb-0">
                  Aún no has enviado comunicaciones desde esta cuenta.
                </Alert>
              ) : (
                <ListGroup variant="flush">
                  {history.map((item) => {
                    const isExpanded = expandedHistoryId === item.id;
                    const courseLabel = item.curso
                      ? `${item.curso.nombre || "Curso"} • ${item.curso.grado || "-"}${item.curso.grupo ? ` (${item.curso.grupo})` : ""}`
                      : "Sin curso asociado";
                    return (
                      <ListGroup.Item key={item.id} className="px-0">
                        <div className="history-card">
                          <div className="d-flex justify-content-between flex-wrap gap-3 align-items-start">
                            <div>
                              <div className="d-flex align-items-center gap-2">
                                <strong>{item.titulo}</strong>
                                <Badge bg="secondary" pill>
                                  {item.tipo}
                                </Badge>
                              </div>
                              <small className="d-block text-muted">
                                {formatDateTime(item.creadaEn)} • {item.destinatarios ?? 0} destinos
                              </small>
                              <small className="text-muted">{courseLabel}</small>
                            </div>
                            <div className="text-end">
                              <Button
                                size="sm"
                                variant="light"
                                className="pill-button"
                                onClick={() => handleToggleHistory(item.id)}
                              >
                                {isExpanded ? "Ocultar" : "Detalles"}
                              </Button>
                            </div>
                          </div>
                          <Collapse in={isExpanded}>
                            <div className="mt-3 message-detail">
                              <p className="mb-2">{item.mensaje}</p>
                              <div className="d-flex flex-wrap gap-3 small text-muted">
                                <span>Hora local: {formatDateTime(item.creadaEn, { hour: "2-digit", minute: "2-digit" })}</span>
                                <span>Estudiantes: {item.estudiantesDestinatarios ?? 0}</span>
                                <span>Tutores: {item.tutoresDestinatarios ?? 0}</span>
                              </div>
                            </div>
                          </Collapse>
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
