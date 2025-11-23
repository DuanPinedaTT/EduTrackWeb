import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Table, Alert } from "react-bootstrap";
import api from "../services/api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export default function AdminGrados() {
  const [grados, setGrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ codigo: "", nombre: "", grupos: "" });

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Grados");
      setGrados(res.data || []);
    } catch (err) {
      setError(err.response?.data || "Error cargando grados");
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
      const gruposArr = form.grupos.split(',').map(s => s.trim()).filter(Boolean);
      if (!nombre) return setError("El nombre es obligatorio");
      if (editing) {
        await api.put(`/Grados/${editing}`, { nombre, codigo, grupos: gruposArr });
      } else {
        await api.post(`/Grados`, { nombre, codigo, grupos: gruposArr });
      }
      setForm({ codigo: "", nombre: "", grupos: "" });
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.response?.data || "Error guardando grado");
    }
  };

  const handleEdit = (g) => {
    setEditing(g.id);
    setForm({ codigo: g.codigo || "", nombre: g.nombre || "", grupos: (g.grupos || []).join(', ') });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar el grado?")) return;
    try {
      await api.delete(`/Grados/${id}`);
      await load();
    } catch (err) {
      setError(err.response?.data || "Error eliminando grado");
    }
  };

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <h3>Gestión de grados</h3>
          <p className="text-muted">Crea grados y define los grupos (ej: 10-01,10-02).</p>
        </Col>
      </Row>

      {error && <Row className="mb-3"><Col><Alert variant="danger">{String(error)}</Alert></Col></Row>}

      <Row>
        <Col md={4}>
          <Card className="mb-3 card-surface">
            <Card.Body>
              <Card.Title>{editing ? "Editar grado" : "Nuevo grado"}</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-2">
                  <Form.Label>Código</Form.Label>
                  <Form.Control name="codigo" value={form.codigo} onChange={handleChange} placeholder="Ejm: DEC" />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control name="nombre" value={form.nombre} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Grupos (separados por coma)</Form.Label>
                  <Form.Control name="grupos" value={form.grupos} onChange={handleChange} placeholder="Ej: 01, 02, 03" />
                </Form.Group>
                <div className="d-flex justify-content-between">
                  <Button type="submit" variant="primary">{editing ? "Guardar" : "Crear"}</Button>
                  {editing && <Button variant="secondary" onClick={() => { setEditing(null); setForm({ codigo: "", nombre: "", grupos: "" }); }}>Cancelar</Button>}
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
                  <thead><tr><th>#</th><th>Código</th><th>Nombre</th><th>Grupos</th><th className="text-end">Acciones</th></tr></thead>
                  <tbody>
                    {grados.length === 0 ? (
                      <tr><td colSpan={5} className="text-center text-muted">No hay grados.</td></tr>
                    ) : grados.map((g, i) => (
                      <tr key={g.id}>
                        <td>{i+1}</td>
                        <td>{g.codigo}</td>
                        <td>{g.nombre}</td>
                        <td>{(g.grupos || []).join(', ')}</td>
                        <td className="text-end">
                          <Button variant="outline-primary" size="sm" onClick={() => handleEdit(g)}>Editar</Button>{' '}
                          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(g.id)}>Eliminar</Button>
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
