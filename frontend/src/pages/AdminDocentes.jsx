import React, { useEffect, useState } from "react";
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
  ButtonGroup
} from "react-bootstrap";
import api from "../services/api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export default function AdminDocentes() {
  const [teachers, setTeachers] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [grados, setGrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    user: "",
    password: "",
    nombre: "",
    apellido: "",
    email: ""
  });

  // include asignaturas and asignaciones (grado+grupo)
  useEffect(() => {
    const loadExtras = async () => {
      try {
        const [aRes, gRes] = await Promise.all([api.get('/Asignaturas'), api.get('/Grados')]);
        setAsignaturas(aRes.data || []);
        setGrados(gRes.data || []);
      } catch (err) {
        console.error('Error cargando asignaturas/grados', err);
      }
    };
    loadExtras();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/usuarios");
      setTeachers(res.data);
    } catch (err) {
      setError(err.response?.data || "Error cargando docentes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleMultiSelect = (e) => {
    const { name, selectedOptions } = e.target;
    const values = Array.from(selectedOptions).map(o => o.value);
    setForm({ ...form, [name]: values });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      user: "",
      password: "",
      nombre: "",
      apellido: "",
      email: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      // include selected asignaturas and asignaciones if present
      const body = {
        user: form.user,
        password: form.password || null,
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        asignaturas: form.asignaturas || [],
        asignaciones: (form.asignaciones || []).map(s => {
          const [gradoId, grupo] = s.split('__');
          return { gradoId: Number(gradoId), grupo };
        })
      };

      if (editingId) {
        await api.put(`/usuarios/${editingId}`, body);
      } else {
        await api.post("/usuarios", body);
      }
      resetForm();
      loadTeachers();
    } catch (err) {
      setError(err.response?.data || "Error guardando docente");
    }
  };

  const handleEdit = (teacher) => {
    setEditingId(teacher.id);
    setForm({
      user: teacher.user,
      password: "",
      nombre: teacher.nombre,
      apellido: teacher.apellido,
      email: teacher.email
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este docente?")) return;
    try {
      setError(null);
      await api.delete(`/usuarios/${id}`);
      loadTeachers();
    } catch (err) {
      setError(err.response?.data || "Error eliminando docente");
    }
  };

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <h3>Gestión de docentes</h3>
          <p className="text-muted">
            Crea y administra las cuentas de los docentes del sistema.
          </p>
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
        <Col md={4}>
          <Card className="shadow-sm mb-3">
            <Card.Body>
              <Card.Title className="mb-3">
                {editingId ? "Editar docente" : "Nuevo docente"}
              </Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-2">
                  <Form.Label>Usuario</Form.Label>
                  <Form.Control
                    name="user"
                    value={form.user}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>
                    Contraseña{" "}
                    {editingId && (
                      <small className="text-muted">(vacío = no cambiar)</small>
                    )}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder={editingId ? "••••••" : ""}
                    required={!editingId}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Asignaturas (seleccione varias)</Form.Label>
                  <Form.Control as="select" multiple name="asignaturas" value={form.asignaturas || []} onChange={handleMultiSelect}>
                    {asignaturas.map(a => (
                      <option key={a.id} value={a.id}>{a.codigo ? `${a.codigo} - ${a.nombre}` : a.nombre}</option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Grados / Grupos (seleccione varios)</Form.Label>
                  <Form.Control as="select" multiple name="asignaciones" value={form.asignaciones || []} onChange={handleMultiSelect}>
                    {grados.flatMap(g => (g.grupos || []).map(gr => ({ gradoId: g.id, grupo: gr }))).map(item => (
                      <option key={`${item.gradoId}__${item.grupo}`} value={`${item.gradoId}__${item.grupo}`}>
                        {`${grados.find(g => g.id === item.gradoId)?.nombre || ''} - ${item.grupo}`}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <div className="d-flex justify-content-between">
                  <Button type="submit" variant="primary">
                    {editingId ? "Guardar cambios" : "Crear docente"}
                  </Button>
                  {editingId && (
                    <Button variant="secondary" onClick={resetForm}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="shadow-sm mb-3">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center mb-3">
                <span>Lista de docentes</span>
                {loading && (
                  <Badge bg="secondary" pill>
                    Cargando...
                  </Badge>
                )}
              </Card.Title>
              {loading ? (
                <LoadingSpinner />
              ) : (
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Usuario</th>
                      <th>Nombre completo</th>
                      <th>Email</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-muted">
                          No hay docentes registrados.
                        </td>
                      </tr>
                    ) : (
                      teachers.map((t, index) => (
                        <tr key={t.id}>
                          <td>{index + 1}</td>
                          <td>{t.user}</td>
                          <td>
                            {t.nombre} {t.apellido}
                          </td>
                          <td>{t.email}</td>
                          <td className="text-end">
                            <ButtonGroup size="sm">
                              <Button
                                variant="outline-primary"
                                onClick={() => handleEdit(t)}
                              >
                                Editar
                              </Button>
                              <Button
                                variant="outline-danger"
                                onClick={() => handleDelete(t.id)}
                              >
                                Eliminar
                              </Button>
                            </ButtonGroup>
                          </td>
                        </tr>
                      ))
                    )}
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
