"use client"

import { LayoutDashboard } from "@/components/layout-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, Award } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const PaginaHistorialEstudiante = () => {
  const historialAnual = [
    { ano: "2025", promedio: 4.2, estado: "En Curso" },
    { ano: "2024", promedio: 4.0, estado: "Aprobado" },
    { ano: "2023", promedio: 3.8, estado: "Aprobado" },
  ]

  const logros = [
    { titulo: "Cuadro de Honor", fecha: "2024", descripcion: "Promedio superior a 4.5" },
    { titulo: "Mejor Estudiante - Matemáticas", fecha: "2024", descripcion: "Excelencia académica" },
    { titulo: "Asistencia Perfecta", fecha: "2023", descripcion: "100% de asistencia" },
  ]

  return (
    <LayoutDashboard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Historial Académico</h1>
            <p className="text-muted-foreground">Consulta tu trayectoria académica completa</p>
          </div>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Descargar Boletín
          </Button>
        </div>

        {/* Resumen */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio Histórico</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">4.0</div>
              <p className="text-xs text-muted-foreground">Últimos 3 años</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Años Cursados</CardTitle>
              <Award className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Años académicos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Logros</CardTitle>
              <Award className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Reconocimientos</p>
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
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo de Reporte</Label>
                <Select defaultValue="completo">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completo">Historial Completo</SelectItem>
                    <SelectItem value="calificaciones">Solo Calificaciones</SelectItem>
                    <SelectItem value="asistencias">Solo Asistencias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Historial por Año */}
        <Card>
          <CardHeader>
            <CardTitle>Historial por Año</CardTitle>
            <CardDescription>Resumen de tu rendimiento académico anual</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Año</TableHead>
                  <TableHead className="text-center">Promedio</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historialAnual.map((hist) => (
                  <TableRow key={hist.ano}>
                    <TableCell className="font-medium">{hist.ano}</TableCell>
                    <TableCell className="text-center text-lg font-bold text-green-600">
                      {hist.promedio.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={hist.estado === "En Curso" ? "secondary" : "default"}>{hist.estado}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button size="sm" variant="outline">
                        Ver Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Logros y Reconocimientos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Logros y Reconocimientos
            </CardTitle>
            <CardDescription>Tus logros académicos destacados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logros.map((logro, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20"
                >
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{logro.titulo}</h4>
                    <p className="text-sm text-muted-foreground">{logro.descripcion}</p>
                    <p className="text-xs text-muted-foreground mt-1">Obtenido en {logro.fecha}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutDashboard>
  )
}

export default PaginaHistorialEstudiante
