import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Form,
  Button,
  ButtonGroup,
  Alert,
  Badge,
  Modal,
  InputGroup
} from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ExportButtons from "../components/ExportButtons.jsx";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const PERIODOS = [
  { id: 1, nombre: "Periodo 1" },
  { id: 2, nombre: "Periodo 2" },
  { id: 3, nombre: "Periodo 3" },
  { id: 4, nombre: "Periodo 4" }
];

const VALID_PERIOD_IDS = PERIODOS.map((p) => p.id);

const resolvePeriodFromSearch = (search) => {
  const params = new URLSearchParams(search);
  const raw = Number(params.get("period") || params.get("periodo"));
  return VALID_PERIOD_IDS.includes(raw) ? raw : VALID_PERIOD_IDS[0];
};

export default function CourseView() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [configs, setConfigs] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [activePeriod, setActivePeriod] = useState(() => resolvePeriodFromSearch(location.search));

  const originalGradesRef = useRef(new Map());
  const dirtyGradesRef = useRef(new Map());

  const makeGradeKey = (estudianteId, notaConfigId) => `${estudianteId}-${notaConfigId}`;

  const [newColumn, setNewColumn] = useState({
    nombre: "",
    peso: "",
    periodo: resolvePeriodFromSearch(location.search)
  });

  const getCourseTitle = (courseData) => {
    if (!courseData) return "";
    const grado = (courseData.gradoNombre || "").trim();
    const grupo = (courseData.grupo || "").trim();
    if (grado && grupo) return `${grado} ${grupo}`;
    if (grado) return grado;
    if (grupo) return grupo;
    return courseData.nombre || "Curso";
  };

  const loadAll = async () => {
    try {
      setLoading(true);
      setError(null);

      const [coursesRes, configsRes, studentsRes] = await Promise.all([
        api.get("/cursos"),
        api.get(`/Notas/curso/${id}/config`),
        api.get(`/Notas/curso/${id}`)
      ]);

      const c = coursesRes.data.find((x) => x.id === Number(id));
      setCourse(c || null);
      setConfigs(configsRes.data || []);
      const studentsData = studentsRes.data || [];
      setStudents(studentsData);

      const snapshot = new Map();
      studentsData.forEach((est) => {
        (est.notas || []).forEach((nota) => {
          snapshot.set(makeGradeKey(est.id, nota.notaConfigId), nota.valor ?? null);
        });
      });
      originalGradesRef.current = snapshot;
      dirtyGradesRef.current = new Map();
    } catch (err) {
      setError(err.response?.data || "Error cargando datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [id]);

  const handleAddColumn = async () => {
    if (!newColumn.nombre || !newColumn.peso) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const configsInPeriod = configs.filter((c) => Number(c.periodo) === Number(activePeriod));
      const maxOrden = configsInPeriod.length > 0 
        ? Math.max(...configsInPeriod.map((c) => c.orden)) 
        : 0;

      await api.post(`/Notas/curso/${id}/config`, {
        nombre: newColumn.nombre,
        orden: maxOrden + 1,
        peso: Number(newColumn.peso),
        periodo: activePeriod
      });

      setNewColumn({ nombre: "", peso: "", periodo: activePeriod });
      setShowAddModal(false);
      await loadAll();
    } catch (err) {
      setError(err.response?.data || "Error creando columna");
    }
  };

  const handleEditWeight = async () => {
    if (!editingConfig || !editingConfig.peso || !editingConfig.nombre) {
      alert("Completa todos los campos");
      return;
    }

    try {
      await api.put(`/Notas/config/${editingConfig.id}`, {
        nombre: editingConfig.nombre,
        orden: editingConfig.orden,
        peso: Number(editingConfig.peso),
        periodo: editingConfig.periodo
      });

      setShowEditModal(false);
      setEditingConfig(null);
      await loadAll();
    } catch (err) {
      setError(err.response?.data || "Error actualizando columna");
    }
  };

  const handleDeleteColumn = async (configId) => {
    if (!window.confirm("¿Eliminar esta columna y todas sus notas?")) return;

    try {
      await api.delete(`/Notas/config/${configId}`);
      await loadAll();
    } catch (err) {
      setError(err.response?.data || "Error eliminando columna");
    }
  };

  const handleGradeChange = (estudianteId, notaConfigId, valor) => {
    const normalized = valor === "" || valor === null ? null : Number(valor);

    setStudents((prev) =>
      prev.map((est) => {
        if (est.id === estudianteId) {
          return {
            ...est,
            notas: est.notas.map((n) =>
              n.notaConfigId === notaConfigId
                ? { ...n, valor: normalized }
                : n
            )
          };
        }
        return est;
      })
    );

    const key = makeGradeKey(estudianteId, notaConfigId);
    const original = originalGradesRef.current.get(key) ?? null;
    if ((normalized == null && original == null) || normalized === original) {
      dirtyGradesRef.current.delete(key);
    } else {
      dirtyGradesRef.current.set(key, normalized);
    }
  };

  const handleSaveAll = async () => {
    const dirtyEntries = Array.from(dirtyGradesRef.current.entries());
    if (dirtyEntries.length === 0) {
      alert("No hay cambios por guardar");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await Promise.all(
        dirtyEntries.map(([key, valor]) => {
          const [estudianteId, notaConfigId] = key.split("-").map(Number);
          return api.put("/Notas", {
            estudianteId,
            notaConfigId,
            valor
          });
        })
      );

      alert("Cambios guardados exitosamente");
      await loadAll();
    } catch (err) {
      setError(err.response?.data || "Error guardando notas");
    } finally {
      setSaving(false);
    }
  };

  const getGradeColor = (grade) => {
    if (grade == null) return "";
    if (grade >= 4.5) return "var(--grade-excellent)";
    if (grade >= 4.0) return "var(--grade-good)";
    if (grade >= 3.5) return "var(--grade-average)";
    if (grade >= 3.0) return "var(--grade-poor)";
    return "var(--grade-fail)";
  };

  const configsForSelectedPeriod = configs.filter(
    (c) => Number(c.periodo) === Number(activePeriod)
  );
  const totalPesosPeriod = configsForSelectedPeriod.reduce(
    (sum, c) => sum + Number(c.peso || 0),
    0
  );

  const calculateStudentPeriodAverage = (student) => {
    if (!student || configsForSelectedPeriod.length === 0) return null;
    let sumaPesos = 0;
    let sumaProductos = 0;

    configsForSelectedPeriod.forEach((cfg) => {
      const nota = (student.notas || []).find((n) => n.notaConfigId === cfg.id);
      const peso = Number(cfg.peso || 0);
      if (nota?.valor != null && peso > 0) {
        sumaPesos += peso;
        sumaProductos += nota.valor * peso;
      }
    });

    if (sumaPesos === 0) return null;
    return Number((sumaProductos / sumaPesos).toFixed(2));
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const currentPeriod = Number(params.get("period"));
    if (currentPeriod === activePeriod) return;

    params.set("period", String(activePeriod));
    const formattedSearch = params.toString();

    navigate(
      {
        pathname: location.pathname,
        search: formattedSearch ? `?${formattedSearch}` : ""
      },
      { replace: true }
    );
  }, [activePeriod, location.pathname, location.search, navigate]);

  if (loading) return <LoadingSpinner message="Cargando curso..." />;

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          {course && (
            <>
              <h3 className="mb-1">{getCourseTitle(course)}</h3>
              {(course.asignaturaNombre || course.nombre || course.docenteNombre) && (
                <div className="text-muted">
                  {course.asignaturaNombre || course.nombre}
                  {course.docenteNombre && (
                    <>
                      <span className="mx-2">•</span>
                      {course.docenteNombre}
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </Col>
        <Col xs="auto">
          <ExportButtons courseId={id} />
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {String(error)}
            </Alert>
          </Col>
        </Row>
      )}

      <Row className="mb-2">
        <Col>
          <small className="text-muted">
            Estudiantes: <strong>{students.length}</strong>
          </small>
        </Col>
      </Row>

      <div className="d-flex flex-wrap gap-2 mb-3">
        {PERIODOS.map((periodo) => {
          const configsPeriodo = configs.filter(
            (c) => Number(c.periodo) === periodo.id
          );
          const totalPesos = configsPeriodo.reduce(
            (sum, c) => sum + Number(c.peso || 0),
            0
          );
          const isActive = activePeriod === periodo.id;

          return (
            <Button
              key={periodo.id}
              variant={isActive ? "primary" : "outline-secondary"}
              size="sm"
              className="d-flex flex-column align-items-start period-chip"
              onClick={() => {
                setActivePeriod(periodo.id);
                setNewColumn((prev) => ({ ...prev, periodo: periodo.id }));
              }}
            >
              <span className="fw-semibold">{periodo.nombre}</span>
              <small className="text-muted">
                {totalPesos}% peso · {configsPeriodo.length} columnas
              </small>
            </Button>
          );
        })}
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <small className="text-muted">
              Suma de pesos: <strong>{totalPesosPeriod}%</strong>
              {totalPesosPeriod !== 100 && (
                <Badge bg="warning" text="dark" className="ms-2">
                  Se recomienda 100%
                </Badge>
              )}
            </small>
            <Button size="sm" variant="primary" onClick={() => setShowAddModal(true)}>
              + Agregar columna
            </Button>
          </div>

          {configsForSelectedPeriod.length === 0 ? (
            <Alert variant="light" className="mb-0">
              No hay columnas configuradas para este periodo. Usa "Agregar columna" para crear una.
            </Alert>
          ) : students.length === 0 ? (
            <Alert variant="light" className="mb-0">
              No hay estudiantes en este curso.
            </Alert>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <Table striped hover responsive size="sm">
                <thead>
                  <tr>
                    <th style={{ minWidth: "180px" }}>Estudiante</th>
                    <th style={{ minWidth: "120px" }}>Documento</th>
                    {configsForSelectedPeriod.map((cfg) => (
                      <th key={cfg.id} style={{ minWidth: "120px" }}>
                        <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
                          <span className="text-truncate" title={`${cfg.nombre} (${cfg.peso}%)`}>
                            <div className="fw-semibold">{cfg.nombre}</div>
                            <small className="text-muted">({cfg.peso}%)</small>
                          </span>
                          <ButtonGroup size="sm">
                            <Button
                              variant="outline-secondary"
                              className="icon-btn"
                              aria-label={`Editar ${cfg.nombre}`}
                              onClick={() => {
                                setEditingConfig(cfg);
                                setShowEditModal(true);
                              }}
                            >
                              <FiEdit2 />
                            </Button>
                            <Button
                              variant="outline-danger"
                              className="icon-btn"
                              aria-label={`Eliminar ${cfg.nombre}`}
                              onClick={() => handleDeleteColumn(cfg.id)}
                            >
                              <FiTrash2 />
                            </Button>
                          </ButtonGroup>
                        </div>
                      </th>
                    ))}
                    <th style={{ minWidth: "100px" }}>Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((est) => {
                    const promedioPeriodo = calculateStudentPeriodAverage(est);
                    return (
                      <tr key={est.id}>
                        <td>{est.nombre}</td>
                        <td>{est.documento}</td>
                        {configsForSelectedPeriod.map((cfg) => {
                          const nota = est.notas.find((n) => n.notaConfigId === cfg.id);
                          return (
                            <td key={`${est.id}-${cfg.id}`}>
                              <Form.Control
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                value={nota?.valor ?? ""}
                                onChange={(e) =>
                                  handleGradeChange(
                                    est.id,
                                    cfg.id,
                                    e.target.value === "" ? "" : Number(e.target.value)
                                  )
                                }
                                style={{
                                  borderLeft: nota?.valor
                                    ? `4px solid ${getGradeColor(nota.valor)}`
                                    : "none",
                                  width: "85px"
                                }}
                              />
                            </td>
                          );
                        })}
                        <td>
                          {promedioPeriodo != null ? (
                            <Badge bg="primary">{promedioPeriodo.toFixed(2)}</Badge>
                          ) : (
                            <Badge bg="secondary">-</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}

          <div className="d-flex justify-content-end mt-3">
            <Button
              variant="primary"
              onClick={handleSaveAll}
              disabled={saving || students.length === 0}
            >
              {saving ? "Guardando..." : "Guardar todas las notas"}
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Modal agregar columna */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Agregar columna - {PERIODOS.find((p) => p.id === activePeriod)?.nombre}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              placeholder="Ej: Quiz 1, Taller 2"
              value={newColumn.nombre}
              onChange={(e) => setNewColumn({ ...newColumn, nombre: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Peso (%)</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                min="0"
                max="100"
                placeholder="30"
                value={newColumn.peso}
                onChange={(e) => setNewColumn({ ...newColumn, peso: e.target.value })}
              />
              <InputGroup.Text>%</InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddColumn}>
            Agregar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal editar columna */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar columna</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={editingConfig?.nombre ?? ""}
              onChange={(e) =>
                setEditingConfig({ ...editingConfig, nombre: e.target.value })
              }
              placeholder="Ej: Quiz 1, Taller 2"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Peso (%)</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                min="0"
                max="100"
                value={editingConfig?.peso ?? ""}
                onChange={(e) =>
                  setEditingConfig({ ...editingConfig, peso: e.target.value })
                }
              />
              <InputGroup.Text>%</InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleEditWeight}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
