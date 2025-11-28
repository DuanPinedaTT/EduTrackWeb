import React, { useEffect, useState } from "react";
import { ListGroup, Dropdown, Collapse } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import api from "../services/api.js";
import NotificationBell from "../components/NotificationBell.jsx";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const rolActual = user?.rol;
  const isAdmin = rolActual === "admin";
  const isDocente = rolActual === "docente";
  const isEstudiante = rolActual === "estudiante";
  const isTutor = rolActual === "tutor";

  const [assignments, setAssignments] = useState([]);
  const [showAssignments, setShowAssignments] = useState(true);

  useEffect(() => {
    if (!isDocente || !user?.id) {
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
  }, [isDocente, user?.id]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getRolLabel = (rol) => {
    if (rol === "admin") return "Administrador";
    if (rol === "docente") return "Docente";
    if (rol === "estudiante") return "Estudiante";
    if (rol === "tutor") return "Tutor";
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

  const menuStudent = [
    { path: "/student", label: "Resumen" },
    { path: "/student#notas", label: "Notas" },
    { path: "/student#asistencias", label: "Asistencias" },
    { path: "/student#comunicaciones", label: "Comunicaciones" }
  ];

  const menuTutor = [
    { path: "/familia", label: "Resumen" },
    { path: "/familia#parent-notas", label: "Notas" },
    { path: "/familia#parent-asistencias", label: "Asistencias" },
    { path: "/familia#parent-comunicaciones", label: "Comunicaciones" }
  ];

  const isMenuItemActive = (targetPath) => {
    if (!targetPath) return false;
    const [pathnameOnly, hash] = targetPath.split("#");
    if (hash) {
      return location.pathname === pathnameOnly && location.hash === `#${hash}`;
    }
    return location.pathname === pathnameOnly && (!location.hash || location.hash === "");
  };

  const renderAdminMenu = () => (
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

  const renderSimpleMenu = (items) => (
    <ListGroup variant="flush" className="border-0">
      {items.map((item) => (
        <ListGroup.Item
          key={item.path}
          as={Link}
          to={item.path}
          className={`menu-item mb-1 ${isMenuItemActive(item.path) ? "active" : ""}`}
        >
          {item.label}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );

  const renderTeacherMenu = () => (
    <>
      <ListGroup variant="flush" className="border-0">
        <ListGroup.Item
          as={Link}
          to="/teacher"
          className={`menu-item mb-1 ${location.pathname === "/teacher" ? "active" : ""}`}
        >
          Panel principal
        </ListGroup.Item>

        <ListGroup.Item
          as={Link}
          to="/teacher/comunicaciones"
          className={`menu-item mb-1 ${location.pathname === "/teacher/comunicaciones" ? "active" : ""}`}
        >
          Centro de comunicaciones
        </ListGroup.Item>

        <ListGroup.Item
          as={Link}
          to="/teacher/asistencias"
          className={`menu-item mb-1 ${location.pathname === "/teacher/asistencias" ? "active" : ""}`}
        >
          Registro de asistencias
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
  );

  const renderFallbackMenu = () => (
    <ListGroup variant="flush" className="border-0">
      <ListGroup.Item
        as={Link}
        to="/profile"
        className={`menu-item mb-1 ${location.pathname === "/profile" ? "active" : ""}`}
      >
        Perfil
      </ListGroup.Item>
    </ListGroup>
  );

  const renderSidebarMenu = () => {
    if (isAdmin) return renderAdminMenu();
    if (isDocente) return renderTeacherMenu();
    if (isEstudiante) return renderSimpleMenu(menuStudent);
    if (isTutor) return renderSimpleMenu(menuTutor);
    return renderFallbackMenu();
  };

  return (
    <div className="dashboard-shell">
      <header className="shell-topbar">
        <div>
          <h5 className="brand-title mb-1">
            <span className="brand-title-primary">Edu</span>
            <span className="brand-title-highlight">Track</span>
            <span className="brand-title-primary"> Academy</span>
          </h5>
          <small className="text-muted">{getRolLabel(user?.rol)} • Experiencia personalizada</small>
        </div>
        <div className="d-flex align-items-center gap-3">
          <NotificationBell />
          <span className="fw-semibold text-muted mb-0">
            {user?.nombre}
          </span>
          <Dropdown align="end">
            <Dropdown.Toggle variant="light" size="sm" className="account-toggle">
              Mi cuenta
            </Dropdown.Toggle>
            <Dropdown.Menu className="shadow-sm">
              <Dropdown.Item as={Link} to="/profile">
                Perfil
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>

      <div className="shell-grid">
        <aside className="shell-sidebar">
          <div className="sidebar-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <p className="menu-heading mb-1">Navegación</p>
                <small className="text-muted">{getRolLabel(user?.rol)} activo</small>
              </div>
            </div>
            {renderSidebarMenu()}
          </div>
        </aside>

        <main className="shell-main">
          {children}
        </main>
      </div>
    </div>
  );
}
