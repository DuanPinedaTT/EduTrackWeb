"use client"

import { LayoutDashboard } from "@/components/layout-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Check, X, Clock, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const PaginaAsistenciasEstudiante = () => {
  const asistenciasPorMateria = [
    { materia: "Matemáticas", presentes: 45, ausentes: 2, tardes: 1, porcentaje: 94 },
    { materia: "Física", presentes: 43, ausentes: 3, tardes: 2, porcentaje: 90 },
    { materia: "Química", presentes: 46, ausentes: 1, tardes: 1, porcentaje: 96 },
    { materia: "Inglés", presentes: 47, ausentes: 1, tardes: 0, porcentaje: 98 },
    { materia: "Historia", presentes: 44, ausentes: 2, tardes: 2, porcentaje: 92 },
    { materia: "Educación Física", presentes: 48, ausentes: 0, tardes: 0, porcentaje: 100 },
  ]

  const asistenciasRecientes = [
    { fecha: "2025-01-10", materia: "Matemáticas", estado: "Presente" },
    { fecha: "2025-01-10", materia: "Física", estado: "Presente" },
    { fecha: "2025-01-09", materia: "Química", estado: "Presente" },
    { fecha: "2025-01-09", materia: "Inglés", estado: "Tarde" },
    { fecha: "2025-01-08", materia: "Historia", estado: "Presente" },
    { fecha: "2025-01-08", materia: "Matemáticas", estado: "Ausente" },
  ]

  const porcentajeGeneral = Math.round(
    asistenciasPorMateria.reduce((acc, mat) => acc + mat.porcentaje, 0) / asistenciasPorMateria.length,
  )

  const obtenerIconoEstado = (estado: string) => {
    switch (estado) {
      case "Presente":
        return <Check className="w-4 h-4 text-green-600" />
      case "Ausente":
        return <X className="w-4 h-4 text-red-600" />
      case "Tarde":
        return <Clock className="w-4 h-4 text-orange-600" />
      default:
        return null
    }
  }

  const obtenerVarianteEstado = (estado: string) => {
    switch (estado) {
      case "Presente":
        return "default"
      case "Ausente":
        return "destructive"
      case "Tarde":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <LayoutDashboard>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mis Asistencias</h1>
          <p className="text-muted-foreground">Consulta tu registro de asistencia por materia</p>
        </div>

        {/* Resumen General */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asistencia General</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{porcentajeGeneral}%</div>
              <p className="text-xs text-muted-foreground">Excelente asistencia</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clases Presentes</CardTitle>
              <Check className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">273</div>
              <p className="text-xs text-muted-foreground">Total de asistencias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ausencias</CardTitle>
              <X className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">9</div>
              <p className="text-xs text-muted-foreground">Faltas registradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Llegadas Tarde</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">6</div>
              <p className="text-xs text-muted-foreground">Retardos</p>
            </CardContent>
          </Card>
        </div>

        {/* Asistencia por Materia */}
        <Card>
          <CardHeader>
            <CardTitle>Asistencia por Materia</CardTitle>
            <CardDescription>Desglose de tu asistencia en cada materia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {asistenciasPorMateria.map((materia) => (
                <div key={materia.materia} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{materia.materia}</h4>
                    <span className="text-lg font-bold text-green-600">{materia.porcentaje}%</span>
                  </div>
                  <Progress value={materia.porcentaje} className="h-2" />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Check className="w-3 h-3 text-green-600" />
                        {materia.presentes} presentes
                      </span>
                      <span className="flex items-center gap-1">
                        <X className="w-3 h-3 text-red-600" />
                        {materia.ausentes} ausentes
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-orange-600" />
                        {materia.tardes} tardes
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Asistencias Recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Registro Reciente</CardTitle>
            <CardDescription>Tus últimas asistencias registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {asistenciasRecientes.map((asist, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{asist.materia}</p>
                      <p className="text-sm text-muted-foreground">{new Date(asist.fecha).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge variant={obtenerVarianteEstado(asist.estado) as any} className="gap-1">
                    {obtenerIconoEstado(asist.estado)}
                    {asist.estado}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutDashboard>
  )
}

export default PaginaAsistenciasEstudiante
