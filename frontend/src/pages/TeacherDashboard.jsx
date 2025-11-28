import React, { useEffect, useMemo, useRef, useState } from "react";
import { Container, Row, Col, Alert, Card, Form, Badge, Button, ListGroup, Spinner, Table } from "react-bootstrap";
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
  ResponsiveContainer,
  ReferenceLine,
  LabelList
} from "recharts";
import api from "../services/api.js";
import StatsCard from "../components/StatsCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import PageHero from "../components/PageHero.jsx";
import { useNotifications } from "../contexts/NotificationContext.jsx";

const pickProp = (obj, prop) => {
  if (!obj) return undefined;
  const lower = prop.charAt(0).toLowerCase() + prop.slice(1);
  const upper = prop.charAt(0).toUpperCase() + prop.slice(1);
  if (Object.prototype.hasOwnProperty.call(obj, prop)) return obj[prop];
  if (Object.prototype.hasOwnProperty.call(obj, lower)) return obj[lower];
  if (Object.prototype.hasOwnProperty.call(obj, upper)) return obj[upper];
  return undefined;
};

const PASSING_SCORE = 3.5;

const formatCourseLabel = (grado, grupo) =>
  [grado || "Sin grado", grupo ? `Grupo ${grupo}` : null].filter(Boolean).join(" · ");

const resolveAssignmentId = (assignment) => {
  if (!assignment) return null;
  const rawId =
    assignment.id ??
    assignment.Id ??
    assignment.cursoAsignaturaId ??
    assignment.CursoAsignaturaId ??
    assignment.cursoAsignaturaID ??
    assignment.CursoAsignaturaID;
  return rawId != null ? Number(rawId) : null;
};

const GroupComparisonTooltip = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;
  const data = payload[0].payload;
  return (
    <div className="p-2 rounded border bg-white shadow-sm small">
      <strong className="d-block mb-1">{data.grado}</strong>
      <div>Promedio: <span className="fw-semibold">{data.promedio?.toFixed ? data.promedio.toFixed(2) : data.promedio}</span></div>
      <div>Estudiantes evaluados: {data.estudiantes}</div>
    </div>
  );
};

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courseAssignments, setCourseAssignments] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [selectedAsignatura, setSelectedAsignatura] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [courseMeta, setCourseMeta] = useState({});
  const [metaLoading, setMetaLoading] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [courseDetail, setCourseDetail] = useState({ configs: [], students: [] });
  const [courseDetailLoading, setCourseDetailLoading] = useState(false);
  const [courseDetailError, setCourseDetailError] = useState(null);
  
  const [statsData, setStatsData] = useState({
    gradeDistribution: [],
    groupComparison: [],
    destacados: [],
    enRiesgo: []
  });
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);
  const [detailRefreshKey, setDetailRefreshKey] = useState(0);
  const assignmentsRef = useRef([]);
  const selectedAssignmentIdRef = useRef(null);
  const selectedCourseIdRef = useRef(null);
  const { subscribe } = useNotifications();

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

  const formatAsignaturaName = (assignment) => {
    if (!assignment) return "Sin asignatura";
    if (assignment.asignaturaCodigo) {
      return `${assignment.asignaturaCodigo} - ${assignment.asignaturaNombre}`;
    }
    return assignment.asignaturaNombre || "Sin asignatura";
  };

  const periodos = [
    { id: 1, nombre: "Periodo 1" },
    { id: 2, nombre: "Periodo 2" },
    { id: 3, nombre: "Periodo 3" },
    { id: 4, nombre: "Periodo 4" }
  ];

  const subjectGroups = useMemo(() => {
    const map = {};
    courseAssignments.forEach((assignment) => {
      const key = formatAsignaturaName(assignment);
      if (!map[key]) map[key] = [];
      map[key].push(assignment);
    });
    return map;
  }, [courseAssignments]);

  const selectedAssignment = useMemo(() => {
    if (selectedAssignmentId == null) return null;
    return courseAssignments.find(
      (assignment) => resolveAssignmentId(assignment) === selectedAssignmentId
    ) || null;
  }, [courseAssignments, selectedAssignmentId]);

  const selectedCourseId = selectedAssignment?.cursoId ?? null;

  useEffect(() => {
    if (!selectedAssignment) {
      setCourseDetail({ configs: [], students: [] });
      setCourseDetailError(null);
      setCourseDetailLoading(false);
      return;
    }

    const cursoAsignaturaId = resolveAssignmentId(selectedAssignment);
    if (cursoAsignaturaId == null) {
      setCourseDetail({ configs: [], students: [] });
      setCourseDetailError("No se pudo identificar la asignación seleccionada.");
      setCourseDetailLoading(false);
      return;
    }

    let cancel = false;
    const loadCourseDetail = async () => {
      setCourseDetailLoading(true);
      setCourseDetailError(null);
      try {
        const params = { params: { cursoAsignaturaId } };
        const [configsRes, studentsRes] = await Promise.all([
          api.get(`/Notas/curso/${selectedAssignment.cursoId}/config`, params),
          api.get(`/Notas/curso/${selectedAssignment.cursoId}`, params)
        ]);

        if (!cancel) {
          setCourseDetail({
            configs: Array.isArray(configsRes.data) ? configsRes.data : [],
            students: Array.isArray(studentsRes.data) ? studentsRes.data : []
          });
        }
      } catch (detailErr) {
        console.error("Error cargando detalle del curso:", detailErr);
        if (!cancel) {
          setCourseDetail({ configs: [], students: [] });
          setCourseDetailError(detailErr?.response?.data || "No se pudo cargar el detalle del curso");
        }
      } finally {
        if (!cancel) setCourseDetailLoading(false);
      }
    };

    loadCourseDetail();
    return () => {
      cancel = true;
    };
  }, [selectedAssignment, detailRefreshKey]);

  const subjectList = useMemo(() => Object.keys(subjectGroups).sort((a, b) => a.localeCompare(b)), [subjectGroups]);
  const selectedCourses = selectedAsignatura ? subjectGroups[selectedAsignatura] || [] : [];

  const getSubjectTotals = (nombre) => {
    const listado = subjectGroups[nombre] || [];
    const estudiantes = listado.reduce(
      (sum, assignment) => sum + (courseMeta[assignment.cursoId]?.studentCount || 0),
      0
    );
    return {
      grupos: listado.length,
      estudiantes
    };
  };

  const selectedAssignmentMeta = selectedCourseId ? courseMeta[selectedCourseId] : null;

  const periodSummarySelectedAssignment = useMemo(() => {
    const summary = {};
    periodos.forEach((p) => {
      const cfgs = courseDetail.configs.filter((cfg) => Number(cfg.periodo) === p.id);
      summary[p.id] = {
        peso: cfgs.reduce((acc, cfg) => acc + Number(cfg.peso || 0), 0),
        columnas: cfgs.length
      };
    });
    return summary;
  }, [courseDetail.configs, periodos]);

  const configsForSelectedPeriod = useMemo(
    () => courseDetail.configs.filter((cfg) => Number(cfg.periodo) === selectedPeriod),
    [courseDetail.configs, selectedPeriod]
  );

  const studentsPeriodData = useMemo(() => {
    if (configsForSelectedPeriod.length === 0) return [];
    const cfgMap = new Map(configsForSelectedPeriod.map((cfg) => [cfg.id, cfg]));
    return courseDetail.students.map((student) => {
      const notasPeriodo = (student.notas || []).filter((nota) => cfgMap.has(nota.notaConfigId));
      const notasConValor = notasPeriodo.filter((nota) => nota.valor != null);

      const sumaPesos = notasConValor.reduce((sum, nota) => {
        const cfg = cfgMap.get(nota.notaConfigId);
        return sum + (cfg?.peso || 0);
      }, 0);

      const sumaProductos = notasConValor.reduce((sum, nota) => {
        const cfg = cfgMap.get(nota.notaConfigId);
        return sum + (nota.valor * (cfg?.peso || 0));
      }, 0);

      const promedio = sumaPesos > 0 ? Number((sumaProductos / sumaPesos).toFixed(2)) : null;

      return {
        id: student.id,
        nombre: student.nombre,
        documento: student.documento,
        promedio,
        completadas: notasConValor.length,
        pendientes: Math.max(cfgMap.size - notasConValor.length, 0)
      };
    });
  }, [courseDetail.students, configsForSelectedPeriod, selectedPeriod]);

  useEffect(() => {
    if (selectedCourseId) {
      setSelectedPeriod(1);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    if (subjectList.length === 0) {
      if (selectedAsignatura) setSelectedAsignatura("");
      return;
    }

    if (!selectedAsignatura || !subjectList.includes(selectedAsignatura)) {
      setSelectedAsignatura(subjectList[0]);
    }
  }, [subjectList, selectedAsignatura]);

  useEffect(() => {
    if (!selectedAsignatura) {
      if (selectedAssignmentId !== null) setSelectedAssignmentId(null);
      return;
    }

    if (selectedCourses.length === 0) {
      if (selectedAssignmentId !== null) setSelectedAssignmentId(null);
      return;
    }

    const hasSelected = selectedCourses.some(
      (assignment) => resolveAssignmentId(assignment) === selectedAssignmentId
    );

    if (!selectedAssignmentId || !hasSelected) {
      const firstId = resolveAssignmentId(selectedCourses[0]);
      setSelectedAssignmentId(firstId ?? null);
    }
  }, [selectedAsignatura, selectedCourses, selectedAssignmentId]);
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get(`/CursoAsignaturas/docente/${user?.id}`);
        const asignaciones = Array.isArray(res.data) ? res.data : [];
        setCourseAssignments(asignaciones);
        setTotalStudents(0);
      } catch (err) {
        console.error("Error cargando asignaciones del docente:", err);
        setError(err?.message || err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) loadData();
  }, [user]);

  useEffect(() => {
    if (courseAssignments.length === 0) {
      setCourseMeta({});
      setTotalStudents(0);
      return;
    }

    let cancel = false;
    const loadMeta = async () => {
      setMetaLoading(true);
      try {
        const entries = (await Promise.all(
          courseAssignments.map(async (course) => {
            const courseId = course.cursoId;
            if (!courseId) {
              return null;
            }
            const cursoAsignaturaId = resolveAssignmentId(course);
            try {
              const [studentsRes, configsRes] = await Promise.all([
                api.get(`/Cursos/${courseId}/students`),
                api.get(`/Notas/curso/${courseId}/config`,
                  cursoAsignaturaId != null ? { params: { cursoAsignaturaId } } : undefined
                )
              ]);

              const studentsCount = Array.isArray(studentsRes.data) ? studentsRes.data.length : 0;
              const configsData = Array.isArray(configsRes.data) ? configsRes.data : [];
              const summary = {};
              periodos.forEach((p) => {
                const cfgs = configsData.filter((cfg) => Number(cfg.periodo) === p.id);
                summary[p.id] = {
                  peso: cfgs.reduce((sum, cfg) => sum + Number(cfg.peso || 0), 0),
                  columnas: cfgs.length
                };
              });

              return [courseId, { studentCount: studentsCount, periodSummary: summary }];
            } catch (metaError) {
              console.error("Error cargando metadatos del curso", courseId, metaError);
              return [courseId, { studentCount: 0, periodSummary: {} }];
            }
          })
        )).filter(Boolean);

        if (!cancel) {
          const mapped = Object.fromEntries(entries);
          setCourseMeta(mapped);
          const total = Object.values(mapped).reduce((sum, meta) => sum + (meta.studentCount || 0), 0);
          setTotalStudents(total);
        }
      } finally {
        if (!cancel) setMetaLoading(false);
      }
    };

    loadMeta();
    return () => {
      cancel = true;
    };
  }, [courseAssignments]);

  // recalcular estadísticas cuando cambie el curso seleccionado o el periodo
  useEffect(() => {
    const computeStats = async () => {
      if (!selectedAsignatura) {
        setStatsData({ gradeDistribution: [], groupComparison: [], destacados: [], enRiesgo: [] });
        return;
      }

      try {
        setStatsLoading(true);

        const cursosDelMismoNombre = courseAssignments.filter(
          (assignment) => formatAsignaturaName(assignment) === selectedAsignatura
        );
        const groupStats = [];
        let allGrades = [];
        const highlightedStudents = [];

        for (const curso of cursosDelMismoNombre) {
          try {
            const cursoAsignaturaId = resolveAssignmentId(curso);
            const requestConfig = cursoAsignaturaId != null ? { params: { cursoAsignaturaId } } : undefined;
            const notasRes = await api.get(`/notas/curso/${curso.cursoId}`, requestConfig);
            const configsRes = await api.get(`/notas/curso/${curso.cursoId}/config`, requestConfig);

            const notasData = Array.isArray(notasRes.data) ? notasRes.data : [];
            const configsData = Array.isArray(configsRes.data) ? configsRes.data : [];

            if (notasData.length === 0) continue;

            const configsPeriodo = configsData.filter((cfg) => Number(cfg.periodo) === Number(selectedPeriod));
            if (configsPeriodo.length === 0) continue;

            const cfgMap = new Map(configsPeriodo.map((cfg) => [cfg.id, cfg]));
            const cursoLabel = formatCourseLabel(curso.gradoNombre, curso.grupo);

            const studentAverages = notasData
              .map((estudiante) => {
                const notasConValor = (estudiante.notas || []).filter(
                  (nota) => cfgMap.has(nota.notaConfigId) && nota.valor != null
                );

                if (notasConValor.length === 0) return null;

                const sumaProductos = notasConValor.reduce((sum, nota) => {
                  const cfg = cfgMap.get(nota.notaConfigId);
                  return cfg?.peso ? sum + nota.valor * cfg.peso : sum;
                }, 0);

                const sumaPesos = notasConValor.reduce((sum, nota) => {
                  const cfg = cfgMap.get(nota.notaConfigId);
                  return cfg?.peso ? sum + cfg.peso : sum;
                }, 0);

                if (sumaPesos <= 0) return null;

                return {
                  estudianteId: estudiante.id,
                  estudiante: estudiante.nombre,
                  documento: estudiante.documento,
                  promedio: Number((sumaProductos / sumaPesos).toFixed(2)),
                  cursoId: curso.cursoId,
                  grado: curso.gradoNombre,
                  grupo: curso.grupo,
                  cursoEtiqueta: cursoLabel
                };
              })
              .filter(Boolean);

            if (studentAverages.length === 0) continue;

            const promediosPeriodo = studentAverages.map((item) => item.promedio);

            const promedioCurso = promediosPeriodo.length > 0
              ? Number((promediosPeriodo.reduce((a, b) => a + b, 0) / promediosPeriodo.length).toFixed(2))
              : 0;

            groupStats.push({
              grado: cursoLabel,
              promedio: promedioCurso,
              estudiantes: studentAverages.length
            });

            allGrades.push(...promediosPeriodo);
            highlightedStudents.push(...studentAverages);
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

        const totalGrades = allGrades.length;
        const distributionWithPercent = distribution
          .map((item) => ({
            ...item,
            porcentaje: totalGrades > 0 ? Number(((item.cantidad / totalGrades) * 100).toFixed(1)) : 0
          }))
          .filter((item) => item.cantidad > 0);

        const orderedByScore = [...highlightedStudents].sort((a, b) => b.promedio - a.promedio);
        let destacados = orderedByScore.filter((student) => student.promedio >= 4.5).slice(0, 5);
        if (destacados.length === 0) destacados = orderedByScore.slice(0, 5);
        destacados = destacados.map((student) => ({ ...student, estado: "Sobresaliente" }));

        const enRiesgo = highlightedStudents
          .filter((student) => student.promedio < PASSING_SCORE)
          .sort((a, b) => a.promedio - b.promedio)
          .slice(0, 5)
          .map((student) => ({ ...student, estado: "Plan de mejoramiento" }));

        setStatsData({
          gradeDistribution: distributionWithPercent,
          groupComparison: groupStats,
          destacados,
          enRiesgo
        });
      } catch (err) {
        console.error("Error procesando estadísticas:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    computeStats();
  }, [selectedAsignatura, selectedPeriod, courseAssignments, statsRefreshKey]);

  useEffect(() => {
    assignmentsRef.current = courseAssignments;
  }, [courseAssignments]);

  useEffect(() => {
    selectedAssignmentIdRef.current = selectedAssignmentId;
  }, [selectedAssignmentId]);

  useEffect(() => {
    selectedCourseIdRef.current = selectedCourseId;
  }, [selectedCourseId]);

  useEffect(() => {
    if (typeof subscribe !== "function") return undefined;

    const unsubscribe = subscribe("nota-curso", (payload) => {
      const data = pickProp(payload, "Data") ?? pickProp(payload, "data") ?? {};
      const cursoIdValue = pickProp(data, "CursoId") ?? pickProp(data, "cursoId");
      const cursoAsignaturaValue = pickProp(data, "CursoAsignaturaId") ?? pickProp(data, "cursoAsignaturaId");
      const cursoId = cursoIdValue != null ? Number(cursoIdValue) : null;
      const cursoAsignaturaId = cursoAsignaturaValue != null ? Number(cursoAsignaturaValue) : null;
      const hasCourse = cursoId != null && !Number.isNaN(cursoId);
      const hasAssignment = cursoAsignaturaId != null && !Number.isNaN(cursoAsignaturaId);
      if (!hasCourse && !hasAssignment) return;

      const matchesAssignment = assignmentsRef.current.some((assignment) => {
        const assignmentId = resolveAssignmentId(assignment);
        if (hasAssignment) {
          return assignmentId === cursoAsignaturaId;
        }
        const assignmentCourseId = Number(assignment.cursoId);
        return hasCourse && assignmentCourseId === cursoId;
      });

      if (!matchesAssignment) return;
      setStatsRefreshKey((prev) => prev + 1);
      const shouldRefreshDetail =
        (hasAssignment && selectedAssignmentIdRef.current === cursoAsignaturaId) ||
        (!hasAssignment && hasCourse && selectedCourseIdRef.current === cursoId);
      if (shouldRefreshDetail) {
        setDetailRefreshKey((prev) => prev + 1);
      }
    });

    return unsubscribe;
  }, [subscribe]);

  const handleOpenCourse = (assignment, periodoId) => {
    if (!assignment) return;
    const courseId = assignment.cursoId;
    if (!courseId) return;
    const query = new URLSearchParams();
    if (periodoId) query.set("period", periodoId);
    const assignmentId = resolveAssignmentId(assignment);
    if (assignmentId != null) query.set("cursoAsignaturaId", assignmentId);
    const queryString = query.toString();
    navigate(`/teacher/course/${courseId}${queryString ? `?${queryString}` : ""}`);
  };

  if (loading) return <LoadingSpinner message="Cargando estadísticas..." />;

  const heroDescription = selectedAsignatura
    ? `Supervisa ${selectedAsignatura} en tus grupos activos.`
    : "Selecciona una asignatura para comenzar.";
  const heroStats = [
    { label: "Asignaturas activas", value: subjectList.length },
    { label: "Total estudiantes", value: totalStudents }
  ];
  const destacados = statsData.destacados ?? [];
  const enRiesgo = statsData.enRiesgo ?? [];

  const renderHighlightList = (students, emptyMessage, badgeVariant = "primary") => {
    if (statsLoading) {
      return (
        <div className="text-center py-4 text-muted">
          <Spinner animation="border" size="sm" />
          <p className="mt-2 mb-0">Procesando promedios...</p>
        </div>
      );
    }

    if (!students.length) {
      return (
        <Alert variant="light" className="mb-0">
          {emptyMessage}
        </Alert>
      );
    }

    return (
      <ListGroup variant="flush" className="list-quiet">
        {students.map((student) => (
          <ListGroup.Item
            key={`${student.estudianteId}-${student.cursoId}`}
            className="d-flex justify-content-between align-items-start gap-3"
          >
            <div>
              <strong className="d-block">{student.estudiante}</strong>
              <div className="text-muted small">{formatCourseLabel(student.grado, student.grupo)}</div>
              {student.documento && (
                <div className="text-muted small">Doc. {student.documento}</div>
              )}
            </div>
            <div className="text-end">
              <Badge bg={badgeVariant} pill>
                {student.promedio?.toFixed ? student.promedio.toFixed(2) : student.promedio}
              </Badge>
              <div className="text-muted small mt-1">{student.estado}</div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  };

  return (
    <Container fluid className="pb-5">
      <Row className="mb-4">
        <Col>
          <PageHero
            eyebrow="Panel del docente"
            title={`Hola ${user?.nombre || user?.username || "Docente"}`}
            description={heroDescription}
            stats={heroStats}
            action={(
              <div className="d-flex gap-2 flex-wrap">
                <Button
                  variant="light"
                  size="sm"
                  className="pill-button"
                  onClick={() => navigate("/teacher/asistencias")}
                >
                  Registrar asistencias
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  className="pill-button active"
                  onClick={() => navigate("/teacher/comunicaciones")}
                >
                  Centro de comunicaciones
                </Button>
              </div>
            )}
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
        <Col lg={4} className="mb-3 mb-lg-0">
          <Card className="glass-card border-0 h-100">
            <Card.Body>
              <Card.Title className="mb-3">Tus asignaturas</Card.Title>
              {courseAssignments.length === 0 ? (
                <Alert variant="light" className="mb-0">No tienes asignaturas asignadas.</Alert>
              ) : (
                <ListGroup variant="flush" className="list-quiet subject-list-group">
                  {subjectList.map((nombre) => {
                    const totals = getSubjectTotals(nombre);
                    const isActive = selectedAsignatura === nombre;
                    return (
                      <ListGroup.Item
                        key={nombre}
                        action
                        active={isActive}
                        onClick={() => setSelectedAsignatura(nombre)}
                        className={`d-flex flex-column gap-1 ${isActive ? "active" : ""}`}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-semibold">{nombre}</span>
                          <span className="chip">{totals.grupos} grupos</span>
                        </div>
                        <small className="text-muted">{totals.estudiantes} estudiantes asignados</small>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={8}>
          <Card className="glass-card border-0 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title className="mb-0">
                  {selectedAsignatura ? `Detalle de ${selectedAsignatura}` : "Selecciona una asignatura"}
                </Card.Title>
                {metaLoading && (
                  <div className="d-flex align-items-center gap-2 text-muted small">
                    <Spinner animation="border" size="sm" />
                    <span>Actualizando...</span>
                  </div>
                )}
              </div>

              {!selectedAsignatura || selectedCourses.length === 0 ? (
                <Alert variant="light" className="mb-0">
                  {courseAssignments.length === 0
                    ? "No tienes cursos vinculados."
                    : "Selecciona una asignatura para explorar sus grupos."}
                </Alert>
              ) : (
                <div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">Selecciona un grado/grupo</small>
                      {selectedCourses.length > 1 && (
                        <span className="chip">{selectedCourses.length} grupos</span>
                      )}
                    </div>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {selectedCourses.map((course) => {
                        const assignmentId = resolveAssignmentId(course);
                        const isActive = selectedAssignmentId === assignmentId;
                        return (
                          <Button
                            key={course.id || course.cursoId}
                            size="sm"
                            variant="light"
                            className={`pill-button ${isActive ? "active" : ""}`}
                            onClick={() => setSelectedAssignmentId(assignmentId ?? null)}
                          >
                            {(course.gradoNombre || "Sin grado")} · {course.grupo || "Sin grupo"}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {!selectedAssignment ? (
                    <Alert variant="light">Selecciona un grupo para ver sus notas.</Alert>
                  ) : (
                    <Card className="glass-card border-0 teacher-course-card">
                      <Card.Body>
                        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
                          <div>
                            <h5 className="mb-1">{selectedAssignment.gradoNombre || "Sin grado"}</h5>
                            <div className="text-muted small">
                              Grupo {selectedAssignment.grupo || "Sin grupo"} · Aula #{selectedAssignment.cursoId}
                            </div>
                          </div>
                          <div className="text-end">
                            <small className="text-muted d-block">Estudiantes asignados</small>
                            <span className="chip">
                              {selectedAssignmentMeta?.studentCount ?? courseDetail.students.length}
                            </span>
                          </div>
                        </div>

                        {courseDetailError && (
                          <Alert variant="danger" className="mt-3 mb-0">
                            {String(courseDetailError)}
                          </Alert>
                        )}

                        <div className="d-flex flex-wrap gap-2 mt-3">
                          {periodos.map((periodo) => {
                            const summary = periodSummarySelectedAssignment[periodo.id] || { peso: 0, columnas: 0 };
                            const isActive = selectedPeriod === periodo.id;
                            return (
                              <Button
                                key={`${selectedAssignment.cursoId}-${periodo.id}`}
                                variant="light"
                                size="sm"
                                className={`pill-button ${isActive ? "active" : ""}`}
                                onClick={() => setSelectedPeriod(periodo.id)}
                                disabled={courseDetailLoading}
                              >
                                <span className="fw-semibold d-block">{periodo.nombre}</span>
                                <small className="text-muted">
                                  {summary.peso}% peso · {summary.columnas} columnas
                                </small>
                              </Button>
                            );
                          })}
                        </div>

                        <div className="mt-4">
                          {courseDetailLoading ? (
                            <div className="text-center py-4 text-muted">
                              <Spinner animation="border" />
                              <p className="mt-2 mb-0">Cargando estudiantes y notas...</p>
                            </div>
                          ) : configsForSelectedPeriod.length === 0 ? (
                            <Alert variant="light">
                              No hay columnas configuradas para este periodo. Puedes crearlas en la vista completa del curso.
                            </Alert>
                          ) : courseDetail.students.length === 0 ? (
                            <Alert variant="light">No hay estudiantes inscritos en este grupo.</Alert>
                          ) : (
                            <div>
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <div>
                                  <strong>Estudiantes del periodo</strong>
                                  <div className="text-muted small">
                                    {configsForSelectedPeriod.length} columnas · {studentsPeriodData.filter((s) => s.promedio != null).length} promedios calculados
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="light"
                                  className="pill-button"
                                  onClick={() => handleOpenCourse(selectedAssignment, selectedPeriod)}
                                >
                                  Abrir vista completa
                                </Button>
                              </div>
                              <div className="table-card table-responsive">
                                <Table size="sm" hover className="mb-0">
                                  <thead>
                                    <tr>
                                      <th>Estudiante</th>
                                      <th>Documento</th>
                                      <th>Notas registradas</th>
                                      <th>Promedio periodo</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {studentsPeriodData.map((student) => (
                                      <tr key={student.id}>
                                        <td>{student.nombre}</td>
                                        <td>{student.documento}</td>
                                        <td>
                                          <Badge bg={student.pendientes === 0 ? "success" : "warning"} text={student.pendientes === 0 ? "light" : "dark"}>
                                            {student.completadas}/{configsForSelectedPeriod.length}
                                          </Badge>
                                        </td>
                                        <td>
                                          {student.promedio != null ? (
                                            <span className="fw-semibold">{student.promedio}</span>
                                          ) : (
                                            <span className="text-muted">Sin calcular</span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              </div>
                            </div>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filtros */}
      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <Card className="glass-card border-0 h-100">
            <Card.Body>
              <p className="section-title mb-1">Analizar curso</p>
              <small className="text-muted">Cambia entre tus asignaturas vinculadas.</small>
              <Form.Select
                className="mt-2"
                value={selectedAsignatura}
                onChange={(e) => setSelectedAsignatura(e.target.value)}
              >
                <option value="">-- Selecciona un curso --</option>
                {subjectList.map((nombre) => (
                  <option key={nombre} value={nombre}>
                    {nombre}
                  </option>
                ))}
              </Form.Select>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-3">
          <Card className="glass-card border-0 h-100">
            <Card.Body>
              <p className="section-title mb-1">Periodo académico</p>
              <small className="text-muted">Ajusta los indicadores visualizados.</small>
              <Form.Select
                className="mt-2"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(Number(e.target.value))}
              >
                {periodos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </Form.Select>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráficos y alertas */}
      {selectedAsignatura && (
        <>
          <Row className="mb-4">
            <Col lg={7}>
              <Card className="glass-card border-0 h-100">
                <Card.Body>
                  <Card.Title className="mb-3">
                    Comparación por grado - {selectedAsignatura}
                  </Card.Title>
                  {statsLoading ? (
                    <div className="text-center py-5 text-muted">
                      <Spinner animation="border" />
                      <p className="mt-2 mb-0">Calculando estadísticas...</p>
                    </div>
                  ) : statsData.groupComparison.length === 0 ? (
                    <Alert variant="info">
                      No hay datos de notas para el periodo seleccionado.
                    </Alert>
                  ) : (
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={statsData.groupComparison} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="barPromedioGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.95} />
                            <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.8} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="grado" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                        <YAxis domain={[0, 5]} tickLine={false} axisLine={false} />
                        <Tooltip content={<GroupComparisonTooltip />} />
                        <Legend />
                        <ReferenceLine
                          y={PASSING_SCORE}
                          stroke="#f97316"
                          strokeDasharray="5 4"
                          label={{ value: `Meta ${PASSING_SCORE.toFixed(1)}`, position: "insideTopRight", fill: "#f97316" }}
                        />
                        <Bar dataKey="promedio" fill="url(#barPromedioGradient)" name="Promedio del periodo" radius={[6, 6, 0, 0]}>
                          <LabelList dataKey="promedio" position="top" formatter={(value) => value?.toFixed ? value.toFixed(2) : value} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={5}>
              <Card className="glass-card border-0 h-100">
                <Card.Body>
                  <Card.Title className="mb-3">Distribución de rendimiento</Card.Title>
                  {statsLoading ? (
                    <div className="text-center py-5 text-muted">
                      <Spinner animation="border" />
                      <p className="mt-2 mb-0">Calculando estadísticas...</p>
                    </div>
                  ) : statsData.gradeDistribution.length === 0 ? (
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
                          innerRadius={40}
                          outerRadius={100}
                          labelLine={false}
                          label={({ percent }) => `${Number((percent * 100).toFixed(0))}%`}
                        >
                          {statsData.gradeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, _, payload) => {
                            const porcentaje = payload?.payload?.porcentaje ?? 0;
                            return [`${value} estudiantes (${porcentaje}%)`, payload?.payload?.rango || "Rango"];
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col lg={6} className="mb-3 mb-lg-0">
              <Card className="glass-card border-0 h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h6 className="mb-0">Estudiantes destacados</h6>
                      <small className="text-muted">Promedios sobresalientes del periodo {selectedPeriod}</small>
                    </div>
                    <span className="chip">{destacados.length}</span>
                  </div>
                  {renderHighlightList(destacados, "Aún no hay estudiantes destacados en este periodo.", "success")}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6}>
              <Card className="glass-card border-0 h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h6 className="mb-0">Planes de mejoramiento</h6>
                      <small className="text-muted">Promedios por debajo de {PASSING_SCORE.toFixed(1)}</small>
                    </div>
                    <span className="chip">{enRiesgo.length}</span>
                  </div>
                  {renderHighlightList(
                    enRiesgo,
                    "No hay estudiantes en riesgo en este periodo.",
                    "danger"
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Estadísticas generales */}
      <Row>
        <Col md={6}>
          <StatsCard title="Total de Cursos" value={courseAssignments.length} color="primary" />
        </Col>
        <Col md={6}>
          <StatsCard title="Total de Estudiantes" value={totalStudents} color="secondary" />
        </Col>
      </Row>
    </Container>
  );
}
