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
import { FaBell, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import useTeacherProfile from "../hooks/useTeacherProfile.js";
import {
  CursoAsignaturas as CursoAsignaturasApi,
  Inscripciones,
  Notificaciones
} from "../services/api.js";

const tipoOpciones = [
  { value: "general", label: "General" },
  { value: "tarea", label: "Tarea" },
  { value: "evaluacion", label: "Evaluación" },
  { value: "proyecto", label: "Proyecto" },
  { value: "urgente", label: "Urgente" }
];

const tipoColor = {
  general: "secondary",
  tarea: "info",
  evaluacion: "danger",
  proyecto: "warning",
  urgente: "dark"
};

export default function TeacherNotifications() {
  const { profile: teacherProfile, loadingProfile, profileError } = useTeacherProfile();
  const [assignments, setAssignments] = useState([]);
  const [studentsByCourse, setStudentsByCourse] = useState({});
  const [notifications, setNotifications] = useState([]);

  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({
    cursoAsignaturaId: "",
    estudianteId: "",
    titulo: "",
    mensaje: "",
    tipo: "general"
  });

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

  const loadNotifications = useCallback(async () => {
    if (!teacherProfile?.id) return;
    const res = await Notificaciones.list({ profesorId: teacherProfile.id });
    setNotifications(Array.isArray(res.data) ? res.data : []);
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
    Promise.all([loadAssignments(), loadNotifications()])
      .catch((err) => setError(err.response?.data || "No se pudo cargar la información"))
      .finally(() => setLoadingData(false));
  }, [teacherProfile, loadAssignments, loadNotifications]);

  const handleOpenModal = (notification) => {
    if (notification) {
      setEditingNotification(notification);
      setForm({
        cursoAsignaturaId: String(notification.cursoAsignaturaId || ""),
        estudianteId: notification.estudianteId ? String(notification.estudianteId) : "",
        titulo: notification.titulo,
        mensaje: notification.mensaje,
        tipo: notification.tipo
      });
      const assignment = assignments.find((a) => a.id === notification.cursoAsignaturaId);
      if (assignment) {
        ensureStudentsForCourse(assignment.cursoId);
      }
    } else {
      setEditingNotification(null);
      setForm({
        cursoAsignaturaId: assignments[0] ? String(assignments[0].id) : "",
        estudianteId: "",
        titulo: "",
        mensaje: "",
        tipo: "general"
      });
      if (assignments[0]) {
        ensureStudentsForCourse(assignments[0].cursoId);
      }
    }
    setShowModal(true);
  };

  const handleFormChange = async (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "cursoAsignaturaId") {
      setForm((prev) => ({ ...prev, estudianteId: "" }));
      const assignment = assignments.find((a) => String(a.id) === value);
      if (assignment) {
        await ensureStudentsForCourse(assignment.cursoId);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teacherProfile?.id || !form.cursoAsignaturaId) return;

    const payload = {
      profesorId: teacherProfile.id,
      cursoAsignaturaId: Number(form.cursoAsignaturaId),
      estudianteId: form.estudianteId ? Number(form.estudianteId) : null,
      titulo: form.titulo,
      mensaje: form.mensaje,
      tipo: form.tipo,
      leida: false
    };

    try {
      if (editingNotification) {
        await Notificaciones.update(editingNotification.id, payload);
        showMessage("success", "Notificación actualizada");
      } else {
        await Notificaciones.create(payload);
        showMessage("success", "Notificación enviada");
      }
      setShowModal(false);
      await loadNotifications();
    } catch (err) {
      setError(err.response?.data || "No se pudo guardar la notificación");
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await Notificaciones.remove(confirmDelete.id);
      showMessage("success", "Notificación eliminada");
      setConfirmDelete(null);
      await loadNotifications();
    } catch (err) {
      setError(err.response?.data || "No se pudo eliminar la notificación");
    }
  };

  const studentsForSelectedAssignment = useMemo(() => {
    const assignment = assignments.find((a) => String(a.id) === form.cursoAsignaturaId);
    if (!assignment) return [];
    return studentsByCourse[assignment.cursoId] || [];
  }, [assignments, form.cursoAsignaturaId, studentsByCourse]);

  if (loadingProfile || loadingData) {
    return <LoadingSpinner message="Cargando centro de notificaciones..." />;
  }

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="mb-0">Centro de Notificaciones</h3>
              <small className="text-muted">Envía anuncios y recordatorios a tus cursos.</small>
            </div>
            <Button onClick={() => handleOpenModal()} disabled={assignments.length === 0}>
              <FaPlus className="me-2" /> Nueva notificación
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

      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <FaBell className="me-2" /> Mis notificaciones ({notifications.length})
        </Card.Header>
        <Card.Body>
          {notifications.length === 0 ? (
            <Alert variant="info">Aún no has publicado notificaciones.</Alert>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Fecha</th>
                    <th>Curso</th>
                    <th>Título</th>
                    <th>Tipo</th>
                    <th>Alcance</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notif) => {
                    const assignment = assignments.find((a) => a.id === notif.cursoAsignaturaId);
                    const tipo = tipoColor[notif.tipo] || "secondary";
                    return (
                      <tr key={notif.id}>
                        <td>{new Date(notif.fechaEnvio).toLocaleString()}</td>
                        <td>
                          <div className="d-flex flex-column">
                            <span>{assignment?.asignaturaNombre || "N/A"}</span>
                            <small className="text-muted">
                              {assignment?.gradoNombre ? `${assignment.gradoNombre} · ${assignment.cursoNombre}` : assignment?.cursoNombre || ""}
                            </small>
                          </div>
                        </td>
                        <td><strong>{notif.titulo}</strong></td>
                        <td>
                          <Badge bg={tipo}>{notif.tipo}</Badge>
                        </td>
                        <td>
                          {notif.estudianteId ? (
                            <Badge bg="info">Estudiante específico</Badge>
                          ) : (
                            <Badge bg="secondary">Todo el curso</Badge>
                          )}
                        </td>
                        <td>
                          {notif.leida ? (
                            <Badge bg="success">Leída</Badge>
                          ) : (
                            <Badge bg="warning" text="dark">Pendiente</Badge>
                          )}
                        </td>
                        <td className="text-end">
                          <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleOpenModal(notif)}>
                            <FaEdit />
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => setConfirmDelete(notif)}>
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

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingNotification ? "Editar notificación" : "Nueva notificación"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Materia / Curso</Form.Label>
                  <Form.Select
                    value={form.cursoAsignaturaId}
                    onChange={(e) => handleFormChange("cursoAsignaturaId", e.target.value)}
                    required
                  >
                    <option value="">Selecciona un curso asignado</option>
                    {assignments.map((assignment) => (
                      <option key={assignment.id} value={assignment.id}>
                        {assignment.asignaturaNombre} · {assignment.gradoNombre || "Sin grado"}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Tipo</Form.Label>
                  <Form.Select value={form.tipo} onChange={(e) => handleFormChange("tipo", e.target.value)}>
                    {tipoOpciones.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Enviar a</Form.Label>
              {studentsForSelectedAssignment.length === 0 ? (
                <Form.Control value="Todo el curso" disabled readOnly />
              ) : (
                <Form.Select
                  value={form.estudianteId}
                  onChange={(e) => handleFormChange("estudianteId", e.target.value)}
                >
                  <option value="">Todos los estudiantes</option>
                  {studentsForSelectedAssignment.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.nombre}
                    </option>
                  ))}
                </Form.Select>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                value={form.titulo}
                onChange={(e) => handleFormChange("titulo", e.target.value)}
                required
                placeholder="Ej: Recordatorio de evaluación"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Mensaje</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={form.mensaje}
                onChange={(e) => handleFormChange("mensaje", e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {editingNotification ? "Actualizar" : "Enviar"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ConfirmModal
        show={Boolean(confirmDelete)}
        title="Eliminar notificación"
        message="Esta acción eliminará la notificación para todos los estudiantes. ¿Deseas continuar?"
        confirmText="Eliminar"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onClose={() => setConfirmDelete(null)}
      />
    </Container>
  );
}
