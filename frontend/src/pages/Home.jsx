import React from "react";
import { Container, Row, Col, Button, Modal, Card, Badge } from "react-bootstrap";
import Login from "./Login.jsx";

// Landing principal; presenta beneficios y expone accesos por rol.
export default function Home({ showLogin, onOpenLogin, onCloseLogin }) {
  const accesoRoles = [
    {
      label: "Administración",
      rol: "Administradores",
      descripcion: "Orquesta grados, asignaturas y reportes en tiempo real.",
      cta: "Panel administrativo",
      emoji: "🧭"
    },
    {
      label: "Docentes",
      rol: "Profesores",
      descripcion: "Carga notas, asistencias y mensajes desde un mismo flujo.",
      cta: "Entrar como docente",
      emoji: "✏️"
    },
    {
      label: "Estudiantes",
      rol: "Alumnos",
      descripcion: "Consulta calificaciones, tareas y comunicaciones.",
      cta: "Portal estudiantil",
      emoji: "🎓"
    },
    {
      label: "Familias",
      rol: "Padres y tutores",
      descripcion: "Supervisa el progreso de tus hijos con alertas proactivas.",
      cta: "Portal familias",
      emoji: "👨‍👩‍👧"
    }
  ];

  // Tarjetas breves que refuerzan funciones destacadas.
  const highlights = [
    { label: "Planillas configurables", detail: "Pesos dinámicos por periodo" },
    { label: "Analytics en vivo", detail: "Comparativas por grupo" },
    { label: "Comunicaciones", detail: "Multicanal y trazables" }
  ];

  return (
    <>
      <div className="home-hero-wrapper">
        <Container>
          <div className="hero-grid mb-5">
            <div className="hero-copy">
              <span className="chip mb-3">Versión 2.0 • Nuevo diseño</span>
              <h1>La experiencia académica que esperabas</h1>
              <p>
                Coordina toda la operación académica desde un ecosistema visual inspirado en dashboards modernos.
                Control total para administración, docentes, estudiantes y familias.
              </p>
              <div className="hero-actions">
                <Button className="cta-primary" onClick={onOpenLogin}>
                  Ingresar al sistema
                </Button>
                <Button className="cta-secondary" onClick={onOpenLogin}>
                  Ver demostración
                </Button>
              </div>
              <div className="d-flex flex-wrap gap-4 mt-4">
                <div>
                  <p className="text-muted mb-1">Instituciones activas</p>
                  <h4 className="mb-0">+32</h4>
                </div>
                <div>
                  <p className="text-muted mb-1">Usuarios diarios</p>
                  <h4 className="mb-0">5.300</h4>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <Card className="glass-card border-0 mb-3">
                <Card.Body>
                  <p className="text-muted mb-1">Promedio institucional</p>
                  <h2 className="fw-bold">4.1</h2>
                  <div className="stat-progress mt-3">
                    <span style={{ width: "78%" }} />
                  </div>
                  <small className="text-muted">Periodo 2 en seguimiento</small>
                </Card.Body>
              </Card>

              <div className="feature-grid mb-3">
                {highlights.map((item) => (
                  <div key={item.label} className="feature-card">
                    <p className="text-muted mb-1">{item.label}</p>
                    <strong>{item.detail}</strong>
                  </div>
                ))}
              </div>

              <Card className="glass-card border-0">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <p className="text-muted mb-0">Comunicación destacada</p>
                      <h6 className="mb-0">Semana STEAM</h6>
                    </div>
                    <Badge bg="light" text="dark" className="text-uppercase">Nuevo</Badge>
                  </div>
                  <p className="text-muted mb-0">
                    Agenda colaborativa, métricas y notificaciones listas para compartir.
                  </p>
                </Card.Body>
              </Card>
            </div>
          </div>

          <div className="mb-5 text-center">
            <p className="chip d-inline-flex mb-2">Funciones clave</p>
            <h3 className="section-title">Plataforma integral</h3>
            <p className="section-subtitle">
              Automatiza planillas, comunicaciones, reportes y seguimiento académico en un mismo flujo.
            </p>
          </div>

          <div className="feature-grid mb-5">
            <div className="feature-card">
              <div style={{ fontSize: "2rem" }}>🧠</div>
              <h5>Panel inteligente</h5>
              <p className="text-muted mb-0">Resumen predictivo de métricas claves y alertas proactivas.</p>
            </div>
            <div className="feature-card">
              <div style={{ fontSize: "2rem" }}>📈</div>
              <h5>Analytics por rol</h5>
              <p className="text-muted mb-0">Comparativas por periodo, grado, docente y estudiante.</p>
            </div>
            <div className="feature-card">
              <div style={{ fontSize: "2rem" }}>🔐</div>
              <h5>Portales dedicados</h5>
              <p className="text-muted mb-0">Experiencias a medida para admins, docentes, estudiantes y familias.</p>
            </div>
            <div className="feature-card">
              <div style={{ fontSize: "2rem" }}>⚡️</div>
              <h5>Automatizaciones</h5>
              <p className="text-muted mb-0">Recordatorios y reportes automáticos listos para exportar.</p>
            </div>
          </div>

          <Row className="mt-4">
            <Col className="text-center mb-4">
              <h3 className="section-title">Accesos por rol</h3>
              <p className="section-subtitle">Cada perfil recibe una experiencia curada.</p>
            </Col>
          </Row>

          <Row className="g-4">
            {accesoRoles.map((rol) => (
              <Col key={rol.label} md={3} sm={6}>
                <Card className="role-card h-100 border-0">
                  <Card.Body className="d-flex flex-column gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ fontSize: "1.5rem" }}>{rol.emoji}</span>
                      <Badge bg="light" text="dark">{rol.label}</Badge>
                    </div>
                    <h5 className="mb-1">{rol.rol}</h5>
                    <p className="text-muted flex-grow-1">{rol.descripcion}</p>
                    <Button variant="light" className="btn-icon mt-auto" onClick={onOpenLogin}>
                      {rol.cta}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      <Modal show={showLogin} onHide={onCloseLogin} centered backdrop="static" contentClassName="glass-card">
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
