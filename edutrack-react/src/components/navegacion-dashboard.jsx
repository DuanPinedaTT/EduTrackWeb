import { useEffect, useMemo, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  GraduationCap,
  LogOut,
  User,
  LayoutDashboard as LayoutDashboardIcon,
  Users,
  BookOpen,
  ClipboardList,
  BarChart3,
  Bell,
  FileText,
  Calendar,
  MessageSquare,
  ListTodo,
  UserCheck,
  Moon,
  Sun,
} from "lucide-react"
import { Boton } from "@/components/ui/button"
import { useAutenticacion } from "@/components/proveedor-autenticacion"
import { cn } from "@/lib/utils"

export function MenuNavegacion() {
  const { usuario, cerrarSesion } = useAutenticacion()
  const location = useLocation()
  const [modoOscuro, setModoOscuro] = useState(false)

  useEffect(() => {
    const modoGuardado = localStorage.getItem("modo-oscuro")
    if (modoGuardado === "true") {
      setModoOscuro(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const alternarModoOscuro = () => {
    const nuevoModo = !modoOscuro
    setModoOscuro(nuevoModo)
    localStorage.setItem("modo-oscuro", String(nuevoModo))

    if (nuevoModo) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const enlaces = useMemo(() => {
    switch (usuario?.rol) {
      case "administrador":
        return [
          { href: "/administrador/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
          { href: "/administrador/usuarios", label: "Usuarios", icon: Users },
          { href: "/administrador/materias", label: "Materias", icon: BookOpen },
          { href: "/administrador/periodos", label: "Periodos", icon: Calendar },
          { href: "/administrador/reportes", label: "Reportes", icon: FileText },
          { href: "/administrador/estadisticas", label: "Estadísticas", icon: BarChart3 },
          { href: "/administrador/comunicacion", label: "Comunicación", icon: MessageSquare },
          { href: "/administrador/padres", label: "Padres de Familia", icon: UserCheck },
        ]
      case "docente":
        return [
          { href: "/docente/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
          { href: "/docente/calificaciones", label: "Calificaciones", icon: ClipboardList },
          { href: "/docente/asistencias", label: "Asistencias", icon: Users },
          { href: "/docente/tareas", label: "Tareas", icon: ListTodo },
          { href: "/docente/comunicacion", label: "Mensajería", icon: MessageSquare },
          { href: "/docente/notificaciones", label: "Notificaciones", icon: Bell },
          { href: "/docente/observaciones", label: "Observaciones", icon: FileText },
        ]
      case "estudiante":
        return [
          { href: "/estudiante/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
          { href: "/estudiante/calificaciones", label: "Mis Calificaciones", icon: ClipboardList },
          { href: "/estudiante/asistencias", label: "Mis Asistencias", icon: Calendar },
          { href: "/estudiante/tareas", label: "Mis Tareas", icon: ListTodo },
          { href: "/estudiante/mensajes", label: "Mensajes", icon: MessageSquare },
          { href: "/estudiante/notificaciones", label: "Notificaciones", icon: Bell },
          { href: "/estudiante/historial", label: "Historial", icon: FileText },
        ]
      default:
        return []
    }
  }, [usuario?.rol])

  return (
    <div className="flex flex-col h-screen bg-card border-r">
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <span className="text-xl font-bold text-primary">EduTrack</span>
            <p className="text-xs text-muted-foreground capitalize">{usuario?.rol}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {enlaces.map((enlace) => {
          const Icono = enlace.icon
          const esActivo = location.pathname === enlace.href

          return (
            <Link key={enlace.href} to={enlace.href}>
              <Boton
                variant={esActivo ? "default" : "ghost"}
                className={cn("w-full justify-start gap-3", esActivo && "bg-primary text-primary-foreground")}
              >
                <Icono className="w-5 h-5" />
                {enlace.label}
              </Boton>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t space-y-2">
        <Boton variant="ghost" className="w-full justify-start gap-3" onClick={alternarModoOscuro}>
          {modoOscuro ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {modoOscuro ? "Modo Claro" : "Modo Oscuro"}
        </Boton>

        <Link to={`/${usuario?.rol}/perfil`}>
          <Boton variant="ghost" className="w-full justify-start gap-3">
            <User className="w-5 h-5" />
            Mi Perfil
          </Boton>
        </Link>
        <Boton
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive"
          onClick={cerrarSesion}
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </Boton>
        <div className="pt-2 border-t">
          <p className="text-sm font-medium truncate">{usuario?.nombre}</p>
          <p className="text-xs text-muted-foreground truncate">{usuario?.email}</p>
        </div>
      </div>
    </div>
  )
}

const NavegacionDashboard = MenuNavegacion

export { NavegacionDashboard }
