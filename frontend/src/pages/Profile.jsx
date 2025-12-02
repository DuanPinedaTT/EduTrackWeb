import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext.jsx";
import api from "../services/api.js";

// Perfil personal; permite actualizar datos básicos y credenciales.
export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    User: user?.user || "",
    Nombre: user?.nombre || "",
    Apellido: user?.apellido || "",
    Email: user?.email || "",
    Password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Persiste los cambios en el backend y sincroniza el contexto local.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        User: form.User,
        Nombre: form.Nombre,
        Apellido: form.Apellido,
        Email: form.Email
      };
      if (form.Password && form.Password.trim().length > 0) payload.Password = form.Password;

      const res = await api.put(`/Usuarios/${user.id}`, payload);
      const updated = res.data;

      // Normalize rol to lowercase if present
      if (updated.rol && typeof updated.rol === "string") updated.rol = updated.rol.toLowerCase();

      // Update context
      updateUser({ ...user, ...updated });

      setSuccess("Perfil actualizado correctamente.");
      setForm((f) => ({ ...f, Password: "" }));
    } catch (err) {
      console.error("Error actualizando perfil:", err);
      setError(err?.response?.data || err.message || "Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Container fluid>
      <Row>
        <Col md={8} lg={6} className="mx-auto">
          <Card className="card-surface mt-4">
            <Card.Body>
              <Card.Title>Mi perfil</Card.Title>
              <Card.Text className="text-muted">Actualiza tus datos personales aquí.</Card.Text>

              {error && <Alert variant="danger">{String(error)}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Usuario</Form.Label>
                  <Form.Control name="User" value={form.User} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control name="Nombre" value={form.Nombre} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control name="Apellido" value={form.Apellido} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="Email" value={form.Email} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Nueva contraseña <small className="text-muted">(dejar en blanco para no cambiar)</small></Form.Label>
                  <Form.Control type="password" name="Password" value={form.Password} onChange={handleChange} />
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button type="submit" className="primary-btn" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
