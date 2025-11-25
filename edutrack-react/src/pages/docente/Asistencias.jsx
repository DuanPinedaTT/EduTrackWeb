import { useCallback, useEffect, useMemo, useState } from "react"
import { DisenoTablero } from "@/components/layout-dashboard"
import { Insignia } from "@/components/ui/badge"
import { Boton } from "@/components/ui/button"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Etiqueta } from "@/components/ui/label"
import { Selector, ContenidoSelector, ElementoSelector, DisparadorSelector, ValorSelector } from "@/components/ui/select"
import { Tabla, CuerpoTabla, CeldaTabla, EncabezadoTabla, CabeceraTabla, FilaTabla } from "@/components/ui/table"
import { Entrada } from "@/components/ui/input"
import { Check, Clock, Loader2, X } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useAutenticacion } from "@/components/proveedor-autenticacion"

export default function PaginaAsistenciasDocente() {
  const { usuario } = useAutenticacion()
  const [cursos, setCursos] = useState([])
  const [cursoSeleccionado, setCursoSeleccionado] = useState("")
  const [estudiantes, setEstudiantes] = useState([])
  const [asistencias, setAsistencias] = useState({})
  const [asistenciasBase, setAsistenciasBase] = useState({})
  const [busqueda, setBusqueda] = useState("")
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10))
  const [mensaje, setMensaje] = useState("")
  const [error, setError] = useState("")
  const [cargandoCursos, setCargandoCursos] = useState(false)
  const [cargandoEstudiantes, setCargandoEstudiantes] = useState(false)
  const [cargandoAsistencias, setCargandoAsistencias] = useState(false)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (!usuario?.id) return

    const cargarCursos = async () => {
      try {
        setCargandoCursos(true)
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

  useEffect(() => {
    const cargarEstudiantes = async () => {
      if (!cursoSeleccionado) {
        setEstudiantes([])
        setAsistencias({})
        setAsistenciasBase({})
        return
      }
      try {
        setCargandoEstudiantes(true)
        const data = await apiClient.get(`/api/Cursos/${cursoSeleccionado}/students`)
        setEstudiantes(data)
        setAsistencias({})
      } catch (err) {
        setError(err.message || "No se pudieron cargar los estudiantes del curso")
      } finally {
        setCargandoEstudiantes(false)
      }
    }

    cargarEstudiantes()
  }, [cursoSeleccionado])

  const sincronizarAsistencias = useCallback(
    async (cursoId, fechaObjetivo, mostrarLoader = true) => {
      if (!cursoId || !fechaObjetivo) {
        setAsistencias({})
        setAsistenciasBase({})
        if (mostrarLoader) setCargandoAsistencias(false)
        return
      }
      try {
        if (mostrarLoader) setCargandoAsistencias(true)
        setError("")
        const queryFecha = encodeURIComponent(fechaObjetivo)
        const data = await apiClient.get(`/api/Asistencias/curso/${cursoId}?fecha=${queryFecha}`)
        const mapa = data.reduce((acc, registro) => {
          acc[registro.estudianteId] = registro.estado
          return acc
        }, {})
        setAsistencias({ ...mapa })
        setAsistenciasBase({ ...mapa })
      } catch (err) {
        setError(err.message || "No se pudo obtener la asistencia registrada")
        setAsistencias({})
        setAsistenciasBase({})
      } finally {
        if (mostrarLoader) setCargandoAsistencias(false)
      }
    },
    []
  )

  useEffect(() => {
    if (cursoSeleccionado && fecha) {
      sincronizarAsistencias(cursoSeleccionado, fecha)
    }
  }, [cursoSeleccionado, fecha, sincronizarAsistencias])

  const estudiantesFiltrados = useMemo(() => {
    const termino = busqueda.toLowerCase()
    return estudiantes.filter((est) => est.nombre.toLowerCase().includes(termino) || est.documento.toLowerCase().includes(termino))
  }, [estudiantes, busqueda])

  const estaCargandoListado = cargandoEstudiantes || cargandoAsistencias

  const marcarAsistencia = (estudianteId, estado) => {
    setAsistencias((prev) => {
      const estadoActual = prev[estudianteId] ?? null
      const nuevoEstado = estadoActual === estado ? null : estado
      return { ...prev, [estudianteId]: nuevoEstado }
    })
  }

  const guardarAsistencias = async () => {
    if (!cursoSeleccionado) return

    const ids = new Set([...Object.keys(asistenciasBase), ...Object.keys(asistencias)])
    const cambios = []

    ids.forEach((id) => {
      const original = asistenciasBase[id] ?? null
      const actual = Object.prototype.hasOwnProperty.call(asistencias, id) ? asistencias[id] : null
      if (original === actual) return
      cambios.push({ estudianteId: Number(id), estado: actual })
    })

    if (cambios.length === 0) {
      setMensaje("No hay cambios pendientes por guardar")
      setTimeout(() => setMensaje(""), 3000)
      return
    }

    try {
      setGuardando(true)
      setError("")
      await apiClient.post(`/api/Asistencias/curso/${cursoSeleccionado}`, {
        fecha,
        registros: cambios,
        registradoPorId: usuario?.id ?? null,
      })
      setMensaje(`Asistencias guardadas para ${fecha}`)
      setTimeout(() => setMensaje(""), 3500)
      await sincronizarAsistencias(cursoSeleccionado, fecha, false)
    } catch (err) {
      setError(err.message || "No se pudieron guardar las asistencias")
    } finally {
      setGuardando(false)
    }
  }

  return (
    <DisenoTablero rolRequerido="docente">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Asistencias</h1>
            <p className="text-muted-foreground">Inscripciones reales desde /api/Cursos/{{id}}/students y registros persistidos en /api/Asistencias</p>
          </div>
          <Boton className="gap-2" onClick={guardarAsistencias} disabled={!cursoSeleccionado || estudiantes.length === 0 || guardando}>
            {guardando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {guardando ? "Guardando..." : "Guardar Asistencias"}
          </Boton>
        </div>

        {mensaje && <p className="text-sm text-primary">{mensaje}</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Configuración</TituloTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Etiqueta>Curso</Etiqueta>
                <Selector value={cursoSeleccionado} onValueChange={setCursoSeleccionado} disabled={cargandoCursos || cursos.length === 0}>
                  <DisparadorSelector>
                    <ValorSelector placeholder={cargandoCursos ? "Cargando..." : "Seleccionar curso"} />
                  </DisparadorSelector>
                  <ContenidoSelector>
                    {cursos.length === 0 && <ElementoSelector value="">Sin cursos</ElementoSelector>}
                    {cursos.map((curso) => (
                      <ElementoSelector key={curso.id} value={curso.id.toString()}>
                        {curso.nombre}
                      </ElementoSelector>
                    ))}
                  </ContenidoSelector>
                </Selector>
              </div>
              <div className="space-y-2">
                <Etiqueta>Fecha</Etiqueta>
                <Entrada type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Etiqueta>Buscar estudiante</Etiqueta>
                <Entrada placeholder="Nombre o documento" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
              </div>
            </div>
          </ContenidoTarjeta>
        </Tarjeta>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Lista de asistencia</TituloTarjeta>
            <DescripcionTarjeta>
              {cursoSeleccionado
                ? `Curso: ${cursos.find((c) => c.id.toString() === cursoSeleccionado)?.nombre || ""} · Fecha: ${fecha}`
                : "Selecciona un curso para ver los estudiantes"}
            </DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <Tabla>
              <CabeceraTabla>
                <FilaTabla>
                  <EncabezadoTabla>Estudiante</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Estado Hoy</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Acciones</EncabezadoTabla>
                </FilaTabla>
              </CabeceraTabla>
              <CuerpoTabla>
                {estaCargandoListado ? (
                  <FilaTabla>
                    <CeldaTabla colSpan={4} className="text-center text-muted-foreground">
                      <Loader2 className="w-4 h-4 inline-block animate-spin" /> Cargando estudiantes...
                    </CeldaTabla>
                  </FilaTabla>
                ) : estudiantesFiltrados.length === 0 ? (
                  <FilaTabla>
                    <CeldaTabla colSpan={4} className="text-center text-muted-foreground">
                      No hay estudiantes para mostrar.
                    </CeldaTabla>
                  </FilaTabla>
                ) : (
                  estudiantesFiltrados.map((estudiante) => {
                    const estadoActual = asistencias[estudiante.id] ?? null
                    return (
                      <FilaTabla key={estudiante.id}>
                        <CeldaTabla className="font-medium">
                          <div>{estudiante.nombre}</div>
                          <p className="text-xs text-muted-foreground">{estudiante.documento}</p>
                        </CeldaTabla>
                        <CeldaTabla className="text-center">
                          {estadoActual === "presente" && <Insignia className="bg-green-600">Presente</Insignia>}
                          {estadoActual === "ausente" && <Insignia variant="destructive">Ausente</Insignia>}
                          {estadoActual === "tarde" && <Insignia className="bg-orange-600">Tarde</Insignia>}
                          {!estadoActual && <Insignia variant="outline">Sin marcar</Insignia>}
                        </CeldaTabla>
                        <CeldaTabla>
                          <div className="flex items-center justify-center gap-2">
                            <Boton
                              size="sm"
                              variant={estadoActual === "presente" ? "default" : "outline"}
                              onClick={() => marcarAsistencia(estudiante.id, "presente")}
                              className="gap-1"
                            >
                              <Check className="w-3 h-3" />
                              Presente
                            </Boton>
                            <Boton
                              size="sm"
                              variant={estadoActual === "tarde" ? "default" : "outline"}
                              onClick={() => marcarAsistencia(estudiante.id, "tarde")}
                              className="gap-1"
                            >
                              <Clock className="w-3 h-3" />
                              Tarde
                            </Boton>
                            <Boton
                              size="sm"
                              variant={estadoActual === "ausente" ? "destructive" : "outline"}
                              onClick={() => marcarAsistencia(estudiante.id, "ausente")}
                              className="gap-1"
                            >
                              <X className="w-3 h-3" />
                              Ausente
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
