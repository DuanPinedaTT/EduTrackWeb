import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Table, Alert } from "react-bootstrap";
import api from "../services/api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export default function AdminAsignaturas() {
  const [asignaturas, setAsignaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ codigo: "", nombre: "" });

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Asignaturas");
      setAsignaturas(res.data || []);
    } catch (err) {
      setError(err.response?.data || "Error cargando asignaturas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const nombre = form.nombre.trim();
      const codigo = form.codigo.trim();
      if (!nombre) return setError("El nombre es obligatorio");
      if (editing) {
        await api.put(`/Asignaturas/${editing}`, { nombre, codigo });
      } else {
        await api.post(`/Asignaturas`, { nombre, codigo });
      }
      setForm({ codigo: "", nombre: "" });
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.response?.data || "Error guardando asignatura");
    }
  };

  const handleEdit = (a) => {
    setEditing(a.id);
    setForm({ codigo: a.codigo || "", nombre: a.nombre || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar la asignatura?")) return;
    try {
      await api.delete(`/Asignaturas/${id}`);
      await load();
    } catch (err) {
      setError(err.response?.data || "Error eliminando asignatura");
    }
  };

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <h3>Gestión de asignaturas</h3>
          <p className="text-muted">Crea y administra las asignaturas (código identificador editable por admin).</p>
        </Col>
      </Row>

      {error && <Row className="mb-3"><Col><Alert variant="danger">{String(error)}</Alert></Col></Row>}

      <Row>
        <Col md={4}>
          <Card className="mb-3 card-surface">
            <Card.Body>
              <Card.Title>{editing ? "Editar asignatura" : "Nueva asignatura"}</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-2">
                  <Form.Label>Código</Form.Label>
                  <Form.Control name="codigo" value={form.codigo} onChange={handleChange} placeholder="Ejm: MAT" />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control name="nombre" value={form.nombre} onChange={handleChange} />
                </Form.Group>
                <div className="d-flex justify-content-between">
                  <Button type="submit" variant="primary">{editing ? "Guardar" : "Crear"}</Button>
                  {editing && <Button variant="secondary" onClick={() => { setEditing(null); setForm({ codigo: "", nombre: "" }); }}>Cancelar</Button>}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="card-surface">
            <Card.Body>
              <Card.Title>Listado</Card.Title>
              {loading ? <LoadingSpinner /> : (
                <Table hover responsive>
                  <thead><tr><th>#</th><th>Código</th><th>Nombre</th><th className="text-end">Acciones</th></tr></thead>
                  <tbody>
                    {asignaturas.length === 0 ? (
                      <tr><td colSpan={4} className="text-center text-muted">No hay asignaturas.</td></tr>
                    ) : asignaturas.map((a, i) => (
                      <tr key={a.id}>
                        <td>{i+1}</td>
                        <td>{a.codigo}</td>
                        <td>{a.nombre}</td>
                        <td className="text-end">
                          <Button variant="outline-primary" size="sm" onClick={() => handleEdit(a)}>Editar</Button>{' '}
                          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(a.id)}>Eliminar</Button>
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
    </Container>
  );
}
