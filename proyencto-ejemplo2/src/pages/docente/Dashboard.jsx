import { Link } from "react-router-dom"
import { DisenoTablero } from "@/components/layout-dashboard"
import { Boton } from "@/components/ui/button"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { BookOpen, Users, Bell, TrendingUp, Calendar, ClipboardCheck } from "lucide-react"

const estadisticas = [
  { titulo: "Materias Asignadas", valor: "5", descripcion: "Materias activas", icono: BookOpen, color: "text-blue-600" },
  { titulo: "Total Estudiantes", valor: "142", descripcion: "En todas las materias", icono: Users, color: "text-green-600" },
  {
    titulo: "Calificaciones Pendientes",
    valor: "23",
    descripcion: "Por registrar",
    icono: ClipboardCheck,
    color: "text-orange-600",
  },
  { titulo: "Alertas Activas", valor: "8", descripcion: "Estudiantes en riesgo", icono: Bell, color: "text-red-600" },
]

const materiasRecientes = [
  { nombre: "Matemáticas 10-A", estudiantes: 32, promedio: 3.8 },
  { nombre: "Física 11-B", estudiantes: 28, promedio: 3.5 },
  { nombre: "Química 10-C", estudiantes: 30, promedio: 4.1 },
  { nombre: "Matemáticas 11-A", estudiantes: 26, promedio: 3.9 },
  { nombre: "Física 10-B", estudiantes: 26, promedio: 3.6 },
]

export default function PaginaDashboardDocente() {
  return (
    <DisenoTablero rolRequerido="docente">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Docente</h1>
          <p className="text-muted-foreground">Bienvenido, aquí está el resumen de tu actividad académica</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {estadisticas.map((stat) => {
            const Icono = stat.icono
            return (
              <Tarjeta key={stat.titulo}>
                <EncabezadoTarjeta className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <TituloTarjeta className="text-sm font-medium">{stat.titulo}</TituloTarjeta>
                  <Icono className={`h-4 w-4 ${stat.color}`} />
                </EncabezadoTarjeta>
                <ContenidoTarjeta>
                  <div className="text-2xl font-bold">{stat.valor}</div>
                  <p className="text-xs text-muted-foreground">{stat.descripcion}</p>
                </ContenidoTarjeta>
              </Tarjeta>
            )
          })}
        </div>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Mis Materias</TituloTarjeta>
            <DescripcionTarjeta>Materias que tienes asignadas este periodo</DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <div className="space-y-4">
              {materiasRecientes.map((materia, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{materia.nombre}</p>
                      <p className="text-sm text-muted-foreground">{materia.estudiantes} estudiantes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Promedio</p>
                      <p className="text-lg font-bold">{materia.promedio}</p>
                    </div>
                    <Link to="/docente/calificaciones">
                      <Boton size="sm">Ver Detalles</Boton>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </ContenidoTarjeta>
        </Tarjeta>

        <div className="grid gap-4 md:grid-cols-2">
          <Tarjeta>
            <EncabezadoTarjeta>
              <TituloTarjeta>Acciones Rápidas</TituloTarjeta>
            </EncabezadoTarjeta>
            <ContenidoTarjeta className="space-y-2">
              <Link to="/docente/calificaciones">
                <Boton variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <ClipboardCheck className="w-4 h-4" />
                  Registrar Calificaciones
                </Boton>
              </Link>
              <Link to="/docente/asistencias">
                <Boton variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <Calendar className="w-4 h-4" />
                  Tomar Asistencia
                </Boton>
              </Link>
              <Link to="/docente/notificaciones">
                <Boton variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <Bell className="w-4 h-4" />
                  Enviar Notificación
                </Boton>
              </Link>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta>
              <TituloTarjeta>Alertas de Rendimiento</TituloTarjeta>
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium">8 estudiantes con bajo rendimiento</p>
                    <p className="text-xs text-muted-foreground">Requieren atención inmediata</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <ClipboardCheck className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium">23 calificaciones pendientes</p>
                    <p className="text-xs text-muted-foreground">Por registrar este periodo</p>
                  </div>
                </div>
              </div>
            </ContenidoTarjeta>
          </Tarjeta>
        </div>
      </div>
    </DisenoTablero>
  )
}
