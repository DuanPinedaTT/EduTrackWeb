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
import { FaCheckCircle, FaEdit, FaPlus, FaTimesCircle, FaTrash } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import { Periodos } from "../services/api.js";

const initialForm = {
  nombre: "",
  fechaInicio: "",
  fechaFin: "",
  orden: ""
};

export default function AdminPeriodos() {
  const [periodos, setPeriodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingPeriodo, setEditingPeriodo] = useState(null);
  const [periodoToDelete, setPeriodoToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPeriodos();
  }, []);

  const loadPeriodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await Periodos.list();
      setPeriodos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data || "No se pudieron cargar los periodos");
    } finally {
      setLoading(false);
    }
  };

  const activePeriodo = useMemo(() => periodos.find((p) => p.activo), [periodos]);

  const openCreateModal = () => {
    setEditingPeriodo(null);
    setForm(initialForm);
    setValidated(false);
    setShowModal(true);
  };

  const openEditModal = (periodo) => {
    setEditingPeriodo(periodo);
    setForm({
      nombre: periodo.nombre,
      fechaInicio: periodo.fechaInicio ? periodo.fechaInicio.substring(0, 10) : "",
      fechaFin: periodo.fechaFin ? periodo.fechaFin.substring(0, 10) : "",
      orden: periodo.orden ?? ""
    });
    setValidated(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPeriodo(null);
    setValidated(false);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formNode = event.currentTarget;
    if (!formNode.checkValidity()) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    if (new Date(form.fechaFin) <= new Date(form.fechaInicio)) {
      setFeedback({ variant: "danger", message: "La fecha fin debe ser posterior a la fecha inicio" });
      return;
    }

    const payload = {
      nombre: form.nombre.trim(),
      fechaInicio: new Date(form.fechaInicio).toISOString(),
      fechaFin: new Date(form.fechaFin).toISOString(),
      orden: form.orden ? Number(form.orden) : editingPeriodo?.orden ?? 0
    };

    setSubmitting(true);
    setFeedback(null);
    try {
      if (editingPeriodo) {
        await Periodos.update(editingPeriodo.id, payload);
        setFeedback({ variant: "success", message: "Periodo actualizado correctamente" });
      } else {
        await Periodos.create(payload);
        setFeedback({ variant: "success", message: "Periodo creado correctamente" });
      }
      closeModal();
      await loadPeriodos();
    } catch (err) {
      setFeedback({ variant: "danger", message: err.response?.data || "No se pudo guardar el periodo" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleActivate = async (periodo) => {
    if (periodo.activo) return;
    try {
      await Periodos.activate(periodo.id);
      setFeedback({ variant: "success", message: `${periodo.nombre} ahora es el periodo activo` });
      await loadPeriodos();
    } catch (err) {
      setFeedback({ variant: "danger", message: err.response?.data || "No se pudo activar el periodo" });
    }
  };

  const handleDelete = async () => {
    if (!periodoToDelete) return;
    try {
      await Periodos.remove(periodoToDelete.id);
      setFeedback({ variant: "success", message: "Periodo eliminado" });
      setPeriodoToDelete(null);
      await loadPeriodos();
    } catch (err) {
      setFeedback({ variant: "danger", message: err.response?.data || "No se pudo eliminar el periodo" });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando periodos académicos..." />;
  }

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="mb-0">Gestión de periodos académicos</h3>
              <small className="text-muted">
                Define la vigencia de cada periodo y controla cuál está activo actualmente.
              </small>
            </div>
            <Button onClick={openCreateModal}>
              <FaPlus className="me-2" /> Nuevo periodo
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {String(error)}
        </Alert>
      )}

      {feedback && (
        <Alert variant={feedback.variant} dismissible onClose={() => setFeedback(null)}>
          {feedback.message}
        </Alert>
      )}

      <Card className="shadow-sm mb-3">
        <Card.Body>
          {activePeriodo ? (
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div>
                <strong>Periodo activo:</strong> {activePeriodo.nombre}
                <span className="text-muted ms-2">
                  {new Date(activePeriodo.fechaInicio).toLocaleDateString()} — {" "}
                  {new Date(activePeriodo.fechaFin).toLocaleDateString()}
                </span>
              </div>
              <Badge bg="success" className="mt-2 mt-md-0">
                <FaCheckCircle className="me-1" /> En curso
              </Badge>
            </div>
          ) : (
            <Alert variant="warning" className="mb-0">
              No hay periodos activos. Activa uno para habilitar reportes.
            </Alert>
          )}
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">Listado de periodos ({periodos.length})</Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Orden</th>
                  <th>Nombre</th>
                  <th>Fechas</th>
                  <th>Estado</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {periodos.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No hay periodos registrados.
                    </td>
                  </tr>
                ) : (
                  periodos.map((periodo) => (
                    <tr key={periodo.id}>
                      <td>{periodo.orden ?? "-"}</td>
                      <td>{periodo.nombre}</td>
                      <td>
                        {new Date(periodo.fechaInicio).toLocaleDateString()} — {" "}
                        {new Date(periodo.fechaFin).toLocaleDateString()}
                      </td>
                      <td>
                        <Badge bg={periodo.activo ? "success" : "secondary"}>
                          {periodo.activo ? (
                            <>
                              <FaCheckCircle className="me-1" /> Activo
                            </>
                          ) : (
                            <>
                              <FaTimesCircle className="me-1" /> Inactivo
                            </>
                          )}
                        </Badge>
                      </td>
                      <td className="text-end">
                        <div className="d-inline-flex gap-2">
                          <Button
                            variant={periodo.activo ? "outline-secondary" : "outline-success"}
                            size="sm"
                            onClick={() => handleActivate(periodo)}
                          >
                            {periodo.activo ? "Activo" : "Activar"}
                          </Button>
                          <Button variant="outline-warning" size="sm" onClick={() => openEditModal(periodo)}>
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => setPeriodoToDelete(periodo)}
                            disabled={periodo.activo}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingPeriodo ? "Editar periodo" : "Nuevo periodo"}</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre *</Form.Label>
              <Form.Control
                name="nombre"
                value={form.nombre}
                onChange={handleFormChange}
                placeholder="Ej: Periodo 1"
                required
              />
              <Form.Control.Feedback type="invalid">El nombre es obligatorio</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de inicio *</Form.Label>
              <Form.Control
                type="date"
                name="fechaInicio"
                value={form.fechaInicio}
                onChange={handleFormChange}
                required
              />
              <Form.Control.Feedback type="invalid">Selecciona la fecha de inicio</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de fin *</Form.Label>
              <Form.Control
                type="date"
                name="fechaFin"
                value={form.fechaFin}
                onChange={handleFormChange}
                required
              />
              <Form.Control.Feedback type="invalid">Selecciona la fecha de fin</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Orden (opcional)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                name="orden"
                value={form.orden}
                onChange={handleFormChange}
                placeholder="1, 2, 3..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Guardando..." : editingPeriodo ? "Actualizar" : "Crear"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ConfirmModal
        show={Boolean(periodoToDelete)}
        title="Eliminar periodo"
        message={`Esta acción eliminará ${periodoToDelete?.nombre}. ¿Deseas continuar?`}
        confirmText="Eliminar"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onClose={() => setPeriodoToDelete(null)}
      />
    </div>
  );
}
