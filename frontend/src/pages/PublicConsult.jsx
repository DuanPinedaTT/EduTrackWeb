import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Table,
  Alert,
  Badge,
  InputGroup,
  Button,
  ButtonGroup
} from "react-bootstrap";
import api from "../services/api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

// Consulta pública; permite buscar estudiantes y cursos sin autenticación.
export default function PublicConsult() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [inscripcionesByStudent, setInscripcionesByStudent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [viewMode, setViewMode] = useState("table"); // "table" o "cards"

  // Carga inicial: estudiantes, cursos e inscripciones para habilitar filtros.
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [studentsRes, coursesRes, insRes] = await Promise.all([
          api.get("/Estudiantes"),
          api.get("/Cursos"),
          api.get("/Inscripciones")
        ]);
        setStudents(studentsRes.data || []);
        setFilteredStudents(studentsRes.data || []);
        setCourses(coursesRes.data || []);

        const map = {};
        (insRes.data || []).forEach(i => {
          if (!map[i.estudianteId]) map[i.estudianteId] = [];
          map[i.estudianteId].push(i);
        });
        setInscripcionesByStudent(map);
      } catch (err) {
        setError(err.response?.data || "Error cargando datos");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Reaplica filtros cada vez que cambian los criterios de búsqueda.
  useEffect(() => {
    let result = students;

    // Filtro por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.nombre.toLowerCase().includes(term) ||
          s.documento.toLowerCase().includes(term)
      );
    }

    // Filtro por curso
    if (selectedCourse) {
      result = result.filter((s) => (inscripcionesByStudent[s.id] || []).some(i => i.cursoId === Number(selectedCourse)));
    }

    setFilteredStudents(result);
  }, [searchTerm, selectedCourse, students]);

  // Traduce IDs en nombres legibles dentro de ambas vistas.
  const getCursoNombre = (cursoId) => {
    if (!cursoId) return "Sin asignar";
    const curso = courses.find((c) => c.id === cursoId);
    return curso ? curso.nombre : `Curso #${cursoId}`;
  };

  if (loading) return <LoadingSpinner message="Cargando datos públicos..." />;

  return (
    <Container className="mt-4 mb-5">
      <Row className="mb-4">
        <Col>
          <h3>Consulta pública de estudiantes</h3>
          <p className="text-muted">
            Busca información de estudiantes registrados en el sistema.
          </p>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger">{String(error)}</Alert>
          </Col>
        </Row>
      )}

      {/* Filtros */}
      <Row className="mb-4">
        <Col md={5}>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre o documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Todos los cursos</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} {c.gradoNombre ? `(${c.gradoNombre})` : c.grado ? `(${c.grado})` : ""}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3} className="text-end">
          <ButtonGroup size="sm">
            <Button
              variant={viewMode === "table" ? "primary" : "outline-primary"}
              onClick={() => setViewMode("table")}
            >
              Tabla
            </Button>
            <Button
              variant={viewMode === "cards" ? "primary" : "outline-primary"}
              onClick={() => setViewMode("cards")}
            >
              Tarjetas
            </Button>
          </ButtonGroup>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <small className="text-muted">
            Mostrando {filteredStudents.length} de {students.length} estudiantes
          </small>
        </Col>
      </Row>

      {/* Vista tabla */}
      {viewMode === "table" && (
        <Row>
          <Col>
            <Card className="shadow-sm">
              <Card.Body>
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Documento</th>
                      <th>Curso</th>
                    </tr>
                  </thead>
                  <tbody>
                      {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center text-muted">
                          {searchTerm || selectedCourse
                            ? "No se encontraron resultados."
                            : "No hay estudiantes registrados."}
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((s, index) => (
                        <tr key={s.id}>
                          <td>{index + 1}</td>
                          <td>{s.nombre}</td>
                          <td>{s.documento}</td>
                          <td>{(() => {
                            const ins = (inscripcionesByStudent[s.id] || [])[0];
                            return ins ? getCursoNombre(ins.cursoId) : 'Sin asignar';
                          })()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Vista tarjetas */}
      {viewMode === "cards" && (
        <Row>
            {filteredStudents.length === 0 ? (
            <Col>
              <Alert variant="info">
                {searchTerm || selectedCourse
                  ? "No se encontraron resultados."
                  : "No hay estudiantes registrados."}
              </Alert>
            </Col>
          ) : (
            filteredStudents.map((s) => (
              <Col key={s.id} md={6} lg={4} className="mb-3">
                <Card className="shadow-sm h-100">
                  <Card.Body>
                    <Card.Title style={{ fontSize: "1.1rem" }}>
                      {s.nombre}
                    </Card.Title>
                    <Card.Text>
                      <strong>Documento:</strong> {s.documento}
                      <br />
                      <strong>Curso:</strong>{" "}
                      <Badge bg="secondary">{(() => {
                        const ins = (inscripcionesByStudent[s.id] || [])[0];
                        return ins ? getCursoNombre(ins.cursoId) : 'Sin asignar';
                      })()}</Badge>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}
    </Container>
  );
}
