import { Routes, Route } from "react-router-dom"
import Home from "@/pages/Home"
import DashboardAdministrador from "@/pages/administrador/Dashboard"
import PaginaUsuarios from "@/pages/administrador/Usuarios"
import PaginaMaterias from "@/pages/administrador/Materias"
import PaginaPeriodos from "@/pages/administrador/Periodos"
import PaginaReportes from "@/pages/administrador/Reportes"
import PaginaEstadisticas from "@/pages/administrador/Estadisticas"
import PaginaComunicacion from "@/pages/administrador/Comunicacion"
import PaginaPadres from "@/pages/administrador/Padres"
import PaginaPerfilAdmin from "@/pages/administrador/Perfil"
import PaginaDashboardDocente from "@/pages/docente/Dashboard"
import PaginaCalificacionesDocente from "@/pages/docente/Calificaciones"
import PaginaAsistenciasDocente from "@/pages/docente/Asistencias"
import PaginaTareasDocente from "@/pages/docente/Tareas"
import PaginaComunicacionDocente from "@/pages/docente/Comunicacion"
import PaginaNotificacionesDocente from "@/pages/docente/Notificaciones"
import PaginaObservacionesDocente from "@/pages/docente/Observaciones"
import PaginaPerfilDocente from "@/pages/docente/Perfil"
import PaginaDashboardEstudiante from "@/pages/estudiante/Dashboard"
import PaginaCalificacionesEstudiante from "@/pages/estudiante/Calificaciones"
import PaginaAsistenciasEstudiante from "@/pages/estudiante/Asistencias"
import PaginaTareasEstudiante from "@/pages/estudiante/Tareas"
import PaginaMensajesEstudiante from "@/pages/estudiante/Mensajes"
import PaginaNotificacionesEstudiante from "@/pages/estudiante/Notificaciones"
import PaginaHistorialEstudiante from "@/pages/estudiante/Historial"
import PaginaPerfilEstudiante from "@/pages/estudiante/Perfil"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/administrador/dashboard" element={<DashboardAdministrador />} />
      <Route path="/administrador/usuarios" element={<PaginaUsuarios />} />
      <Route path="/administrador/materias" element={<PaginaMaterias />} />
      <Route path="/administrador/periodos" element={<PaginaPeriodos />} />
      <Route path="/administrador/reportes" element={<PaginaReportes />} />
      <Route path="/administrador/estadisticas" element={<PaginaEstadisticas />} />
      <Route path="/administrador/comunicacion" element={<PaginaComunicacion />} />
      <Route path="/administrador/padres" element={<PaginaPadres />} />
      <Route path="/administrador/perfil" element={<PaginaPerfilAdmin />} />

      <Route path="/docente/dashboard" element={<PaginaDashboardDocente />} />
      <Route path="/docente/calificaciones" element={<PaginaCalificacionesDocente />} />
      <Route path="/docente/asistencias" element={<PaginaAsistenciasDocente />} />
      <Route path="/docente/tareas" element={<PaginaTareasDocente />} />
      <Route path="/docente/comunicacion" element={<PaginaComunicacionDocente />} />
      <Route path="/docente/notificaciones" element={<PaginaNotificacionesDocente />} />
      <Route path="/docente/observaciones" element={<PaginaObservacionesDocente />} />
      <Route path="/docente/perfil" element={<PaginaPerfilDocente />} />

      <Route path="/estudiante/dashboard" element={<PaginaDashboardEstudiante />} />
      <Route path="/estudiante/calificaciones" element={<PaginaCalificacionesEstudiante />} />
      <Route path="/estudiante/asistencias" element={<PaginaAsistenciasEstudiante />} />
      <Route path="/estudiante/tareas" element={<PaginaTareasEstudiante />} />
      <Route path="/estudiante/mensajes" element={<PaginaMensajesEstudiante />} />
      <Route path="/estudiante/notificaciones" element={<PaginaNotificacionesEstudiante />} />
      <Route path="/estudiante/historial" element={<PaginaHistorialEstudiante />} />
      <Route path="/estudiante/perfil" element={<PaginaPerfilEstudiante />} />

      <Route path="*" element={<Home />} />
    </Routes>
  )
}

export default App
