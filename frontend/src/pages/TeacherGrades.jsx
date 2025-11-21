import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
  Table
} from "react-bootstrap";
import { FaCog, FaRegSave, FaTrash } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import useTeacherProfile from "../hooks/useTeacherProfile.js";
import { Cursos, Notas, Periodos } from "../services/api.js";

export default function TeacherGrades() {
  const { profile: teacherProfile, loadingProfile, profileError } = useTeacherProfile();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [periods, setPeriods] = useState([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState("");
  const [configs, setConfigs] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const [gradeDrafts, setGradeDrafts] = useState({});
  const [savingCells, setSavingCells] = useState(() => new Set());

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingConfigId, setEditingConfigId] = useState(null);
  const [configForm, setConfigForm] = useState({
    nombre: "",
    peso: 0.25,
    orden: 1,
    periodoAcademicoId: ""
  });
  const [configToDelete, setConfigToDelete] = useState(null);

  const showMessage = (variant, message) => {
    setFeedback({ variant, message });
    setTimeout(() => setFeedback(null), 3500);
  };

  const loadCourses = useCallback(async () => {
    if (!teacherProfile?.id) return;
    try {
      const res = await Cursos.list();
      const data = Array.isArray(res.data) ? res.data : [];
      const owned = data.filter((curso) => {
        const responsable = curso.profesorId ?? curso.docenteId;
        return responsable === teacherProfile.id;
      });
      setCourses(owned);
      setSelectedCourseId((current) => current || (owned[0] ? String(owned[0].id) : ""));
    } catch (err) {
      setError(err.response?.data || "No se pudieron cargar los cursos");
    }
  }, [teacherProfile]);

  const loadPeriods = useCallback(async () => {
    try {
      const res = await Periodos.list();
      const data = Array.isArray(res.data) ? res.data : [];
      setPeriods(data);
      if (!selectedPeriodId && data.length > 0) {
        const activo = data.find((p) => p.activo);
        setSelectedPeriodId(String(activo?.id ?? data[0].id));
      }
    } catch (err) {
      setError(err.response?.data || "No se pudieron cargar los periodos");
    }
  }, [selectedPeriodId]);

  const loadNotas = useCallback(async (cursoIdParam) => {
    const cursoId = Number(cursoIdParam ?? selectedCourseId);
    if (!cursoId) return;

    setLoading(true);
    setError(null);
    try {
      const [configRes, notasRes] = await Promise.all([
        Notas.configByCurso(cursoId),
        Notas.listByCurso(cursoId)
      ]);
      setConfigs(Array.isArray(configRes.data) ? configRes.data : []);
      setStudents(Array.isArray(notasRes.data) ? notasRes.data : []);
      setGradeDrafts({});
    } catch (err) {
      setError(err.response?.data || "No se pudieron cargar las calificaciones");
    } finally {
      setLoading(false);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    loadPeriods();
  }, [loadPeriods]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    if (selectedCourseId) {
      loadNotas(selectedCourseId);
    }
  }, [selectedCourseId, loadNotas]);

  const displayedConfigs = useMemo(() => {
    const periodId = Number(selectedPeriodId);
    return configs.filter((cfg) => (periodId ? cfg.periodoAcademicoId === periodId : true));
  }, [configs, selectedPeriodId]);

  const configIdSet = useMemo(() => new Set(displayedConfigs.map((cfg) => cfg.id)), [displayedConfigs]);

  const studentsRows = useMemo(() => {
    return students.map((student) => {
      const notasPeriodo = (student.notas || []).filter((nota) => configIdSet.has(nota.notaConfigId));
      const filled = notasPeriodo.filter((n) => n.valor != null);
      const promedio = calcularPromedio(notasPeriodo);
      return {
        ...student,
        notasPeriodo,
        filledCount: filled.length,
        promedio
      };
    });
  }, [students, configIdSet]);

  const stats = useMemo(() => {
    const totalPromedios = studentsRows.filter((row) => row.promedio != null);
    const promedioGeneral = totalPromedios.length
      ? totalPromedios.reduce((sum, row) => sum + row.promedio, 0) / totalPromedios.length
      : 0;
    const enRiesgo = studentsRows.filter((row) => (row.promedio ?? 5) < 3).length;
    const totalCeldas = studentsRows.length * displayedConfigs.length;
    const celdasCompletas = studentsRows.reduce((acc, row) => acc + row.filledCount, 0);
    const avance = totalCeldas > 0 ? Math.round((celdasCompletas / totalCeldas) * 100) : 0;

    return {
      evaluaciones: displayedConfigs.length,
      promedioGeneral: Number.isNaN(promedioGeneral) ? 0 : promedioGeneral,
      enRiesgo,
      avance
    };
  }, [studentsRows, displayedConfigs]);

  const handleCourseChange = (e) => {
    setSelectedCourseId(e.target.value);
  };

  const handlePeriodChange = (e) => {
    setSelectedPeriodId(e.target.value);
  };

  const handleGradeChange = (studentId, configId, value) => {
    setGradeDrafts((prev) => ({
      ...prev,
      [`${studentId}-${configId}`]: value
    }));
  };

  const persistGrade = async (studentId, configId) => {
    const key = `${studentId}-${configId}`;
    if (!(key in gradeDrafts)) return;

    const rawValue = gradeDrafts[key];
    const value = rawValue === "" ? null : Number(rawValue);
    if (value != null && (value < 0 || value > 5)) {
      showMessage("warning", "La nota debe estar entre 0 y 5");
      return;
    }

    setSavingCells((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });

    try {
      await Notas.updateValor({ estudianteId: studentId, notaConfigId: configId, valor: value });
      setStudents((prev) =>
        prev.map((student) => {
          if (student.id !== studentId) return student;
          const notasActualizadas = (student.notas || []).map((nota) =>
            nota.notaConfigId === configId ? { ...nota, valor: value } : nota
          );
          return {
            ...student,
            notas: notasActualizadas
          };
        })
      );
      setGradeDrafts((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      showMessage("success", "Calificación guardada");
    } catch (err) {
      setError(err.response?.data || "No se pudo guardar la calificación");
    } finally {
      setSavingCells((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  const openConfigModal = (config) => {
    if (!selectedCourseId) return;
    if (config) {
      setEditingConfigId(config.id);
      setConfigForm({
        nombre: config.nombre,
        peso: config.peso,
        orden: config.orden,
        periodoAcademicoId: String(config.periodoAcademicoId)
      });
    } else {
      setEditingConfigId(null);
      setConfigForm({
        nombre: "",
        peso: 0.25,
        orden: displayedConfigs.length + 1,
        periodoAcademicoId: selectedPeriodId || (periods[0] ? String(periods[0].id) : "")
      });
    }
    setShowConfigModal(true);
  };

  const handleConfigSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) return;

    const payload = {
      nombre: configForm.nombre,
      peso: Number(configForm.peso),
      orden: Number(configForm.orden),
      periodoAcademicoId: Number(configForm.periodoAcademicoId),
      cursoId: Number(selectedCourseId)
    };

    try {
      if (editingConfigId) {
        await Notas.updateConfig(editingConfigId, payload);
        showMessage("success", "Configuración actualizada");
      } else {
        await Notas.createConfig(Number(selectedCourseId), payload);
        showMessage("success", "Configuración creada");
      }
      setShowConfigModal(false);
      setEditingConfigId(null);
      await loadNotas(selectedCourseId);
    } catch (err) {
      setError(err.response?.data || "No se pudo guardar la configuración");
    }
  };

  const confirmDeleteConfig = (config) => {
    setConfigToDelete(config);
  };

  const deleteConfig = async () => {
    if (!configToDelete) return;
    try {
      await Notas.deleteConfig(configToDelete.id);
      showMessage("success", "Configuración eliminada");
      setConfigToDelete(null);
      await loadNotas(selectedCourseId);
    } catch (err) {
      setError(err.response?.data || "No se pudo eliminar la configuración");
    }
  };

  const getGradeValue = (studentId, configId) => {
    const key = `${studentId}-${configId}`;
    if (key in gradeDrafts) return gradeDrafts[key];
    const est = students.find((s) => s.id === studentId);
    const nota = est?.notas?.find((n) => n.notaConfigId === configId);
    return nota?.valor ?? "";
  };

  if (loadingProfile) {
    return <LoadingSpinner message="Cargando perfil docente..." />;
  }

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="mb-0">Gestión de Calificaciones</h3>
              <p className="text-muted mb-0">Controla evaluaciones y notas por curso y periodo.</p>
            </div>
            <div>
              <Button
                variant="outline-primary"
                size="sm"
                disabled={!selectedCourseId}
                onClick={() => openConfigModal()}
              >
                <FaCog className="me-2" /> Configurar evaluaciones
              </Button>
            </div>
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

      {feedback && (
        <Row className="mb-3">
          <Col>
            <Alert variant={feedback.variant} onClose={() => setFeedback(null)} dismissible>
              {feedback.message}
            </Alert>
          </Col>
        </Row>
      )}

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {String(error)}
            </Alert>
          </Col>
        </Row>
      )}

      <Row className="mb-3">
        <Col md={6} className="mb-2">
          <Card className="shadow-sm">
            <Card.Body>
              <Form.Group>
                <Form.Label>Curso</Form.Label>
                <Form.Select value={selectedCourseId} onChange={handleCourseChange}>
                  <option value="">Selecciona un curso</option>
                  {courses.map((curso) => (
                    <option key={curso.id} value={curso.id}>
                      {curso.gradoNombre ? `${curso.gradoNombre} - ${curso.nombre}` : curso.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-2">
          <Card className="shadow-sm">
            <Card.Body>
              <Form.Group>
                <Form.Label>Periodo académico</Form.Label>
                <Form.Select value={selectedPeriodId} onChange={handlePeriodChange}>
                  {periods.map((periodo) => (
                    <option key={periodo.id} value={periodo.id}>
                      {periodo.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {selectedCourseId ? (
        <>
          <Row className="mb-3">
            <Col md={3} className="mb-2">
              <Card className="card-surface shadow-sm">
                <Card.Body>
                  <small className="text-muted text-uppercase">Evaluaciones del periodo</small>
                  <h2 className="mt-2">{stats.evaluaciones}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-2">
              <Card className="card-surface shadow-sm">
                <Card.Body>
                  <small className="text-muted text-uppercase">Promedio global</small>
                  <h2 className="mt-2">{stats.promedioGeneral.toFixed(2)}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-2">
              <Card className="card-surface shadow-sm">
                <Card.Body>
                  <small className="text-muted text-uppercase">Estudiantes en riesgo</small>
                  <h2 className="mt-2">{stats.enRiesgo}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-2">
              <Card className="card-surface shadow-sm">
                <Card.Body>
                  <small className="text-muted text-uppercase">Avance del registro</small>
                  <h2 className="mt-2">{stats.avance}%</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="shadow-sm mb-3">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">Calificaciones por estudiante</h5>
                <small>Periodo seleccionado: {periods.find((p) => String(p.id) === selectedPeriodId)?.nombre}</small>
              </div>
              <div>
                <Badge bg="light" text="dark">
                  {displayedConfigs.length} evaluaciones activas
                </Badge>
              </div>
            </Card.Header>
            <Card.Body>
              {displayedConfigs.length === 0 ? (
                <Alert variant="info">
                  No hay evaluaciones asignadas a este curso y periodo. Usa el botón "Configurar evaluaciones" para crearlas.
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Estudiante</th>
                        <th>Documento</th>
                        {displayedConfigs.map((cfg) => (
                          <th key={cfg.id} className="text-center">
                            <div className="d-flex flex-column align-items-center">
                              <span>{cfg.nombre}</span>
                              <small className="text-muted">{(cfg.peso * 100).toFixed(0)}%</small>
                            </div>
                          </th>
                        ))}
                        <th className="text-center">Promedio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentsRows.map((student) => (
                        <tr key={student.id}>
                          <td>{student.nombre}</td>
                          <td>{student.documento}</td>
                          {displayedConfigs.map((cfg) => {
                            const cellKey = `${student.id}-${cfg.id}`;
                            const saving = savingCells.has(cellKey);
                            return (
                              <td key={cfg.id} className="text-center" style={{ minWidth: 130 }}>
                                <div className="d-flex align-items-center gap-2 justify-content-center">
                                  <Form.Control
                                    type="number"
                                    size="sm"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    value={getGradeValue(student.id, cfg.id)}
                                    onChange={(e) => handleGradeChange(student.id, cfg.id, e.target.value)}
                                    onBlur={() => persistGrade(student.id, cfg.id)}
                                  />
                                  {saving ? (
                                    <Spinner animation="border" size="sm" />
                                  ) : (
                                    gradeDrafts[cellKey] && <FaRegSave className="text-warning" title="Hay cambios sin guardar" />
                                  )}
                                </div>
                              </td>
                            );
                          })}
                          <td className="text-center">
                            <Badge bg={student.promedio != null && student.promedio < 3 ? "danger" : "success"}>
                              {student.promedio != null ? student.promedio.toFixed(2) : "-"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  {loading && (
                    <div className="text-center py-3">
                      <Spinner animation="grow" size="sm" className="me-2" /> Actualizando datos...
                    </div>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </>
      ) : (
        <Alert variant="info">Selecciona un curso para comenzar.</Alert>
      )}

      <Modal show={showConfigModal} onHide={() => setShowConfigModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingConfigId ? "Editar evaluación" : "Nueva evaluación"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleConfigSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                value={configForm.nombre}
                onChange={(e) => setConfigForm({ ...configForm, nombre: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Peso (0 - 1)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={configForm.peso}
                onChange={(e) => setConfigForm({ ...configForm, peso: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Orden</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={configForm.orden}
                onChange={(e) => setConfigForm({ ...configForm, orden: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Periodo</Form.Label>
              <Form.Select
                value={configForm.periodoAcademicoId}
                onChange={(e) => setConfigForm({ ...configForm, periodoAcademicoId: e.target.value })}
                required
              >
                <option value="">Seleccione un periodo</option>
                {periods.map((periodo) => (
                  <option key={periodo.id} value={periodo.id}>
                    {periodo.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {displayedConfigs.length > 0 && (
              <div className="border rounded p-3">
                <p className="text-muted mb-2">Evaluaciones actuales</p>
                {displayedConfigs.map((cfg) => (
                  <div key={cfg.id} className="d-flex justify-content-between align-items-center py-1">
                    <div>
                      <strong>{cfg.nombre}</strong>
                      <small className="d-block text-muted">{(cfg.peso * 100).toFixed(0)}% · Orden {cfg.orden}</small>
                    </div>
                    <div className="d-flex gap-2">
                      <Button size="sm" variant="outline-secondary" onClick={() => openConfigModal(cfg)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => confirmDeleteConfig(cfg)}>
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowConfigModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {editingConfigId ? "Guardar cambios" : "Crear evaluación"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ConfirmModal
        show={Boolean(configToDelete)}
        title="Eliminar evaluación"
        message="Esta evaluación y sus notas asociadas se eliminarán. ¿Deseas continuar?"
        confirmText="Eliminar"
        confirmVariant="danger"
        onConfirm={deleteConfig}
        onClose={() => setConfigToDelete(null)}
      />
    </Container>
  );
}

function calcularPromedio(notas = []) {
  const notasConValor = notas.filter((n) => n.valor != null);
  if (notasConValor.length === 0) return null;
  const suma = notasConValor.reduce((acc, nota) => acc + nota.valor * nota.peso, 0);
  const totalPeso = notasConValor.reduce((acc, nota) => acc + nota.peso, 0);
  if (totalPeso === 0) return null;
  return Number((suma / totalPeso).toFixed(2));
}
