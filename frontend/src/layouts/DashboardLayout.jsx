import React, { useEffect, useState } from "react";
import { Container, Row, Col, ListGroup, Dropdown, Collapse } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import api from "../services/api.js";
import useTeacherProfile from "../hooks/useTeacherProfile.js";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.rol === "admin";
  const isTeacher = user?.rol === "docente";
  const isStudent = user?.rol === "estudiante";
  const { profile: teacherProfile } = useTeacherProfile();

  const [courses, setCourses] = useState([]);
  const [showCourses, setShowCourses] = useState(true);

  useEffect(() => {
    if (isTeacher && teacherProfile?.id) {
      const loadCourses = async () => {
        try {
          const res = await api.get("/cursos");
          // Filtrar solo los cursos del docente logueado (ProfesorId)
          const misCursos = res.data.filter((c) => {
            const profesorId = c.profesorId ?? c.docenteId ?? c.profesor?.id;
            return profesorId === teacherProfile.id;
          });
          setCourses(misCursos);
        } catch (err) {
          console.error(err);
        }
      };
      loadCourses();
    }
  }, [isTeacher, teacherProfile]);

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

  const menuTeacher = [
    { path: "/teacher", label: "Panel principal" },
    { path: "/teacher/grades", label: "Calificaciones" },
    { path: "/teacher/attendance", label: "Asistencias" },
    { path: "/teacher/notifications", label: "Notificaciones" },
    { path: "/teacher/observations", label: "Observaciones" }
  ];

  const menuStudent = [
    { path: "/student", label: "Resumen" },
    { path: "/student/profile", label: "Mi perfil" },
    { path: "/student/grades", label: "Mis calificaciones" },
    { path: "/student/attendance", label: "Mis asistencias" },
    { path: "/student/notifications", label: "Mis notificaciones" }
  ];

  let sidebarMenu = (
    <ListGroup variant="flush" className="border-0">
      <ListGroup.Item className="menu-item mb-1">Sin opciones disponibles</ListGroup.Item>
    </ListGroup>
  );

  if (isAdmin) {
    sidebarMenu = (
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
    );
  } else if (isTeacher) {
    sidebarMenu = (
      <>
        <ListGroup variant="flush" className="border-0">
          {menuTeacher.map((item) => (
            <ListGroup.Item
              key={item.path}
              as={Link}
              to={item.path}
              className={`menu-item mb-1 ${location.pathname === item.path ? "active" : ""}`}
            >
              {item.label}
            </ListGroup.Item>
          ))}

          <ListGroup.Item
            className="menu-item mb-1"
            onClick={() => setShowCourses(!showCourses)}
          >
            <div className="d-flex justify-content-between align-items-center">
              <span>Mis cursos</span>
              <span style={{ fontSize: "0.75rem" }}>
                {showCourses ? "▼" : "▶"}
              </span>
            </div>
          </ListGroup.Item>
        </ListGroup>

        <Collapse in={showCourses}>
          <div>
            <ListGroup variant="flush" className="border-0">
              {courses.length === 0 ? (
                <ListGroup.Item className="border-0 ps-3 transparent-bg">
                  <small className="muted-accent">Sin cursos</small>
                </ListGroup.Item>
              ) : (
                courses.map((c) => (
                  <ListGroup.Item
                    key={c.id}
                    as={Link}
                    to={`/teacher/course/${c.id}`}
                    className={`menu-item ps-3 mb-1 ${location.pathname === `/teacher/course/${c.id}` ? "active" : ""}`}
                  >
                    {c.gradoNombre ? `${c.gradoNombre} - ${c.nombre}` : c.grado ? `${c.grado} - ${c.nombre}` : c.nombre}
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
          </div>
        </Collapse>
      </>
    );
  } else if (isStudent) {
    sidebarMenu = (
      <ListGroup variant="flush" className="border-0">
        {menuStudent.map((item) => (
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
    );
  }

  return (
    <div className="app-root">
      {/* Header interno */}
      <div className="dashboard-header border-bottom shadow-sm">
        <Container fluid className="px-4 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 header-title">EduTrack Academy</h5>
            <div className="d-flex align-items-center">
              <span className="me-3 header-user">{user?.nombre} <small>({getRolLabel(user?.rol)})</small></span>
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="light"
                  size="sm"
                  className="account-toggle"
                >
                  Mi cuenta
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profile">Perfil</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Container>
      </div>

      {/* Layout principal */}
      <Container fluid>
        <Row>
          <Col xs={12} md={3} lg={2} className="sidebar-panel p-3">
            <div>
              <h6 className="mb-3 text-uppercase menu-heading">Menú</h6>
              {sidebarMenu}
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
