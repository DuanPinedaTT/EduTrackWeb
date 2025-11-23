import React, { useEffect, useState } from "react";
import { Container, Row, Col, ListGroup, Dropdown, Collapse } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import api from "../services/api.js";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.rol === "admin";

  const [assignments, setAssignments] = useState([]);
  const [showAssignments, setShowAssignments] = useState(true);

  useEffect(() => {
    if (isAdmin || !user?.id) {
      setAssignments([]);
      return;
    }

    let cancel = false;
    const loadAssignments = async () => {
      try {
        const res = await api.get(`/CursoAsignaturas/docente/${user.id}`);
        if (!cancel) {
          const data = Array.isArray(res.data) ? res.data : [];
          setAssignments(data);
        }
      } catch (err) {
        console.error("Error cargando asignaciones del docente", err);
        if (!cancel) setAssignments([]);
      }
    };

    loadAssignments();
    return () => {
      cancel = true;
    };
  }, [isAdmin, user?.id]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getRolLabel = (rol) => {
    if (rol === "admin") return "Administrador";
    if (rol === "docente") return "Docente";
    return rol;
  };

  const menuAdmin = [
    { path: "/admin", label: "Resumen" },
    { path: "/admin/docentes", label: "Docentes" },
    { path: "/admin/asignaturas", label: "Asignaturas" },
    { path: "/admin/grados", label: "Grados" },
    { path: "/admin/curso-asignaturas", label: "Asignaciones" },
    { path: "/admin/estudiantes", label: "Estudiantes" }
  ];

  return (
    <div className="app-root">
      <div className="dashboard-header border-bottom shadow-sm">
        <Container fluid className="px-4 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 header-title">EduTrack Academy</h5>
            <div className="d-flex align-items-center">
              <span className="me-3 header-user">
                {user?.nombre} <small>({getRolLabel(user?.rol)})</small>
              </span>
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" size="sm" className="account-toggle">
                  Mi cuenta
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">
                    Perfil
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Container>
      </div>

      <Container fluid>
        <Row>
          <Col xs={12} md={3} lg={2} className="sidebar-panel p-3">
            <div>
              <h6 className="mb-3 text-uppercase menu-heading">Menú</h6>

              {isAdmin ? (
                <ListGroup variant="flush" className="border-0">
                  {menuAdmin.map((item) => (
                    <ListGroup.Item
                      key={item.path}
                      as={Link}
                      to={item.path}
                      className={`menu-item mb-1 ${location.pathname === item.path ? "active" : ""}`}
                    >
                      {item.label}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <>
                  <ListGroup variant="flush" className="border-0">
                    <ListGroup.Item
                      as={Link}
                      to="/teacher"
                      className={`menu-item mb-1 ${location.pathname === "/teacher" ? "active" : ""}`}
                    >
                      Panel principal
                    </ListGroup.Item>

                    <ListGroup.Item className="menu-item mb-1" onClick={() => setShowAssignments((prev) => !prev)}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>Mis asignaturas</span>
                        <span style={{ fontSize: "0.75rem" }}>{showAssignments ? "▼" : "▶"}</span>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>

                  <Collapse in={showAssignments}>
                    <div>
                      <ListGroup variant="flush" className="border-0">
                        {assignments.length === 0 ? (
                          <ListGroup.Item className="border-0 ps-3 transparent-bg">
                            <small className="muted-accent">Sin asignaturas</small>
                          </ListGroup.Item>
                        ) : (
                          assignments.map((assignment) => {
                            const subjectLabel = assignment.asignaturaCodigo
                              ? `${assignment.asignaturaCodigo} - ${assignment.asignaturaNombre}`
                              : assignment.asignaturaNombre || assignment.cursoNombre || "Asignatura";
                            const gradeLabel = assignment.gradoNombre || "Sin grado";
                            const groupLabel = assignment.grupo ? `Grupo ${assignment.grupo}` : null;
                            const coursePath = `/teacher/course/${assignment.cursoId}`;
                            const isActive = location.pathname === coursePath;

                            return (
                              <ListGroup.Item
                                key={`${assignment.id}-${assignment.cursoId}`}
                                as={Link}
                                to={coursePath}
                                className={`menu-item ps-3 mb-1 ${isActive ? "active" : ""}`}
                              >
                                <div className="d-flex flex-column">
                                  <span className="fw-semibold">{subjectLabel}</span>
                                  <small className="text-muted">
                                    {gradeLabel}
                                    {groupLabel ? ` • ${groupLabel}` : ""}
                                  </small>
                                </div>
                              </ListGroup.Item>
                            );
                          })
                        )}
                      </ListGroup>
                    </div>
                  </Collapse>
                </>
              )}
            </div>
          </Col>
          <Col xs={12} md={9} lg={10} className="p-4">
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
