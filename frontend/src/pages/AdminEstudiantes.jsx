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
  ListGroup,
  Spinner
} from "react-bootstrap";
import api from "../services/api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import PageHero from "../components/PageHero.jsx";

const PERIOD_OPTIONS = [
  { id: 1, label: "Periodo 1" },
  { id: 2, label: "Periodo 2" },
  { id: 3, label: "Periodo 3" },
  { id: 4, label: "Periodo 4" }
];

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
  const [activeTab, setActiveTab] = useState("estudiantes");
  const [summaryModal, setSummaryModal] = useState({
    show: false,
    loading: false,
    student: null,
    courses: [],
    error: null,
    period: 1
  });
  const [selectedCursoFilter, setSelectedCursoFilter] = useState("");
  const [selectedGradoFilter, setSelectedGradoFilter] = useState("");
  const [documentFilter, setDocumentFilter] = useState("");

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
      const students = Array.isArray(res.data) ? res.data : [];
      setEstudiantes(students);
      setFilteredEstudiantes(students);

      const map = {};
      (insRes.data || []).forEach((inscripcion) => {
        if (!map[inscripcion.estudianteId]) {
          map[inscripcion.estudianteId] = [];
        }
        map[inscripcion.estudianteId].push(inscripcion);
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
      setCursos(Array.isArray(res.data) ? res.data : []);
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
      setTutores(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error cargando tutores", err);
    } finally {
      setLoadingTutores(false);
    }
  };

  useEffect(() => {
    Promise.all([loadEstudiantes(), loadCursos(), loadGrados(), loadTutores()]);
  }, []);

  const handleSearchByDocumento = () => {
    const query = searchDocumento.trim();
    if (!query) {
      alert("Ingresa un documento");
      return;
    }

    const match = estudiantes.find((s) => String(s.documento) === query);
    if (!match) {
      alert("Estudiante no encontrado");
      setDocumentFilter("");
      return;
    }

    setDocumentFilter(String(match.documento));
    setTimeout(() => {
      const row = document.getElementById(`student-row-${match.id}`);
      if (row) {
        row.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 200);
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

    if (documentFilter !== "") {
      result = result.filter((e) => String(e.documento) === documentFilter);
    }

    setFilteredEstudiantes(result);
  }, [selectedCursoFilter, selectedGradoFilter, documentFilter, estudiantes, cursos, inscripcionesByStudent]);

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

  const handleViewStudentSummary = async (student) => {
    const inscripciones = inscripcionesByStudent[student.id] || [];
    setSummaryModal({ show: true, loading: true, student, courses: [], error: null, period: 1 });

    if (inscripciones.length === 0) {
      setSummaryModal((prev) => ({ ...prev, loading: false, error: "El estudiante no tiene cursos asignados." }));
      return;
    }

    try {
      const summaries = await Promise.all(
        inscripciones.map(async (inscripcion) => {
          const curso = cursos.find((c) => c.id === inscripcion.cursoId);
          let configs = [];
          let notasEstudiante = [];

          try {
            const [configsRes, notasRes] = await Promise.all([
              api.get(`/Notas/curso/${inscripcion.cursoId}/config`),
              api.get(`/Notas/curso/${inscripcion.cursoId}`)
            ]);

            configs = Array.isArray(configsRes.data) ? configsRes.data : [];
            const notasData = Array.isArray(notasRes.data) ? notasRes.data : [];
            const match = notasData.find((entry) => Number(entry.id) === Number(student.id));
            notasEstudiante = Array.isArray(match?.notas) ? match.notas : [];
          } catch (notesErr) {
            console.error("Error cargando notas del curso", inscripcion.cursoId, notesErr);
          }

          return {
            cursoId: inscripcion.cursoId,
            asignatura: curso?.nombre || `Curso #${inscripcion.cursoId}`,
            grado: curso?.gradoNombre || curso?.grado || "Sin grado",
            grupo: curso?.grupo || "-",
            docente: curso?.docenteNombre || null,
            configs,
            notas: notasEstudiante
          };
        })
      );

      setSummaryModal((prev) => ({ ...prev, loading: false, courses: summaries, error: null }));
    } catch (err) {
      console.error("Error generando resumen", err);
      setSummaryModal((prev) => ({ ...prev, loading: false, error: err.response?.data || "No se pudo generar el resumen" }));
    }
  };

  const getCourseAverageForPeriod = (course, period) => {
    if (!course || !Array.isArray(course.configs) || course.configs.length === 0) return null;
    const periodConfigs = course.configs.filter((cfg) => Number(cfg.periodo) === Number(period));
    if (periodConfigs.length === 0) return null;

    const notaMap = new Map((course.notas || []).map((nota) => [nota.notaConfigId, nota.valor]));
    let sumaPesos = 0;
    let sumaProductos = 0;

    periodConfigs.forEach((cfg) => {
      const peso = Number(cfg.peso) || 0;
      const valor = notaMap.get(cfg.id);
      if (valor != null && peso > 0) {
        sumaPesos += peso;
        sumaProductos += peso * Number(valor);
      }
    });

    if (sumaPesos === 0) return null;
    return Number((sumaProductos / sumaPesos).toFixed(2));
  };

  const handleResetFilters = () => {
    setSelectedCursoFilter("");
    setSelectedGradoFilter("");
    setDocumentFilter("");
    setSearchDocumento("");
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
      hijos: prev.hijos.map((h) => (h.estudianteId === estudianteId ? { ...h, [field]: value } : h))
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
                        >
                          Buscar
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
                            filteredEstudiantes.map((e, index) => {
                              const isFocused = documentFilter && String(e.documento) === documentFilter;
                              return (
                              <tr key={e.id} id={`student-row-${e.id}`} className={isFocused ? "table-active" : ""}>
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
                                      onClick={() => handleViewStudentSummary(e)}
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
                                      onClick={() => handleDelete(e.id)}
                                    >
                                      Eliminar
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                              );
                            })
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
      <Modal
        show={summaryModal.show}
        onHide={() => setSummaryModal((prev) => ({ ...prev, show: false }))}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Resumen académico{summaryModal.student ? ` • ${summaryModal.student.nombre}` : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Periodo a consultar</Form.Label>
                <Form.Select
                  value={summaryModal.period}
                  onChange={(e) =>
                    setSummaryModal((prev) => ({
                      ...prev,
                      period: Number(e.target.value) || 1
                    }))
                  }
                >
                  {PERIOD_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {summaryModal.loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
            </div>
          ) : summaryModal.error ? (
            <Alert variant="light" className="mb-0">
              {summaryModal.error}
            </Alert>
          ) : summaryModal.courses.length === 0 ? (
            <Alert variant="light" className="mb-0">
              No se encontraron asignaturas para este estudiante.
            </Alert>
          ) : (
            <div className="table-card">
              <Table responsive hover className="mb-0">
                <thead>
                  <tr>
                    <th>Asignatura</th>
                    <th>Docente</th>
                    <th className="text-end">Nota periodo {summaryModal.period}</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryModal.courses.map((course) => {
                    const promedio = getCourseAverageForPeriod(course, summaryModal.period);
                    return (
                      <tr key={course.cursoId}>
                        <td>
                          <div className="d-flex flex-column">
                            <strong>{course.asignatura}</strong>
                            <small className="text-muted">
                              {course.grado} • Grupo {course.grupo}
                            </small>
                          </div>
                        </td>
                        <td>{course.docente || <span className="text-muted">Sin docente</span>}</td>
                        <td className="text-end">
                          {promedio != null ? (
                            <span
                              className={`badge ${
                                promedio >= 4 ? "badge-soft-success" : promedio < 3 ? "badge-soft-danger" : "bg-light text-dark"
                              }`}
                            >
                              {promedio.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-muted">Sin registros</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
      </Modal>

    </Container>
  );
}
