"use client"

import { useAutenticacion } from "./proveedor-autenticacion"
import { Button } from "./ui/button"
import {
  GraduationCap,
  LogOut,
  User,
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  BarChart3,
  Bell,
  FileText,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export const NavegacionDashboard = () => {
  const { usuario, cerrarSesion } = useAutenticacion()
  const rutaActual = usePathname()

  const obtenerEnlacesNavegacion = () => {
    switch (usuario?.rol) {
      case "administrador":
        return [
          { href: "/administrador/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { href: "/administrador/usuarios", label: "Usuarios", icon: Users },
          { href: "/administrador/materias", label: "Materias", icon: BookOpen },
          { href: "/administrador/periodos", label: "Periodos", icon: Calendar },
          { href: "/administrador/reportes", label: "Reportes", icon: FileText },
          { href: "/administrador/estadisticas", label: "Estadísticas", icon: BarChart3 },
        ]
      case "docente":
        return [
          { href: "/docente/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { href: "/docente/calificaciones", label: "Calificaciones", icon: ClipboardList },
          { href: "/docente/asistencias", label: "Asistencias", icon: Users },
          { href: "/docente/notificaciones", label: "Notificaciones", icon: Bell },
          { href: "/docente/observaciones", label: "Observaciones", icon: FileText },
        ]
      case "estudiante":
        return [
          { href: "/estudiante/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { href: "/estudiante/calificaciones", label: "Mis Calificaciones", icon: ClipboardList },
          { href: "/estudiante/asistencias", label: "Mis Asistencias", icon: Calendar },
          { href: "/estudiante/historial", label: "Historial", icon: FileText },
        ]
      default:
        return []
    }
  }

  const enlaces = obtenerEnlacesNavegacion()

  return (
    <div className="flex flex-col h-screen bg-card border-r">
      {/* Logo */}
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

      {/* Navegación */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {enlaces.map((enlace) => {
          const Icono = enlace.icon
          const esActivo = rutaActual === enlace.href

          return (
            <Link key={enlace.href} href={enlace.href}>
              <Button
                variant={esActivo ? "default" : "ghost"}
                className={cn("w-full justify-start gap-3", esActivo && "bg-primary text-primary-foreground")}
              >
                <Icono className="w-5 h-5" />
                {enlace.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Usuario y Cerrar Sesión */}
      <div className="p-4 border-t space-y-2">
        <Link href={`/${usuario?.rol}/perfil`}>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <User className="w-5 h-5" />
            Mi Perfil
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive"
          onClick={cerrarSesion}
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </Button>
        <div className="pt-2 border-t">
          <p className="text-sm font-medium truncate">{usuario?.nombre}</p>
          <p className="text-xs text-muted-foreground truncate">{usuario?.email}</p>
        </div>
      </div>
    </div>
  )
}
