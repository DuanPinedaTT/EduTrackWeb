import React from "react";
import { Container, Row, Col, Button, Modal, Card, Carousel } from "react-bootstrap";
import Login from "./Login.jsx";

export default function Home({ showLogin, onOpenLogin, onCloseLogin }) {
  return (
    <>
      <div
        style={{
          background: "linear-gradient(to bottom, #f8f9ff, #ffffff)",
          minHeight: "calc(100vh - 64px)"
        }}
      >
        <Container className="pt-5 pb-5">
          <Row className="align-items-center mb-5">
            <Col md={6} className="mb-4">
              <h1
                className="mb-3"
                style={{
                  fontWeight: 700,
                  fontSize: "2.8rem",
                  color: "var(--primary-color)"
                }}
              >
                Sistema de gestión académica
              </h1>
              <p className="text-muted mb-4" style={{ fontSize: "1.2rem", lineHeight: 1.6 }}>
                Administra docentes, cursos, estudiantes y planillas de notas
                desde una plataforma moderna y eficiente.
              </p>
              <Button
                onClick={onOpenLogin}
                size="lg"
                className="px-5 py-3 shadow"
                style={{
                  background: "var(--primary-color)",
                  border: "none",
                  fontSize: "1.1rem"
                }}
              >
                Acceder al sistema
              </Button>
            </Col>
            <Col md={6} className="mb-4">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-0">
                  <Carousel fade indicators={false}>
                    <Carousel.Item>
                      <img
                        className="d-block w-100"
                        src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=5c7b0f1f1b2f8f4f1e3b0c9a9b3f2d3e"
                        alt="Gestión académica"
                        style={{ height: 360, objectFit: 'cover', borderRadius: '0.25rem' }}
                      />
                      <Carousel.Caption className="text-start" style={{ left: 20, right: 'auto' }}>
                        <h3 style={{ color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>Organiza tus cursos</h3>
                        <p style={{ color: 'white', textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}>Gestiona docentes, alumnos y notas desde una sola plataforma.</p>
                      </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item>
                      <img
                        className="d-block w-100"
                        src="https://images.unsplash.com/photo-1556514767-3a13e1f2b6d6?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=6a1f5c2a9e9b2f6c3d4e5f6a7b8c9d0e"
                        alt="Planillas y estadísticas"
                        style={{ height: 360, objectFit: 'cover', borderRadius: '0.25rem' }}
                      />
                      <Carousel.Caption className="text-start" style={{ left: 20, right: 'auto' }}>
                        <h3 style={{ color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>Visualiza rendimiento</h3>
                        <p style={{ color: 'white', textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}>Gráficas y distribución de notas por periodo y grado.</p>
                      </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item>
                      <img
                        className="d-block w-100"
                        src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=8b2a1c3d4e5f6a7b8c9d0e1f2a3b4c5d"
                        alt="Exportar y reportes"
                        style={{ height: 360, objectFit: 'cover', borderRadius: '0.25rem' }}
                      />
                      <Carousel.Caption className="text-start" style={{ left: 20, right: 'auto' }}>
                        <h3 style={{ color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>Exporta reportes</h3>
                        <p style={{ color: 'white', textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}>Genera XLSX y PDF listos para imprimir y compartir.</p>
                      </Carousel.Caption>
                    </Carousel.Item>
                  </Carousel>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-5">
            <Col className="text-center mb-4">
              <h3 className="mb-2">Funcionalidades principales</h3>
              <p className="text-muted">
                Todo lo que necesitas para gestionar tu institución
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-3">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="text-center p-4">
                  <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>👨‍💼</div>
                  <Card.Title>Panel administrativo</Card.Title>
                  <Card.Text className="text-muted">
                    Gestiona docentes, cursos y estudiantes desde un único panel de control.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="text-center p-4">
                  <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📊</div>
                  <Card.Title>Planillas flexibles</Card.Title>
                  <Card.Text className="text-muted">
                    Configura columnas de notas personalizadas con pesos y promedios automáticos.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="text-center p-4">
                  <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔍</div>
                  <Card.Title>Consulta pública</Card.Title>
                  <Card.Text className="text-muted">
                    Permite búsquedas de información de estudiantes sin necesidad de autenticación.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Modal show={showLogin} onHide={onCloseLogin} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>Ingreso al sistema</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Login onSuccess={onCloseLogin} />
        </Modal.Body>
      </Modal>
    </>
  );
}
