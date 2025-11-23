import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Table
} from "react-bootstrap";
import { FaBell, FaEye, FaEyeSlash, FaPlus, FaTrash } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import {
  CursoAsignaturas as CursoAsignaturasApi,
  Cursos,
  Estudiantes,
  Notificaciones
} from "../services/api.js";

const TYPE_META = {
  informativa: { label: "Informativa", variant: "info" },
  aviso: { label: "Aviso", variant: "primary" },
  alerta: { label: "Alerta", variant: "warning" },
  urgente: { label: "Urgente", variant: "danger" },
  general: { label: "General", variant: "secondary" }
};

const TARGET_OPTIONS = [
  { value: "general", label: "Todos los estudiantes" },
  { value: "curso", label: "Curso y asignatura" },
  { value: "estudiante", label: "Estudiante específico" }
];

const initialForm = {
  titulo: "",
  mensaje: "",
  tipo: "informativa",
  destinatario: "general",
  cursoAsignaturaId: "",
  estudianteId: ""
};

export default function AdminNotificaciones() {
  const [notifications, setNotifications] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [filters, setFilters] = useState({ cursoId: "", estado: "", tipo: "", search: "" });

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [notifRes, courseRes, assignmentRes, studentRes] = await Promise.all([
          Notificaciones.list(),
          Cursos.list(),
          CursoAsignaturasApi.list(),
          Estudiantes.list()
        ]);

        setNotifications(Array.isArray(notifRes.data) ? notifRes.data : []);
        setCourses(Array.isArray(courseRes.data) ? courseRes.data : []);
        setAssignments(Array.isArray(assignmentRes.data) ? assignmentRes.data : []);
        setStudents(Array.isArray(studentRes.data) ? studentRes.data : []);
      } catch (err) {
        setError(err.response?.data || "No se pudieron cargar las notificaciones");
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  const studentMap = useMemo(() => Object.fromEntries(students.map((s) => [s.id, s])), [students]);
  const courseMap = useMemo(() => Object.fromEntries(courses.map((c) => [c.id, c])), [courses]);
  const assignmentMap = useMemo(() => Object.fromEntries(assignments.map((a) => [a.id, a])), [assignments]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      if (filters.cursoId && String(notif.cursoId ?? "") !== filters.cursoId) return false;
      if (filters.tipo && notif.tipo !== filters.tipo) return false;
      if (filters.estado === "leidas" && !notif.leida) return false;
      if (filters.estado === "pendientes" && notif.leida) return false;
      if (
        filters.search &&
        !`${notif.titulo} ${notif.mensaje}`
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [notifications, filters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const refreshNotifications = async () => {
    try {
      const res = await Notificaciones.list();
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data || "No se pudo actualizar la lista");
    }
  };

  const openModal = () => {
    setForm(initialForm);
    setShowModal(true);
    setFeedback(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    if (!form.titulo.trim() || !form.mensaje.trim()) {
      setFeedback({ variant: "warning", message: "Completa título y mensaje." });
      return;
    }

    if (form.destinatario === "curso" && !form.cursoAsignaturaId) {
      setFeedback({ variant: "warning", message: "Selecciona el curso y asignatura destino." });
      return;
    }

    if (form.destinatario === "estudiante" && !form.estudianteId) {
      setFeedback({ variant: "warning", message: "Selecciona el estudiante destino." });
      return;
    }

    const payload = {
      titulo: form.titulo.trim(),
      mensaje: form.mensaje.trim(),
      tipo: form.tipo,
      profesorId: null,
      cursoAsignaturaId: form.destinatario === "curso" ? Number(form.cursoAsignaturaId) : null,
      estudianteId: form.destinatario === "estudiante" ? Number(form.estudianteId) : null,
      leida: false
    };

    setSaving(true);
    setFeedback(null);
    try {
      await Notificaciones.create(payload);
      setShowModal(false);
      await refreshNotifications();
      setFeedback({ variant: "success", message: "Notificación enviada correctamente." });
    } catch (err) {
      setFeedback({ variant: "danger", message: err.response?.data || "No se pudo enviar la notificación" });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleRead = async (notif) => {
    setTogglingId(notif.id);
    try {
      await Notificaciones.update(notif.id, {
        titulo: notif.titulo,
        mensaje: notif.mensaje,
        tipo: notif.tipo,
        profesorId: notif.profesorId ?? null,
        cursoAsignaturaId: notif.cursoAsignaturaId ?? null,
        estudianteId: notif.estudianteId ?? null,
        leida: !notif.leida
      });
      await refreshNotifications();
    } catch (err) {
      setFeedback({ variant: "danger", message: err.response?.data || "No se pudo actualizar la notificación" });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await Notificaciones.remove(deleting.id);
      await refreshNotifications();
      setFeedback({ variant: "success", message: "Notificación eliminada" });
    } catch (err) {
      setFeedback({ variant: "danger", message: err.response?.data || "No se pudo eliminar la notificación" });
    } finally {
      setDeleting(null);
    }
  };

  const renderDestination = (notif) => {
    if (notif.estudianteId) {
      const estudiante = studentMap[notif.estudianteId];
      return estudiante ? `${estudiante.nombre} ${estudiante.apellido || ""}`.trim() : "Estudiante";
    }
    if (notif.cursoAsignaturaId) {
      const assignment = assignmentMap[notif.cursoAsignaturaId];
      if (!assignment) return "Curso";
      const grado = assignment.gradoNombre ? `${assignment.gradoNombre} · ` : "";
      return `${grado}${assignment.cursoNombre ?? ""} - ${assignment.asignaturaNombre}`;
    }
    return "General";
  };

  const renderCourse = (notif) => {
    if (!notif.cursoId) return "-";
    const course = courseMap[notif.cursoId];
    if (!course) return `Curso ${notif.cursoId}`;
    return course.gradoNombre ? `${course.gradoNombre} · ${course.nombre}` : course.nombre;
  };

  if (loading) {
    return <LoadingSpinner message="Cargando notificaciones..." />;
  }

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h3 className="mb-0">Centro de notificaciones</h3>
              <small className="text-muted">Envía comunicados a cursos o estudiantes y controla su estado.</small>
            </div>
            <Button onClick={openModal}>
              <FaPlus className="me-2" /> Nueva notificación
            </Button>
          </div>
        </Col>
      </Row>

      {feedback && (
        <Alert variant={feedback.variant} dismissible onClose={() => setFeedback(null)}>
          {feedback.message}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {String(error)}
        </Alert>
      )}

      <Card className="shadow-sm mb-3">
        <Card.Body>
          <Row className="gy-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Curso</Form.Label>
                <Form.Select name="cursoId" value={filters.cursoId} onChange={handleFilterChange}>
                  <option value="">Todos</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.gradoNombre ? `${course.gradoNombre} · ${course.nombre}` : course.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Tipo</Form.Label>
                <Form.Select name="tipo" value={filters.tipo} onChange={handleFilterChange}>
                  <option value="">Todos</option>
                  {Object.entries(TYPE_META).map(([value, meta]) => (
                    <option key={value} value={value}>
                      {meta.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Estado</Form.Label>
                <Form.Select name="estado" value={filters.estado} onChange={handleFilterChange}>
                  <option value="">Todos</option>
                  <option value="pendientes">Pendientes</option>
                  <option value="leidas">Leídas</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Búsqueda</Form.Label>
                <Form.Control
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Título o mensaje"
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">Notificaciones ({filteredNotifications.length})</Card.Header>
        <Card.Body>
          {filteredNotifications.length === 0 ? (
            <Alert variant="light" className="mb-0">
              No hay notificaciones para los filtros seleccionados.
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Fecha</th>
                    <th>Título</th>
                    <th>Tipo</th>
                    <th>Curso</th>
                    <th>Destino</th>
                    <th>Estado</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotifications.map((notif) => {
                    const typeMeta = TYPE_META[notif.tipo] || TYPE_META.general;
                    return (
                      <tr key={notif.id}>
                        <td>{new Date(notif.fechaEnvio).toLocaleString()}</td>
                        <td>
                          <strong>{notif.titulo}</strong>
                          <div className="text-muted small">{notif.mensaje}</div>
                        </td>
                        <td>
                          <Badge bg={typeMeta.variant}>{typeMeta.label}</Badge>
                        </td>
                        <td>{renderCourse(notif)}</td>
                        <td>{renderDestination(notif)}</td>
                        <td>
                          <Badge bg={notif.leida ? "success" : "warning"}>
                            {notif.leida ? "Leída" : "Pendiente"}
                          </Badge>
                        </td>
                        <td className="text-end">
                          <div className="d-inline-flex gap-2">
                            <Button
                              size="sm"
                              variant={notif.leida ? "outline-secondary" : "outline-success"}
                              onClick={() => handleToggleRead(notif)}
                              disabled={togglingId === notif.id}
                            >
                              {notif.leida ? <FaEyeSlash /> : <FaEye />}
                            </Button>
                            <Button size="sm" variant="outline-danger" onClick={() => setDeleting(notif)}>
                              <FaTrash />
                            </Button>
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

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Crear notificación</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreate}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Título *</Form.Label>
              <Form.Control name="titulo" value={form.titulo} onChange={handleFormChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mensaje *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="mensaje"
                value={form.mensaje}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Row className="gy-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tipo</Form.Label>
                  <Form.Select name="tipo" value={form.tipo} onChange={handleFormChange}>
                    {Object.entries(TYPE_META).map(([value, meta]) => (
                      <option key={value} value={value}>
                        {meta.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Destino</Form.Label>
                  <Form.Select name="destinatario" value={form.destinatario} onChange={handleFormChange}>
                    {TARGET_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            {form.destinatario === "curso" && (
              <Form.Group className="mt-3">
                <Form.Label>Curso y asignatura</Form.Label>
                <Form.Select
                  name="cursoAsignaturaId"
                  value={form.cursoAsignaturaId}
                  onChange={handleFormChange}
                >
                  <option value="">Selecciona una opción</option>
                  {assignments.map((assignment) => {
                    const grado = assignment.gradoNombre ? `${assignment.gradoNombre} · ` : "";
                    return (
                      <option key={assignment.id} value={assignment.id}>
                        {grado}
                        {assignment.cursoNombre} - {assignment.asignaturaNombre}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            )}
            {form.destinatario === "estudiante" && (
              <Form.Group className="mt-3">
                <Form.Label>Estudiante</Form.Label>
                <Form.Select name="estudianteId" value={form.estudianteId} onChange={handleFormChange}>
                  <option value="">Selecciona un estudiante</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.nombre} {student.apellido}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
            {feedback && (
              <Alert variant={feedback.variant} className="mt-3" onClose={() => setFeedback(null)} dismissible>
                {feedback.message}
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Enviando..." : "Enviar"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ConfirmModal
        show={Boolean(deleting)}
        title="Eliminar notificación"
        message="Esta acción no se puede deshacer. ¿Deseas continuar?"
        confirmVariant="danger"
        confirmText="Eliminar"
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
