import { DisenoTablero } from "@/components/layout-dashboard"
import { Insignia } from "@/components/ui/badge"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Progreso } from "@/components/ui/progress"
import { Calendar, Check, Clock, TrendingUp, X } from "lucide-react"

const asistenciasPorMateria = [
  { materia: "Matemáticas", presentes: 45, ausentes: 2, tardes: 1, porcentaje: 94 },
  { materia: "Física", presentes: 43, ausentes: 3, tardes: 2, porcentaje: 90 },
  { materia: "Química", presentes: 46, ausentes: 1, tardes: 1, porcentaje: 96 },
  { materia: "Inglés", presentes: 47, ausentes: 1, tardes: 0, porcentaje: 98 },
  { materia: "Historia", presentes: 44, ausentes: 2, tardes: 2, porcentaje: 92 },
  { materia: "Educación Física", presentes: 48, ausentes: 0, tardes: 0, porcentaje: 100 },
]

const asistenciasRecientes = [
  { fecha: "2025-01-10", materia: "Matemáticas", estado: "Presente" },
  { fecha: "2025-01-10", materia: "Física", estado: "Presente" },
  { fecha: "2025-01-09", materia: "Química", estado: "Presente" },
  { fecha: "2025-01-09", materia: "Inglés", estado: "Tarde" },
  { fecha: "2025-01-08", materia: "Historia", estado: "Presente" },
  { fecha: "2025-01-08", materia: "Matemáticas", estado: "Ausente" },
]

const obtenerIconoEstado = (estado) => {
  if (estado === "Presente") return <Check className="w-4 h-4 text-green-600" />
  if (estado === "Ausente") return <X className="w-4 h-4 text-red-600" />
  if (estado === "Tarde") return <Clock className="w-4 h-4 text-orange-600" />
  return null
}

const obtenerVarianteEstado = (estado) => {
  if (estado === "Presente") return "default"
  if (estado === "Ausente") return "destructive"
  if (estado === "Tarde") return "secondary"
  return "outline"
}

export default function PaginaAsistenciasEstudiante() {
  const porcentajeGeneral = Math.round(
    asistenciasPorMateria.reduce((acumulado, materia) => acumulado + materia.porcentaje, 0) /
      asistenciasPorMateria.length,
  )

  return (
    <DisenoTablero rolRequerido="estudiante">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mis Asistencias</h1>
          <p className="text-muted-foreground">Consulta tu registro de asistencia por materia</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between space-y-0 pb-2">
              <TituloTarjeta className="text-sm font-medium">Asistencia General</TituloTarjeta>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-3xl font-bold text-green-600">{porcentajeGeneral}%</div>
              <p className="text-xs text-muted-foreground">Excelente asistencia</p>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between space-y-0 pb-2">
              <TituloTarjeta className="text-sm font-medium">Clases Presentes</TituloTarjeta>
              <Check className="h-4 w-4 text-green-600" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-3xl font-bold">273</div>
              <p className="text-xs text-muted-foreground">Total de asistencias</p>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between space-y-0 pb-2">
              <TituloTarjeta className="text-sm font-medium">Ausencias</TituloTarjeta>
              <X className="h-4 w-4 text-red-600" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-3xl font-bold text-red-600">9</div>
              <p className="text-xs text-muted-foreground">Faltas registradas</p>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between space-y-0 pb-2">
              <TituloTarjeta className="text-sm font-medium">Llegadas Tarde</TituloTarjeta>
              <Clock className="h-4 w-4 text-orange-600" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-3xl font-bold text-orange-600">6</div>
              <p className="text-xs text-muted-foreground">Retardos</p>
            </ContenidoTarjeta>
          </Tarjeta>
        </div>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Asistencia por Materia</TituloTarjeta>
            <DescripcionTarjeta>Desglose de tu asistencia en cada materia</DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <div className="space-y-6">
              {asistenciasPorMateria.map((materia) => (
                <div key={materia.materia} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{materia.materia}</h4>
                    <span className="text-lg font-bold text-green-600">{materia.porcentaje}%</span>
                  </div>
                  <Progreso value={materia.porcentaje} className="h-2" />
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-green-600" />
                      {materia.presentes} presentes
                    </span>
                    <span className="flex items-center gap-1">
                      <X className="w-3 h-3 text-red-600" />
                      {materia.ausentes} ausentes
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-orange-600" />
                      {materia.tardes} tardes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ContenidoTarjeta>
        </Tarjeta>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Registro Reciente</TituloTarjeta>
            <DescripcionTarjeta>Tus últimas asistencias registradas</DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <div className="space-y-3">
              {asistenciasRecientes.map((registro, index) => (
                <div
                  key={`${registro.fecha}-${index}`}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{registro.materia}</p>
                      <p className="text-sm text-muted-foreground">{new Date(registro.fecha).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Insignia variant={obtenerVarianteEstado(registro.estado)} className="gap-1">
                    {obtenerIconoEstado(registro.estado)}
                    {registro.estado}
                  </Insignia>
                </div>
              ))}
            </div>
          </ContenidoTarjeta>
        </Tarjeta>
      </div>
    </DisenoTablero>
  )
}
