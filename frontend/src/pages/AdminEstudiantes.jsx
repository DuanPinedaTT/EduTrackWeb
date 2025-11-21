import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Alert,
  Badge,
  ButtonGroup,
  Modal
} from "react-bootstrap";
import api from "../services/api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { CursoAsignaturas } from "../services/api.js";

export default function AdminEstudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [filteredEstudiantes, setFilteredEstudiantes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [grados, setGrados] = useState([]);
  const [inscripcionesByStudent, setInscripcionesByStudent] = useState({});
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollStudentId, setEnrollStudentId] = useState(null);
  const [selectedEnrollCourse, setSelectedEnrollCourse] = useState("");
  const [loadingEst, setLoadingEst] = useState(true);
  const [loadingCursos, setLoadingCursos] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchDocumento, setSearchDocumento] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [studentReport, setStudentReport] = useState(null);
  
  const [selectedCursoFilter, setSelectedCursoFilter] = useState("");
  const [selectedGradoFilter, setSelectedGradoFilter] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    documento: "",
    cursoId: ""
  });

  const loadEstudiantes = async () => {
    try {
      setLoadingEst(true);
      setError(null);
      const [res, insRes] = await Promise.all([api.get("/Estudiantes"), api.get("/Inscripciones")]);
      setEstudiantes(res.data);
      setFilteredEstudiantes(res.data);

      // Mapear inscripciones por estudiante
      const map = {};
      (insRes.data || []).forEach((i) => {
        if (!map[i.estudianteId]) map[i.estudianteId] = [];
        map[i.estudianteId].push(i);
      });
      setInscripcionesByStudent(map);
    } catch (err) {
      setError(err.response?.data || "Error cargando estudiantes");
    } finally {
      setLoadingEst(false);
    }
  };

  const loadCursos = async () => {
    try {
      setLoadingCursos(true);
      setError(null);
      const res = await api.get("/Cursos");
      setCursos(res.data);
      
      // Extraer grados únicos (compatible con GradoNombre)
      const gradosUnicos = [...new Set(res.data.map((c) => c.gradoNombre || c.grado).filter((g) => g))];
      setGrados(gradosUnicos.sort());
    } catch (err) {
      setError(err.response?.data || "Error cargando cursos");
    } finally {
      setLoadingCursos(false);
    }
  };

  useEffect(() => {
    Promise.all([loadEstudiantes(), loadCursos()]);
  }, []);

  const handleSearchByDocumento = async () => {
    if (!searchDocumento) return alert('Ingresa un documento');
    setReportLoading(true);
    try {
      const found = estudiantes.find(s => String(s.documento) === String(searchDocumento));
      if (!found) return alert('Estudiante no encontrado');

      // obtener inscripciones del estudiante
      const ins = (inscripcionesByStudent[found.id] || []);

      // cargar asignaciones de curso->asignatura para mostrar materias
      const asigRes = await CursoAsignaturas.list();
      const asignaciones = asigRes.data || [];

      const cursosReport = [];
      for (const i of ins) {
        const curso = cursos.find(c => c.id === i.cursoId);
        if (!curso) continue;

        // obtener notas del curso y buscar las del estudiante
        let notasEstudiante = null;
        try {
          const notasRes = await api.get(`/Notas/curso/${i.cursoId}`);
          const notasData = Array.isArray(notasRes.data) ? notasRes.data : [];
          notasEstudiante = notasData.find(e => Number(e.id) === Number(found.id)) || null;
        } catch (err) {
          console.error('Error cargando notas para curso', i.cursoId, err);
          notasEstudiante = null;
        }

        const asigns = asignaciones.filter(a => a.cursoId === i.cursoId).map(a => ({
          id: a.id,
          asignaturaId: a.asignaturaId,
          asignaturaNombre: a.asignaturaNombre || a.asignatura?.nombre,
          docenteId: a.docenteId,
          docenteNombre: a.docenteNombre || (a.docente ? `${a.docente.nombre} ${a.docente.apellido}` : null)
        }));

        cursosReport.push({ curso, asigns, notasEstudiante });
      }

      setStudentReport({ student: found, cursos: cursosReport });
      setShowReportModal(true);
    } catch (err) {
      console.error(err);
      alert('Error generando informe');
    } finally {
      setReportLoading(false);
    }
  };

  useEffect(() => {
    let result = estudiantes;

    // Filtro por curso
    if (selectedCursoFilter !== "") {
      result = result.filter((e) => (inscripcionesByStudent[e.id] || []).some(i => i.cursoId === Number(selectedCursoFilter)));
    }

    // Filtro por grado (compatible con GradoNombre)
    if (selectedGradoFilter !== "") {
      const cursosDelGrado = cursos
        .filter((c) => (c.gradoNombre || c.grado) === selectedGradoFilter)
        .map((c) => c.id);
      result = result.filter((e) => (inscripcionesByStudent[e.id] || []).some(i => cursosDelGrado.includes(i.cursoId)));
    }

    setFilteredEstudiantes(result);
  }, [selectedCursoFilter, selectedGradoFilter, estudiantes, cursos]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      nombre: "",
      documento: "",
      cursoId: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const body = {
        nombre: form.nombre,
        documento: form.documento
      };

      if (editingId) {
        await api.put(`/Estudiantes/${editingId}`, body);
      } else {
        const res = await api.post("/Estudiantes", body);
        const newId = res.data?.id || res.data?.Id || null;
        // Si se seleccionó curso al crear, crear Inscripcion
        if (form.cursoId && newId) {
          try {
            await api.post('/Inscripciones', { cursoId: Number(form.cursoId), estudianteId: Number(newId) });
          } catch (err) {
            console.error('Error creando inscripción:', err);
          }
        }
      }

      resetForm();
      await loadEstudiantes();
    } catch (err) {
      setError(err.response?.data || "Error guardando estudiante");
    }
  };

  const handleEdit = (est) => {
    setEditingId(est.id);
    setForm({
      nombre: est.nombre,
      documento: est.documento,
      cursoId: ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este estudiante?")) return;
    try {
      setError(null);
      await api.delete(`/Estudiantes/${id}`);
      loadEstudiantes();
    } catch (err) {
      setError(err.response?.data || "Error eliminando estudiante");
    }
  };

  const getCursoNombre = (cursoId) => {
    // cursoId is actually not stored on student; we look up inscripciones
    if (!cursoId) return "Sin asignar";
    const curso = cursos.find((c) => c.id === cursoId);
    return curso ? curso.nombre : `Curso #${cursoId}`;
  };

  const getCursoGrado = (cursoId) => {
    if (!cursoId) return "";
    const curso = cursos.find((c) => c.id === cursoId);
    return curso?.gradoNombre || curso?.grado || "";
  };

  const openEnrollModal = (studentId) => {
    setEnrollStudentId(studentId);
    setSelectedEnrollCourse("");
    setShowEnrollModal(true);
  };

  const handleEnrollSubmit = async () => {
    if (!selectedEnrollCourse) return alert('Selecciona un curso');
    try {
      await api.post('/Inscripciones', { cursoId: Number(selectedEnrollCourse), estudianteId: Number(enrollStudentId) });
      setShowEnrollModal(false);
      await loadEstudiantes();
    } catch (err) {
      alert(err.response?.data || 'Error inscribiendo estudiante');
    }
  };

  const handleViewInscripciones = (studentId) => {
    const list = (inscripcionesByStudent[studentId] || []).map(i => {
      const curso = cursos.find(c => c.id === i.cursoId);
      return curso ? `${curso.nombre} (${curso.gradoNombre || curso.grado || '-'})` : `Curso #${i.cursoId}`;
    });
    alert(list.length ? list.join('\n') : 'Sin inscripciones');
  };

  const handleResetFilters = () => {
    setSelectedCursoFilter("");
    setSelectedGradoFilter("");
  };

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <h3>Gestión de estudiantes</h3>
          <p className="text-muted">
            Crea, edita y asigna estudiantes a cursos.
          </p>
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

      <Row>
        <Col md={4}>
          <Card className="card-surface mb-3">
            <Card.Body>
              <Card.Title className="mb-3">
                {editingId ? "Editar estudiante" : "Nuevo estudiante"}
              </Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-2">
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Documento</Form.Label>
                  <Form.Control
                    name="documento"
                    value={form.documento}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Curso</Form.Label>
                  <Form.Select
                    name="cursoId"
                    value={form.cursoId}
                    onChange={handleChange}
                  >
                    <option value="">Sin asignar</option>
                    {cursos.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre} {c.gradoNombre ? `(${c.gradoNombre})` : c.grado ? `(${c.grado})` : ""}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <div className="d-flex justify-content-between">
                  <Button type="submit" className="primary-btn">
                    {editingId ? "Guardar cambios" : "Crear estudiante"}
                  </Button>
                  {editingId && (
                    <Button variant="secondary" onClick={resetForm}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="card-surface mb-3">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center mb-3">
                <span>Lista de estudiantes</span>
                {(loadingEst || loadingCursos) && (
                  <Badge bg="secondary" pill>
                    Cargando...
                  </Badge>
                )}
              </Card.Title>

              {/* Filtros */}
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Filtrar por grado</Form.Label>
                    <Form.Select
                      value={selectedGradoFilter}
                      onChange={(e) => setSelectedGradoFilter(e.target.value)}
                    >
                      <option value="">Todos los grados</option>
                      {grados.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={5}>
                  <Form.Group>
                    <Form.Label>Filtrar por curso</Form.Label>
                    <Form.Select
                      value={selectedCursoFilter}
                      onChange={(e) => setSelectedCursoFilter(e.target.value)}
                    >
                      <option value="">Todos los cursos</option>
                      {cursos
                        .filter((c) => 
                          selectedGradoFilter === "" || (c.gradoNombre || c.grado) === selectedGradoFilter
                        )
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nombre} {c.gradoNombre ? `(${c.gradoNombre})` : c.grado ? `(${c.grado})` : ""}
                          </option>
                        ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3} className="d-flex align-items-end">
                  <div className="w-100 d-flex gap-2">
                    <Form.Control placeholder="Buscar por documento" value={searchDocumento} onChange={(e) => setSearchDocumento(e.target.value)} />
                    <Button variant="outline-primary" size="sm" onClick={handleSearchByDocumento} disabled={reportLoading}>{reportLoading ? 'Buscando...' : 'Buscar'}</Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={handleResetFilters}
                    >
                      Limpiar
                    </Button>
                  </div>
                </Col>
              </Row>

              <Row className="mb-2">
                <Col>
                  <small className="text-muted">
                    Mostrando <strong>{filteredEstudiantes.length}</strong> de{" "}
                    <strong>{estudiantes.length}</strong> estudiantes
                    {(selectedGradoFilter || selectedCursoFilter) && (
                      <Badge bg="info" className="ms-2">
                        Filtros activos
                      </Badge>
                    )}
                  </small>
                </Col>
              </Row>

              {loadingEst ? (
                <LoadingSpinner />
              ) : (
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Documento</th>
                      <th>Grado</th>
                      <th>Curso</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEstudiantes.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center text-muted">
                          {selectedCursoFilter || selectedGradoFilter
                            ? "No hay estudiantes que coincidan con los filtros."
                            : "No hay estudiantes registrados."}
                        </td>
                      </tr>
                    ) : (
                      filteredEstudiantes.map((e, index) => (
                        <tr key={e.id}>
                          <td>{index + 1}</td>
                          <td>{e.nombre}</td>
                          <td>{e.documento}</td>
                          <td>
                            {(() => {
                              const ins = (inscripcionesByStudent[e.id] || [])[0];
                              const grado = ins ? getCursoGrado(ins.cursoId) : null;
                              return grado ? <Badge bg="secondary">{grado}</Badge> : <span className="text-muted">-</span>;
                            })()}
                          </td>
                          <td>{(() => {
                              const ins = (inscripcionesByStudent[e.id] || [])[0];
                              return ins ? getCursoNombre(ins.cursoId) : "Sin asignar";
                            })()}</td>
                          <td className="text-end">
                            <ButtonGroup size="sm">
                              <Button aria-label={`Inscribir estudiante ${e.nombre}`} variant="outline-success" onClick={() => openEnrollModal(e.id)}>Inscribir</Button>
                              <Button aria-label={`Ver inscripciones de ${e.nombre}`} variant="outline-info" onClick={() => handleViewInscripciones(e.id)}>Ver</Button>
                              <Button
                                variant="outline-primary"
                                onClick={() => handleEdit(e)}
                              >
                                Editar
                              </Button>
                              <Button
                                variant="outline-danger"
                                onClick={() => handleDelete(e.id)}
                              >
                                Eliminar
                              </Button>
                            </ButtonGroup>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal para inscripción */}
      <Modal show={showEnrollModal} onHide={() => setShowEnrollModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Inscribir estudiante</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Selecciona un curso</Form.Label>
            <Form.Select aria-label="Seleccionar curso para inscribir" value={selectedEnrollCourse} onChange={(e) => setSelectedEnrollCourse(e.target.value)}>
              <option value="">-- Selecciona --</option>
              {cursos.map(c => (
                <option key={c.id} value={c.id}>{c.nombre} {c.grado ? `(${c.grado})` : ''}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEnrollModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleEnrollSubmit}>Inscribir</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal informe por estudiante (documento) */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Informe del estudiante</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!studentReport ? (
            <p>No hay datos</p>
          ) : (
            <div>
              <h5>{studentReport.student.nombre} <small className="text-muted">({studentReport.student.documento})</small></h5>
              <hr />
              {studentReport.cursos.length === 0 ? (
                <p className="text-muted">El estudiante no tiene inscripciones.</p>
              ) : studentReport.cursos.map((cr, idx) => (
                <Card className="mb-3" key={idx}>
                  <Card.Body>
                    <h6>{cr.curso.nombre} <small className="text-muted">{cr.curso.gradoNombre || cr.curso.grado || ''}</small></h6>
                    <p className="text-muted">Asignaturas asignadas:</p>
                    {cr.asigns.length === 0 ? (
                      <p className="text-muted">No hay asignaturas asignadas a este salón.</p>
                    ) : (
                      <Table size="sm" responsive>
                        <thead><tr><th>Asignatura</th><th>Docente</th></tr></thead>
                        <tbody>
                          {cr.asigns.map(a => (
                            <tr key={a.id}><td>{a.asignaturaNombre || 'Asignatura #' + a.asignaturaId}</td><td>{a.docenteNombre || '-'}</td></tr>
                          ))}
                        </tbody>
                      </Table>
                    )}

                    <hr />
                    <p className="text-muted">Notas por configuración (por curso):</p>
                    {cr.notasEstudiante ? (
                      <Table size="sm" responsive>
                        <thead><tr><th>Nombre</th><th>Peso</th><th>Periodo</th><th>Valor</th></tr></thead>
                        <tbody>
                          {cr.notasEstudiante.notas && cr.notasEstudiante.notas.length > 0 ? (
                            cr.notasEstudiante.notas.map(n => (
                              <tr key={n.notaConfigId}><td>{n.nombre}</td><td>{n.peso}%</td><td>{n.periodo}</td><td>{n.valor != null ? n.valor : '-'}</td></tr>
                            ))
                          ) : (
                            <tr><td colSpan={4} className="text-muted">No hay notas registradas para este curso.</td></tr>
                          )}
                        </tbody>
                        <tfoot>
                          <tr><td colSpan={3}><strong>Promedio</strong></td><td>{cr.notasEstudiante.promedio != null ? cr.notasEstudiante.promedio : '-'}</td></tr>
                        </tfoot>
                      </Table>
                    ) : (
                      <p className="text-muted">No se pudo cargar las notas para este curso.</p>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReportModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
