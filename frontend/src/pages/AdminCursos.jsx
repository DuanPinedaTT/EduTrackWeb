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
  ButtonGroup
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export default function AdminCursos() {
  const [teachers, setTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [grados, setGrados] = useState([]);
  const [studentCounts, setStudentCounts] = useState({});
  const [error, setError] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingCounts, setLoadingCounts] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);

  const [formCourse, setFormCourse] = useState({
    nombre: "",
    gradoId: "",
    grupo: "",
    docenteId: ""
  });

  const navigate = useNavigate();

  const loadTeachers = async () => {
    try {
      setError(null);
      const res = await api.get("/usuarios");
      setTeachers(res.data);
    } catch (err) {
      setError(err.response?.data || "Error cargando docentes");
    }
  };

  const loadCourses = async () => {
    try {
      setLoadingCourses(true);
      setError(null);
      const res = await api.get("/cursos");
      setCourses(res.data);
    } catch (err) {
      setError(err.response?.data || "Error cargando cursos");
    } finally {
      setLoadingCourses(false);
    }
  };

  const loadGrados = async () => {
    try {
      const res = await api.get("/Grados");
      setGrados(res.data || []);
    } catch (err) {
      console.error("Error cargando grados", err);
    }
  };

  const loadStudentCounts = async (courseList) => {
    try {
      setLoadingCounts(true);
      const counts = {};
      await Promise.all(
        courseList.map(async (c) => {
          try {
            const res = await api.get(`/cursos/${c.id}/students`);
            counts[c.id] = Array.isArray(res.data) ? res.data.length : 0;
          } catch {
            counts[c.id] = 0;
          }
        })
      );
      setStudentCounts(counts);
    } finally {
      setLoadingCounts(false);
    }
  };

  useEffect(() => {
    Promise.all([loadTeachers(), loadCourses(), loadGrados()]);
  }, []);

  useEffect(() => {
    if (courses.length > 0) {
      loadStudentCounts(courses);
    } else {
      setStudentCounts({});
    }
  }, [courses]);

  const handleCourseChange = (e) => {
    setFormCourse({
      ...formCourse,
      [e.target.name]: e.target.value
    });
  };

  const gruposForSelectedGrado = () => {
    const g = grados.find(x => String(x.id) === String(formCourse.gradoId));
    return g?.grupos || [];
  };

  const resetCourseForm = () => {
    setEditingCourseId(null);
    setFormCourse({
      nombre: "",
      gradoId: "",
      grupo: "",
      docenteId: ""
    });
  };

  const handleCreateOrUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const gradoObj = grados.find(g => String(g.id) === String(formCourse.gradoId));
      const grupo = formCourse.grupo?.trim();
      const defaultNombre = gradoObj ? `${gradoObj.codigo || gradoObj.nombre} ${grupo || ''}`.trim() : formCourse.nombre;

      const body = {
        nombre: (formCourse.nombre && formCourse.nombre.trim()) || defaultNombre || `Curso ${Date.now()}`,
        gradoId: formCourse.gradoId ? Number(formCourse.gradoId) : null,
        grupo: formCourse.grupo || "",
        docenteId: formCourse.docenteId ? Number(formCourse.docenteId) : null
      };

      if (editingCourseId) {
        await api.put(`/cursos/${editingCourseId}`, body);
      } else {
        await api.post("/cursos", body);
      }

      resetCourseForm();
      loadCourses();
    } catch (err) {
      setError(err.response?.data || "Error guardando curso");
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourseId(course.id);
    setFormCourse({
      nombre: course.nombre,
      gradoId: course.gradoId || "",
      grupo: course.grupo || "",
      docenteId: course.docenteId || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este curso?")) return;
    try {
      setError(null);
      await api.delete(`/cursos/${id}`);
      loadCourses();
    } catch (err) {
      setError(err.response?.data || "Error eliminando curso");
    }
  };

  const handleViewStudents = (courseId) => {
    navigate(`/admin/course/${courseId}`);
  };

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <h3>Gestión de cursos</h3>
          <p className="text-muted">
            Crea, asigna y administra cursos, sus docentes y estudiantes.
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
        <Col md={5}>
          <Card className="shadow-sm mb-3">
            <Card.Body>
              <Card.Title className="mb-3">
                {editingCourseId ? "Editar curso" : "Nuevo curso"}
              </Card.Title>
              <Form onSubmit={handleCreateOrUpdateCourse}>
                <Form.Group className="mb-2">
                  <Form.Label>Nombre del curso</Form.Label>
                  <Form.Control
                    name="nombre"
                    value={formCourse.nombre}
                    onChange={handleCourseChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Grado</Form.Label>
                  <Form.Select
                    name="gradoId"
                    value={formCourse.gradoId}
                    onChange={handleCourseChange}
                  >
                    <option value="">Sin asignar</option>
                    {grados.map((g) => (
                      <option key={g.id} value={g.id}>{g.nombre}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Grupo (salón)</Form.Label>
                  <Form.Select
                    name="grupo"
                    value={formCourse.grupo}
                    onChange={handleCourseChange}
                    disabled={!formCourse.gradoId}
                  >
                    <option value="">(Selecciona grado primero)</option>
                    {gruposForSelectedGrado().map((gr, idx) => (
                      <option key={idx} value={gr}>{gr}</option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">Los grupos se definen en la gestión de grados.</Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Docente asignado</Form.Label>
                  <Form.Select
                    name="docenteId"
                    value={formCourse.docenteId}
                    onChange={handleCourseChange}
                  >
                    <option value="">Sin asignar</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre} {t.apellido}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                {/* Asignación de asignaturas ahora se gestiona desde CursoAsignaturas. */}
                <div className="d-flex justify-content-between">
                  <Button type="submit" variant="primary">
                    {editingCourseId ? "Guardar cambios" : "Crear curso"}
                  </Button>
                  {editingCourseId && (
                    <Button variant="secondary" onClick={resetCourseForm}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={7}>
          <Card className="shadow-sm mb-3">
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center mb-3">
                <span>Listado de cursos</span>
                {(loadingCourses || loadingCounts) && (
                  <Badge bg="secondary" pill>
                    Cargando...
                  </Badge>
                )}
              </Card.Title>
              {loadingCourses ? (
                <LoadingSpinner />
              ) : (
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Curso</th>
                      <th>Grupo</th>
                      <th>Grado</th>
                      <th>Asignatura</th>
                      <th>Docente</th>
                      <th>Estudiantes</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                        {courses.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center text-muted">
                          No hay cursos registrados.
                        </td>
                      </tr>
                    ) : (
                      courses.map((c, index) => (
                        <tr key={c.id}>
                          <td>{index + 1}</td>
                          <td>{c.nombre}</td>
                          <td>{c.grupo || "-"}</td>
                          <td>{c.gradoNombre || c.grado || "-"}</td>
                          <td>{c.asignaturaNombre || "-"}</td>
                          <td>{c.docenteNombre || "Sin asignar"}</td>
                          <td>
                            <Badge bg="info">
                              {studentCounts[c.id] ?? "—"} est.
                            </Badge>
                          </td>
                          <td className="text-end">
                            <ButtonGroup size="sm">
                              <Button
                                variant="outline-secondary"
                                onClick={() => handleViewStudents(c.id)}
                              >
                                Ver
                              </Button>
                              <Button
                                variant="outline-primary"
                                onClick={() => handleEditCourse(c)}
                              >
                                Editar
                              </Button>
                              <Button
                                variant="outline-danger"
                                onClick={() => handleDeleteCourse(c.id)}
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
    </Container>
  );
}
