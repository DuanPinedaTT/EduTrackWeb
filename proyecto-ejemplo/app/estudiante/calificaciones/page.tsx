"use client"

import { LayoutDashboard } from "@/components/layout-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BookOpen, TrendingUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const PaginaCalificacionesEstudiante = () => {
  const calificaciones = [
    {
      materia: "Matemáticas",
      periodo1: 4.5,
      periodo2: 4.3,
      periodo3: 4.7,
      promedio: 4.5,
      estado: "Aprobado",
    },
    {
      materia: "Física",
      periodo1: 3.8,
      periodo2: 3.5,
      periodo3: 4.0,
      promedio: 3.8,
      estado: "Aprobado",
    },
    {
      materia: "Química",
      periodo1: 4.2,
      periodo2: 4.4,
      periodo3: 4.0,
      promedio: 4.2,
      estado: "Aprobado",
    },
    {
      materia: "Inglés",
      periodo1: 4.7,
      periodo2: 4.8,
      periodo3: 4.6,
      promedio: 4.7,
      estado: "Aprobado",
    },
    {
      materia: "Historia",
      periodo1: 4.0,
      periodo2: 3.9,
      periodo3: 4.1,
      promedio: 4.0,
      estado: "Aprobado",
    },
    {
      materia: "Educación Física",
      periodo1: 4.8,
      periodo2: 4.9,
      periodo3: 4.7,
      promedio: 4.8,
      estado: "Aprobado",
    },
  ]

  const obtenerColorNota = (nota: number) => {
    if (nota >= 4.5) return "text-green-600 font-bold"
    if (nota >= 3.5) return "text-blue-600"
    if (nota >= 3.0) return "text-orange-600"
    return "text-red-600 font-bold"
  }

  const promedioGeneral = (calificaciones.reduce((acc, cal) => acc + cal.promedio, 0) / calificaciones.length).toFixed(
    2,
  )

  return (
    <LayoutDashboard>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mis Calificaciones</h1>
          <p className="text-muted-foreground">Consulta tus calificaciones por materia y periodo</p>
        </div>

        {/* Resumen */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio General</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{promedioGeneral}</div>
              <p className="text-xs text-muted-foreground">Excelente rendimiento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Materias Aprobadas</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">6/6</div>
              <p className="text-xs text-muted-foreground">100% de aprobación</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mejor Materia</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">Educación Física</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Año Académico</Label>
                <Select defaultValue="2025">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Periodo</Label>
                <Select defaultValue="todos">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los periodos</SelectItem>
                    <SelectItem value="1">Primer Periodo</SelectItem>
                    <SelectItem value="2">Segundo Periodo</SelectItem>
                    <SelectItem value="3">Tercer Periodo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Calificaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Calificaciones por Materia</CardTitle>
            <CardDescription>Año Académico 2025 - Todos los periodos</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Materia</TableHead>
                  <TableHead className="text-center">Periodo 1</TableHead>
                  <TableHead className="text-center">Periodo 2</TableHead>
                  <TableHead className="text-center">Periodo 3</TableHead>
                  <TableHead className="text-center">Promedio</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calificaciones.map((cal) => (
                  <TableRow key={cal.materia}>
                    <TableCell className="font-medium">{cal.materia}</TableCell>
                    <TableCell className={`text-center ${obtenerColorNota(cal.periodo1)}`}>
                      {cal.periodo1.toFixed(1)}
                    </TableCell>
                    <TableCell className={`text-center ${obtenerColorNota(cal.periodo2)}`}>
                      {cal.periodo2.toFixed(1)}
                    </TableCell>
                    <TableCell className={`text-center ${obtenerColorNota(cal.periodo3)}`}>
                      {cal.periodo3.toFixed(1)}
                    </TableCell>
                    <TableCell className={`text-center ${obtenerColorNota(cal.promedio)}`}>
                      {cal.promedio.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default">{cal.estado}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </LayoutDashboard>
  )
}

export default PaginaCalificacionesEstudiante
