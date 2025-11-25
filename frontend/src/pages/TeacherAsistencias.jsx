import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Alert,
  Badge,
  Spinner
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext.jsx";
import api from "../services/api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import PageHero from "../components/PageHero.jsx";

const ATTENDANCE_STATES = [
  { value: "Presente", label: "Presente", variant: "success" },
  { value: "Tarde", label: "Tarde", variant: "warning" },
  { value: "Ausente", label: "Ausente", variant: "danger" },
  { value: "Justificado", label: "Justificado", variant: "info" }
];

const getStateVariant = (estado) => ATTENDANCE_STATES.find((state) => state.value === estado)?.variant || "secondary";

const PERIOD_OPTIONS = [
  { id: 1, label: "Periodo 1" },
  { id: 2, label: "Periodo 2" },
  { id: 3, label: "Periodo 3" },
  { id: 4, label: "Periodo 4" }
];

const todayIso = () => new Date().toISOString().split("T")[0];

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric" });
};

export default function TeacherAsistencias() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(true);
  const [assignmentsError, setAssignmentsError] = useState(null);

  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [marks, setMarks] = useState({});

  const [fecha, setFecha] = useState(() => todayIso());
  const [periodo, setPeriodo] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

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
        setAssignmentsError(err?.response?.data || "No se pudieron cargar tus cursos");
      } finally {
        setAssignmentsLoading(false);
      }
    };

    loadAssignments();
  }, [user?.id]);

  useEffect(() => {
    if (!selectedCourseId) {
      setStudents([]);
      setMarks({});
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
              id: Number(student.id ?? student.Id ?? student.estudianteId ?? student.EstudianteId),
              nombre: student.nombre ?? student.Nombre ?? "Estudiante",
              documento: student.documento ?? student.Documento ?? ""
            }))
          : [];
        setStudents(data);
        setMarks(
          data.reduce((acc, student) => {
            acc[student.id] = { estado: "Presente", observacion: "" };
            return acc;
          }, {})
        );
      } catch (err) {
        if (!cancel) {
          setStudents([]);
          setMarks({});
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

  const loadHistory = useCallback(
    async (courseId) => {
      if (!courseId) {
        setHistory([]);
        return;
      }
      setHistoryLoading(true);
      try {
        const res = await api.get(`/Asistencias/curso/${courseId}`);
        const data = Array.isArray(res.data) ? res.data : [];
        setHistory(data);
      } catch (err) {
        setHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadHistory(selectedCourseId);
  }, [selectedCourseId, loadHistory]);

  const selectedCourse = useMemo(
    () => assignments.find((assignment) => assignment.cursoId === selectedCourseId) || null,
    [assignments, selectedCourseId]
  );

  const studentCount = students.length;

  const updateMark = (studentId, field, value) => {
    setMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { estado: "Presente", observacion: "" }),
        [field]: value
      }
    }));
  };

  const handleBulkState = (estado) => {
    setMarks((prev) => {
      const next = { ...prev };
      students.forEach((student) => {
        next[student.id] = { ...(next[student.id] || {}), estado };
      });
      return next;
    });
  };

  const handleClearObservations = () => {
    setMarks((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        next[key] = { ...(next[key] || {}), observacion: "" };
      });
      return next;
    });
  };

  const canSubmit = Boolean(selectedCourseId && studentCount > 0 && !submitting);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const payload = {
      cursoId: Number(selectedCourseId),
      fecha,
      periodo: Number(periodo),
      detalles: students.map((student) => ({
        estudianteId: student.id,
        estado: marks[student.id]?.estado || "Presente",
        observacion: marks[student.id]?.observacion || null
      }))
    };

    try {
      setSubmitting(true);
      setSubmitError(null);
      setSubmitMessage(null);
      await api.post("/Asistencias", payload);
      setSubmitMessage("Asistencia registrada correctamente");
      await loadHistory(selectedCourseId);
    } catch (err) {
      setSubmitError(err?.response?.data || "No se pudo registrar la asistencia");
    } finally {
      setSubmitting(false);
    }
  };

  if (assignmentsLoading) {
    return <LoadingSpinner message="Cargando cursos para asistencia..." />;
  }

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
        <Alert variant="light">Aún no tienes cursos asignados para registrar asistencias.</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="pb-5">
      <Row className="mb-4">
        <Col>
          <PageHero
            eyebrow="Control de asistencia"
            title={selectedCourse ? `${selectedCourse.asignaturaNombre || "Asignatura"} • ${selectedCourse.grupo || "Sin grupo"}` : "Selecciona un curso"}
            description="Marca asistencias en segundos y mantén un historial consolidado por curso."
            stats={[
              { label: "Cursos asignados", value: assignments.length },
              { label: "Estudiantes del curso", value: studentCount }
            ]}
          />
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col lg={4}>
          <Card className="glass-card border-0 h-100">
            <Card.Body>
              <Card.Title className="mb-3">Preparar registro</Card.Title>
              <Form.Group className="mb-3">
                <Form.Label>Curso</Form.Label>
                <Form.Select
                  value={selectedCourseId ?? ""}
                  onChange={(e) => setSelectedCourseId(Number(e.target.value) || null)}
                >
                  {assignments.map((assignment) => (
                    <option key={assignment.cursoId} value={assignment.cursoId}>
                      {(assignment.asignaturaNombre || "Asignatura")}
                      {" • "}
                      {(assignment.gradoNombre || "Sin grado")}
                      {assignment.grupo ? ` (${assignment.grupo})` : ""}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha</Form.Label>
                <Form.Control type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} max={todayIso()} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Periodo</Form.Label>
                <Form.Select value={periodo} onChange={(e) => setPeriodo(Number(e.target.value) || 1)}>
                  {PERIOD_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <div className="d-flex flex-wrap gap-2">
                <Button size="sm" variant="light" className="pill-button" onClick={() => handleBulkState("Presente")}>
                  Todos presentes
                </Button>
                <Button size="sm" variant="light" className="pill-button" onClick={() => handleBulkState("Ausente")}>
                  Todos ausentes
                </Button>
                <Button size="sm" variant="light" className="pill-button" onClick={handleClearObservations}>
                  Limpiar observaciones
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="glass-card border-0 h-100">
            <Card.Body className="d-flex flex-column h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0">Lista del curso</Card.Title>
                {studentsLoading && <Spinner animation="border" size="sm" />}
              </div>

              {submitError && (
                <Alert variant="danger" onClose={() => setSubmitError(null)} dismissible>
                  {submitError}
                </Alert>
              )}

              {submitMessage && (
                <Alert variant="success" onClose={() => setSubmitMessage(null)} dismissible>
                  {submitMessage}
                </Alert>
              )}

              {students.length === 0 ? (
                <div className="empty-state flex-grow-1 d-flex align-items-center justify-content-center">
                  <div className="text-center">
                    <p className="text-muted mb-0">No hay estudiantes inscritos en este curso.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="table-card flex-grow-1 mb-3">
                    <Table responsive hover className="mb-0">
                      <thead>
                        <tr>
                          <th className="text-nowrap">#</th>
                          <th>Estudiante</th>
                          <th>Documento</th>
                          <th>Estado</th>
                          <th>Observación</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student, index) => (
                          <tr key={student.id}>
                            <td>{index + 1}</td>
                            <td>{student.nombre}</td>
                            <td><small className="text-muted">{student.documento || "-"}</small></td>
                            <td style={{ minWidth: 160 }}>
                              <Form.Select
                                value={marks[student.id]?.estado || "Presente"}
                                onChange={(e) => updateMark(student.id, "estado", e.target.value)}
                              >
                                {ATTENDANCE_STATES.map((state) => (
                                  <option key={state.value} value={state.value}>
                                    {state.label}
                                  </option>
                                ))}
                              </Form.Select>
                            </td>
                            <td style={{ minWidth: 220 }}>
                              <Form.Control
                                value={marks[student.id]?.observacion || ""}
                                placeholder="Motivo o detalle"
                                onChange={(e) => updateMark(student.id, "observacion", e.target.value)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="light"
                      className="pill-button active"
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                    >
                      {submitting ? "Guardando..." : "Guardar asistencia"}
                    </Button>
                  </div>
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
                <div>
                  <Card.Title className="mb-1">Historial reciente</Card.Title>
                  <small className="text-muted">Últimos registros del curso.</small>
                </div>
                {historyLoading && <Spinner animation="border" size="sm" />}
              </div>

              <div className="table-card">
                <Table responsive hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Periodo</th>
                      <th>Estudiante</th>
                      <th>Estado</th>
                      <th>Observación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-muted">
                          Aún no hay registros para este curso.
                        </td>
                      </tr>
                    ) : (
                      history.slice(0, 15).map((record) => {
                        const recordId = record.id ?? record.Id;
                        const recordFecha = record.fecha ?? record.Fecha;
                        const recordPeriodo = record.periodo ?? record.Periodo;
                        const estado = record.estado ?? record.Estado;
                        const observacion = record.observacion ?? record.Observacion;
                        const student = record.estudiante || record.Estudiante || {};
                        const studentName = student.nombre ?? student.Nombre ?? "Estudiante";
                        const rowKey = recordId ?? `${estado}-${recordFecha}-${studentName}`;
                        return (
                          <tr key={rowKey}>
                            <td>{formatDate(recordFecha)}</td>
                            <td>{recordPeriodo}</td>
                            <td>{studentName}</td>
                            <td>
                              <Badge bg={getStateVariant(estado)}>{estado}</Badge>
                            </td>
                            <td>{observacion || <span className="text-muted">Sin comentarios</span>}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
