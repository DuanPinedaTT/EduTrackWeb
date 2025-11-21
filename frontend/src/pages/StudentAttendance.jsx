import React, { useEffect, useMemo, useState } from "react";
import { Alert, Badge, Card, Col, Container, Form, Row, Table } from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import useStudentProfile from "../hooks/useStudentProfile.js";
import { Asistencias } from "../services/api.js";

const STATE_METADATA = {
  1: { label: "Presente", variant: "success" },
  2: { label: "Ausente", variant: "danger" },
  3: { label: "Tardanza", variant: "warning" }
};

export default function StudentAttendance() {
  const { profile, loadingProfile, profileError } = useStudentProfile();
  const [records, setRecords] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState(() => new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 10));
  const [toDate, setToDate] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const load = async () => {
      if (!profile?.id) {
        setLoadingData(false);
        return;
      }
      setLoadingData(true);
      setError(null);
      try {
        const res = await Asistencias.list({ estudianteId: profile.id });
        setRecords(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(err.response?.data || "No se pudo cargar la asistencia");
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, [profile]);

  const filtered = useMemo(() => {
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    return records.filter((r) => {
      const current = new Date(r.fecha);
      if (from && current < from) return false;
      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        if (current > end) return false;
      }
      return true;
    });
  }, [records, fromDate, toDate]);

  const summary = useMemo(() => {
    const total = filtered.length;
    const presentes = filtered.filter((r) => r.estado === 1).length;
    const ausentes = filtered.filter((r) => r.estado === 2).length;
    const tardanzas = filtered.filter((r) => r.estado === 3).length;
    const porcentaje = total ? Math.round((presentes / total) * 100) : 0;
    return { total, presentes, ausentes, tardanzas, porcentaje };
  }, [filtered]);

  if (loadingProfile || loadingData) {
    return <LoadingSpinner message="Cargando historial de asistencia..." />;
  }

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <h3 className="mb-0">Mi asistencia</h3>
          <small className="text-muted">Consulta tus registros por fecha.</small>
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
        <Col md={3} className="mb-2">
          <Card className="card-surface shadow-sm">
            <Card.Body>
              <small className="text-muted text-uppercase">Registros</small>
              <h2 className="mt-2">{summary.total}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-2">
          <Card className="card-surface shadow-sm">
            <Card.Body>
              <small className="text-muted text-uppercase">Presentes</small>
              <h2 className="mt-2 text-success">{summary.presentes}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-2">
          <Card className="card-surface shadow-sm">
            <Card.Body>
              <small className="text-muted text-uppercase">Ausentes</small>
              <h2 className="mt-2 text-danger">{summary.ausentes}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-2">
          <Card className="card-surface shadow-sm">
            <Card.Body>
              <small className="text-muted text-uppercase">% Asistencia</small>
              <h2 className="mt-2">{summary.porcentaje}%</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body>
          <Row className="mb-3">
            <Col md={6} className="mb-2">
              <Form.Group>
                <Form.Label>Desde</Form.Label>
                <Form.Control type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-2">
              <Form.Group>
                <Form.Label>Hasta</Form.Label>
                <Form.Control type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
              </Form.Group>
            </Col>
          </Row>

          {filtered.length === 0 ? (
            <Alert variant="info">No hay registros en el rango seleccionado.</Alert>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Observación</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((record) => {
                    const meta = STATE_METADATA[record.estado] || STATE_METADATA[1];
                    return (
                      <tr key={record.id}>
                        <td>{new Date(record.fecha).toLocaleDateString()}</td>
                        <td>
                          <Badge bg={meta.variant}>{meta.label}</Badge>
                        </td>
                        <td>{record.observacion || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
