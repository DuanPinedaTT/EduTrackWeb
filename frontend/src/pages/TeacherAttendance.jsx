import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Table
} from "react-bootstrap";
import { FaCheck, FaClock, FaTimes } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import useTeacherProfile from "../hooks/useTeacherProfile.js";
import { Asistencias, CursoAsignaturas as CursoAsignaturasApi, Inscripciones } from "../services/api.js";

const STATE_METADATA = {
  1: { label: "Presente", variant: "success", icon: <FaCheck /> },
  2: { label: "Ausente", variant: "danger", icon: <FaTimes /> },
  3: { label: "Tardanza", variant: "warning", icon: <FaClock /> }
};

export default function TeacherAttendance() {
  const { profile: teacherProfile, loadingProfile, profileError } = useTeacherProfile();
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});

  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [savingStudents, setSavingStudents] = useState(() => new Set());
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const showMessage = (variant, message) => {
    setFeedback({ variant, message });
    setTimeout(() => setFeedback(null), 2500);
  };

  const loadAssignments = useCallback(async () => {
    if (!teacherProfile?.id) return;
    setLoadingAssignments(true);
    try {
      const res = await CursoAsignaturasApi.list({ profesorId: teacherProfile.id });
      const data = Array.isArray(res.data) ? res.data : [];
      setAssignments(data);
      setSelectedAssignmentId((current) => current || (data[0] ? String(data[0].id) : ""));
    } catch (err) {
      setError(err.response?.data || "No se pudieron cargar las asignaciones");
    } finally {
      setLoadingAssignments(false);
    }
  }, [teacherProfile]);

  const loadStudents = useCallback(async () => {
    const assignment = assignments.find((a) => String(a.id) === selectedAssignmentId);
    if (!assignment) {
      setStudents([]);
      return;
    }

    setLoadingStudents(true);
    try {
      const res = await Inscripciones.list({ cursoId: assignment.cursoId });
      const data = Array.isArray(res.data) ? res.data : [];
      const mapped = data.map((item) => ({
        id: item.estudianteId,
        nombre: item.estudianteNombre
      }));
      setStudents(mapped);
    } catch (err) {
      setError(err.response?.data || "No se pudieron cargar los estudiantes");
    } finally {
      setLoadingStudents(false);
    }
  }, [assignments, selectedAssignmentId]);

  const loadAttendance = useCallback(async () => {
    if (!selectedAssignmentId) {
      setAttendanceMap({});
      return;
    }

    setLoadingAttendance(true);
    try {
      const res = await Asistencias.list({
        cursoAsignaturaId: Number(selectedAssignmentId),
        desde: selectedDate,
        hasta: selectedDate
      });
      const data = Array.isArray(res.data) ? res.data : [];
      const map = {};
      data.forEach((item) => {
        map[item.estudianteId] = item;
      });
      setAttendanceMap(map);
    } catch (err) {
      setError(err.response?.data || "No se pudieron cargar las asistencias");
    } finally {
      setLoadingAttendance(false);
    }
  }, [selectedAssignmentId, selectedDate]);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  const stats = useMemo(() => {
    const registros = Object.values(attendanceMap);
    const presentes = registros.filter((r) => r.estado === 1).length;
    const ausentes = registros.filter((r) => r.estado === 2).length;
    const tardanzas = registros.filter((r) => r.estado === 3).length;
    const porcentaje = students.length ? Math.round((presentes / students.length) * 100) : 0;

    return {
      total: registros.length,
      presentes,
      ausentes,
      tardanzas,
      porcentaje
    };
  }, [attendanceMap, students]);

  const handleQuickMark = async (studentId, estado) => {
    if (!selectedAssignmentId) return;
    const existing = attendanceMap[studentId];
    const payload = {
      estudianteId: studentId,
      cursoAsignaturaId: Number(selectedAssignmentId),
      fecha: `${selectedDate}T00:00:00`,
      estado,
      observacion: existing?.observacion || ""
    };

    setSavingStudents((prev) => {
      const next = new Set(prev);
      next.add(studentId);
      return next;
    });

    try {
      let response;
      if (existing) {
        response = await Asistencias.update(existing.id, { ...payload, id: existing.id });
      } else {
        response = await Asistencias.create(payload);
      }
      const record = response.data;
      setAttendanceMap((prev) => ({
        ...prev,
        [studentId]: record
      }));
      showMessage("success", "Asistencia registrada");
    } catch (err) {
      setError(err.response?.data || "No se pudo registrar la asistencia");
    } finally {
      setSavingStudents((prev) => {
        const next = new Set(prev);
        next.delete(studentId);
        return next;
      });
    }
  };

  if (loadingProfile || loadingAssignments) {
    return <LoadingSpinner message="Preparando panel de asistencias..." />;
  }

  const selectedAssignment = assignments.find((a) => String(a.id) === selectedAssignmentId);

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <h3 className="mb-0">Gestión de Asistencias</h3>
          <small className="text-muted">Registra el estado diario de cada estudiante por materia.</small>
        </Col>
      </Row>

      {profileError && (
        <Row className="mb-3">
          <Col>
            <Alert variant="warning">{String(profileError)}</Alert>
          </Col>
        </Row>
      )}

      {feedback && (
        <Row className="mb-3">
          <Col>
            <Alert variant={feedback.variant}>{feedback.message}</Alert>
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
        <Col md={6} className="mb-2">
          <Card className="shadow-sm">
            <Card.Body>
              <Form.Group>
                <Form.Label>Materia / Curso</Form.Label>
                <Form.Select value={selectedAssignmentId} onChange={(e) => setSelectedAssignmentId(e.target.value)}>
                  <option value="">Selecciona una materia asignada</option>
                  {assignments.map((assignment) => (
                    <option key={assignment.id} value={assignment.id}>
                      {assignment.gradoNombre ? `${assignment.gradoNombre} · ${assignment.cursoNombre}` : assignment.cursoNombre} - {assignment.asignaturaNombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-2">
          <Card className="shadow-sm">
            <Card.Body>
              <Form.Group>
                <Form.Label>Fecha</Form.Label>
                <Form.Control type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {selectedAssignment ? (
        <>
          <Row className="mb-3">
            <Col md={3} className="mb-2">
              <SummaryCard title="Registros" value={stats.total} variant="primary" />
            </Col>
            <Col md={3} className="mb-2">
              <SummaryCard title="Presentes" value={stats.presentes} variant="success" />
            </Col>
            <Col md={3} className="mb-2">
              <SummaryCard title="Ausentes" value={stats.ausentes} variant="danger" />
            </Col>
            <Col md={3} className="mb-2">
              <SummaryCard title="% Asistencia" value={`${stats.porcentaje}%`} variant="info" />
            </Col>
          </Row>

          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">Lista del curso</h5>
                <small>
                  {selectedAssignment.asignaturaNombre} · {selectedAssignment.gradoNombre || "Sin grado"}
                </small>
              </div>
              {(loadingStudents || loadingAttendance) && <Spinner animation="border" size="sm" />}
            </Card.Header>
            <Card.Body>
              {students.length === 0 ? (
                <Alert variant="info">No hay estudiantes inscritos para este curso.</Alert>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Estudiante</th>
                        <th>Estado actual</th>
                        <th>Acciones rápidas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => {
                        const record = attendanceMap[student.id];
                        const metadata = record ? STATE_METADATA[record.estado] : null;
                        const isSaving = savingStudents.has(student.id);
                        return (
                          <tr key={student.id}>
                            <td>{student.nombre}</td>
                            <td>
                              {metadata ? (
                                <Badge bg={metadata.variant} className="px-3 py-2">
                                  {metadata.icon} <span className="ms-2">{metadata.label}</span>
                                </Badge>
                              ) : (
                                <Badge bg="secondary">Sin registro</Badge>
                              )}
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button
                                  size="sm"
                                  variant="success"
                                  disabled={isSaving}
                                  onClick={() => handleQuickMark(student.id, 1)}
                                >
                                  <FaCheck className="me-1" /> Presente
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  disabled={isSaving}
                                  onClick={() => handleQuickMark(student.id, 2)}
                                >
                                  <FaTimes className="me-1" /> Ausente
                                </Button>
                                <Button
                                  size="sm"
                                  variant="warning"
                                  disabled={isSaving}
                                  onClick={() => handleQuickMark(student.id, 3)}
                                >
                                  <FaClock className="me-1" /> Tarde
                                </Button>
                                {isSaving && <Spinner animation="border" size="sm" />}
                              </div>
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
        </>
      ) : (
        <Alert variant="info">No tienes asignaturas registradas. Pide al administrador que asigne tus cursos.</Alert>
      )}
    </Container>
  );
}

function SummaryCard({ title, value, variant }) {
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <small className="text-muted text-uppercase">{title}</small>
        <h2 className={`mt-2 text-${variant}`}>{value}</h2>
      </Card.Body>
    </Card>
  );
}
