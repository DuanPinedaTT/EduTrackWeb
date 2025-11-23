import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Row,
  Table
} from "react-bootstrap";
import { FaChartBar, FaFileExcel, FaSync, FaUsers } from "react-icons/fa";
import {
  CartesianGrid,
  ResponsiveContainer,
  Bar,
  BarChart,
  Legend,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { Asistencias, Cursos, Estadisticas, Exports, Notas, Periodos } from "../services/api.js";

const REPORT_TYPES = [
  { value: "general", label: "Rendimiento y asistencia" },
  { value: "asistencia", label: "Solo asistencia" }
];

const defaultAttendance = { total: 0, presentes: 0, ausentes: 0, tardanzas: 0, porcentaje: 0 };

export default function AdminReportes() {
  const [courses, setCourses] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [reportType, setReportType] = useState("general");
  const [reportRows, setReportRows] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInitial = async () => {
      setLoadingInitial(true);
      setError(null);
      try {
        const [coursesRes, periodsRes, statsRes] = await Promise.all([
          Cursos.list(),
          Periodos.list().catch(() => ({ data: [] })),
          Estadisticas.resumen().catch(() => ({ data: null }))
        ]);

        const courseData = Array.isArray(coursesRes.data) ? coursesRes.data : [];
        const periodData = Array.isArray(periodsRes.data) ? periodsRes.data : [];
        setCourses(courseData);
        setPeriods(periodData);
        if (statsRes?.data) {
          setStats(statsRes.data);
        }

        if (courseData.length > 0) {
          setSelectedCourse(String(courseData[0].id));
        }

        const activePeriodo = periodData.find((p) => p.activo);
        if (activePeriodo) {
          setSelectedPeriod(String(activePeriodo.id));
        }
      } catch (err) {
        setError(err.response?.data || "No se pudo cargar la configuración inicial");
      } finally {
        setLoadingInitial(false);
      }
    };

    loadInitial();
  }, []);

  useEffect(() => {
    if (loadingInitial) return;
    if (!selectedCourse) return;
    generateReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourse, selectedPeriod, reportType]);

  const periodRange = useMemo(() => {
    if (!selectedPeriod) return null;
    const periodObj = periods.find((p) => String(p.id) === String(selectedPeriod));
    if (!periodObj) return null;
    return {
      desde: periodObj.fechaInicio,
      hasta: periodObj.fechaFin,
      nombre: periodObj.nombre
    };
  }, [periods, selectedPeriod]);

  const generateReport = async () => {
    setGenerating(true);
    setError(null);
    try {
      const courseId = Number(selectedCourse);
      const notasRes = await Notas.listByCurso(courseId);
      const estudiantes = Array.isArray(notasRes.data) ? notasRes.data : [];
      const studentIds = estudiantes.map((est) => est.id);
      const periodoId = selectedPeriod ? Number(selectedPeriod) : null;

        const attendanceMap = await fetchAttendanceMap(studentIds, periodRange);

      const rows = estudiantes.map((est) => buildRow(est, attendanceMap[est.id] ?? defaultAttendance, periodoId, reportType));
      setReportRows(rows);
      setChartData(buildChartDataset(rows, reportType));
    } catch (err) {
      setError(err.response?.data || "No se pudo generar el reporte");
      setReportRows([]);
      setChartData([]);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadExcel = async () => {
    if (!selectedCourse) {
      setError("Selecciona un curso para descargar la planilla");
      return;
    }
    setDownloading(true);
    try {
      const courseId = Number(selectedCourse);
      const res = await Exports.courseXlsx(courseId);
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `planilla_curso_${courseId}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data || "No se pudo descargar la planilla");
    } finally {
      setDownloading(false);
    }
  };

  const fetchAttendanceMap = async (studentIds, range) => {
    if (studentIds.length === 0) return {};
    const paramsBase = {};
    if (range?.desde) paramsBase.desde = range.desde;
    if (range?.hasta) paramsBase.hasta = range.hasta;

    const entries = await Promise.all(
      studentIds.map(async (id) => {
        try {
          const res = await Asistencias.list({ ...paramsBase, estudianteId: id });
          const registros = Array.isArray(res.data) ? res.data : [];
          return [id, summarizeAttendance(registros)];
        } catch (err) {
          console.error(err);
          return [id, { ...defaultAttendance }];
        }
      })
    );

    return Object.fromEntries(entries);
  };

  const buildRow = (estudiante, attendance, periodoId, type) => {
    const notasFiltradas = periodoId
      ? estudiante.notas.filter((nota) => nota.periodoAcademicoId === periodoId)
      : estudiante.notas;

    const promedioInfo = summarizeGrades(notasFiltradas);
    const promedio = promedioInfo.promedio;

    return {
      id: estudiante.id,
      nombre: estudiante.nombre,
      promedio,
      notasRegistradas: promedioInfo.registradas,
      notasTotales: promedioInfo.total,
      asistencia: attendance,
      asistenciaPorcentaje: attendance.porcentaje,
      estadoAcademico: promedio == null ? "Sin datos" : promedio >= 3 ? "Aprobado" : "En riesgo",
      mostrarPromedio: type === "general"
    };
  };

  const buildChartDataset = (rows) => {
    return rows.map((row) => ({
      name: row.nombre.split(" ")[0],
      promedio: row.promedio ?? 0,
      asistencia: row.asistenciaPorcentaje ?? 0
    }));
  };

  const handleExportCsv = () => {
    if (reportRows.length === 0) return;
    const headers = reportType === "asistencia"
      ? ["Nombre", "Total", "Presentes", "Ausentes", "Tardanzas", "% Asistencia"]
      : ["Nombre", "Promedio", "Notas registradas", "Notas totales", "% Asistencia", "Estado"];

    const lines = reportRows.map((row) => {
      if (reportType === "asistencia") {
        return [
          wrapCsv(row.nombre),
          row.asistencia.total,
          row.asistencia.presentes,
          row.asistencia.ausentes,
          row.asistencia.tardanzas,
          row.asistenciaPorcentaje
        ].join(",");
      }
      return [
        wrapCsv(row.nombre),
        row.promedio != null ? row.promedio.toFixed(2) : "",
        row.notasRegistradas,
        row.notasTotales,
        row.asistenciaPorcentaje,
        row.estadoAcademico
      ].join(",");
    });

    const csvContent = `${headers.join(",")}\n${lines.join("\n")}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reporte_${reportType}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const resumenCards = useMemo(() => {
    if (!stats) return [];
    return [
      { title: "Docentes", value: stats.totalDocentes, icon: <FaUsers />, variant: "primary" },
      { title: "Cursos", value: stats.totalCursos, icon: <FaChartBar />, variant: "info" },
      { title: "Estudiantes", value: stats.totalEstudiantes, icon: <FaUsers />, variant: "success" }
    ];
  }, [stats]);

  if (loadingInitial) {
    return <LoadingSpinner message="Preparando reportes..." />;
  }

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h3 className="mb-0">Reportes y analíticas</h3>
              <small className="text-muted">Explora tendencias por curso y exporta la información relevante.</small>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" onClick={generateReport} disabled={generating}>
                <FaSync className="me-2" /> Actualizar
              </Button>
              <Button variant="success" onClick={handleExportCsv} disabled={reportRows.length === 0}>
                <FaFileExcel className="me-2" /> Exportar CSV
              </Button>
              <Button
                variant="outline-primary"
                onClick={handleDownloadExcel}
                disabled={!selectedCourse || downloading}
              >
                <FaFileExcel className="me-2" /> {downloading ? "Descargando..." : "Planilla XLSX"}
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {courses.length === 0 && (
        <Alert variant="info">No hay cursos registrados aún. Crea cursos para habilitar los reportes.</Alert>
      )}

      {resumenCards.length > 0 && (
        <Row className="mb-4">
          {resumenCards.map((card) => (
            <Col md={4} key={card.title} className="mb-3">
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-uppercase text-muted">{card.title}</small>
                      <h2 className="mb-0">{card.value ?? "--"}</h2>
                    </div>
                    <div className={`text-${card.variant}`} style={{ fontSize: "1.5rem" }}>
                      {card.icon}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {String(error)}
        </Alert>
      )}

      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white">
          <FaChartBar className="me-2" /> Configuración del reporte
        </Card.Header>
        <Card.Body>
          <Row className="gy-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Curso</Form.Label>
                <Form.Select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} disabled={courses.length === 0}>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.gradoNombre ? `${course.gradoNombre} · ${course.nombre}` : course.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Periodo académico</Form.Label>
                <Form.Select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
                  <option value="">Todos los periodos</option>
                  {periods.map((periodo) => (
                    <option key={periodo.id} value={periodo.id}>
                      {periodo.nombre} {periodo.activo ? "(Activo)" : ""}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Tipo de reporte</Form.Label>
                <Form.Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                  {REPORT_TYPES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          {periodRange && (
            <Alert variant="info" className="mt-3 mb-0">
              Filtrando por {periodRange.nombre}: {new Date(periodRange.desde).toLocaleDateString()} — {new Date(periodRange.hasta).toLocaleDateString()}
            </Alert>
          )}
        </Card.Body>
      </Card>

      {generating ? (
        <LoadingSpinner message="Construyendo reporte..." />
      ) : (
        <>
          {chartData.length > 0 && (
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-success text-white">Visualización</Card.Header>
              <Card.Body style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, reportType === "asistencia" ? 100 : 5]} />
                    <Tooltip />
                    <Legend />
                    {reportType === "general" && <Bar dataKey="promedio" fill="#0d6efd" name="Promedio" />}
                    <Bar dataKey="asistencia" fill="#20c997" name="% Asistencia" />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          )}

          <Card className="shadow-sm">
            <Card.Header className="bg-info text-white">Detalle de estudiantes ({reportRows.length})</Card.Header>
            <Card.Body>
              {reportRows.length === 0 ? (
                <Alert variant="light" className="mb-0">
                  No hay datos disponibles para los filtros actuales.
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Estudiante</th>
                        {reportType === "general" && <th>Promedio</th>}
                        {reportType === "general" && <th>Notas registradas</th>}
                        <th>% Asistencia</th>
                        <th>Detalle asistencia</th>
                        {reportType === "general" && <th>Estado</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {reportRows.map((row) => (
                        <tr key={row.id}>
                          <td>{row.nombre}</td>
                          {reportType === "general" && (
                            <td>
                              {row.promedio == null ? (
                                <Badge bg="secondary">Sin notas</Badge>
                              ) : (
                                <Badge bg={row.promedio >= 3 ? "success" : "danger"}>{row.promedio.toFixed(2)}</Badge>
                              )}
                            </td>
                          )}
                          {reportType === "general" && (
                            <td>{row.notasRegistradas}/{row.notasTotales}</td>
                          )}
                          <td>
                            <Badge bg={row.asistenciaPorcentaje >= 90 ? "success" : row.asistenciaPorcentaje >= 75 ? "warning" : "danger"}>
                              {row.asistenciaPorcentaje}%
                            </Badge>
                          </td>
                          <td>
                            <small className="text-muted">
                              P{row.asistencia.presentes} · A{row.asistencia.ausentes} · T{row.asistencia.tardanzas}
                            </small>
                          </td>
                          {reportType === "general" && (
                            <td>
                              <Badge bg={row.estadoAcademico === "Aprobado" ? "success" : row.estadoAcademico === "Sin datos" ? "secondary" : "warning"}>
                                {row.estadoAcademico}
                              </Badge>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
}

function summarizeGrades(notas) {
  if (!Array.isArray(notas) || notas.length === 0) {
    return { promedio: null, registradas: 0, total: 0 };
  }
  const conValor = notas.filter((nota) => nota.valor != null);
  const pesoTotal = conValor.reduce((sum, nota) => sum + Number(nota.peso ?? 0), 0);
  const promedio = pesoTotal > 0
    ? Number((conValor.reduce((sum, nota) => sum + Number(nota.valor || 0) * Number(nota.peso || 0), 0) / pesoTotal).toFixed(2))
    : null;
  return { promedio, registradas: conValor.length, total: notas.length };
}

function summarizeAttendance(registros) {
  if (!Array.isArray(registros) || registros.length === 0) {
    return { ...defaultAttendance };
  }
  const presentes = registros.filter((r) => r.estado === 1).length;
  const ausentes = registros.filter((r) => r.estado === 2).length;
  const tardanzas = registros.filter((r) => r.estado === 3).length;
  const total = registros.length;
  const porcentaje = total > 0 ? Math.round((presentes / total) * 100) : 0;
  return { total, presentes, ausentes, tardanzas, porcentaje };
}

function wrapCsv(value) {
  if (value == null) return "";
  const needsQuotes = /[",\n]/.test(value);
  const sanitized = String(value).replace(/"/g, '""');
  return needsQuotes ? `"${sanitized}"` : sanitized;
}
