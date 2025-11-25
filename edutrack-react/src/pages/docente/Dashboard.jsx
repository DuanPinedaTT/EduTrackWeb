import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { DisenoTablero } from "@/components/layout-dashboard"
import { Boton } from "@/components/ui/button"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { BookOpen, Users, Bell, TrendingUp, Calendar, ClipboardCheck } from "lucide-react"
import { useAutenticacion } from "@/components/proveedor-autenticacion"
import { apiClient } from "@/lib/api-client"

export default function PaginaDashboardDocente() {
  const { usuario } = useAutenticacion()
  const [cursos, setCursos] = useState([])
  const [conteoEstudiantes, setConteoEstudiantes] = useState({})
  const [totalEstudiantes, setTotalEstudiantes] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!usuario?.id) return

    const cargarCursos = async () => {
      try {
        setCargando(true)
        setError("")
        const data = await apiClient.get("/api/Cursos")
        const asignados = data.filter((curso) => curso.docenteId === usuario.id)
        setCursos(asignados)

        const estudiantesPorCurso = await Promise.all(
          asignados.map((curso) => apiClient.get(`/api/Cursos/${curso.id}/students`)),
        )

        const mapa = {}
        let total = 0
        estudiantesPorCurso.forEach((lista, index) => {
          const cursoId = asignados[index].id
          mapa[cursoId] = lista.length
          total += lista.length
        })

        setConteoEstudiantes(mapa)
        setTotalEstudiantes(total)
      } catch (err) {
        setError(err.message || "No se pudo cargar la información académica")
      } finally {
        setCargando(false)
      }
    }

    cargarCursos()
  }, [usuario?.id])

  const promedioPorCurso = useMemo(() => {
    if (cursos.length === 0) return 0
    return Math.round(totalEstudiantes / cursos.length) || 0
  }, [cursos.length, totalEstudiantes])

  const gradosCubiertos = useMemo(() => {
    const setGrados = new Set(cursos.map((curso) => curso.gradoNombre || "Sin grado"))
    return setGrados.size
  }, [cursos])

  const estadisticas = [
    { titulo: "Cursos Asignados", valor: cursos.length, descripcion: "Cursos activos", icono: BookOpen, color: "text-blue-600" },
    { titulo: "Estudiantes", valor: totalEstudiantes, descripcion: "Inscritos en tus cursos", icono: Users, color: "text-green-600" },
    {
      titulo: "Promedio por Curso",
      valor: promedioPorCurso,
      descripcion: "Estudiantes por curso",
      icono: ClipboardCheck,
      color: "text-orange-600",
    },
    {
      titulo: "Grados Cubiertos",
      valor: gradosCubiertos,
      descripcion: "Grados vinculados",
      icono: Bell,
      color: "text-red-600",
    },
  ]

  return (
    <DisenoTablero rolRequerido="docente">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Docente</h1>
          <p className="text-muted-foreground">Bienvenido, aquí está el resumen de tu actividad académica</p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

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
                  <div className="text-2xl font-bold">{cargando ? "--" : stat.valor}</div>
                  <p className="text-xs text-muted-foreground">{stat.descripcion}</p>
                </ContenidoTarjeta>
              </Tarjeta>
            )
          })}
        </div>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Mis Materias</TituloTarjeta>
            <DescripcionTarjeta>Materias que tienes asignadas este periodo</DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <div className="space-y-4">
              {cargando ? (
                <p className="text-sm text-muted-foreground">Cargando cursos...</p>
              ) : cursos.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aún no tienes cursos asignados.</p>
              ) : (
                cursos.slice(0, 5).map((curso) => (
                  <div
                    key={curso.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{curso.nombre}</p>
                        <p className="text-sm text-muted-foreground">
                          {curso.gradoNombre || "Sin grado"} · {conteoEstudiantes[curso.id] ?? 0} estudiantes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Grupo</p>
                        <p className="text-lg font-bold">{curso.grupo || "-"}</p>
                      </div>
                      <Link to="/docente/calificaciones">
                        <Boton size="sm">Ver Detalles</Boton>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ContenidoTarjeta>
        </Tarjeta>

        <div className="grid gap-4 md:grid-cols-2">
          <Tarjeta>
            <EncabezadoTarjeta>
              <TituloTarjeta>Acciones Rápidas</TituloTarjeta>
            </EncabezadoTarjeta>
            <ContenidoTarjeta className="space-y-2">
              <Link to="/docente/calificaciones">
                <Boton variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <ClipboardCheck className="w-4 h-4" />
                  Registrar Calificaciones
                </Boton>
              </Link>
              <Link to="/docente/asistencias">
                <Boton variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <Calendar className="w-4 h-4" />
                  Tomar Asistencia
                </Boton>
              </Link>
              <Link to="/docente/notificaciones">
                <Boton variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <Bell className="w-4 h-4" />
                  Enviar Notificación
                </Boton>
              </Link>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta>
              <TituloTarjeta>Alertas de Rendimiento</TituloTarjeta>
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium">Sin alertas automáticas</p>
                    <p className="text-xs text-muted-foreground">Genera alertas desde calificaciones y asistencia</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg">
                  <ClipboardCheck className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="text-sm font-medium">Registra tus calificaciones</p>
                    <p className="text-xs text-muted-foreground">Esto permitirá monitorear el desempeño en tiempo real</p>
                  </div>
                </div>
              </div>
            </ContenidoTarjeta>
          </Tarjeta>
        </div>
      </div>
    </DisenoTablero>
  )
}
