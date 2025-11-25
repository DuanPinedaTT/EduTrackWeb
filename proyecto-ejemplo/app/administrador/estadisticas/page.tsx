"use client"

import { LayoutDashboard } from "@/components/layout-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function PaginaEstadisticas() {
  return (
    <LayoutDashboard>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Estadísticas y Análisis</h1>
          <p className="text-muted-foreground">Visualiza el rendimiento académico general</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Periodo</Label>
                <Select defaultValue="1">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Primer Periodo</SelectItem>
                    <SelectItem value="2">Segundo Periodo</SelectItem>
                    <SelectItem value="3">Tercer Periodo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Grado</Label>
                <Select defaultValue="todos">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los grados</SelectItem>
                    <SelectItem value="10">10° Grado</SelectItem>
                    <SelectItem value="11">11° Grado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Materia</Label>
                <Select defaultValue="todas">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las materias</SelectItem>
                    <SelectItem value="mat">Matemáticas</SelectItem>
                    <SelectItem value="fis">Física</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio General</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">3.9</div>
              <p className="text-xs text-muted-foreground">+0.2 vs periodo anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estudiantes Destacados</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">Promedio ≥ 4.5</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Riesgo</CardTitle>
              <Users className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">12</div>
              <p className="text-xs text-muted-foreground">Promedio {"<"} 3.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asistencia</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">Promedio institucional</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por Materia</CardTitle>
              <CardDescription>Promedios del primer periodo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { materia: "Matemáticas", promedio: 3.8, color: "bg-blue-600" },
                  { materia: "Física", promedio: 3.6, color: "bg-green-600" },
                  { materia: "Química", promedio: 4.1, color: "bg-purple-600" },
                  { materia: "Inglés", promedio: 4.3, color: "bg-pink-600" },
                  { materia: "Historia", promedio: 3.9, color: "bg-orange-600" },
                ].map((item) => (
                  <div key={item.materia} className="flex items-center gap-4">
                    <div className="w-32 font-medium">{item.materia}</div>
                    <div className="flex-1 bg-secondary rounded-full h-3 overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${(item.promedio / 5) * 100}%` }} />
                    </div>
                    <div className="w-12 text-right font-bold">{item.promedio.toFixed(1)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribución de Calificaciones</CardTitle>
              <CardDescription>Estudiantes por rango de notas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { rango: "Excelente (4.5 - 5.0)", cantidad: 45, porcentaje: 30, color: "bg-green-600" },
                  { rango: "Bueno (3.5 - 4.4)", cantidad: 78, porcentaje: 52, color: "bg-blue-600" },
                  { rango: "Aceptable (3.0 - 3.4)", cantidad: 15, porcentaje: 10, color: "bg-orange-600" },
                  { rango: "Bajo ({'<'} 3.0)", cantidad: 12, porcentaje: 8, color: "bg-red-600" },
                ].map((item) => (
                  <div key={item.rango} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{item.rango}</span>
                      <span className="font-bold">
                        {item.cantidad} ({item.porcentaje}%)
                      </span>
                    </div>
                    <div className="bg-secondary rounded-full h-2 overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.porcentaje}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </LayoutDashboard>
  )
}
