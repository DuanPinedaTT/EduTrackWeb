import { DisenoTablero } from "@/components/layout-dashboard"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Etiqueta } from "@/components/ui/label"
import { Selector, ContenidoSelector, ElementoSelector, DisparadorSelector, ValorSelector } from "@/components/ui/select"
import { BarChart3, TrendingUp, Users } from "lucide-react"

const rendimientosMaterias = [
  { materia: "Matemáticas", promedio: 3.8, color: "bg-blue-600" },
  { materia: "Física", promedio: 3.6, color: "bg-green-600" },
  { materia: "Química", promedio: 4.1, color: "bg-purple-600" },
  { materia: "Inglés", promedio: 4.3, color: "bg-pink-600" },
  { materia: "Historia", promedio: 3.9, color: "bg-orange-600" },
]

const distribucionNotas = [
  { rango: "Excelente (4.5 - 5.0)", cantidad: 45, porcentaje: 30, color: "bg-green-600" },
  { rango: "Bueno (3.5 - 4.4)", cantidad: 78, porcentaje: 52, color: "bg-blue-600" },
  { rango: "Aceptable (3.0 - 3.4)", cantidad: 15, porcentaje: 10, color: "bg-orange-600" },
  { rango: "Bajo (< 3.0)", cantidad: 12, porcentaje: 8, color: "bg-red-600" },
]

export default function PaginaEstadisticas() {
  return (
    <DisenoTablero rolRequerido="administrador">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Estadísticas y Análisis</h1>
          <p className="text-muted-foreground">Visualiza el rendimiento académico general</p>
        </div>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Filtros</TituloTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Etiqueta>Periodo</Etiqueta>
                <Selector defaultValue="1">
                  <DisparadorSelector>
                    <ValorSelector />
                  </DisparadorSelector>
                  <ContenidoSelector>
                    <ElementoSelector value="1">Primer Periodo</ElementoSelector>
                    <ElementoSelector value="2">Segundo Periodo</ElementoSelector>
                    <ElementoSelector value="3">Tercer Periodo</ElementoSelector>
                  </ContenidoSelector>
                </Selector>
              </div>
              <div className="space-y-2">
                <Etiqueta>Grado</Etiqueta>
                <Selector defaultValue="todos">
                  <DisparadorSelector>
                    <ValorSelector />
                  </DisparadorSelector>
                  <ContenidoSelector>
                    <ElementoSelector value="todos">Todos los grados</ElementoSelector>
                    <ElementoSelector value="10">10° Grado</ElementoSelector>
                    <ElementoSelector value="11">11° Grado</ElementoSelector>
                  </ContenidoSelector>
                </Selector>
              </div>
              <div className="space-y-2">
                <Etiqueta>Materia</Etiqueta>
                <Selector defaultValue="todas">
                  <DisparadorSelector>
                    <ValorSelector />
                  </DisparadorSelector>
                  <ContenidoSelector>
                    <ElementoSelector value="todas">Todas las materias</ElementoSelector>
                    <ElementoSelector value="mat">Matemáticas</ElementoSelector>
                    <ElementoSelector value="fis">Física</ElementoSelector>
                  </ContenidoSelector>
                </Selector>
              </div>
            </div>
          </ContenidoTarjeta>
        </Tarjeta>

        <div className="grid gap-4 md:grid-cols-4">
          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between space-y-0 pb-2">
              <TituloTarjeta className="text-sm font-medium">Promedio General</TituloTarjeta>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-2xl font-bold text-green-600">3.9</div>
              <p className="text-xs text-muted-foreground">+0.2 vs periodo anterior</p>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between space-y-0 pb-2">
              <TituloTarjeta className="text-sm font-medium">Estudiantes Destacados</TituloTarjeta>
              <Users className="h-4 w-4 text-blue-600" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">Promedio ≥ 4.5</p>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between space-y-0 pb-2">
              <TituloTarjeta className="text-sm font-medium">En Riesgo</TituloTarjeta>
              <Users className="h-4 w-4 text-red-600" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-2xl font-bold text-red-600">12</div>
              <p className="text-xs text-muted-foreground">Promedio {"<"} 3.0</p>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between space-y-0 pb-2">
              <TituloTarjeta className="text-sm font-medium">Asistencia</TituloTarjeta>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">Promedio institucional</p>
            </ContenidoTarjeta>
          </Tarjeta>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Tarjeta>
            <EncabezadoTarjeta>
              <TituloTarjeta>Rendimiento por Materia</TituloTarjeta>
              <DescripcionTarjeta>Promedios del primer periodo</DescripcionTarjeta>
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="space-y-4">
                {rendimientosMaterias.map((item) => (
                  <div key={item.materia} className="flex items-center gap-4">
                    <div className="w-32 font-medium">{item.materia}</div>
                    <div className="flex-1 bg-secondary rounded-full h-3 overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${(item.promedio / 5) * 100}%` }} />
                    </div>
                    <div className="w-12 text-right font-bold">{item.promedio.toFixed(1)}</div>
                  </div>
                ))}
              </div>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta>
              <TituloTarjeta>Distribución de Calificaciones</TituloTarjeta>
              <DescripcionTarjeta>Estudiantes por rango de notas</DescripcionTarjeta>
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="space-y-4">
                {distribucionNotas.map((item) => (
                  <div key={item.rango} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{item.rango}</span>
                      <span className="font-bold">
                        {item.cantidad} ({item.porcentaje}%)
                      </span>
                    </div>
                    <div className="bg-secondary rounded-full h-2 overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.porcentaje}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </ContenidoTarjeta>
          </Tarjeta>
        </div>
      </div>
    </DisenoTablero>
  )
}
