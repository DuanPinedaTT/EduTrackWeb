import { useEffect, useMemo, useState } from "react"
import { DisenoTablero } from "@/components/layout-dashboard"
import { Insignia } from "@/components/ui/badge"
import { Boton } from "@/components/ui/button"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import {
  Dialogo,
  ContenidoDialogo,
  DescripcionDialogo,
  EncabezadoDialogo,
  TituloDialogo,
  ActivadorDialogo,
} from "@/components/ui/dialog"
import { Entrada } from "@/components/ui/input"
import { Etiqueta } from "@/components/ui/label"
import { Selector, ContenidoSelector, ElementoSelector, DisparadorSelector, ValorSelector } from "@/components/ui/select"
import { Pestanas, ContenidoPestanas, ListaPestanas, DisparadorPestanas } from "@/components/ui/tabs"
import { Calendar, CheckCircle, Clock, ClipboardList, ListTodo, Loader2, Plus } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useAutenticacion } from "@/components/proveedor-autenticacion"

const tareaInicial = { nombre: "", periodo: "1", peso: "25", orden: "1" }

export default function PaginaTareasDocente() {
  const { usuario } = useAutenticacion()
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [nuevaTarea, setNuevaTarea] = useState(tareaInicial)
  const [cursos, setCursos] = useState([])
  const [cursoSeleccionado, setCursoSeleccionado] = useState("")
  const [evaluaciones, setEvaluaciones] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!usuario?.id) return
    const cargarCursos = async () => {
      try {
        setError("")
        const data = await apiClient.get("/api/Cursos")
        const asignados = data.filter((curso) => curso.docenteId === usuario.id)
        setCursos(asignados)
        if (asignados.length > 0) {
          setCursoSeleccionado(asignados[0].id.toString())
        }
      } catch (err) {
        setError(err.message || "No se pudieron cargar tus cursos")
      }
    }
    cargarCursos()
  }, [usuario?.id])

  const cargarEvaluaciones = async (cursoId) => {
    if (!cursoId) {
      setEvaluaciones([])
      return
    }
    try {
      setCargando(true)
      setError("")
      const data = await apiClient.get(`/api/Notas/curso/${cursoId}/config`)
      setEvaluaciones(data)
    } catch (err) {
      setError(err.message || "No se pudieron cargar las actividades evaluativas")
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    if (cursoSeleccionado) {
      cargarEvaluaciones(Number(cursoSeleccionado))
    }
  }, [cursoSeleccionado])

  const crearTarea = async (evento) => {
    evento.preventDefault()
    if (!cursoSeleccionado) return
    try {
      setCargando(true)
      setError("")
      await apiClient.post(`/api/Notas/curso/${cursoSeleccionado}/config`, {
        nombre: nuevaTarea.nombre,
        periodo: Number(nuevaTarea.periodo),
        peso: Number(nuevaTarea.peso),
        orden: Number(nuevaTarea.orden),
      })
      setNuevaTarea(tareaInicial)
      setDialogoAbierto(false)
      await cargarEvaluaciones(Number(cursoSeleccionado))
    } catch (err) {
      setError(err.message || "No se pudo crear la tarea")
    } finally {
      setCargando(false)
    }
  }

  const tareasOrdenadas = useMemo(() => {
    return [...evaluaciones].sort((a, b) => (a.periodo - b.periodo) || (a.orden - b.orden))
  }, [evaluaciones])

  const totalPeso = evaluaciones.reduce((acc, tarea) => acc + Number(tarea.peso), 0)
  const periodosUnicos = new Set(evaluaciones.map((tarea) => tarea.periodo))
  const cursoActual = cursos.find((curso) => curso.id.toString() === cursoSeleccionado)

  return (
    <DisenoTablero rolRequerido="docente">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Tareas</h1>
            <p className="text-muted-foreground">Cada tarea se sincroniza con las configuraciones reales de evaluación</p>
          </div>
          <Dialogo open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
            <ActivadorDialogo asChild>
              <Boton disabled={!cursoSeleccionado}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Tarea
              </Boton>
            </ActivadorDialogo>
            <ContenidoDialogo className="max-w-2xl">
              <EncabezadoDialogo>
                <TituloDialogo>Crear Nueva Tarea</TituloDialogo>
                <DescripcionDialogo>Se registrará como una nueva evaluación en /api/Notas/curso/{cursoSeleccionado}/config</DescripcionDialogo>
              </EncabezadoDialogo>
              <form className="space-y-4" onSubmit={crearTarea}>
                <div className="space-y-2">
                  <Etiqueta htmlFor="titulo">Nombre de la actividad</Etiqueta>
                  <Entrada
                    id="titulo"
                    placeholder="Ej: Proyecto de laboratorio"
                    value={nuevaTarea.nombre}
                    onChange={(e) => setNuevaTarea({ ...nuevaTarea, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Etiqueta>Periodo</Etiqueta>
                    <Entrada
                      type="number"
                      min="1"
                      max="4"
                      value={nuevaTarea.periodo}
                      onChange={(e) => setNuevaTarea({ ...nuevaTarea, periodo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Etiqueta>Peso (%)</Etiqueta>
                    <Entrada
                      type="number"
                      min="1"
                      max="100"
                      value={nuevaTarea.peso}
                      onChange={(e) => setNuevaTarea({ ...nuevaTarea, peso: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Etiqueta>Orden</Etiqueta>
                    <Entrada
                      type="number"
                      min="1"
                      value={nuevaTarea.orden}
                      onChange={(e) => setNuevaTarea({ ...nuevaTarea, orden: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Boton type="submit" className="w-full gap-2" disabled={!cursoSeleccionado || cargando}>
                  {cargando ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Crear evaluación
                </Boton>
              </form>
            </ContenidoDialogo>
          </Dialogo>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Curso activo</TituloTarjeta>
            <DescripcionTarjeta>Las tareas se crearán para el curso seleccionado</DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta className="space-y-4">
            <div className="space-y-2">
              <Etiqueta>Curso</Etiqueta>
              <Selector value={cursoSeleccionado} onValueChange={setCursoSeleccionado} disabled={cursos.length === 0}>
                <DisparadorSelector>
                  <ValorSelector placeholder={cursos.length === 0 ? "Sin cursos asignados" : "Selecciona un curso"} />
                </DisparadorSelector>
                <ContenidoSelector>
                  {cursos.length === 0 && <ElementoSelector value="">Sin cursos disponibles</ElementoSelector>}
                  {cursos.map((curso) => (
                    <ElementoSelector key={curso.id} value={curso.id.toString()}>
                      {curso.nombre}
                    </ElementoSelector>
                  ))}
                </ContenidoSelector>
              </Selector>
            </div>
            <p className="text-sm text-muted-foreground">
              {cursoActual ? `${cursoActual.nombre} · ${cursoActual.gradoNombre || "Sin grado"}` : "Aún no tienes cursos asignados"}
            </p>
          </ContenidoTarjeta>
        </Tarjeta>

        <div className="grid gap-4 md:grid-cols-3">
          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between pb-2">
              <TituloTarjeta className="text-sm font-medium">Tareas Activas</TituloTarjeta>
              <ListTodo className="h-4 w-4 text-primary" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-2xl font-bold">{evaluaciones.length}</div>
              <p className="text-xs text-muted-foreground">Evaluaciones configuradas</p>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between pb-2">
              <TituloTarjeta className="text-sm font-medium">Entregas Pendientes</TituloTarjeta>
              <Clock className="h-4 w-4 text-destructive" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-2xl font-bold">{Math.max(0, 100 - totalPeso)}%</div>
              <p className="text-xs text-muted-foreground">Peso disponible del plan</p>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between pb-2">
              <TituloTarjeta className="text-sm font-medium">Tareas Completadas</TituloTarjeta>
              <CheckCircle className="h-4 w-4 text-secondary" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-2xl font-bold">{periodosUnicos.size}</div>
              <p className="text-xs text-muted-foreground">Periodos cubiertos</p>
            </ContenidoTarjeta>
          </Tarjeta>
        </div>

        <Pestanas defaultValue="activas" className="space-y-4">
          <ListaPestanas>
            <DisparadorPestanas value="activas">Activas</DisparadorPestanas>
            <DisparadorPestanas value="configuracion">Configuración</DisparadorPestanas>
          </ListaPestanas>

          <ContenidoPestanas value="activas" className="space-y-4">
            {cargando ? (
              <Tarjeta>
                <ContenidoTarjeta className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" /> Cargando tareas...
                </ContenidoTarjeta>
              </Tarjeta>
            ) : tareasOrdenadas.length === 0 ? (
              <Tarjeta>
                <ContenidoTarjeta className="text-sm text-muted-foreground">
                  Aún no tienes actividades registradas en este curso.
                </ContenidoTarjeta>
              </Tarjeta>
            ) : (
              tareasOrdenadas.map((tarea) => (
                <Tarjeta key={tarea.id}>
                  <EncabezadoTarjeta>
                    <div className="flex items-start justify-between">
                      <div>
                        <TituloTarjeta>{tarea.nombre}</TituloTarjeta>
                        <DescripcionTarjeta>Periodo {tarea.periodo} · Orden {tarea.orden}</DescripcionTarjeta>
                      </div>
                      <Insignia variant={tarea.peso >= 30 ? "default" : "secondary"}>{tarea.peso}%</Insignia>
                    </div>
                  </EncabezadoTarjeta>
                  <ContenidoTarjeta className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Evaluación vinculada al periodo {tarea.periodo}</span>
                    </div>
                    <Boton variant="outline" size="sm" className="gap-2" disabled>
                      <ClipboardList className="w-4 h-4" />
                      Entregas (próximamente)
                    </Boton>
                  </ContenidoTarjeta>
                </Tarjeta>
              ))
            )}
          </ContenidoPestanas>

          <ContenidoPestanas value="configuracion">
            <Tarjeta>
              <EncabezadoTarjeta>
                <TituloTarjeta>Resumen de configuración</TituloTarjeta>
                <DescripcionTarjeta>Listado resumido de pesos por periodo</DescripcionTarjeta>
              </EncabezadoTarjeta>
              <ContenidoTarjeta className="space-y-2 text-sm">
                {[...periodosUnicos]
                  .sort()
                  .map((periodo) => {
                    const pesoPeriodo = evaluaciones
                      .filter((tarea) => tarea.periodo === periodo)
                      .reduce((acc, tarea) => acc + Number(tarea.peso), 0)
                    return (
                      <div key={periodo} className="flex items-center justify-between border rounded-lg px-3 py-2">
                        <span>Periodo {periodo}</span>
                        <Insignia variant={pesoPeriodo >= 100 ? "default" : "secondary"}>{pesoPeriodo}%</Insignia>
                      </div>
                    )
                  })}
                {periodosUnicos.size === 0 && (
                  <p className="text-muted-foreground">Aún no hay periodos configurados.</p>
                )}
              </ContenidoTarjeta>
            </Tarjeta>
          </ContenidoPestanas>
        </Pestanas>
      </div>
    </DisenoTablero>
  )
}
