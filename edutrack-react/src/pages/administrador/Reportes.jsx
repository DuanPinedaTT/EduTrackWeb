import { useEffect, useMemo, useState } from "react"
import { DisenoTablero } from "@/components/layout-dashboard"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Boton } from "@/components/ui/button"
import { Etiqueta } from "@/components/ui/label"
import { Entrada } from "@/components/ui/input"
import { Selector, ContenidoSelector, ElementoSelector, DisparadorSelector, ValorSelector } from "@/components/ui/select"
import { Tabla, CuerpoTabla, CeldaTabla, EncabezadoTabla, CabeceraTabla, FilaTabla } from "@/components/ui/table"
import { Download, RefreshCcw, Loader2, Search, BookOpen, Users, FileSpreadsheet } from "lucide-react"
import { apiClient } from "@/lib/api-client"

export default function PaginaReportes() {
  const [cursos, setCursos] = useState([])
  const [historial, setHistorial] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [gradoSeleccionado, setGradoSeleccionado] = useState("todos")
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")
  const [descargandoId, setDescargandoId] = useState(null)

  const cargarCursos = async () => {
    try {
      setCargando(true)
      setError("")
      const data = await apiClient.get("/api/Cursos")
      setCursos(data)
    } catch (err) {
      setError(err.message || "No se pudo cargar la información de los cursos")
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarCursos()
  }, [])

  const gradosDisponibles = useMemo(() => {
    const set = new Set()
    cursos.forEach((curso) => {
      if (curso.gradoNombre) {
        set.add(curso.gradoNombre)
      }
    })
    return Array.from(set)
  }, [cursos])

  const cursosFiltrados = useMemo(() => {
    const termino = busqueda.toLowerCase()
    return cursos.filter((curso) => {
      const coincideNombre = curso.nombre.toLowerCase().includes(termino)
      const coincideDocente = (curso.docenteNombre ?? "").toLowerCase().includes(termino)
      const coincideGrado = (curso.gradoNombre ?? "").toLowerCase().includes(termino)
      const coincideFiltro = gradoSeleccionado === "todos" || curso.gradoNombre === gradoSeleccionado
      return (coincideNombre || coincideDocente || coincideGrado) && coincideFiltro
    })
  }, [cursos, busqueda, gradoSeleccionado])

  const totales = useMemo(() => {
    const setDocentes = new Set()
    const setGrados = new Set()
    cursos.forEach((curso) => {
      if (curso.docenteId) setDocentes.add(curso.docenteId)
      if (curso.gradoNombre) setGrados.add(curso.gradoNombre)
    })
    return {
      cursos: cursos.length,
      docentes: setDocentes.size,
      grados: setGrados.size,
    }
  }, [cursos])

  const formatearFecha = (valor) => new Date(valor).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })

  const manejarDescargaCurso = async (curso) => {
    try {
      setDescargandoId(curso.id)
      setError("")
      const blob = await apiClient.download(`/api/Exports/course/${curso.id}/xlsx`)
      const nombreArchivo = `planilla_${curso.nombre.replace(/\s+/g, "_")}.xlsx`
      const url = window.URL.createObjectURL(blob)
      const enlace = document.createElement("a")
      enlace.href = url
      enlace.download = nombreArchivo
      document.body.appendChild(enlace)
      enlace.click()
      document.body.removeChild(enlace)
      window.URL.revokeObjectURL(url)
      setHistorial((prev) => [{ nombre: nombreArchivo, fecha: new Date().toISOString(), tipo: "Excel", curso: curso.nombre }, ...prev].slice(0, 8))
    } catch (err) {
      setError(err.message || "No se pudo descargar el reporte seleccionado")
    } finally {
      setDescargandoId(null)
    }
  }

  return (
    <DisenoTablero rolRequerido="administrador">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Generación de Reportes</h1>
            <p className="text-muted-foreground">
              Descarga planillas oficiales por curso y lleva un historial de los reportes compartidos
            </p>
          </div>
          <Boton className="gap-2" onClick={cargarCursos} disabled={cargando}>
            {cargando ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
            Sincronizar datos
          </Boton>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[{ titulo: "Cursos activos", valor: totales.cursos, descripcion: "Disponibles para exportar", icono: BookOpen }, { titulo: "Docentes asignados", valor: totales.docentes, descripcion: "Con cursos vinculados", icono: Users }, { titulo: "Grados cubiertos", valor: totales.grados, descripcion: "Con evaluaciones registradas", icono: FileSpreadsheet }].map((stat) => {
            const Icono = stat.icono
            return (
              <Tarjeta key={stat.titulo}>
                <EncabezadoTarjeta className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <TituloTarjeta className="text-sm font-medium">{stat.titulo}</TituloTarjeta>
                  <Icono className="h-4 w-4 text-primary" />
                </EncabezadoTarjeta>
                <ContenidoTarjeta>
                  <div className="text-2xl font-bold">{cargando ? "--" : stat.valor}</div>
                  <p className="text-xs text-muted-foreground">{stat.descripcion}</p>
                </ContenidoTarjeta>
              </Tarjeta>
            )
          })}
        </div>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Planillas por curso</TituloTarjeta>
            <DescripcionTarjeta>
              Exporta calificaciones oficiales en Excel directamente desde la API /api/Exports
            </DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Etiqueta>Buscar</Etiqueta>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Entrada
                    placeholder="Curso, docente o grado"
                    className="pl-10"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Etiqueta>Filtrar por grado</Etiqueta>
                <Selector value={gradoSeleccionado} onValueChange={setGradoSeleccionado}>
                  <DisparadorSelector>
                    <ValorSelector />
                  </DisparadorSelector>
                  <ContenidoSelector>
                    <ElementoSelector value="todos">Todos</ElementoSelector>
                    {gradosDisponibles.map((grado) => (
                      <ElementoSelector key={grado} value={grado}>
                        {grado}
                      </ElementoSelector>
                    ))}
                  </ContenidoSelector>
                </Selector>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Tabla>
              <CabeceraTabla>
                <FilaTabla>
                  <EncabezadoTabla>Curso</EncabezadoTabla>
                  <EncabezadoTabla>Grado</EncabezadoTabla>
                  <EncabezadoTabla>Docente</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Grupo</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Acciones</EncabezadoTabla>
                </FilaTabla>
              </CabeceraTabla>
              <CuerpoTabla>
                {cargando ? (
                  <FilaTabla>
                    <CeldaTabla colSpan={5} className="text-center text-muted-foreground">
                      Cargando cursos disponibles...
                    </CeldaTabla>
                  </FilaTabla>
                ) : cursosFiltrados.length === 0 ? (
                  <FilaTabla>
                    <CeldaTabla colSpan={5} className="text-center text-muted-foreground">
                      No hay cursos que coincidan con los filtros aplicados.
                    </CeldaTabla>
                  </FilaTabla>
                ) : (
                  cursosFiltrados.map((curso) => (
                    <FilaTabla key={curso.id}>
                      <CeldaTabla className="font-medium">{curso.nombre}</CeldaTabla>
                      <CeldaTabla>{curso.gradoNombre || "Sin grado"}</CeldaTabla>
                      <CeldaTabla>{curso.docenteNombre || "Sin docente"}</CeldaTabla>
                      <CeldaTabla className="text-center">{curso.grupo || "--"}</CeldaTabla>
                      <CeldaTabla className="text-center">
                        <Boton
                          size="sm"
                          className="gap-2"
                          onClick={() => manejarDescargaCurso(curso)}
                          disabled={descargandoId === curso.id}
                        >
                          {descargandoId === curso.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                          Exportar Excel
                        </Boton>
                      </CeldaTabla>
                    </FilaTabla>
                  ))
                )}
              </CuerpoTabla>
            </Tabla>
          </ContenidoTarjeta>
        </Tarjeta>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Historial reciente</TituloTarjeta>
            <DescripcionTarjeta>Últimos archivos descargados durante esta sesión</DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta className="space-y-3">
            {historial.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aún no se han generado reportes en esta sesión.</p>
            ) : (
              historial.map((reporte, index) => (
                <div
                  key={`${reporte.nombre}-${index}`}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{reporte.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      {reporte.curso} · {formatearFecha(reporte.fecha)}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-primary">{reporte.tipo}</span>
                </div>
              ))
            )}
          </ContenidoTarjeta>
        </Tarjeta>
      </div>
    </DisenoTablero>
  )
}
