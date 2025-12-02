import React, { useMemo, useEffect, useState } from "react";
import { Container, Row, Col, Alert, Card } from "react-bootstrap";
import api from "../services/api.js";
import StatsCard from "../components/StatsCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import PageHero from "../components/PageHero.jsx";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";

// Panel ejecutivo con métricas en vivo para supervisar matrículas, cursos y desempeño docente.
export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Carga única de estadísticas; evita múltiples viajes al backend.
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

  const chartHeight = 280;

  const formatCount = (value) =>
    typeof value === "number" ? value.toLocaleString("es-ES") : "—";

  const formatAverage = (value) =>
    typeof value === "number" ? value.toFixed(2) : "—";

  const ChartPlaceholder = ({ message }) => (
    <div className="h-100 d-flex align-items-center justify-content-center text-muted small">
      {message}
    </div>
  );

  const resumen = stats?.resumenAcademico ?? {};

  const estudiantesPorGrado = useMemo(
    () => (stats?.estudiantesPorGrado ?? []).map((item) => ({
      grado: item.grado ?? "Sin grado",
      estudiantes: item.estudiantes ?? 0
    })),
    [stats]
  );

  const cursosPorGrado = useMemo(
    () => (stats?.cursosPorGrado ?? []).map((item) => ({
      grado: item.grado ?? "Sin grado",
      cursos: item.cursos ?? 0
    })),
    [stats]
  );

  const docentesConMayorCarga = stats?.docentesConMayorCarga ?? [];
  const cursosConMejorPromedio = stats?.cursosConMejorPromedio ?? [];
  const cursosConPeorPromedio = stats?.cursosConPeorPromedio ?? [];

  // Listado textual cuando no justifica renderizar otra gráfica.
  const renderCursoPerformance = (items, emptyMessage) => {
    if (!items.length) return <ChartPlaceholder message={emptyMessage} />;

    return (
      <div className="d-flex flex-column gap-3">
        {items.map((curso) => (
          <div key={`${curso.cursoId}-${curso.curso}`} className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{curso.curso}</strong>
              <p className="text-muted small mb-0">{curso.grado ?? "General"}</p>
            </div>
            <div className="text-end">
              <span className="fw-semibold">{formatAverage(curso.promedio)} / 5</span>
              <p className="text-muted small mb-0">
                {curso.estudiantesEvaluados} eval · {curso.estudiantesEnRiesgo} riesgo
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <LoadingSpinner message="Cargando panel..." />;

  return (
    <Container fluid className="pb-5">
      <Row className="mb-4">
        <Col>
          <PageHero
            eyebrow="Administración"
            title="Panel de administración"
            description="Monitorea el estado general y profundiza en el rendimiento académico."
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
            value={formatCount(stats?.totalDocentes)}
            color="primary"
          />
        </Col>
        <Col md={4}>
          <StatsCard
            title="Total Cursos"
            value={formatCount(stats?.totalCursos)}
            color="secondary"
          />
        </Col>
        <Col md={4}>
          <StatsCard
            title="Total Estudiantes"
            value={formatCount(stats?.totalEstudiantes)}
            color="accent"
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <StatsCard
            title="Promedio general"
            value={`${formatAverage(resumen.promedioGeneral)} / 5`}
            color="primary"
          />
        </Col>
        <Col md={4}>
          <StatsCard
            title="Estudiantes en riesgo"
            value={formatCount(resumen.estudiantesEnRiesgo)}
            color="secondary"
          />
        </Col>
        <Col md={4}>
          <StatsCard
            title="Cursos sin docente asignado"
            value={formatCount(resumen.cursosSinDocente)}
            color="accent"
          />
        </Col>
      </Row>

      <Row className="gy-4 mb-4">
        <Col lg={6}>
          <Card className="glass-card border-0 h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="mb-0">Estudiantes por grado</h6>
                  <small className="text-muted">Total de matrículas por nivel</small>
                </div>
              </div>
              <div style={{ height: chartHeight }}>
                {estudiantesPorGrado.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={estudiantesPorGrado} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="grado" tickLine={false} axisLine={false} />
                      <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                      <Tooltip formatter={(value) => [`${value} estudiantes`, "Estudiantes"]} />
                      <Bar dataKey="estudiantes" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ChartPlaceholder message="Aún no hay estudiantes registrados por grado." />
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="glass-card border-0 h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="mb-0">Cursos por grado</h6>
                  <small className="text-muted">Oferta académica vigente</small>
                </div>
              </div>
              <div style={{ height: chartHeight }}>
                {cursosPorGrado.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cursosPorGrado} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="grado" tickLine={false} axisLine={false} />
                      <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                      <Tooltip formatter={(value) => [`${value} cursos`, "Cursos"]} />
                      <Bar dataKey="cursos" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ChartPlaceholder message="Aún no hay cursos abiertos para mostrar." />
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="gy-4">
        <Col xl={6}>
          <Card className="glass-card border-0 h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="mb-0">Docentes con mayor carga</h6>
                  <small className="text-muted">Comparativo entre cursos y asignaturas</small>
                </div>
              </div>
              <div style={{ height: chartHeight }}>
                {docentesConMayorCarga.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={docentesConMayorCarga}
                      layout="vertical"
                      margin={{ top: 10, right: 16, left: 20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="docente" width={140} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="asignaturas" name="Asignaturas" fill="#f97316" radius={[0, 6, 6, 0]} />
                      <Bar dataKey="cursos" name="Cursos" fill="#10b981" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ChartPlaceholder message="Todavía no hay asignaciones para mostrar." />
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={6}>
          <Card className="glass-card border-0 h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 className="mb-0">Rendimiento por curso</h6>
                  <small className="text-muted">Promedio ponderado y estudiantes evaluados</small>
                </div>
              </div>
              <div className="mb-4">
                <h6 className="text-muted text-uppercase small mb-3">Mejores resultados</h6>
                {renderCursoPerformance(cursosConMejorPromedio, "Sin datos de calificaciones todavía.")}
              </div>
              <div>
                <h6 className="text-muted text-uppercase small mb-3">Necesitan atención</h6>
                {renderCursoPerformance(cursosConPeorPromedio, "Aún no hay cursos en riesgo.")}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card className="glass-card border-0">
            <Card.Body className="p-4">
              <h5 className="mb-3">Mas opciones</h5>
              <p className="text-muted mb-0">
                Usa los filtros del menú lateral para profundizar en grupos específicos.
                Estos tableros se actualizan conforme se registran inscripciones, calificaciones y asignaciones.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
