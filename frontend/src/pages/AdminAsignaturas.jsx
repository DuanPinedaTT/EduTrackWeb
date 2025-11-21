import React, { useEffect, useMemo, useState } from "react";
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
  Modal
} from "react-bootstrap";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import api from "../services/api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import SearchInput from "../components/SearchInput.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";

export default function AdminAsignaturas() {
  const [asignaturas, setAsignaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ codigo: "", nombre: "" });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/Asignaturas");
      setAsignaturas(res.data || []);
    } catch (err) {
      setError(err.response?.data || "Error cargando asignaturas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!search) return asignaturas;
    const term = search.toLowerCase();
    return asignaturas.filter((item) =>
      item.nombre?.toLowerCase().includes(term) ||
      item.codigo?.toLowerCase().includes(term)
    );
  }, [search, asignaturas]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const resetForm = () => {
    setForm({ codigo: "", nombre: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nombre = form.nombre.trim();
    const codigo = form.codigo.trim();
    if (!nombre) {
      return setError("El nombre es obligatorio");
    }
    try {
      setSaving(true);
      setError(null);
      if (editing) {
        await api.put(`/Asignaturas/${editing}`, { nombre, codigo });
      } else {
        await api.post(`/Asignaturas`, { nombre, codigo });
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err.response?.data || "Error guardando asignatura");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditing(item.id);
    setForm({ codigo: item.codigo || "", nombre: item.nombre || "" });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setError(null);
      await api.delete(`/Asignaturas/${deleteTarget.id}`);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(err.response?.data || "Error eliminando asignatura");
    }
  };

  const emptyState = !loading && filtered.length === 0;

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
            <div>
              <h3 className="mb-1">Gestión de asignaturas</h3>
              <p className="text-muted mb-0">
                Centraliza el catálogo de materias que luego se asignan a grados y grupos.
              </p>
            </div>
            <Button onClick={() => { setShowForm(true); setEditing(null); setForm({ codigo: "", nombre: "" }); }}>
              <FaPlus className="me-2" /> Nueva asignatura
            </Button>
          </div>
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

      <Row>
        <Col>
          <Card className="card-surface">
            <Card.Body>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
                <div>
                  <Card.Title className="mb-0">Listado de asignaturas</Card.Title>
                  <small className="text-muted">{filtered.length} resultados</small>
                </div>
                <SearchInput placeholder="Buscar por nombre o código" onSearch={setSearch} />
              </div>

              {loading ? (
                <LoadingSpinner />
              ) : emptyState ? (
                <div className="text-center text-muted py-4">
                  {asignaturas.length === 0 ? "Aún no hay asignaturas registradas." : "No hay resultados para la búsqueda."}
                </div>
              ) : (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Código</th>
                      <th>Nombre</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>
                          {item.codigo ? (
                            <Badge bg="info" pill>{item.codigo}</Badge>
                          ) : (
                            <span className="text-muted">Sin código</span>
                          )}
                        </td>
                        <td>{item.nombre}</td>
                        <td className="text-end">
                          <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(item)}>
                            <FaEdit className="me-1" /> Editar
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => setDeleteTarget(item)}>
                            <FaTrash className="me-1" /> Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showForm} onHide={resetForm} backdrop="static">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editing ? "Editar asignatura" : "Nueva asignatura"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre *</Form.Label>
              <Form.Control
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                placeholder="Matemáticas, Ciencias..."
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Código</Form.Label>
              <Form.Control
                name="codigo"
                value={form.codigo}
                onChange={handleChange}
                placeholder="Ej: MAT"
              />
              <Form.Text className="text-muted">Opcional, visible al asignar materias.</Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={resetForm} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear asignatura"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ConfirmModal
        show={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar asignatura"
        message={`¿Confirma eliminar ${deleteTarget?.nombre || "esta asignatura"}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
      />
    </Container>
  );
}
