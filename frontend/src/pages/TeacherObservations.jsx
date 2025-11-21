import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table
} from "react-bootstrap";
import { FaClipboardList, FaPlus, FaTrash } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import useTeacherProfile from "../hooks/useTeacherProfile.js";
import {
  CursoAsignaturas as CursoAsignaturasApi,
  Inscripciones,
  Observaciones
} from "../services/api.js";

const tipoObservacion = [
  { value: "academica", label: "Académica", variant: "primary" },
  { value: "convivencia", label: "Convivencia", variant: "warning" },
  { value: "reconocimiento", label: "Reconocimiento", variant: "success" },
  { value: "seguimiento", label: "Seguimiento", variant: "info" }
];

export default function TeacherObservations() {
  const { profile: teacherProfile, loadingProfile, profileError } = useTeacherProfile();
  const [assignments, setAssignments] = useState([]);
  const [studentsByCourse, setStudentsByCourse] = useState({});
  const [observations, setObservations] = useState([]);
  const [filters, setFilters] = useState({ cursoAsignaturaId: "", estudianteId: "" });

  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    cursoAsignaturaId: "",
    estudianteId: "",
    tipo: "academica",
    comentario: ""
  });
  const [observationToDelete, setObservationToDelete] = useState(null);

  const showMessage = (variant, message) => {
    setFeedback({ variant, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const loadAssignments = useCallback(async () => {
    if (!teacherProfile?.id) return [];
    const res = await CursoAsignaturasApi.list({ profesorId: teacherProfile.id });
    const data = Array.isArray(res.data) ? res.data : [];
    setAssignments(data);
    return data;
  }, [teacherProfile]);

  const loadObservations = useCallback(async () => {
    if (!teacherProfile?.id) return;
    const res = await Observaciones.list({ profesorId: teacherProfile.id });
    setObservations(Array.isArray(res.data) ? res.data : []);
  }, [teacherProfile]);

  const ensureStudentsForCourse = useCallback(async (cursoId) => {
    if (!cursoId || studentsByCourse[cursoId]) return;
    try {
      const res = await Inscripciones.list({ cursoId });
      const data = Array.isArray(res.data) ? res.data : [];
      setStudentsByCourse((prev) => ({
        ...prev,
        [cursoId]: data.map((item) => ({ id: item.estudianteId, nombre: item.estudianteNombre }))
      }));
    } catch (err) {
      setError(err.response?.data || "No se pudieron cargar los estudiantes");
    }
  }, [studentsByCourse]);

  useEffect(() => {
    if (!teacherProfile?.id) return;
    setLoadingData(true);
    Promise.all([loadAssignments(), loadObservations()])
      .catch((err) => setError(err.response?.data || "No se pudo cargar la información"))
      .finally(() => setLoadingData(false));
  }, [teacherProfile, loadAssignments, loadObservations]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "cursoAsignaturaId" ? { estudianteId: "" } : {})
    }));
    if (name === "cursoAsignaturaId") {
      const assignment = assignments.find((a) => String(a.id) === value);
      if (assignment) {
        ensureStudentsForCourse(assignment.cursoId);
      }
    }
  };

  const filteredObservations = useMemo(() => {
    return observations.filter((obs) => {
      if (filters.cursoAsignaturaId && String(obs.cursoAsignaturaId) !== filters.cursoAsignaturaId) {
        return false;
      }
      if (filters.estudianteId && String(obs.estudianteId) !== filters.estudianteId) {
        return false;
      }
      return true;
    });
  }, [observations, filters]);

  const studentsForFilter = useMemo(() => {
    const assignment = assignments.find((a) => String(a.id) === filters.cursoAsignaturaId);
    if (!assignment) return [];
    return studentsByCourse[assignment.cursoId] || [];
  }, [assignments, filters.cursoAsignaturaId, studentsByCourse]);

  const studentsForForm = useMemo(() => {
    const assignment = assignments.find((a) => String(a.id) === form.cursoAsignaturaId);
    if (!assignment) return [];
    return studentsByCourse[assignment.cursoId] || [];
  }, [assignments, form.cursoAsignaturaId, studentsByCourse]);

  const handleOpenModal = () => {
    const defaultAssignment = assignments[0];
    const cursoAsignaturaId = defaultAssignment ? String(defaultAssignment.id) : "";
    setForm({
      cursoAsignaturaId,
      estudianteId: "",
      tipo: "academica",
      comentario: ""
    });
    if (defaultAssignment) {
      ensureStudentsForCourse(defaultAssignment.cursoId);
    }
    setShowModal(true);
  };

  const handleFormChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "cursoAsignaturaId" ? { estudianteId: "" } : {})
    }));
    if (name === "cursoAsignaturaId") {
      const assignment = assignments.find((a) => String(a.id) === value);
      if (assignment) {
        ensureStudentsForCourse(assignment.cursoId);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teacherProfile?.id || !form.cursoAsignaturaId || !form.estudianteId) return;

    const payload = {
      profesorId: teacherProfile.id,
      cursoAsignaturaId: Number(form.cursoAsignaturaId),
      estudianteId: Number(form.estudianteId),
      tipo: form.tipo,
      comentario: form.comentario
    };

    try {
      await Observaciones.create(payload);
      showMessage("success", "Observación registrada");
      setShowModal(false);
      await loadObservations();
    } catch (err) {
      setError(err.response?.data || "No se pudo crear la observación");
    }
  };

  const handleDelete = async () => {
    if (!observationToDelete) return;
    try {
      await Observaciones.remove(observationToDelete.id);
      showMessage("success", "Observación eliminada");
      setObservationToDelete(null);
      await loadObservations();
    } catch (err) {
      setError(err.response?.data || "No se pudo eliminar la observación");
    }
  };

  if (loadingProfile || loadingData) {
    return <LoadingSpinner message="Cargando observaciones..." />;
  }

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="mb-0">Observaciones y seguimientos</h3>
              <small className="text-muted">Registra alertas académicas o de convivencia para dar trazabilidad.</small>
            </div>
            <Button onClick={handleOpenModal} disabled={assignments.length === 0}>
              <FaPlus className="me-2" /> Nueva observación
            </Button>
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

      <Card className="shadow-sm mb-3">
        <Card.Body>
          <Row>
            <Col md={6} className="mb-2">
              <Form.Group>
                <Form.Label>Filtrar por curso</Form.Label>
                <Form.Select value={filters.cursoAsignaturaId} onChange={(e) => handleFilterChange("cursoAsignaturaId", e.target.value)}>
                  <option value="">Todos</option>
                  {assignments.map((assignment) => (
                    <option key={assignment.id} value={assignment.id}>
                      {assignment.asignaturaNombre} · {assignment.gradoNombre || "Sin grado"}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6} className="mb-2">
              <Form.Group>
                <Form.Label>Filtrar por estudiante</Form.Label>
                <Form.Select value={filters.estudianteId} onChange={(e) => handleFilterChange("estudianteId", e.target.value)} disabled={!filters.cursoAsignaturaId}>
                  <option value="">Todos</option>
                  {studentsForFilter.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <FaClipboardList className="me-2" /> Historial de observaciones ({filteredObservations.length})
        </Card.Header>
        <Card.Body>
          {filteredObservations.length === 0 ? (
            <Alert variant="info">No hay observaciones registradas para los filtros seleccionados.</Alert>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Fecha</th>
                    <th>Estudiante</th>
                    <th>Curso</th>
                    <th>Tipo</th>
                    <th>Comentario</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredObservations.map((obs) => {
                    const assignment = assignments.find((a) => a.id === obs.cursoAsignaturaId);
                    const tipo = tipoObservacion.find((t) => t.value === obs.tipo) || tipoObservacion[0];
                    return (
                      <tr key={obs.id}>
                        <td>{new Date(obs.fecha).toLocaleString()}</td>
                        <td>{obs.estudiante}</td>
                        <td>{assignment ? `${assignment.asignaturaNombre} · ${assignment.gradoNombre || ""}` : "-"}</td>
                        <td>
                          <Badge bg={tipo.variant}>{tipo.label}</Badge>
                        </td>
                        <td>{obs.comentario}</td>
                        <td className="text-end">
                          <Button variant="outline-danger" size="sm" onClick={() => setObservationToDelete(obs)}>
                            <FaTrash />
                          </Button>
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nueva observación</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Curso</Form.Label>
              <Form.Select
                value={form.cursoAsignaturaId}
                onChange={(e) => handleFormChange("cursoAsignaturaId", e.target.value)}
                required
              >
                <option value="">Selecciona un curso</option>
                {assignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.asignaturaNombre} · {assignment.gradoNombre || "Sin grado"}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estudiante</Form.Label>
              <Form.Select
                value={form.estudianteId}
                onChange={(e) => handleFormChange("estudianteId", e.target.value)}
                required
                disabled={!form.cursoAsignaturaId || studentsForForm.length === 0}
              >
                <option value="">Selecciona un estudiante</option>
                {studentsForForm.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Select value={form.tipo} onChange={(e) => handleFormChange("tipo", e.target.value)}>
                {tipoObservacion.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Comentario</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={form.comentario}
                onChange={(e) => handleFormChange("comentario", e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Registrar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ConfirmModal
        show={Boolean(observationToDelete)}
        title="Eliminar observación"
        message="Esta observación se eliminará del historial del estudiante. ¿Deseas continuar?"
        confirmText="Eliminar"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onClose={() => setObservationToDelete(null)}
      />
    </Container>
  );
}
