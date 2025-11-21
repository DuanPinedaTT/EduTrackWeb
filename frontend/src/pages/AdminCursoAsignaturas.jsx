import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Table, Alert, Modal } from "react-bootstrap";
import api, { Asignaturas, CursoAsignaturas, Grados, Cursos } from "../services/api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export default function AdminCursoAsignaturas() {
  const [courses, setCourses] = useState([]);
  const [grados, setGrados] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(""); // curso = grupo dentro del grado
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ asignaturaId: "", docenteId: "" });
  const [editingId, setEditingId] = useState(null);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [cRes, gRes, aRes, uRes, asigRes] = await Promise.all([
        Cursos.list(),
        Grados.list(),
        Asignaturas.list(),
        api.get('/usuarios'),
        CursoAsignaturas.list()
      ]);

      setCourses(Array.isArray(cRes.data) ? cRes.data : []);
      setGrados(gRes.data || []);
      setAsignaturas(aRes.data || []);
      setTeachers(uRes.data || []);
      setAssignments(asigRes.data || []);
    } catch (err) {
      setError(err.response?.data || 'Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const currentAssignments = assignments.filter(a => String(a.cursoId) === String(selectedCourse));

  const openAdd = () => {
    setEditingId(null);
    setForm({ asignaturaId: "", docenteId: "" });
    setShowModal(true);
  };

  const openEdit = (a) => {
    setEditingId(a.id);
    setForm({ asignaturaId: a.asignaturaId, docenteId: a.docenteId || "" });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      setError(null);
          if (!selectedCourse) return setError('Selecciona primero un grado y un grupo (salón)');
      if (!form.asignaturaId) return setError('Selecciona una asignatura');

      const payload = {
        cursoId: Number(selectedCourse),
        asignaturaId: Number(form.asignaturaId),
        docenteId: form.docenteId ? Number(form.docenteId) : null
      };

      if (editingId) {
        await CursoAsignaturas.update(editingId, payload);
      } else {
        await CursoAsignaturas.create(payload);
      }

      setShowModal(false);
      await loadAll();
    } catch (err) {
      setError(err.response?.data || 'Error guardando asignación');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar asignación?')) return;
    try {
      await CursoAsignaturas.remove(id);
      await loadAll();
    } catch (err) {
      setError(err.response?.data || 'Error eliminando');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <h3>Asignaciones (Grado → Grupo → Asignaturas)</h3>
          <p className="text-muted">Selecciona un grado y luego el grupo (salón) de ese grado. Asigna materias al grupo y, opcionalmente, un docente por asignatura.</p>
        </Col>
      </Row>

      {error && <Row className="mb-3"><Col><Alert variant="danger">{String(error)}</Alert></Col></Row>}

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Selecciona un grado</Form.Label>
            <Form.Select value={selectedGrade} onChange={(e) => { setSelectedGrade(e.target.value); setSelectedCourse(""); }}>
              <option value="">-- Selecciona grado --</option>
              {grados.map(g => (
                <option key={g.id} value={g.id}>{g.nombre}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>Selecciona un grupo (salón)</Form.Label>
            <Form.Select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} disabled={!selectedGrade}>
              <option value="">-- Selecciona grupo --</option>
              {courses.filter(c => String(c.gradoId) === String(selectedGrade)).map(c => (
                <option key={c.id} value={c.id}>{c.grupo || c.nombre || `Grupo ${c.id}`}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={4} className="d-flex align-items-end">
          <div>
            <Button variant="primary" onClick={openAdd} disabled={!selectedCourse}>+ Agregar asignatura al salón</Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="card-surface">
            <Card.Body>
              <Card.Title>Asignaciones del salón</Card.Title>
              {selectedCourse === "" ? (
                <p className="text-muted">Selecciona un curso para ver sus asignaciones.</p>
              ) : (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Asignatura</th>
                      <th>Docente</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAssignments.length === 0 ? (
                      <tr><td colSpan={4} className="text-center text-muted">No hay asignaciones.</td></tr>
                    ) : currentAssignments.map((a,i) => (
                      <tr key={a.id}>
                        <td>{i+1}</td>
                        <td>{(a.asignaturaNombre || a.asignatura?.nombre) || 'Asignatura #' + a.asignaturaId}</td>
                        <td>{(a.docenteNombre) || (a.docente ? `${a.docente.nombre} ${a.docente.apellido}` : 'Sin asignar')}</td>
                        <td className="text-end">
                          <Button size="sm" variant="outline-primary" onClick={() => openEdit(a)}>Editar</Button>{' '}
                          <Button size="sm" variant="outline-danger" onClick={() => handleDelete(a.id)}>Eliminar</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Editar asignación' : 'Nueva asignación'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Asignatura</Form.Label>
            <Form.Select value={form.asignaturaId} onChange={(e) => setForm({ ...form, asignaturaId: e.target.value })}>
              <option value="">-- Selecciona --</option>
              {asignaturas.map(a => (
                <option key={a.id} value={a.id}>{a.codigo ? `${a.codigo} - ${a.nombre}` : a.nombre}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Docente (opcional)</Form.Label>
            <Form.Select value={form.docenteId} onChange={(e) => setForm({ ...form, docenteId: e.target.value })}>
              <option value="">Sin asignar</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.nombre} {t.apellido}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave}>{editingId ? 'Guardar' : 'Crear'}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
