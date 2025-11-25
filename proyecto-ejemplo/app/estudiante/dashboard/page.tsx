"use client"

import { LayoutDashboard } from "@/components/layout-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, TrendingUp, Calendar, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

const PaginaDashboardEstudiante = () => {
  const estadisticas = [
    {
      titulo: "Promedio General",
      valor: "4.2",
      descripcion: "Buen rendimiento",
      icono: TrendingUp,
      color: "text-green-600",
    },
    {
      titulo: "Materias Cursando",
      valor: "8",
      descripcion: "Materias activas",
      icono: BookOpen,
      color: "text-blue-600",
    },
    {
      titulo: "Asistencia",
      valor: "94%",
      descripcion: "Excelente asistencia",
      icono: Calendar,
      color: "text-purple-600",
    },
    {
      titulo: "Logros",
      valor: "12",
      descripcion: "Reconocimientos",
      icono: Award,
      color: "text-yellow-600",
    },
  ]

  const materias = [
    { nombre: "Matemáticas", nota: 4.5, progreso: 90, color: "bg-blue-600" },
    { nombre: "Física", nota: 3.8, progreso: 76, color: "bg-green-600" },
    { nombre: "Química", nota: 4.2, progreso: 84, color: "bg-purple-600" },
    { nombre: "Inglés", nota: 4.7, progreso: 94, color: "bg-pink-600" },
    { nombre: "Historia", nota: 4.0, progreso: 80, color: "bg-orange-600" },
  ]

  return (
    <LayoutDashboard>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mi Dashboard</h1>
          <p className="text-muted-foreground">Bienvenido, aquí está el resumen de tu rendimiento académico</p>
        </div>

        {/* Estadísticas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {estadisticas.map((stat) => {
            const Icono = stat.icono
            return (
              <Card key={stat.titulo}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.titulo}</CardTitle>
                  <Icono className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.valor}</div>
                  <p className="text-xs text-muted-foreground">{stat.descripcion}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Rendimiento por Materia */}
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Materia</CardTitle>
            <CardDescription>Tu progreso en cada materia del periodo actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {materias.map((materia) => (
                <div key={materia.nombre} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${materia.color}`} />
                      <span className="font-medium">{materia.nombre}</span>
                    </div>
                    <span className="text-lg font-bold">{materia.nota.toFixed(1)}</span>
                  </div>
                  <Progress value={materia.progreso} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">{materia.progreso}% completado</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Próximas Actividades */}
          <Card>
            <CardHeader>
              <CardTitle>Próximas Actividades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Examen de Matemáticas</p>
                  <p className="text-xs text-muted-foreground">Viernes 15 de Enero</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <BookOpen className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Entrega de Tarea - Física</p>
                  <p className="text-xs text-muted-foreground">Lunes 12 de Enero</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <Award className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Proyecto de Química</p>
                  <p className="text-xs text-muted-foreground">Miércoles 20 de Enero</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accesos Rápidos */}
          <Card>
            <CardHeader>
              <CardTitle>Accesos Rápidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/estudiante/calificaciones">
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <BookOpen className="w-4 h-4" />
                  Ver Mis Calificaciones
                </Button>
              </Link>
              <Link href="/estudiante/asistencias">
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <Calendar className="w-4 h-4" />
                  Ver Mis Asistencias
                </Button>
              </Link>
              <Link href="/estudiante/historial">
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                  <TrendingUp className="w-4 h-4" />
                  Ver Historial Académico
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutDashboard>
  )
}

export default PaginaDashboardEstudiante
