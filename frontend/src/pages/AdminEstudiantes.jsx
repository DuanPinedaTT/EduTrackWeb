import React, { useEffect, useMemo, useState } from "react";
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
  Modal,
  Tabs,
  Tab,
  ListGroup
} from "react-bootstrap";
import api from "../services/api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { CursoAsignaturas } from "../services/api.js";
import PageHero from "../components/PageHero.jsx";

export default function AdminEstudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [filteredEstudiantes, setFilteredEstudiantes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [grados, setGrados] = useState([]);
  const [inscripcionesByStudent, setInscripcionesByStudent] = useState({});
  const [loadingEst, setLoadingEst] = useState(true);
  const [loadingCursos, setLoadingCursos] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchDocumento, setSearchDocumento] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [studentReport, setStudentReport] = useState(null);
  const [activeTab, setActiveTab] = useState("estudiantes");
  
  const [selectedCursoFilter, setSelectedCursoFilter] = useState("");
  const [selectedGradoFilter, setSelectedGradoFilter] = useState("");

  const initialStudentForm = {
    nombre: "",
    documento: "",
    gradoId: "",
    grupo: "",
    usuarioPortal: "",
    passwordPortal: ""
  };
  const [form, setForm] = useState({ ...initialStudentForm });
  const [studentUserDirty, setStudentUserDirty] = useState(false);

  const [tutores, setTutores] = useState([]);
  const [loadingTutores, setLoadingTutores] = useState(false);
  const [editingTutorId, setEditingTutorId] = useState(null);
  const initialTutorState = {
    nombre: "",
    apellido: "",
    email: "",
    user: "",
    password: "",
    hijos: []
  };
  const [tutorForm, setTutorForm] = useState({ ...initialTutorState });
  const [tutorStudentQuery, setTutorStudentQuery] = useState("");
  const tutorSearchMatches = useMemo(() => {
    const query = tutorStudentQuery.trim().toLowerCase();
    if (!query) return [];

    return estudiantes
      .filter((s) => {
        const documento = String(s.documento || "").toLowerCase();
        const nombre = String(s.nombre || "").toLowerCase();
        return documento.includes(query) || nombre.includes(query);
      })
      .filter((s) => !tutorForm.hijos.some((h) => h.estudianteId === s.id))
      .slice(0, 5);
  }, [tutorStudentQuery, estudiantes, tutorForm.hijos]);

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
    } catch (err) {
      setError(err.response?.data || "Error cargando cursos");
    } finally {
      setLoadingCursos(false);
    }
  };

  const loadGrados = async () => {
    try {
      const res = await api.get("/Grados");
      setGrados(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error cargando grados", err);
    }
  };

  const loadTutores = async () => {
    try {
      setLoadingTutores(true);
      const res = await api.get("/Tutores");
      setTutores(res.data || []);
    } catch (err) {
      console.error("Error cargando tutores", err);
    } finally {
      setLoadingTutores(false);
    }
  };

  useEffect(() => {
    Promise.all([loadEstudiantes(), loadCursos(), loadGrados(), loadTutores()]);
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
      result = result.filter((e) => {
        if (e.gradoNombre) {
          return e.gradoNombre === selectedGradoFilter;
        }
        return (inscripcionesByStudent[e.id] || []).some(i => cursosDelGrado.includes(i.cursoId));
      });
    }

    setFilteredEstudiantes(result);
  }, [selectedCursoFilter, selectedGradoFilter, estudiantes, cursos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "gradoId") {
      setForm((prev) => ({ ...prev, gradoId: value, grupo: "" }));
      return;
    }

     if (name === "documento") {
       setForm((prev) => {
         const next = { ...prev, documento: value };
         if (!studentUserDirty && !editingId) {
           next.usuarioPortal = buildStudentUserSuggestion(value);
         }
         return next;
       });
       return;
     }

     if (name === "usuarioPortal") {
       setStudentUserDirty(true);
     }

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setStudentUserDirty(false);
    setForm({ ...initialStudentForm });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const grupoValue = (form.grupo || "").trim();
      const gradoIdNumber = form.gradoId ? Number(form.gradoId) : null;

      if (!gradoIdNumber || !grupoValue) {
        setError("Debes seleccionar grado y grupo");
        return;
      }

      const usernameValue = (form.usuarioPortal || "").trim();
      const passwordValue = (form.passwordPortal || "").trim();

      if (!usernameValue) {
        setError("Define el usuario del portal del estudiante");
        return;
      }

      if (!editingId && !passwordValue) {
        setError("Define una contraseña inicial para el portal");
        return;
      }

      const body = {
        nombre: form.nombre,
        documento: form.documento,
        gradoId: gradoIdNumber,
        grupo: grupoValue,
        usuarioPortal: usernameValue
      };

      if (passwordValue) {
        body.passwordPortal = passwordValue;
      }

      if (editingId) {
        await api.put(`/Estudiantes/${editingId}`, body);
      } else {
        const res = await api.post("/Estudiantes", body);
        const cred = res.data?.credenciales;
        if (cred?.passwordTemporal) {
          alert(`Estudiante creado. Usuario: ${cred.usuario}, Contraseña: ${cred.passwordTemporal}`);
        } else {
          alert("Estudiante creado y habilitado para el portal.");
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
    setStudentUserDirty(true);
    setForm({
      nombre: est.nombre,
      documento: est.documento,
      gradoId: est.gradoId ? String(est.gradoId) : "",
      grupo: est.grupo || "",
      usuarioPortal: est.usuarioPortal || buildStudentUserSuggestion(est.documento),
      passwordPortal: ""
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

  const normalizePortalUser = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 20);

  const buildStudentUserSuggestion = (documento) => {
    const normalizedDoc = normalizePortalUser(documento);
    if (!normalizedDoc) return "";
    return `est-${normalizedDoc}`;
  };

  const handleSuggestStudentUser = () => {
    const suggestion = buildStudentUserSuggestion(form.documento);
    if (!suggestion) {
      alert("Ingresa un documento válido para generar un usuario");
      return;
    }
    setForm((prev) => ({ ...prev, usuarioPortal: suggestion }));
    setStudentUserDirty(true);
  };

  const gruposDisponibles = () => {
    const grado = grados.find((g) => String(g.id) === String(form.gradoId));
    return grado?.grupos || [];
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

  const handleResetPortal = async (studentId) => {
    try {
      const res = await api.post(`/Estudiantes/${studentId}/reset-portal`);
      const cred = res.data;
      alert(
        cred?.passwordTemporal
          ? `Portal reiniciado. Usuario: ${cred.usuario}, Contraseña: ${cred.passwordTemporal}`
          : "Portal actualizado."
      );
      await loadEstudiantes();
    } catch (err) {
      setError(err.response?.data || "Error reiniciando acceso");
    }
  };

  const upsertTutorHijo = (nuevo) => {
    setTutorForm((prev) => {
      const exists = prev.hijos.some((h) => h.estudianteId === nuevo.estudianteId);
      const hijos = exists
        ? prev.hijos.map((h) => (h.estudianteId === nuevo.estudianteId ? nuevo : h))
        : [...prev.hijos, nuevo];
      return { ...prev, hijos };
    });
  };

  const removeTutorHijo = (estudianteId) => {
    setTutorForm((prev) => ({
      ...prev,
      hijos: prev.hijos.filter((h) => h.estudianteId !== estudianteId)
    }));
  };

  const handleTutorFieldChange = (e) => {
    const { name, value } = e.target;
    setTutorForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTutorStudent = (estudianteId) => {
    const est = estudiantes.find((s) => s.id === estudianteId);
    if (!est) return;
    upsertTutorHijo({
      estudianteId,
      nombre: est.nombre,
      documento: est.documento,
      relacion: "Tutor",
      esPrincipal: tutorForm.hijos.length === 0
    });
  };

  const handleTutorMatchSelect = (estudianteId) => {
    handleAddTutorStudent(estudianteId);
    setTutorStudentQuery("");
  };

  const handleUpdateHijoField = (estudianteId, field, value) => {
    setTutorForm((prev) => ({
      ...prev,
      hijos: prev.hijos.map((h) =>
        h.estudianteId === estudianteId ? { ...h, [field]: value } : h
      )
    }));
  };

  const resetTutorForm = () => {
    setEditingTutorId(null);
    setTutorForm({ ...initialTutorState });
    setTutorStudentQuery("");
  };

  const handleEditTutor = (tutor) => {
    setEditingTutorId(tutor.id);
    setTutorForm({
      nombre: tutor.nombre,
      apellido: tutor.apellido,
      email: tutor.email,
      user: tutor.user,
      password: "",
      hijos: (tutor.estudiantes || []).map((h) => ({
        estudianteId: h.estudianteId,
        nombre: h.nombre,
        documento: h.documento,
        relacion: h.relacion,
        esPrincipal: h.esPrincipal
      }))
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveTab("tutores");
  };

  const handleSubmitTutor = async (e) => {
    e.preventDefault();
    if (!tutorForm.hijos.length) {
      alert("Debes vincular al menos un estudiante");
      return;
    }

    try {
      setError(null);
      const payload = {
        nombre: tutorForm.nombre,
        apellido: tutorForm.apellido,
        email: tutorForm.email,
        user: tutorForm.user || undefined,
        password: tutorForm.password || undefined,
        hijos: tutorForm.hijos.map((h) => ({
          estudianteId: h.estudianteId,
          relacion: h.relacion,
          esPrincipal: h.esPrincipal
        }))
      };

      if (editingTutorId) {
        await api.put(`/Tutores/${editingTutorId}`, payload);
      } else {
        const res = await api.post("/Tutores", payload);
        if (res.data?.credenciales) {
          alert(
            `Tutor creado. Usuario: ${res.data.credenciales.usuario}, Contraseña temporal: ${res.data.credenciales.passwordTemporal}`
          );
        }
      }

      await loadTutores();
      resetTutorForm();
    } catch (err) {
      setError(err.response?.data || "Error guardando tutor");
    }
  };

  const handleDeleteTutor = async (id) => {
    if (!window.confirm("¿Eliminar este tutor y su acceso al portal?")) return;
    try {
      await api.delete(`/Tutores/${id}`);
      await loadTutores();
    } catch (err) {
      setError(err.response?.data || "Error eliminando tutor");
    }
  };

  return (
    <Container fluid className="pb-5">
      <Row className="mb-4">
        <Col>
          <PageHero
            eyebrow="Administración"
            title="Gestión de estudiantes y tutores"
            description="Administra matrículas y accesos al portal familiar."
            stats={[
              { label: "Estudiantes", value: estudiantes.length },
              { label: "Tutores", value: tutores.length }
            ]}
          />
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

      <Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(key)} className="mb-3">
        <Tab eventKey="estudiantes" title="Estudiantes">
          <Row>
            <Col md={4}>
              <Card className="glass-card border-0 mb-3">
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
                    <Form.Group className="mb-2">
                      <Form.Label>Grado</Form.Label>
                      <Form.Select
                        name="gradoId"
                        value={form.gradoId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Selecciona grado</option>
                        {grados.map((g) => (
                          <option key={g.id} value={g.id}>{g.nombre}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Grupo</Form.Label>
                      <Form.Select
                        name="grupo"
                        value={form.grupo}
                        onChange={handleChange}
                        disabled={!form.gradoId}
                        required
                      >
                        <option value="">Selecciona grupo</option>
                        {gruposDisponibles().map((gr) => (
                          <option key={gr} value={gr}>{gr}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Usuario portal</Form.Label>
                      <div className="d-flex gap-2">
                        <Form.Control
                          name="usuarioPortal"
                          value={form.usuarioPortal}
                          onChange={handleChange}
                          placeholder="Ej: est-juan"
                          required
                        />
                        <Button type="button" variant="outline-secondary" onClick={handleSuggestStudentUser}>
                          Sugerir
                        </Button>
                      </div>
                      <Form.Text className="text-muted">
                        Se usará para que el estudiante inicie sesión.
                      </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Contraseña portal
                        {editingId && <small className="text-muted"> (vacío = mantener)</small>}
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="passwordPortal"
                        value={form.passwordPortal}
                        onChange={handleChange}
                        placeholder={editingId ? "••••••" : ""}
                        required={!editingId}
                      />
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
              <Card className="glass-card border-0 mb-3">
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between align-items-center mb-3">
                    <span>Lista de estudiantes</span>
                    {(loadingEst || loadingCursos) && (
                      <Badge bg="secondary" pill>
                        Cargando...
                      </Badge>
                    )}
                  </Card.Title>
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
                            <option key={g.id} value={g.nombre}>
                              {g.nombre}
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
                        <Form.Control
                          placeholder="Buscar por documento"
                          value={searchDocumento}
                          onChange={(e) => setSearchDocumento(e.target.value)}
                        />
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={handleSearchByDocumento}
                          disabled={reportLoading}
                        >
                          {reportLoading ? "Buscando..." : "Buscar"}
                        </Button>
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
                    <div className="table-card">
                      <Table hover responsive className="mb-0">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Documento</th>
                            <th>Grado</th>
                            <th>Grupo</th>
                            <th>Usuario portal</th>
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
                                    const grado = e.gradoNombre || (() => {
                                      const ins = (inscripcionesByStudent[e.id] || [])[0];
                                      return ins ? getCursoGrado(ins.cursoId) : null;
                                    })();
                                    return grado ? <Badge bg="secondary">{grado}</Badge> : <span className="text-muted">-</span>;
                                  })()}
                                </td>
                                <td>
                                  {(() => {
                                    if (e.grupo) return e.grupo;
                                    const ins = (inscripcionesByStudent[e.id] || [])[0];
                                    if (!ins) return "Sin grupo";
                                    const curso = cursos.find((c) => c.id === ins.cursoId);
                                    return curso?.grupo || getCursoNombre(ins.cursoId) || "Sin grupo";
                                  })()}
                                </td>
                                <td>
                                  {e.usuarioPortal ? (
                                    <Badge bg="light" text="dark">{e.usuarioPortal}</Badge>
                                  ) : (
                                    <span className="text-muted">Pendiente</span>
                                  )}
                                </td>
                                <td className="text-end">
                                  <div className="d-flex justify-content-end gap-2 flex-wrap">
                                    <Button
                                      aria-label={`Ver inscripciones de ${e.nombre}`}
                                      size="sm"
                                      variant="light"
                                      className="pill-button"
                                      onClick={() => handleViewInscripciones(e.id)}
                                    >
                                      Ver
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="light"
                                      className="pill-button"
                                      onClick={() => handleEdit(e)}
                                    >
                                      Editar
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="light"
                                      className="pill-button"
                                      onClick={() => handleResetPortal(e.id)}
                                    >
                                      Portal
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="light"
                                      className="pill-button"
                                      onClick={() => handleDelete(e.id)}
                                    >
                                      Eliminar
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="tutores" title="Tutores">
          <Row>
            <Col md={5}>
              <Card className="glass-card border-0 mb-3">
                <Card.Body>
                  <Card.Title className="mb-3">
                    {editingTutorId ? "Editar tutor" : "Nuevo tutor"}
                  </Card.Title>
                  <Form onSubmit={handleSubmitTutor}>
                    <Form.Group className="mb-2">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control name="nombre" value={tutorForm.nombre} onChange={handleTutorFieldChange} required />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Apellido</Form.Label>
                      <Form.Control name="apellido" value={tutorForm.apellido} onChange={handleTutorFieldChange} required />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" name="email" value={tutorForm.email} onChange={handleTutorFieldChange} required />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Usuario (opcional)</Form.Label>
                      <Form.Control name="user" value={tutorForm.user} onChange={handleTutorFieldChange} placeholder="Ej: padre.juan" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Contraseña
                        {editingTutorId && <small className="text-muted"> (vacío = mantener)</small>}
                      </Form.Label>
                      <Form.Control type="password" name="password" value={tutorForm.password} onChange={handleTutorFieldChange} placeholder={editingTutorId ? "••••••" : ""} required={!editingTutorId} />
                    </Form.Group>

                    <Card className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <strong>Hijos vinculados</strong>
                        </div>
                        <Form.Group className="mb-2">
                          <Form.Label>Agregar estudiante por documento</Form.Label>
                          <Form.Control
                            placeholder="Ej: 000123456"
                            value={tutorStudentQuery}
                            onChange={(e) => setTutorStudentQuery(e.target.value)}
                          />
                        </Form.Group>
                        {tutorStudentQuery && (
                          <div className="mb-3">
                            {tutorSearchMatches.length === 0 ? (
                              <small className="text-muted">Sin coincidencias para ese documento.</small>
                            ) : (
                              <ListGroup>
                                {tutorSearchMatches.map((s) => (
                                  <ListGroup.Item key={s.id} className="d-flex justify-content-between align-items-center">
                                    <span>
                                      <strong>{s.nombre}</strong>{" "}
                                      <small className="text-muted">({s.documento})</small>
                                    </span>
                                    <Button type="button" size="sm" onClick={() => handleTutorMatchSelect(s.id)}>
                                      Vincular
                                    </Button>
                                  </ListGroup.Item>
                                ))}
                              </ListGroup>
                            )}
                          </div>
                        )}
                        {tutorForm.hijos.length === 0 ? (
                          <p className="text-muted mb-0">No hay estudiantes vinculados.</p>
                        ) : (
                          <Table size="sm" responsive>
                            <thead>
                              <tr>
                                <th>Nombre</th>
                                <th>Relación</th>
                                <th>Principal</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {tutorForm.hijos.map((h) => (
                                <tr key={h.estudianteId}>
                                  <td>
                                    <div className="fw-semibold">{h.nombre}</div>
                                    <small className="text-muted">{h.documento}</small>
                                  </td>
                                  <td>
                                    <Form.Control
                                      size="sm"
                                      value={h.relacion}
                                      onChange={(e) => handleUpdateHijoField(h.estudianteId, "relacion", e.target.value)}
                                    />
                                  </td>
                                  <td className="text-center">
                                    <Form.Check
                                      type="radio"
                                      name="principal"
                                      checked={h.esPrincipal}
                                      onChange={() => {
                                        setTutorForm((prev) => ({
                                          ...prev,
                                          hijos: prev.hijos.map((child) => ({
                                            ...child,
                                            esPrincipal: child.estudianteId === h.estudianteId
                                          }))
                                        }));
                                      }}
                                    />
                                  </td>
                                  <td className="text-end">
                                    <Button variant="outline-danger" size="sm" onClick={() => removeTutorHijo(h.estudianteId)}>
                                      Quitar
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        )}
                      </Card.Body>
                    </Card>

                    <div className="d-flex justify-content-between">
                      <Button type="submit" className="primary-btn">
                        {editingTutorId ? "Guardar tutor" : "Crear tutor"}
                      </Button>
                      {editingTutorId && (
                        <Button variant="secondary" onClick={resetTutorForm}>
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col md={7}>
              <Card className="glass-card border-0 mb-3">
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between align-items-center mb-3">
                    <span>Tutores registrados</span>
                    {loadingTutores && <Badge bg="secondary">Cargando...</Badge>}
                  </Card.Title>
                  {loadingTutores ? (
                    <LoadingSpinner />
                  ) : (
                    <div className="table-card">
                      <Table hover responsive className="mb-0">
                        <thead>
                          <tr>
                            <th>Usuario</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Hijos</th>
                            <th className="text-end">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tutores.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="text-center text-muted">
                                No hay tutores registrados.
                              </td>
                            </tr>
                          ) : (
                            tutores.map((t) => (
                              <tr key={t.id}>
                                <td>{t.user}</td>
                                <td>{t.nombre} {t.apellido}</td>
                                <td>{t.email}</td>
                                <td>
                                  {(t.estudiantes || []).map((h) => (
                                    <Badge bg={h.esPrincipal ? "primary" : "light"} key={`${t.id}-${h.estudianteId}`} className="me-1">
                                      {h.nombre}
                                    </Badge>
                                  ))}
                                </td>
                                <td className="text-end">
                                  <div className="d-flex justify-content-end gap-2 flex-wrap">
                                    <Button size="sm" variant="light" className="pill-button" onClick={() => handleEditTutor(t)}>
                                      Editar
                                    </Button>
                                    <Button size="sm" variant="light" className="pill-button" onClick={() => handleDeleteTutor(t.id)}>
                                      Eliminar
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>
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
