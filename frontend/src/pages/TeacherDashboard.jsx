import React, { useEffect, useState } from "react";
import { Container, Row, Col, Alert, Card, Form, Badge } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import api from "../services/api.js";
import StatsCard from "../components/StatsCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  
  const [statsData, setStatsData] = useState({
    gradeDistribution: [],
    groupComparison: []
  });

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

  const periodos = [
    { id: 1, nombre: "Periodo 1" },
    { id: 2, nombre: "Periodo 2" },
    { id: 3, nombre: "Periodo 3" },
    { id: 4, nombre: "Periodo 4" }
  ];
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/cursos");
        const cursos = Array.isArray(res.data) ? res.data : [];

        const misCursos = cursos.filter((c) => c.docenteId === user?.id);
        setCourses(misCursos);
        setAllCourses(cursos);

        // contar estudiantes totales de los cursos del docente
        let total = 0;
        for (const curso of misCursos) {
          try {
            const studentsRes = await api.get(`/cursos/${curso.id}/students`);
            total += Array.isArray(studentsRes.data) ? studentsRes.data.length : 0;
          } catch (e) {
            console.error("Error cargando estudiantes del curso:", curso.id, e);
          }
        }
        setTotalStudents(total);
      } catch (err) {
        console.error("Error cargando cursos:", err);
        setError(err?.message || err);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadData();
  }, [user]);

  // recalcular estadísticas cuando cambie el curso seleccionado o el periodo
  useEffect(() => {
    const computeStats = async () => {
      if (!selectedCourse) {
        setStatsData({ gradeDistribution: [], groupComparison: [] });
        return;
      }

      try {
        setLoading(true);

        const cursosDelMismoNombre = allCourses.filter(c => c.nombre === selectedCourse);
        const groupStats = [];
        let allGrades = [];

        for (const curso of cursosDelMismoNombre) {
          try {
            const notasRes = await api.get(`/notas/curso/${curso.id}`);
            const configsRes = await api.get(`/notas/curso/${curso.id}/config`);

            const notasData = Array.isArray(notasRes.data) ? notasRes.data : [];
            const configsData = Array.isArray(configsRes.data) ? configsRes.data : [];

            if (notasData.length === 0) continue;

            const configsPeriodo = configsData.filter(cfg => cfg.periodo === selectedPeriod);

            const promediosPeriodo = notasData.map(estudiante => {
              const notasPeriodo = (estudiante.notas || []).filter(n =>
                configsPeriodo.some(cfg => cfg.id === n.notaConfigId)
              );

              if (!notasPeriodo || notasPeriodo.length === 0) return null;

              const notasConValor = notasPeriodo.filter(n => n.valor != null);
              if (notasConValor.length === 0) return null;

              const sumaProductos = notasConValor.reduce((sum, n) => {
                const cfg = configsPeriodo.find(c => c.id === n.notaConfigId);
                return sum + (n.valor * (cfg?.peso || 0));
              }, 0);

              const sumaPesos = notasConValor.reduce((sum, n) => {
                const cfg = configsPeriodo.find(c => c.id === n.notaConfigId);
                return sum + (cfg?.peso || 0);
              }, 0);

              return sumaPesos > 0 ? sumaProductos / sumaPesos : null;
            }).filter(p => p != null);

            const promedioCurso = promediosPeriodo.length > 0
              ? (promediosPeriodo.reduce((a, b) => a + b, 0) / promediosPeriodo.length)
              : 0;

            groupStats.push({
              grado: curso.gradoNombre || curso.grado || "Sin grado",
              promedio: Number(promedioCurso.toFixed(2)),
              estudiantes: notasData.length
            });

            allGrades.push(...promediosPeriodo);
          } catch (err) {
            console.error("Error cargando estadísticas del curso:", err);
          }
        }

        const distribution = [
          { rango: "Excelente (4.5-5.0)", cantidad: 0 },
          { rango: "Bueno (4.0-4.4)", cantidad: 0 },
          { rango: "Aceptable (3.5-3.9)", cantidad: 0 },
          { rango: "Bajo (3.0-3.4)", cantidad: 0 },
          { rango: "Insuficiente (<3.0)", cantidad: 0 }
        ];

        allGrades.forEach(grade => {
          if (grade >= 4.5) distribution[0].cantidad++;
          else if (grade >= 4.0) distribution[1].cantidad++;
          else if (grade >= 3.5) distribution[2].cantidad++;
          else if (grade >= 3.0) distribution[3].cantidad++;
          else distribution[4].cantidad++;
        });

        setStatsData({
          gradeDistribution: distribution.filter(d => d.cantidad > 0),
          groupComparison: groupStats
        });
      } catch (err) {
        console.error("Error procesando estadísticas:", err);
      } finally {
        setLoading(false);
      }
    };

    computeStats();
  }, [selectedCourse, selectedPeriod, allCourses]);

  const handleCourseClick = (cursoId) => {
    navigate(`/teacher/course/${cursoId}`);
  };

  if (loading) return <LoadingSpinner message="Cargando estadísticas..." />;

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="mb-0">Panel del docente</h3>
              <small className="text-muted">
                Vista actual: <strong>{selectedCourse || "Ninguno"}</strong>
              </small>
            </div>
          </div>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger">{String(error)}</Alert>
          </Col>
        </Row>
      )}

      {/* Cards de cursos uniformes */}
      <Row className="mb-4">
        <Col>
          <h6 className="text-muted mb-3">Tus cursos</h6>
          {courses.length === 0 ? (
            <Alert variant="info">No tienes cursos asignados.</Alert>
          ) : (
            <Row>
              {courses.map((c) => (
                <Col key={c.id} md={6} lg={4} xl={3} className="mb-3">
                  <Card className="h-100 card-surface course-card" onClick={() => handleCourseClick(c.id)}>
                    <Card.Body className="d-flex flex-column">
                      <div className="mb-2">
                        <Badge bg="primary" className="mb-2" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                          {c.gradoNombre || c.grado || "Sin grado"}
                        </Badge>
                      </div>
                      <Card.Title className="mb-2" style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--primary-color)" }}>
                        {c.nombre}
                      </Card.Title>
                      <Card.Text style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                        Ver estudiantes →
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>

      {/* Filtros */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Analizar curso</Form.Label>
            <Form.Select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">-- Selecciona un curso --</option>
              {[...new Set(courses.map(c => c.nombre))].map((nombre) => (
                <option key={nombre} value={nombre}>
                  {nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Periodo académico</Form.Label>
            <Form.Select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
            >
              {periodos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Gráficos */}
      {selectedCourse && (
        <Row className="mb-4">
          <Col lg={7}>
            <Card className="card-surface">
              <Card.Body>
                <Card.Title className="mb-3">
                  Comparación por grado - {selectedCourse}
                </Card.Title>
                {statsData.groupComparison.length === 0 ? (
                  <Alert variant="info">
                    No hay datos de notas para el periodo seleccionado.
                  </Alert>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={statsData.groupComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="grado" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="promedio" fill="#667eea" name="Promedio del Periodo" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={5}>
            <Card className="card-surface">
              <Card.Body>
                <Card.Title className="mb-3">Distribución de rendimiento</Card.Title>
                {statsData.gradeDistribution.length === 0 ? (
                  <Alert variant="info">Sin datos disponibles.</Alert>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statsData.gradeDistribution}
                        dataKey="cantidad"
                        nameKey="rango"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label
                      >
                        {statsData.gradeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Estadísticas generales */}
      <Row>
        <Col md={6}>
          <StatsCard title="Total de Cursos" value={courses.length} color="primary" />
        </Col>
        <Col md={6}>
          <StatsCard title="Total de Estudiantes" value={totalStudents} color="secondary" />
        </Col>
      </Row>
    </Container>
  );
}
