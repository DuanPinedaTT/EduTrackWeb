import React, { useEffect, useState } from "react";
import { Container, Row, Col, Alert, Card } from "react-bootstrap";
import api from "../services/api.js";
import StatsCard from "../components/StatsCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import PageHero from "../components/PageHero.jsx";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/Estadisticas");
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data || "Error cargando estadísticas");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) return <LoadingSpinner message="Cargando panel..." />;

  return (
    <Container fluid className="pb-5">
      <Row className="mb-4">
        <Col>
          <PageHero
            eyebrow="Administración"
            title="Panel de administración"
            description="Monitorea el estado general de cursos, docentes y estudiantes."
            stats={[
              { label: "Docentes", value: stats?.totalDocentes ?? 0 },
              { label: "Cursos", value: stats?.totalCursos ?? 0 },
              { label: "Estudiantes", value: stats?.totalEstudiantes ?? 0 }
            ]}
          />
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger">{String(error)}</Alert>
          </Col>
        </Row>
      )}

      <Row className="mb-4">
        <Col md={4}>
          <StatsCard
            title="Total Docentes"
            value={stats?.totalDocentes ?? 0}
            color="primary"
          />
        </Col>
        <Col md={4}>
          <StatsCard
            title="Total Cursos"
            value={stats?.totalCursos ?? 0}
            color="secondary"
          />
        </Col>
        <Col md={4}>
          <StatsCard
            title="Total Estudiantes"
            value={stats?.totalEstudiantes ?? 0}
            color="accent"
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="glass-card border-0">
            <Card.Body className="p-4">
              <h5 className="mb-3">Bienvenido al panel de administración</h5>
              <p className="text-muted mb-0">
                Usa el menú lateral para gestionar docentes, cursos y estudiantes.
                Todas las operaciones se actualizan en tiempo real.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
