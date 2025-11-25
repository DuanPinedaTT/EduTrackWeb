import { DisenoTablero } from "@/components/layout-dashboard"
import { Insignia } from "@/components/ui/badge"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Etiqueta } from "@/components/ui/label"
import { Selector, ContenidoSelector, ElementoSelector, DisparadorSelector, ValorSelector } from "@/components/ui/select"
import { Tabla, CuerpoTabla, CeldaTabla, EncabezadoTabla, CabeceraTabla, FilaTabla } from "@/components/ui/table"
import { BookOpen, TrendingUp } from "lucide-react"

const calificaciones = [
  { materia: "Matemáticas", periodo1: 4.5, periodo2: 4.3, periodo3: 4.7, promedio: 4.5, estado: "Aprobado" },
  { materia: "Física", periodo1: 3.8, periodo2: 3.5, periodo3: 4.0, promedio: 3.8, estado: "Aprobado" },
  { materia: "Química", periodo1: 4.2, periodo2: 4.4, periodo3: 4.0, promedio: 4.2, estado: "Aprobado" },
  { materia: "Inglés", periodo1: 4.7, periodo2: 4.8, periodo3: 4.6, promedio: 4.7, estado: "Aprobado" },
  { materia: "Historia", periodo1: 4.0, periodo2: 3.9, periodo3: 4.1, promedio: 4.0, estado: "Aprobado" },
  { materia: "Educación Física", periodo1: 4.8, periodo2: 4.9, periodo3: 4.7, promedio: 4.8, estado: "Aprobado" },
]

const obtenerColorNota = (nota) => {
  if (nota >= 4.5) return "text-green-600 font-bold"
  if (nota >= 3.5) return "text-blue-600"
  if (nota >= 3.0) return "text-orange-600"
  return "text-red-600 font-bold"
}

export default function PaginaCalificacionesEstudiante() {
  const promedioGeneral = (
    calificaciones.reduce((acumulado, calificacion) => acumulado + calificacion.promedio, 0) / calificaciones.length
  ).toFixed(2)

  return (
    <DisenoTablero rolRequerido="estudiante">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mis Calificaciones</h1>
          <p className="text-muted-foreground">Consulta tus calificaciones por materia y periodo</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between space-y-0 pb-2">
              <TituloTarjeta className="text-sm font-medium">Promedio General</TituloTarjeta>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-3xl font-bold text-green-600">{promedioGeneral}</div>
              <p className="text-xs text-muted-foreground">Excelente rendimiento</p>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between space-y-0 pb-2">
              <TituloTarjeta className="text-sm font-medium">Materias Aprobadas</TituloTarjeta>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-3xl font-bold">6/6</div>
              <p className="text-xs text-muted-foreground">100% de aprobación</p>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between space-y-0 pb-2">
              <TituloTarjeta className="text-sm font-medium">Mejor Materia</TituloTarjeta>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-3xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">Educación Física</p>
            </ContenidoTarjeta>
          </Tarjeta>
        </div>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Filtros</TituloTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Etiqueta>Año Académico</Etiqueta>
                <Selector defaultValue="2025">
                  <DisparadorSelector>
                    <ValorSelector />
                  </DisparadorSelector>
                  <ContenidoSelector>
                    <ElementoSelector value="2025">2025</ElementoSelector>
                    <ElementoSelector value="2024">2024</ElementoSelector>
                  </ContenidoSelector>
                </Selector>
              </div>
              <div className="space-y-2">
                <Etiqueta>Periodo</Etiqueta>
                <Selector defaultValue="todos">
                  <DisparadorSelector>
                    <ValorSelector />
                  </DisparadorSelector>
                  <ContenidoSelector>
                    <ElementoSelector value="todos">Todos los periodos</ElementoSelector>
                    <ElementoSelector value="1">Primer Periodo</ElementoSelector>
                    <ElementoSelector value="2">Segundo Periodo</ElementoSelector>
                    <ElementoSelector value="3">Tercer Periodo</ElementoSelector>
                  </ContenidoSelector>
                </Selector>
              </div>
            </div>
          </ContenidoTarjeta>
        </Tarjeta>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Calificaciones por Materia</TituloTarjeta>
            <DescripcionTarjeta>Año Académico 2025 - Todos los periodos</DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <Tabla>
              <CabeceraTabla>
                <FilaTabla>
                  <EncabezadoTabla>Materia</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Periodo 1</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Periodo 2</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Periodo 3</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Promedio</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Estado</EncabezadoTabla>
                </FilaTabla>
              </CabeceraTabla>
              <CuerpoTabla>
                {calificaciones.map((calificacion) => (
                  <FilaTabla key={calificacion.materia}>
                    <CeldaTabla className="font-medium">{calificacion.materia}</CeldaTabla>
                    <CeldaTabla className={`text-center ${obtenerColorNota(calificacion.periodo1)}`}>
                      {calificacion.periodo1.toFixed(1)}
                    </CeldaTabla>
                    <CeldaTabla className={`text-center ${obtenerColorNota(calificacion.periodo2)}`}>
                      {calificacion.periodo2.toFixed(1)}
                    </CeldaTabla>
                    <CeldaTabla className={`text-center ${obtenerColorNota(calificacion.periodo3)}`}>
                      {calificacion.periodo3.toFixed(1)}
                    </CeldaTabla>
                    <CeldaTabla className={`text-center ${obtenerColorNota(calificacion.promedio)}`}>
                      {calificacion.promedio.toFixed(1)}
                    </CeldaTabla>
                    <CeldaTabla className="text-center">
                      <Insignia>{calificacion.estado}</Insignia>
                    </CeldaTabla>
                  </FilaTabla>
                ))}
              </CuerpoTabla>
            </Tabla>
          </ContenidoTarjeta>
        </Tarjeta>
      </div>
    </DisenoTablero>
  )
}
