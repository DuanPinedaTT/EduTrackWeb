import React, { useEffect, useMemo, useState } from "react";
import { Alert, Badge, Card, Col, Container, Row, Table } from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import useStudentProfile from "../hooks/useStudentProfile.js";
import { Notas } from "../services/api.js";

export default function StudentGrades() {
  const { profile, loadingProfile, profileError } = useStudentProfile();
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [configs, setConfigs] = useState([]);
  const [studentRow, setStudentRow] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!profile?.cursoActual?.id) {
        setLoadingData(false);
        return;
      }
      setLoadingData(true);
      setError(null);
      try {
        const [configRes, notasRes] = await Promise.all([
          Notas.configByCurso(profile.cursoActual.id),
          Notas.listByCurso(profile.cursoActual.id)
        ]);
        setConfigs(Array.isArray(configRes.data) ? configRes.data : []);
        const row = Array.isArray(notasRes.data)
          ? notasRes.data.find((student) => student.id === profile.id)
          : null;
        setStudentRow(row || null);
      } catch (err) {
        setError(err.response?.data || "No se pudieron cargar las calificaciones");
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, [profile]);

  const evaluations = useMemo(() => {
    if (!studentRow) return [];
    const configsMap = new Map(configs.map((cfg) => [cfg.id, cfg]));
    return (studentRow.notas || []).map((nota) => {
      const cfg = configsMap.get(nota.notaConfigId);
      return {
        ...nota,
        periodo: cfg?.periodoNombre || "Sin periodo",
        peso: cfg?.peso || 0,
        nombre: cfg?.nombre || nota.nombre
      };
    });
  }, [studentRow, configs]);

  const grouped = useMemo(() => {
    const map = new Map();
    evaluations.forEach((ev) => {
      const period = ev.periodo;
      if (!map.has(period)) map.set(period, []);
      map.get(period).push(ev);
    });
    return Array.from(map.entries());
  }, [evaluations]);

  const promedioGeneral = studentRow?.promedio ?? null;

  if (loadingProfile || loadingData) {
    return <LoadingSpinner message="Cargando calificaciones..." />;
  }

  if (!profile?.cursoActual?.id) {
    return (
      <Container fluid>
        <Alert variant="info">Aún no tienes un curso asignado.</Alert>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <h3 className="mb-0">Mis calificaciones</h3>
          <small className="text-muted">
            {profile.cursoActual.gradoNombre || ""} · {profile.cursoActual.nombre}
          </small>
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

      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card className="card-surface shadow-sm">
            <Card.Body>
              <small className="text-muted text-uppercase">Promedio General</small>
              <h2 className="mt-2">{promedioGeneral != null ? promedioGeneral.toFixed(2) : "--"}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="card-surface shadow-sm">
            <Card.Body>
              <small className="text-muted text-uppercase">Evaluaciones registradas</small>
              <h2 className="mt-2">{evaluations.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="card-surface shadow-sm">
            <Card.Body>
              <small className="text-muted text-uppercase">Pendientes</small>
              <h2 className="mt-2">{evaluations.filter((ev) => ev.valor == null).length}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {grouped.length === 0 ? (
        <Alert variant="info">Aún no hay calificaciones cargadas.</Alert>
      ) : (
        grouped.map(([periodo, rows]) => (
          <Card className="shadow-sm mb-4" key={periodo}>
            <Card.Header className="bg-primary text-white">
              {periodo}
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Evaluación</th>
                      <th>Peso</th>
                      <th>Calificación</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.notaConfigId}>
                        <td>{row.nombre}</td>
                        <td>{(row.peso * 100).toFixed(0)}%</td>
                        <td>{row.valor != null ? row.valor.toFixed(2) : "--"}</td>
                        <td>
                          {row.valor == null ? (
                            <Badge bg="secondary">Pendiente</Badge>
                          ) : row.valor < 3 ? (
                            <Badge bg="danger">En riesgo</Badge>
                          ) : (
                            <Badge bg="success">Aprobado</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}
