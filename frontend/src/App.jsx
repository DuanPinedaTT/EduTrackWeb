import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { useAuth } from "./hooks/useAuth.js";

import Home from "./pages/Home.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import CourseView from "./pages/CourseView.jsx";
import PublicConsult from "./pages/PublicConsult.jsx";
import AdminDocentes from "./pages/AdminDocentes.jsx";
import AdminEstudiantes from "./pages/AdminEstudiantes.jsx";
import AdminCursos from "./pages/AdminCursos.jsx";
import AdminAsignaturas from "./pages/AdminAsignaturas.jsx";
import AdminGrados from "./pages/AdminGrados.jsx";
import AdminCursoAsignaturas from "./pages/AdminCursoAsignaturas.jsx";
import AdminPeriodos from "./pages/AdminPeriodos.jsx";
import AdminReportes from "./pages/AdminReportes.jsx";
import AdminNotificaciones from "./pages/AdminNotificaciones.jsx";
import Profile from "./pages/Profile.jsx";
import TeacherGrades from "./pages/TeacherGrades.jsx";
import TeacherAttendance from "./pages/TeacherAttendance.jsx";
import TeacherNotifications from "./pages/TeacherNotifications.jsx";
import TeacherObservations from "./pages/TeacherObservations.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import StudentGrades from "./pages/StudentGrades.jsx";
import StudentAttendance from "./pages/StudentAttendance.jsx";
import StudentNotifications from "./pages/StudentNotifications.jsx";
import StudentProfile from "./pages/StudentProfile.jsx";
import StudentObservations from "./pages/StudentObservations.jsx";

import Navbar from "./components/Navbar.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (roles && !roles.includes(user.rol)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar onLoginClick={openLoginModal} />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                showLogin={showLoginModal}
                onOpenLogin={openLoginModal}
                onCloseLogin={closeLoginModal}
              />
            }
          />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/public" element={<PublicConsult />} />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <PrivateRoute roles={["admin"]}>
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/docentes"
            element={
              <PrivateRoute roles={["admin"]}>
                <DashboardLayout>
                  <AdminDocentes />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/cursos"
            element={
              <PrivateRoute roles={["admin"]}>
                <DashboardLayout>
                  <AdminCursos />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/asignaturas"
            element={
              <PrivateRoute roles={["admin"]}>
                <DashboardLayout>
                  <AdminAsignaturas />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/grados"
            element={
              <PrivateRoute roles={["admin"]}>
                <DashboardLayout>
                  <AdminGrados />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/estudiantes"
            element={
              <PrivateRoute roles={["admin"]}>
                <DashboardLayout>
                  <AdminEstudiantes />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/curso-asignaturas"
            element={
              <PrivateRoute roles={["admin"]}>
                <DashboardLayout>
                  <AdminCursoAsignaturas />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/periodos"
            element={
              <PrivateRoute roles={["admin"]}>
                <DashboardLayout>
                  <AdminPeriodos />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/reportes"
            element={
              <PrivateRoute roles={["admin"]}>
                <DashboardLayout>
                  <AdminReportes />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/notificaciones"
            element={
              <PrivateRoute roles={["admin"]}>
                <DashboardLayout>
                  <AdminNotificaciones />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/course/:id"
            element={
              <PrivateRoute roles={["admin"]}>
                <DashboardLayout>
                  <CourseView />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          {/* DOCENTE */}
          <Route
            path="/teacher"
            element={
              <PrivateRoute roles={["docente"]}>
                <DashboardLayout>
                  <TeacherDashboard />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/teacher/grades"
            element={
              <PrivateRoute roles={["docente"]}>
                <DashboardLayout>
                  <TeacherGrades />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/teacher/attendance"
            element={
              <PrivateRoute roles={["docente"]}>
                <DashboardLayout>
                  <TeacherAttendance />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/teacher/notifications"
            element={
              <PrivateRoute roles={["docente"]}>
                <DashboardLayout>
                  <TeacherNotifications />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/teacher/observations"
            element={
              <PrivateRoute roles={["docente"]}>
                <DashboardLayout>
                  <TeacherObservations />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/teacher/course/:id"
            element={
              <PrivateRoute roles={["docente"]}>
                <DashboardLayout>
                  <CourseView />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          {/* ESTUDIANTE */}
          <Route
            path="/student"
            element={
              <PrivateRoute roles={["estudiante"]}>
                <DashboardLayout>
                  <StudentDashboard />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/student/profile"
            element={
              <PrivateRoute roles={["estudiante"]}>
                <DashboardLayout>
                  <StudentProfile />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/student/grades"
            element={
              <PrivateRoute roles={["estudiante"]}>
                <DashboardLayout>
                  <StudentGrades />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/student/attendance"
            element={
              <PrivateRoute roles={["estudiante"]}>
                <DashboardLayout>
                  <StudentAttendance />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/student/notifications"
            element={
              <PrivateRoute roles={["estudiante"]}>
                <DashboardLayout>
                  <StudentNotifications />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/student/observations"
            element={
              <PrivateRoute roles={["estudiante"]}>
                <DashboardLayout>
                  <StudentObservations />
                </DashboardLayout>
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
