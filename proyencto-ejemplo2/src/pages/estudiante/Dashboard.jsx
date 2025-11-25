import { DisenoTablero } from "@/components/layout-dashboard"
import { Boton } from "@/components/ui/button"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Progreso } from "@/components/ui/progress"
import { BookOpen, TrendingUp, Calendar, Award } from "lucide-react"
import { Link } from "react-router-dom"

const estadisticas = [
  { titulo: "Promedio General", valor: "4.2", descripcion: "Buen rendimiento", icono: TrendingUp, color: "text-green-600" },
  { titulo: "Materias Cursando", valor: "8", descripcion: "Materias activas", icono: BookOpen, color: "text-blue-600" },
  { titulo: "Asistencia", valor: "94%", descripcion: "Excelente asistencia", icono: Calendar, color: "text-purple-600" },
  { titulo: "Logros", valor: "12", descripcion: "Reconocimientos", icono: Award, color: "text-yellow-600" },
]

const materias = [
  { nombre: "Matemáticas", nota: 4.5, progreso: 90, color: "bg-blue-600" },
  { nombre: "Física", nota: 3.8, progreso: 76, color: "bg-green-600" },
  { nombre: "Química", nota: 4.2, progreso: 84, color: "bg-purple-600" },
  { nombre: "Inglés", nota: 4.7, progreso: 94, color: "bg-pink-600" },
  { nombre: "Historia", nota: 4.0, progreso: 80, color: "bg-orange-600" },
]

export default function PaginaDashboardEstudiante() {
  return (
    <DisenoTablero rolRequerido="estudiante">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mi Dashboard</h1>
          <p className="text-muted-foreground">Bienvenido, aquí está el resumen de tu rendimiento académico</p>
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
            <TituloTarjeta>Rendimiento por Materia</TituloTarjeta>
            <DescripcionTarjeta>Tu progreso en cada materia del periodo actual</DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <div className="space-y-6">
              {materias.map((materia) => (
                <div key={materia.nombre} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${materia.color}`} />
                      <span className="font-medium">{materia.nombre}</span>
                    </div>
                    <span className="text-lg font-bold">{materia.nota.toFixed(1)}</span>
                  </div>
                  <Progreso value={materia.progreso} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">{materia.progreso}% completado</p>
                </div>
              ))}
            </div>
          </ContenidoTarjeta>
        </Tarjeta>

        <div className="grid gap-4 md:grid-cols-2">
          <Tarjeta>
            <EncabezadoTarjeta>
              <TituloTarjeta>Próximas Actividades</TituloTarjeta>
            </EncabezadoTarjeta>
            <ContenidoTarjeta className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Examen de Matemáticas</p>
                  <p className="text-xs text-muted-foreground">Viernes 15 de Enero</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <BookOpen className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Entrega de Tarea - Física</p>
                  <p className="text-xs text-muted-foreground">Lunes 12 de Enero</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <Award className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Proyecto de Química</p>
                  <p className="text-xs text-muted-foreground">Miércoles 20 de Enero</p>
                </div>
              </div>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta>
              <TituloTarjeta>Accesos Rápidos</TituloTarjeta>
            </EncabezadoTarjeta>
            <ContenidoTarjeta className="space-y-2">
              <Link to="/estudiante/calificaciones">
                <Boton variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <BookOpen className="w-4 h-4" />
                  Ver Mis Calificaciones
                </Boton>
              </Link>
              <Link to="/estudiante/asistencias">
                <Boton variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <Calendar className="w-4 h-4" />
                  Ver Mis Asistencias
                </Boton>
              </Link>
              <Link to="/estudiante/historial">
                <Boton variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <TrendingUp className="w-4 h-4" />
                  Ver Historial Académico
                </Boton>
              </Link>
            </ContenidoTarjeta>
          </Tarjeta>
        </div>
      </div>
    </DisenoTablero>
  )
}
