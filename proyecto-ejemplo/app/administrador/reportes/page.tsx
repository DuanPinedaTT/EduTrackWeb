"use client"

import { LayoutDashboard } from "@/components/layout-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, FileSpreadsheet, FilePen as FilePdf } from "lucide-react"

export default function PaginaReportes() {
  const tiposReporte = [
    {
      titulo: "Boletines de Calificaciones",
      descripcion: "Genera boletines individuales o grupales en PDF",
      icono: FilePdf,
      color: "text-red-600",
    },
    {
      titulo: "Reporte de Asistencias",
      descripcion: "Exporta registros de asistencia por periodo",
      icono: FileSpreadsheet,
      color: "text-green-600",
    },
    {
      titulo: "Estadísticas por Curso",
      descripcion: "Promedios y análisis de rendimiento por curso",
      icono: FileText,
      color: "text-blue-600",
    },
    {
      titulo: "Reporte de Docentes",
      descripcion: "Información de materias y estudiantes por docente",
      icono: FileText,
      color: "text-purple-600",
    },
  ]

  return (
    <LayoutDashboard>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Generación de Reportes</h1>
          <p className="text-muted-foreground">Genera y exporta reportes académicos</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {tiposReporte.map((tipo) => {
            const Icono = tipo.icono
            return (
              <Card key={tipo.titulo} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Icono className={`w-12 h-12 ${tipo.color} mb-2`} />
                  <CardTitle className="text-lg">{tipo.titulo}</CardTitle>
                  <CardDescription>{tipo.descripcion}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full gap-2">
                    <Download className="w-4 h-4" />
                    Generar
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generar Reporte Personalizado</CardTitle>
            <CardDescription>Configura los parámetros para tu reporte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Tipo de Reporte</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boletines">Boletines de Calificaciones</SelectItem>
                    <SelectItem value="asistencias">Reporte de Asistencias</SelectItem>
                    <SelectItem value="estadisticas">Estadísticas por Curso</SelectItem>
                    <SelectItem value="docentes">Reporte de Docentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Periodo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar periodo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Primer Periodo</SelectItem>
                    <SelectItem value="2">Segundo Periodo</SelectItem>
                    <SelectItem value="3">Tercer Periodo</SelectItem>
                    <SelectItem value="todos">Todos los periodos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Grado</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar grado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los grados</SelectItem>
                    <SelectItem value="10">10° Grado</SelectItem>
                    <SelectItem value="11">11° Grado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Formato</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="gap-2">
                <Download className="w-4 h-4" />
                Generar Reporte
              </Button>
              <Button variant="outline">Vista Previa</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reportes Recientes</CardTitle>
            <CardDescription>Historial de reportes generados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { nombre: "Boletines_Primer_Periodo_2025.pdf", fecha: "2025-01-10", tipo: "PDF" },
                { nombre: "Asistencias_Enero_2025.xlsx", fecha: "2025-01-08", tipo: "Excel" },
                { nombre: "Estadisticas_10A_2025.pdf", fecha: "2025-01-05", tipo: "PDF" },
              ].map((reporte, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{reporte.nombre}</p>
                      <p className="text-sm text-muted-foreground">
                        Generado el {new Date(reporte.fecha).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                    <Download className="w-3 h-3" />
                    Descargar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutDashboard>
  )
}
