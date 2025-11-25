import { useEffect, useMemo, useState } from "react"
import { DisenoTablero } from "@/components/layout-dashboard"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Boton } from "@/components/ui/button"
import { Entrada } from "@/components/ui/input"
import { Etiqueta } from "@/components/ui/label"
import { Tabla, CuerpoTabla, CeldaTabla, EncabezadoTabla, CabeceraTabla, FilaTabla } from "@/components/ui/table"
import { Insignia } from "@/components/ui/badge"
import { Calendar, RefreshCcw, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"

const opcionesFecha = { day: "numeric", month: "short" }

export default function PaginaPeriodos() {
  const [busqueda, setBusqueda] = useState("")
  const [resumen, setResumen] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")

  const cargarDatos = async () => {
    try {
      setCargando(true)
      setError("")
      const data = await apiClient.get("/api/Notas/periodos/resumen")
      setResumen(data)
    } catch (err) {
      setError(err.message || "No fue posible cargar los periodos")
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  const cursosFiltrados = useMemo(() => {
    if (!resumen) return []
    const termino = busqueda.toLowerCase()
    return resumen.cursos.filter((curso) => {
      const coincideCurso = curso.cursoNombre.toLowerCase().includes(termino)
      const coincideDocente = (curso.docenteNombre ?? "").toLowerCase().includes(termino)
      const coincideGrado = (curso.gradoNombre ?? "").toLowerCase().includes(termino)
      return coincideCurso || coincideDocente || coincideGrado
    })
  }, [resumen, busqueda])

  const formatearPeriodo = (fecha) =>
    new Date(fecha).toLocaleDateString("es-CO", opcionesFecha)

  return (
    <DisenoTablero rolRequerido="administrador">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Periodos Académicos</h1>
            <p className="text-muted-foreground">Conoce cómo avanzan los periodos evaluativos configurados en cada curso</p>
          </div>
          <Boton className="gap-2" onClick={cargarDatos} disabled={cargando}>
            {cargando ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
            Sincronizar periodos
          </Boton>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between space-y-0 pb-2">
              <TituloTarjeta className="text-sm font-medium">Periodo actual</TituloTarjeta>
              <Calendar className="h-4 w-4 text-green-600" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              {resumen ? (
                <>
                  <div className="text-2xl font-bold">Periodo {resumen.periodoActual}</div>
                  <p className="text-xs text-muted-foreground">
                    {formatearPeriodo(resumen.inicioPeriodoActual)} - {formatearPeriodo(resumen.finPeriodoActual)}
                  </p>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Sin datos disponibles</div>
              )}
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between space-y-0 pb-2">
              <TituloTarjeta className="text-sm font-medium">Periodos configurados</TituloTarjeta>
              <Calendar className="h-4 w-4 text-blue-600" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-2xl font-bold">{resumen?.totalPeriodosConfigurados ?? 0}</div>
              <p className="text-xs text-muted-foreground">Contando todos los cursos</p>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between space-y-0 pb-2">
              <TituloTarjeta className="text-sm font-medium">Días restantes</TituloTarjeta>
              <Calendar className="h-4 w-4 text-orange-600" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-2xl font-bold">{resumen?.diasRestantes ?? 0}</div>
              <p className="text-xs text-muted-foreground">Para finalizar el periodo en curso</p>
            </ContenidoTarjeta>
          </Tarjeta>
        </div>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Periodos configurados por curso</TituloTarjeta>
            <DescripcionTarjeta>
              {resumen
                ? `${resumen.cursosConConfig} cursos con ${resumen.evaluacionesRegistradas} evaluaciones registradas`
                : "Sin datos por mostrar"}
            </DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="space-y-2">
                <Etiqueta>Buscar</Etiqueta>
                <Entrada
                  placeholder="Curso, docente o grado"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive mb-4">{error}</p>}

            <Tabla>
              <CabeceraTabla>
                <FilaTabla>
                  <EncabezadoTabla>Curso</EncabezadoTabla>
                  <EncabezadoTabla>Docente</EncabezadoTabla>
                  <EncabezadoTabla>Periodos</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Evaluaciones</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Estado</EncabezadoTabla>
                </FilaTabla>
              </CabeceraTabla>
              <CuerpoTabla>
                {cargando ? (
                  <FilaTabla>
                    <CeldaTabla colSpan={5} className="text-center text-muted-foreground">
                      Cargando información...
                    </CeldaTabla>
                  </FilaTabla>
                ) : cursosFiltrados.length === 0 ? (
                  <FilaTabla>
                    <CeldaTabla colSpan={5} className="text-center text-muted-foreground">
                      No hay cursos configurados que coincidan con la búsqueda.
                    </CeldaTabla>
                  </FilaTabla>
                ) : (
                  cursosFiltrados.map((curso) => (
                    <FilaTabla key={curso.cursoId}>
                      <CeldaTabla>
                        <div className="font-medium">{curso.cursoNombre}</div>
                        <p className="text-xs text-muted-foreground">{curso.gradoNombre ?? "Sin grado"}</p>
                      </CeldaTabla>
                      <CeldaTabla>{curso.docenteNombre ?? "Sin docente asignado"}</CeldaTabla>
                      <CeldaTabla>
                        <div className="flex flex-wrap gap-2">
                          {curso.periodos.map((periodo) => (
                            <Insignia key={`${curso.cursoId}-${periodo.periodo}`} variant="outline" className="text-xs">
                              Periodo {periodo.periodo} · {periodo.evaluaciones} eval · {periodo.pesoTotal}%
                            </Insignia>
                          ))}
                        </div>
                      </CeldaTabla>
                      <CeldaTabla className="text-center font-semibold">{curso.totalEvaluaciones}</CeldaTabla>
                      <CeldaTabla className="text-center">
                        <Insignia variant={curso.estaCompleto ? "default" : "secondary"}>
                          {curso.estaCompleto ? "Completo" : "Pendiente"}
                        </Insignia>
                      </CeldaTabla>
                    </FilaTabla>
                  ))
                )}
              </CuerpoTabla>
            </Tabla>
          </ContenidoTarjeta>
        </Tarjeta>
      </div>
    </DisenoTablero>
  )
}
