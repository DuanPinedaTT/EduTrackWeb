import { useEffect, useMemo, useState } from "react"
import { DisenoTablero } from "@/components/layout-dashboard"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Boton } from "@/components/ui/button"
import { Entrada } from "@/components/ui/input"
import { Etiqueta } from "@/components/ui/label"
import { Tabla, CuerpoTabla, CeldaTabla, EncabezadoTabla, CabeceraTabla, FilaTabla } from "@/components/ui/table"
import { Insignia } from "@/components/ui/badge"
import { Plus, Search, Trash2, Loader2 } from "lucide-react"
import { Dialogo, ContenidoDialogo, DescripcionDialogo, EncabezadoDialogo, TituloDialogo, ActivadorDialogo } from "@/components/ui/dialog"
import { apiClient } from "@/lib/api-client"

const formularioInicial = { nombre: "", codigo: "" }

export default function PaginaMaterias() {
  const [busqueda, setBusqueda] = useState("")
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [materias, setMaterias] = useState([])
  const [asignaciones, setAsignaciones] = useState([])
  const [formulario, setFormulario] = useState(formularioInicial)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")
  const [guardando, setGuardando] = useState(false)
  const [eliminando, setEliminando] = useState(null)

  const cargarDatos = async () => {
    try {
      setCargando(true)
      setError("")
      const [materiasResponse, asignacionesResponse] = await Promise.all([
        apiClient.get("/api/Asignaturas"),
        apiClient.get("/api/CursoAsignaturas"),
      ])

      setMaterias(materiasResponse)
      setAsignaciones(asignacionesResponse)
    } catch (err) {
      setError(err.message || "No fue posible cargar las materias")
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  const resumenAsignaciones = useMemo(() => {
    const map = new Map()
    asignaciones.forEach((item) => {
      const actual = map.get(item.asignaturaId) || { cursos: new Set(), docentes: new Set() }
      actual.cursos.add(item.cursoId)
      if (item.docenteNombre) {
        actual.docentes.add(item.docenteNombre)
      }
      map.set(item.asignaturaId, actual)
    })
    return map
  }, [asignaciones])

  const materiasFiltradas = useMemo(() => {
    const termino = busqueda.toLowerCase()
    return materias.filter((materia) =>
      materia.nombre.toLowerCase().includes(termino) || materia.codigo.toLowerCase().includes(termino),
    )
  }, [materias, busqueda])

  const manejarCambioFormulario = (campo, valor) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }))
  }

  const manejarGuardar = async (event) => {
    event.preventDefault()
    try {
      setGuardando(true)
      await apiClient.post("/api/Asignaturas", {
        nombre: formulario.nombre,
        codigo: formulario.codigo,
      })
      setDialogoAbierto(false)
      setFormulario(formularioInicial)
      await cargarDatos()
    } catch (err) {
      setError(err.message || "No se pudo registrar la materia")
    } finally {
      setGuardando(false)
    }
  }

  const manejarEliminar = async (id) => {
    try {
      setEliminando(id)
      await apiClient.del(`/api/Asignaturas/${id}`)
      await cargarDatos()
    } catch (err) {
      setError(err.message || "No se pudo eliminar la materia")
    } finally {
      setEliminando(null)
    }
  }

  return (
    <DisenoTablero rolRequerido="administrador">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Materias</h1>
            <p className="text-muted-foreground">Administra las materias del sistema</p>
          </div>
          <Dialogo open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
            <ActivadorDialogo asChild>
              <Boton className="gap-2">
                <Plus className="w-4 h-4" />
                Nueva Materia
              </Boton>
            </ActivadorDialogo>
            <ContenidoDialogo>
              <EncabezadoDialogo>
                <TituloDialogo>Registrar Nueva Materia</TituloDialogo>
                <DescripcionDialogo>Ingresa los datos de la nueva materia</DescripcionDialogo>
              </EncabezadoDialogo>
              <form className="space-y-4 py-4" onSubmit={manejarGuardar}>
                <div className="space-y-2">
                  <Etiqueta htmlFor="nombre">Nombre de la Materia</Etiqueta>
                  <Entrada
                    id="nombre"
                    placeholder="Ej: Matemáticas"
                    value={formulario.nombre}
                    onChange={(e) => manejarCambioFormulario("nombre", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Etiqueta htmlFor="codigo">Código</Etiqueta>
                  <Entrada
                    id="codigo"
                    placeholder="Ej: MAT-101"
                    value={formulario.codigo}
                    onChange={(e) => manejarCambioFormulario("codigo", e.target.value)}
                    required
                  />
                </div>
                <Boton className="w-full gap-2" type="submit" disabled={guardando}>
                  {guardando && <Loader2 className="w-4 h-4 animate-spin" />}
                  Guardar Materia
                </Boton>
              </form>
            </ContenidoDialogo>
          </Dialogo>
        </div>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Filtros</TituloTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Etiqueta>Buscar</Etiqueta>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Entrada
                    placeholder="Buscar materia..."
                    className="pl-9"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </ContenidoTarjeta>
        </Tarjeta>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Lista de Materias</TituloTarjeta>
            <DescripcionTarjeta>
              {cargando ? "Cargando materias..." : `Total: ${materias.length} materias registradas`}
            </DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            {error && <p className="text-sm text-destructive mb-4">{error}</p>}
            <Tabla>
              <CabeceraTabla>
                <FilaTabla>
                  <EncabezadoTabla>Código</EncabezadoTabla>
                  <EncabezadoTabla>Materia</EncabezadoTabla>
                  <EncabezadoTabla>Docentes Asignados</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Cursos</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Acciones</EncabezadoTabla>
                </FilaTabla>
              </CabeceraTabla>
              <CuerpoTabla>
                {cargando ? (
                  <FilaTabla>
                    <CeldaTabla colSpan={5} className="text-center text-muted-foreground">
                      Cargando información...
                    </CeldaTabla>
                  </FilaTabla>
                ) : materiasFiltradas.length === 0 ? (
                  <FilaTabla>
                    <CeldaTabla colSpan={5} className="text-center text-muted-foreground">
                      No hay materias que coincidan con la búsqueda.
                    </CeldaTabla>
                  </FilaTabla>
                ) : (
                  materiasFiltradas.map((materia) => {
                    const resumen = resumenAsignaciones.get(materia.id)
                    const docentes = resumen ? Array.from(resumen.docentes) : []
                    const totalCursos = resumen ? resumen.cursos.size : 0

                    return (
                      <FilaTabla key={materia.id}>
                        <CeldaTabla className="font-mono">{materia.codigo}</CeldaTabla>
                        <CeldaTabla className="font-medium">{materia.nombre}</CeldaTabla>
                        <CeldaTabla>
                          {docentes.length === 0 ? (
                            <span className="text-muted-foreground text-sm">Sin docente asignado</span>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {docentes.map((docente) => (
                                <Insignia key={docente} variant="outline">
                                  {docente}
                                </Insignia>
                              ))}
                            </div>
                          )}
                        </CeldaTabla>
                        <CeldaTabla className="text-center">{totalCursos}</CeldaTabla>
                        <CeldaTabla>
                          <div className="flex items-center justify-center gap-2">
                            <Boton
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => manejarEliminar(materia.id)}
                              disabled={eliminando === materia.id}
                            >
                              {eliminando === materia.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Boton>
                          </div>
                        </CeldaTabla>
                      </FilaTabla>
                    )
                  })
                )}
              </CuerpoTabla>
            </Tabla>
          </ContenidoTarjeta>
        </Tarjeta>
      </div>
    </DisenoTablero>
  )
}
