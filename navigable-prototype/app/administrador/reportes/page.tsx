"use client"

import { LayoutDashboard } from "@/components/layout-dashboard"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Boton } from "@/components/ui/button"
import { Etiqueta } from "@/components/ui/label"
import { Selector, ContenidoSelector, ElementoSelector, DisparadorSelector, ValorSelector } from "@/components/ui/select"
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
              <Tarjeta key={tipo.titulo} className="hover:shadow-lg transition-shadow">
                <EncabezadoTarjeta>
                  <Icono className={`w-12 h-12 ${tipo.color} mb-2`} />
                  <TituloTarjeta className="text-lg">{tipo.titulo}</TituloTarjeta>
                  <DescripcionTarjeta>{tipo.descripcion}</DescripcionTarjeta>
                </EncabezadoTarjeta>
                <ContenidoTarjeta>
                  <Boton className="w-full gap-2">
                    <Download className="w-4 h-4" />
                    Generar
                  </Boton>
                </ContenidoTarjeta>
              </Tarjeta>
            )
          })}
        </div>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Generar Reporte Personalizado</TituloTarjeta>
            <DescripcionTarjeta>Configura los parámetros para tu reporte</DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Etiqueta>Tipo de Reporte</Etiqueta>
                <Selector>
                  <DisparadorSelector>
                    <ValorSelector placeholder="Seleccionar tipo" />
                  </DisparadorSelector>
                  <ContenidoSelector>
                    <ElementoSelector value="boletines">Boletines de Calificaciones</ElementoSelector>
                    <ElementoSelector value="asistencias">Reporte de Asistencias</ElementoSelector>
                    <ElementoSelector value="estadisticas">Estadísticas por Curso</ElementoSelector>
                    <ElementoSelector value="docentes">Reporte de Docentes</ElementoSelector>
                  </ContenidoSelector>
                </Selector>
              </div>

              <div className="space-y-2">
                <Etiqueta>Periodo</Etiqueta>
                <Selector>
                  <DisparadorSelector>
                    <ValorSelector placeholder="Seleccionar periodo" />
                  </DisparadorSelector>
                  <ContenidoSelector>
                    <ElementoSelector value="1">Primer Periodo</ElementoSelector>
                    <ElementoSelector value="2">Segundo Periodo</ElementoSelector>
                    <ElementoSelector value="3">Tercer Periodo</ElementoSelector>
                    <ElementoSelector value="todos">Todos los periodos</ElementoSelector>
                  </ContenidoSelector>
                </Selector>
              </div>

              <div className="space-y-2">
                <Etiqueta>Grado</Etiqueta>
                <Selector>
                  <DisparadorSelector>
                    <ValorSelector placeholder="Seleccionar grado" />
                  </DisparadorSelector>
                  <ContenidoSelector>
                    <ElementoSelector value="todos">Todos los grados</ElementoSelector>
                    <ElementoSelector value="10">10° Grado</ElementoSelector>
                    <ElementoSelector value="11">11° Grado</ElementoSelector>
                  </ContenidoSelector>
                </Selector>
              </div>

              <div className="space-y-2">
                <Etiqueta>Formato</Etiqueta>
                <Selector>
                  <DisparadorSelector>
                    <ValorSelector placeholder="Seleccionar formato" />
                  </DisparadorSelector>
                  <ContenidoSelector>
                    <ElementoSelector value="pdf">PDF</ElementoSelector>
                    <ElementoSelector value="excel">Excel</ElementoSelector>
                    <ElementoSelector value="csv">CSV</ElementoSelector>
                  </ContenidoSelector>
                </Selector>
              </div>
            </div>

            <div className="flex gap-2">
              <Boton className="gap-2">
                <Download className="w-4 h-4" />
                Generar Reporte
              </Boton>
              <Boton variant="outline">Vista Previa</Boton>
            </div>
          </ContenidoTarjeta>
        </Tarjeta>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Reportes Recientes</TituloTarjeta>
            <DescripcionTarjeta>Historial de reportes generados</DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
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
                  <Boton size="sm" variant="outline" className="gap-2 bg-transparent">
                    <Download className="w-3 h-3" />
                    Descargar
                  </Boton>
                </div>
              ))}
            </div>
          </ContenidoTarjeta>
        </Tarjeta>
      </div>
    </LayoutDashboard>
  )
}
