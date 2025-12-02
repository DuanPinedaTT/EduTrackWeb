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
  Badge
} from "react-bootstrap";
import api from "../services/api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import PageHero from "../components/PageHero.jsx";

// Catálogo integral de docentes; centraliza cuentas, asignaturas y grupos asignados.
export default function AdminDocentes() {
  const [teachers, setTeachers] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [grados, setGrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    user: "",
    password: "",
    nombre: "",
    apellido: "",
    email: "",
    asignaturas: [],
    asignaciones: []
  };

  const [form, setForm] = useState(() => ({ ...initialFormState }));

  // Carga paralela de asignaturas y grados para poblar selectores sin bloqueos.
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

  // Consulta principal de docentes; reutilizada tras cada operación.
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

  // Permite prender/apagar cada asignatura sin inputs adicionales.
  const toggleAsignatura = (asignaturaId) => {
    setForm((prev) => {
      const key = String(asignaturaId);
      const current = new Set(prev.asignaturas || []);
      if (current.has(key)) {
        current.delete(key);
      } else {
        current.add(key);
      }
      return { ...prev, asignaturas: Array.from(current) };
    });
  };

  // Marca los salones (grado+grupo) que atenderá cada docente.
  const toggleAsignacion = (gradoId, grupo) => {
    const key = `${gradoId}__${grupo}`;
    setForm((prev) => {
      const current = new Set(prev.asignaciones || []);
      if (current.has(key)) {
        current.delete(key);
      } else {
        current.add(key);
      }
      return { ...prev, asignaciones: Array.from(current) };
    });
  };

  const selectedAsignaturas = form.asignaturas || [];
  const selectedAsignaciones = form.asignaciones || [];

  // Limpieza total del formulario; también sale del modo edición.
  const resetForm = () => {
    setEditingId(null);
    setForm({ ...initialFormState });
  };

  // Alta y edición comparten este flujo para no duplicar formularios.
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
        asignaturas: selectedAsignaturas.map((id) => Number(id)),
        asignaciones: selectedAsignaciones.map((value) => {
          const [gradoId, grupo] = value.split("__");
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

  // Carga datos del docente en el formulario y sube la vista para editar enseguida.
  const handleEdit = (teacher) => {
    setEditingId(teacher.id);
    setForm({
      user: teacher.user,
      password: "",
      nombre: teacher.nombre,
      apellido: teacher.apellido,
      email: teacher.email,
      asignaturas: (teacher.asignaturas || []).map((a) => String(a.asignaturaId ?? a.id ?? a)),
      asignaciones: (teacher.asignaciones || []).map((a) => `${a.gradoId}__${a.grupo}`)
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
    <Container fluid className="pb-5">
      <Row className="mb-4">
        <Col>
          <PageHero
            eyebrow="Administración"
            title="Gestión de docentes"
            description="Crea y administra las cuentas de los docentes del sistema."
            stats={[
              { label: "Docentes", value: teachers.length },
              { label: "Asignaturas", value: asignaturas.length }
            ]}
          />
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
          <Card className="glass-card border-0 mb-3">
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
                <Form.Group className="mb-3">
                  <Form.Label>Asignaturas que imparte</Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    {asignaturas.length === 0 ? (
                      <span className="text-muted small">No hay asignaturas registradas.</span>
                    ) : (
                      asignaturas.map((a) => {
                        const selected = selectedAsignaturas.includes(String(a.id));
                        return (
                            <Button
                              type="button"
                              key={a.id}
                              size="sm"
                              variant="light"
                              className={`pill-button ${selected ? "active" : ""}`}
                              onClick={() => toggleAsignatura(a.id)}
                            >
                              {a.codigo ? `${a.codigo} - ${a.nombre}` : a.nombre}
                            </Button>
                        );
                      })
                    )}
                  </div>
                  <Form.Text className="text-muted">Haz clic para activar o desactivar cada asignatura.</Form.Text>
                  {selectedAsignaturas.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {selectedAsignaturas.map((id) => {
                        const data = asignaturas.find((a) => String(a.id) === id);
                        const label = data
                          ? data.codigo
                            ? `${data.codigo} - ${data.nombre}`
                            : data.nombre
                          : `Asignatura #${id}`;
                        return (
                          <Badge bg="info" key={id}>{label}</Badge>
                        );
                      })}
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Grados y grupos</Form.Label>
                  {grados.length === 0 ? (
                    <p className="text-muted small mb-2">Crea grados para poder seleccionar grupos.</p>
                  ) : (
                    grados.map((grado) => (
                      <div key={grado.id} className="mb-2">
                        <strong>{grado.nombre}</strong>
                        <div className="d-flex flex-wrap gap-2 mt-2">
                          {(grado.grupos || []).length === 0 ? (
                            <span className="text-muted small">Sin grupos configurados.</span>
                          ) : (
                            grado.grupos.map((grupo) => {
                              const key = `${grado.id}__${grupo}`;
                              const selected = selectedAsignaciones.includes(key);
                              return (
                                <Button
                                  type="button"
                                  key={key}
                                  size="sm"
                                  variant="light"
                                  className={`pill-button ${selected ? "active" : ""}`}
                                  onClick={() => toggleAsignacion(grado.id, grupo)}
                                >
                                  {grupo}
                                </Button>
                              );
                            })
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  <Form.Text className="text-muted">Selecciona los salones donde el docente impartirá clases.</Form.Text>
                  {selectedAsignaciones.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {selectedAsignaciones.map((value) => {
                        const [gradoId, grupo] = value.split("__");
                        const gradoNombre = grados.find((g) => String(g.id) === gradoId)?.nombre || `Grado #${gradoId}`;
                        return (
                          <Badge bg="secondary" key={value}>{`${gradoNombre} - ${grupo}`}</Badge>
                        );
                      })}
                    </div>
                  )}
                </Form.Group>
                <div className="d-flex justify-content-between">
                  <Button type="submit" variant="light" className="pill-button active">
                    {editingId ? "Guardar cambios" : "Crear docente"}
                  </Button>
                  {editingId && (
                    <Button variant="light" className="pill-button" onClick={resetForm}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="glass-card border-0 mb-3">
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
                <div className="table-card">
                  <Table hover responsive className="mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Usuario</th>
                        <th>Nombre completo</th>
                        <th>Email</th>
                        <th>Asignaturas</th>
                        <th className="text-end">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center text-muted">
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
                            <td>
                              {t.asignaturas && t.asignaturas.length > 0 ? (
                                <div className="d-flex flex-wrap gap-1">
                                  {t.asignaturas.map((a) => (
                                    <Badge key={`${t.id}-asig-${a.asignaturaId}`} bg="light" text="dark">
                                      {a.codigo || a.nombre}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted">Sin asignar</span>
                              )}
                            </td>
                            <td className="text-end">
                              <div className="d-flex justify-content-end gap-2 flex-wrap">
                                <Button
                                  size="sm"
                                  variant="light"
                                  className="pill-button"
                                  onClick={() => handleEdit(t)}
                                >
                                  Editar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="light"
                                  className="pill-button"
                                  onClick={() => handleDelete(t.id)}
                                >
                                  Eliminar
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
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
