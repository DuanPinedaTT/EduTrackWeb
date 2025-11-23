import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../hooks/useAuth.js";

export default function Login({ onSuccess }) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        user,
        password
      });

      const normalizedUser = {
        ...res.data.user,
        rol: res.data.user.rol?.toLowerCase()
      };

      login({
        token: res.data.token,
        user: normalizedUser
      });

      if (onSuccess) onSuccess();

      if (normalizedUser.rol === "admin") {
        navigate("/admin");
      } else if (normalizedUser.rol === "docente") {
        navigate("/teacher");
      } else if (normalizedUser.rol === "estudiante") {
        navigate("/student");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {String(error)}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Usuario</Form.Label>
          <Form.Control
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Ingresa tu usuario"
            required
            autoFocus
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
            required
          />
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          className="w-100"
          disabled={loading}
          style={{
            background: "var(--primary-color)",
            border: "none"
          }}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </Button>
      </Form>
    </>
  );
}
