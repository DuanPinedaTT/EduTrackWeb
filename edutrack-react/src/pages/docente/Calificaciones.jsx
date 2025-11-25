import { useEffect, useMemo, useState } from "react"
import { DisenoTablero } from "@/components/layout-dashboard"
import { Insignia } from "@/components/ui/badge"
import { Boton } from "@/components/ui/button"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Entrada } from "@/components/ui/input"
import { Etiqueta } from "@/components/ui/label"
import { Selector, ContenidoSelector, ElementoSelector, DisparadorSelector, ValorSelector } from "@/components/ui/select"
import { Tabla, CuerpoTabla, CeldaTabla, EncabezadoTabla, CabeceraTabla, FilaTabla } from "@/components/ui/table"
import { Loader2, RefreshCcw, Search } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useAutenticacion } from "@/components/proveedor-autenticacion"

const formConfigInicial = { nombre: "", periodo: "1", peso: "25", orden: "1" }

export default function PaginaCalificacionesDocente() {
  const { usuario } = useAutenticacion()
  const [cursos, setCursos] = useState([])
  const [cursoSeleccionado, setCursoSeleccionado] = useState("")
  const [configs, setConfigs] = useState([])
  const [estudiantes, setEstudiantes] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("todos")
  const [error, setError] = useState("")
  const [cargandoCursos, setCargandoCursos] = useState(false)
  const [cargandoNotas, setCargandoNotas] = useState(false)
  const [edicionesPendientes, setEdicionesPendientes] = useState({})
  const [guardandoNotaId, setGuardandoNotaId] = useState(null)
  const [formConfig, setFormConfig] = useState(formConfigInicial)
  const [guardandoConfig, setGuardandoConfig] = useState(false)

  useEffect(() => {
    if (!usuario?.id) return

    const cargarCursos = async () => {
      try {
        setCargandoCursos(true)
        setError("")
        const data = await apiClient.get("/api/Cursos")
        const asignados = data.filter((curso) => curso.docenteId === usuario.id)
        setCursos(asignados)
        if (asignados.length > 0) {
          setCursoSeleccionado(asignados[0].id.toString())
        }
      } catch (err) {
        setError(err.message || "No se pudieron cargar tus cursos")
      } finally {
        setCargandoCursos(false)
      }
    }

    cargarCursos()
  }, [usuario?.id])

  const cargarDatosCurso = async (cursoId) => {
    if (!cursoId) {
      setConfigs([])
      setEstudiantes([])
      return
    }

    try {
      setCargandoNotas(true)
      setError("")
      const [configResponse, notasResponse] = await Promise.all([
        apiClient.get(`/api/Notas/curso/${cursoId}/config`),
        apiClient.get(`/api/Notas/curso/${cursoId}`),
      ])
      setConfigs(configResponse)
      setEstudiantes(notasResponse)
      setEdicionesPendientes({})
    } catch (err) {
      setError(err.message || "No se pudieron cargar las calificaciones del curso")
    } finally {
      setCargandoNotas(false)
    }
  }

  useEffect(() => {
    if (cursoSeleccionado) {
      cargarDatosCurso(Number(cursoSeleccionado))
    }
  }, [cursoSeleccionado])

  const periodosDisponibles = useMemo(() => {
    const set = new Set(configs.map((config) => config.periodo.toString()))
    return Array.from(set).sort()
  }, [configs])

  const configsFiltrados = useMemo(() => {
    if (periodoSeleccionado === "todos") {
      return configs
    }
    return configs.filter((config) => config.periodo.toString() === periodoSeleccionado)
  }, [configs, periodoSeleccionado])

  const estudiantesFiltrados = useMemo(() => {
    const termino = busqueda.toLowerCase()
    return estudiantes.filter((est) => est.nombre.toLowerCase().includes(termino) || est.documento.toLowerCase().includes(termino))
  }, [estudiantes, busqueda])

  const resumenPesos = useMemo(() => {
    const pesoPorPeriodo = configs.reduce((acc, config) => {
      acc[config.periodo] = (acc[config.periodo] || 0) + Number(config.peso)
      return acc
    }, {})
    return pesoPorPeriodo
  }, [configs])

  const obtenerValorCelda = (estudianteId, notaConfigId) => {
    const key = `${estudianteId}-${notaConfigId}`
    if (edicionesPendientes[key] !== undefined) {
      return edicionesPendientes[key]
    }
    const estudiante = estudiantes.find((est) => est.id === estudianteId)
    const nota = estudiante?.notas.find((n) => n.notaConfigId === notaConfigId)
    return nota?.valor?.toString() ?? ""
  }

  const manejarCambioNota = (estudianteId, notaConfigId, valor) => {
    setEdicionesPendientes((prev) => ({ ...prev, [`${estudianteId}-${notaConfigId}`]: valor }))
  }

  const manejarGuardarNota = async (estudianteId, notaConfigId) => {
    const key = `${estudianteId}-${notaConfigId}`
    if (!(key in edicionesPendientes)) return

    const valorTexto = edicionesPendientes[key]
    const valorNumerico = valorTexto === "" ? null : Number(valorTexto)
    if (valorNumerico !== null && (Number.isNaN(valorNumerico) || valorNumerico < 0 || valorNumerico > 5)) {
      setError("Las calificaciones deben estar entre 0 y 5")
      return
    }

    try {
      setGuardandoNotaId(key)
      setError("")
      await apiClient.put("/api/Notas", {
        estudianteId,
        notaConfigId,
        valor: valorNumerico,
      })
      setEdicionesPendientes((prev) => {
        const copia = { ...prev }
        delete copia[key]
        return copia
      })
      await cargarDatosCurso(Number(cursoSeleccionado))
    } catch (err) {
      setError(err.message || "No se pudo guardar la nota")
    } finally {
      setGuardandoNotaId(null)
    }
  }

  const manejarCrearConfig = async (evento) => {
    evento.preventDefault()
    if (!cursoSeleccionado) {
      setError("Selecciona un curso para crear configuraciones")
      return
    }

    try {
      setGuardandoConfig(true)
      setError("")
      await apiClient.post(`/api/Notas/curso/${cursoSeleccionado}/config`, {
        nombre: formConfig.nombre,
        periodo: Number(formConfig.periodo),
        peso: Number(formConfig.peso),
        orden: Number(formConfig.orden),
      })
      setFormConfig(formConfigInicial)
      await cargarDatosCurso(Number(cursoSeleccionado))
    } catch (err) {
      setError(err.message || "No se pudo crear la evaluación")
    } finally {
      setGuardandoConfig(false)
    }
  }

  const cursoActual = cursos.find((curso) => curso.id.toString() === cursoSeleccionado)

  return (
    <DisenoTablero rolRequerido="docente">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Calificaciones</h1>
            <p className="text-muted-foreground">Registra y sincroniza notas directamente con la API oficial</p>
          </div>
          <Boton className="gap-2" onClick={() => cargarDatosCurso(Number(cursoSeleccionado))} disabled={!cursoSeleccionado || cargandoNotas}>
            {cargandoNotas ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
            Actualizar
          </Boton>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Filtros</TituloTarjeta>
            <DescripcionTarjeta>Selecciona el curso y el periodo a trabajar</DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Etiqueta>Curso</Etiqueta>
                <Selector value={cursoSeleccionado} onValueChange={setCursoSeleccionado} disabled={cargandoCursos || cursos.length === 0}>
                  <DisparadorSelector>
                    <ValorSelector placeholder={cargandoCursos ? "Cargando cursos..." : "Seleccionar curso"} />
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
              <div className="space-y-2">
                <Etiqueta>Periodo</Etiqueta>
                <Selector value={periodoSeleccionado} onValueChange={setPeriodoSeleccionado} disabled={configs.length === 0}>
                  <DisparadorSelector>
                    <ValorSelector placeholder="Todos los periodos" />
                  </DisparadorSelector>
                  <ContenidoSelector>
                    <ElementoSelector value="todos">Todos</ElementoSelector>
                    {periodosDisponibles.map((periodo) => (
                      <ElementoSelector key={periodo} value={periodo}>
                        Periodo {periodo}
                      </ElementoSelector>
                    ))}
                  </ContenidoSelector>
                </Selector>
              </div>
              <div className="space-y-2">
                <Etiqueta>Buscar estudiante</Etiqueta>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Entrada
                    placeholder="Nombre o documento"
                    className="pl-9"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </ContenidoTarjeta>
        </Tarjeta>

        <div className="grid gap-4 md:grid-cols-2">
          <Tarjeta>
            <EncabezadoTarjeta>
              <TituloTarjeta>Resumen del curso</TituloTarjeta>
              <DescripcionTarjeta>{cursoActual ? `${cursoActual.nombre} · ${cursoActual.gradoNombre || "Sin grado"}` : "Selecciona un curso"}</DescripcionTarjeta>
            </EncabezadoTarjeta>
            <ContenidoTarjeta className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Estudiantes</p>
                <p className="text-2xl font-bold">{estudiantes.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Evaluaciones activas</p>
                <p className="text-2xl font-bold">{configs.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Periodos configurados</p>
                <p className="text-2xl font-bold">{periodosDisponibles.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Peso período actual</p>
                <p className="text-2xl font-bold">
                  {periodoSeleccionado === "todos"
                    ? "--"
                    : `${resumenPesos[Number(periodoSeleccionado)] ?? 0}%`}
                </p>
              </div>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta>
              <TituloTarjeta>Nueva evaluación</TituloTarjeta>
              <DescripcionTarjeta>Creará columnas adicionales en la tabla</DescripcionTarjeta>
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <form className="grid gap-3" onSubmit={manejarCrearConfig}>
                <div className="grid gap-1">
                  <Etiqueta htmlFor="nombre-evaluacion">Nombre</Etiqueta>
                  <Entrada
                    id="nombre-evaluacion"
                    placeholder="Ej: Parcial 1"
                    value={formConfig.nombre}
                    onChange={(e) => setFormConfig((prev) => ({ ...prev, nombre: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Etiqueta>Periodo</Etiqueta>
                    <Entrada
                      type="number"
                      min="1"
                      max="4"
                      value={formConfig.periodo}
                      onChange={(e) => setFormConfig((prev) => ({ ...prev, periodo: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Etiqueta>Peso (%)</Etiqueta>
                    <Entrada
                      type="number"
                      min="1"
                      max="100"
                      value={formConfig.peso}
                      onChange={(e) => setFormConfig((prev) => ({ ...prev, peso: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Etiqueta>Orden</Etiqueta>
                    <Entrada
                      type="number"
                      min="1"
                      value={formConfig.orden}
                      onChange={(e) => setFormConfig((prev) => ({ ...prev, orden: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <Boton type="submit" className="w-full gap-2" disabled={!cursoSeleccionado || guardandoConfig}>
                  {guardandoConfig ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Crear evaluación
                </Boton>
              </form>
            </ContenidoTarjeta>
          </Tarjeta>
        </div>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Calificaciones registradas</TituloTarjeta>
            <DescripcionTarjeta>
              Los cambios se sincronizan con /api/Notas al salir de cada campo
            </DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <Tabla>
              <CabeceraTabla>
                <FilaTabla>
                  <EncabezadoTabla>Estudiante</EncabezadoTabla>
                  {configsFiltrados.map((config) => (
                    <EncabezadoTabla key={config.id} className="text-center">
                      {config.nombre}
                      <span className="block text-xs text-muted-foreground">Periodo {config.periodo} · {config.peso}%</span>
                    </EncabezadoTabla>
                  ))}
                  <EncabezadoTabla className="text-center">Promedio</EncabezadoTabla>
                </FilaTabla>
              </CabeceraTabla>
              <CuerpoTabla>
                {cargandoNotas ? (
                  <FilaTabla>
                    <CeldaTabla colSpan={configsFiltrados.length + 2} className="text-center text-muted-foreground">
                      Cargando calificaciones...
                    </CeldaTabla>
                  </FilaTabla>
                ) : estudiantesFiltrados.length === 0 ? (
                  <FilaTabla>
                    <CeldaTabla colSpan={configsFiltrados.length + 2} className="text-center text-muted-foreground">
                      No hay estudiantes para mostrar.
                    </CeldaTabla>
                  </FilaTabla>
                ) : (
                  estudiantesFiltrados.map((estudiante) => (
                    <FilaTabla key={estudiante.id}>
                      <CeldaTabla className="font-medium">
                        <div>{estudiante.nombre}</div>
                        <p className="text-xs text-muted-foreground">{estudiante.documento}</p>
                      </CeldaTabla>
                      {configsFiltrados.map((config) => {
                        const key = `${estudiante.id}-${config.id}`
                        const valor = obtenerValorCelda(estudiante.id, config.id)
                        return (
                          <CeldaTabla key={config.id} className="text-center">
                            <Entrada
                              type="number"
                              min="0"
                              max="5"
                              step="0.1"
                              value={valor}
                              onChange={(e) => manejarCambioNota(estudiante.id, config.id, e.target.value)}
                              onBlur={() => manejarGuardarNota(estudiante.id, config.id)}
                              disabled={guardandoNotaId === key}
                              className="max-w-[90px] mx-auto text-center"
                            />
                          </CeldaTabla>
                        )
                      })}
                      <CeldaTabla className="text-center">
                        {estudiante.promedio == null ? (
                          <span className="text-xs text-muted-foreground">Sin promedio</span>
                        ) : (
                          <Insignia variant={estudiante.promedio >= 3.5 ? "default" : "destructive"}>
                            {estudiante.promedio.toFixed(2)}
                          </Insignia>
                        )}
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
