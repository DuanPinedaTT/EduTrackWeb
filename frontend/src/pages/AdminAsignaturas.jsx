import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Table, Alert } from "react-bootstrap";
import api from "../services/api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import PageHero from "../components/PageHero.jsx";

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
    <Container fluid className="pb-5">
      <Row className="mb-4">
        <Col>
          <PageHero
            eyebrow="Administración"
            title="Gestión de asignaturas"
            description="Crea y administra los catálogos de asignaturas disponibles."
            stats={[{ label: "Asignaturas", value: asignaturas.length }]}
          />
        </Col>
      </Row>

      {error && <Row className="mb-3"><Col><Alert variant="danger">{String(error)}</Alert></Col></Row>}

      <Row>
        <Col md={4}>
          <Card className="mb-3 glass-card border-0">
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
                  <Button type="submit" variant="light" className="pill-button active">{editing ? "Guardar" : "Crear"}</Button>
                  {editing && <Button variant="light" className="pill-button" onClick={() => { setEditing(null); setForm({ codigo: "", nombre: "" }); }}>Cancelar</Button>}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="glass-card border-0">
            <Card.Body>
              <Card.Title>Listado</Card.Title>
              {loading ? <LoadingSpinner /> : (
                <div className="table-card">
                  <Table hover responsive className="mb-0">
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
                            <div className="d-flex justify-content-end gap-2 flex-wrap">
                              <Button variant="light" size="sm" className="pill-button" onClick={() => handleEdit(a)}>Editar</Button>
                              <Button variant="light" size="sm" className="pill-button" onClick={() => handleDelete(a.id)}>Eliminar</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
