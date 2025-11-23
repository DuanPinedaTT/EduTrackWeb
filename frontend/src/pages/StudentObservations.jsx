import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table
} from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import useStudentProfile from "../hooks/useStudentProfile.js";
import { Observaciones } from "../services/api.js";

const OBSERVATION_TYPES = [
  { value: "academica", label: "Académica", variant: "primary" },
  { value: "convivencia", label: "Convivencia", variant: "warning" },
  { value: "reconocimiento", label: "Reconocimiento", variant: "success" },
  { value: "seguimiento", label: "Seguimiento", variant: "info" }
];

const typeMeta = OBSERVATION_TYPES.reduce((acc, tipo) => {
  acc[tipo.value] = tipo;
  return acc;
}, {});

export default function StudentObservations() {
  const { profile, loadingProfile, profileError } = useStudentProfile();
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [observations, setObservations] = useState([]);
  const [filters, setFilters] = useState({ tipo: "", search: "" });

  useEffect(() => {
    if (!profile?.id) {
      setLoadingData(false);
      return;
    }

    const loadObservations = async () => {
      setLoadingData(true);
      setError(null);
      try {
        const res = await Observaciones.list({ estudianteId: profile.id });
        const data = Array.isArray(res.data) ? res.data : [];
        setObservations(
          data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
        );
      } catch (err) {
        setError(err.response?.data || "No se pudieron cargar las observaciones");
      } finally {
        setLoadingData(false);
      }
    };

    loadObservations();
  }, [profile]);

  const filteredObservations = useMemo(() => {
    return observations.filter((obs) => {
      if (filters.tipo && obs.tipo !== filters.tipo) return false;
      if (
        filters.search &&
        !`${obs.comentario} ${obs.profesor || ""}`
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [observations, filters]);

  const stats = useMemo(() => {
    const total = observations.length;
    const byType = OBSERVATION_TYPES.map((tipo) => ({
      ...tipo,
      count: observations.filter((obs) => obs.tipo === tipo.value).length
    }));
    return { total, byType };
  }, [observations]);

  const recent = useMemo(() => filteredObservations.slice(0, 5), [filteredObservations]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (loadingProfile || loadingData) {
    return <LoadingSpinner message="Cargando observaciones..." />;
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="mb-0">Observaciones y seguimientos</h3>
              <small className="text-muted">Consulta el seguimiento académico y de convivencia registrado por tus docentes.</small>
            </div>
            <Badge bg="dark" className="fs-6">
              {stats.total} registros
            </Badge>
          </div>
        </Col>
      </Row>

      {profileError && (
        <Row className="mb-3">
          <Col>
            <Alert variant="warning">{String(profileError)}</Alert>
          </Col>
        </Row>
      )}

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {String(error)}
            </Alert>
          </Col>
        </Row>
      )}

      <Row className="mb-3">
        {stats.byType.map((tipo) => (
          <Col md={3} sm={6} key={tipo.value} className="mb-3">
            <Card className="shadow-sm h-100">
              <Card.Body>
                <small className="text-muted text-uppercase">{tipo.label}</small>
                <h2 className="mt-2 mb-0">{tipo.count}</h2>
                <p className="text-muted mb-0">Registros</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="shadow-sm mb-3">
        <Card.Header className="bg-light">Filtros</Card.Header>
        <Card.Body>
          <Row>
            <Col md={4} className="mb-3">
              <Form.Group>
                <Form.Label>Tipo de observación</Form.Label>
                <Form.Select name="tipo" value={filters.tipo} onChange={handleFilterChange}>
                  <option value="">Todas</option>
                  {OBSERVATION_TYPES.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={8} className="mb-3">
              <Form.Group>
                <Form.Label>Buscar por docente o comentario</Form.Label>
                <Form.Control
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Ej: convivencia, seguimiento, nombre del docente"
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          Historial completo ({filteredObservations.length})
        </Card.Header>
        <Card.Body>
          {filteredObservations.length === 0 ? (
            <Alert variant="info">No hay observaciones para los filtros seleccionados.</Alert>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Fecha</th>
                    <th>Docente</th>
                    <th>Tipo</th>
                    <th>Comentario</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredObservations.map((obs) => {
                    const meta = typeMeta[obs.tipo] || OBSERVATION_TYPES[0];
                    return (
                      <tr key={obs.id}>
                        <td>{new Date(obs.fecha).toLocaleString()}</td>
                        <td>{obs.profesor || "Sin profesor"}</td>
                        <td>
                          <Badge bg={meta.variant}>{meta.label}</Badge>
                        </td>
                        <td>{obs.comentario}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary text-white">Resumen rápido</Card.Header>
            <Card.Body>
              {recent.length === 0 ? (
                <p className="text-muted mb-0">Aún no tienes observaciones registradas.</p>
              ) : (
                <ul className="list-unstyled mb-0">
                  {recent.map((obs) => {
                    const meta = typeMeta[obs.tipo] || OBSERVATION_TYPES[0];
                    return (
                      <li key={obs.id} className="mb-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <strong>{meta.label}</strong>
                            <p className="mb-1 text-muted">{obs.comentario}</p>
                            <small className="text-muted">Docente: {obs.profesor || "N/D"}</small>
                          </div>
                          <small>{new Date(obs.fecha).toLocaleDateString()}</small>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
