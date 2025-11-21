import React from "react";
import { Alert, Card, Col, Container, Row } from "react-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import useStudentProfile from "../hooks/useStudentProfile.js";

export default function StudentProfile() {
  const { profile, loadingProfile, profileError } = useStudentProfile();

  if (loadingProfile) {
    return <LoadingSpinner message="Cargando perfil del estudiante..." />;
  }

  if (!profile) {
    return (
      <Container fluid>
        {profileError ? (
          <Alert variant="danger">{String(profileError)}</Alert>
        ) : (
          <Alert variant="info">No se encontró información del estudiante.</Alert>
        )}
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h3 className="mb-0">Mi información</h3>
          <small className="text-muted">Consulta tus datos académicos y de contacto.</small>
        </Col>
      </Row>

      {profileError && (
        <Row className="mb-3">
          <Col>
            <Alert variant="warning">{String(profileError)}</Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col md={6} className="mb-3">
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">Datos personales</Card.Header>
            <Card.Body>
              <dl className="row mb-0">
                <dt className="col-sm-4">Nombre</dt>
                <dd className="col-sm-8">{profile.nombre} {profile.apellido}</dd>
                <dt className="col-sm-4">Documento</dt>
                <dd className="col-sm-8">{profile.documento}</dd>
                <dt className="col-sm-4">Nivel</dt>
                <dd className="col-sm-8">{profile.nivel || "N/D"}</dd>
                <dt className="col-sm-4">Teléfono</dt>
                <dd className="col-sm-8">{profile.telefono || "N/D"}</dd>
                <dt className="col-sm-4">Dirección</dt>
                <dd className="col-sm-8">{profile.direccion || "N/D"}</dd>
              </dl>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-3">
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary text-white">Curso actual</Card.Header>
            <Card.Body>
              {profile.cursoActual ? (
                <dl className="row mb-0">
                  <dt className="col-sm-4">Grado</dt>
                  <dd className="col-sm-8">{profile.cursoActual.gradoNombre || "N/D"}</dd>
                  <dt className="col-sm-4">Curso</dt>
                  <dd className="col-sm-8">{profile.cursoActual.nombre}</dd>
                  <dt className="col-sm-4">Grupo</dt>
                  <dd className="col-sm-8">{profile.cursoActual.grupo || "N/D"}</dd>
                  <dt className="col-sm-4">Código grado</dt>
                  <dd className="col-sm-8">{profile.cursoActual.gradoCodigo || "N/D"}</dd>
                </dl>
              ) : (
                <Alert variant="info" className="mb-0">
                  Aún no tienes un curso asignado.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
