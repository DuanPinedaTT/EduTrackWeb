"use client"

import { LayoutDashboard } from "@/components/layout-dashboard"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Selector, ContenidoSelector, ElementoSelector, DisparadorSelector, ValorSelector } from "@/components/ui/select"
import { Etiqueta } from "@/components/ui/label"
import { Boton } from "@/components/ui/button"
import { Download, TrendingUp, Award } from "lucide-react"
import { Tabla, CuerpoTabla, CeldaTabla, CabeceraTabla, EncabezadoTabla, FilaTabla } from "@/components/ui/table"
import { Insignia } from "@/components/ui/badge"

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
          <Boton className="gap-2">
            <Download className="w-4 h-4" />
            Descargar Boletín
          </Boton>
        </div>

        {/* Resumen */}
        <div className="grid gap-4 md:grid-cols-3">
          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between space-y-0 pb-2">
              <TituloTarjeta className="text-sm font-medium">Promedio Histórico</TituloTarjeta>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-3xl font-bold text-green-600">4.0</div>
              <p className="text-xs text-muted-foreground">Últimos 3 años</p>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between space-y-0 pb-2">
              <TituloTarjeta className="text-sm font-medium">Años Cursados</TituloTarjeta>
              <Award className="h-4 w-4 text-blue-600" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-3xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Años académicos</p>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between space-y-0 pb-2">
              <TituloTarjeta className="text-sm font-medium">Logros</TituloTarjeta>
              <Award className="h-4 w-4 text-yellow-600" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-3xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Reconocimientos</p>
            </ContenidoTarjeta>
          </Tarjeta>
        </div>

        {/* Filtros */}
        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Filtros</TituloTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Etiqueta>Año Académico</Etiqueta>
                <Selector defaultValue="2025">
                  <DisparadorSelector>
                    <ValorSelector />
                  </DisparadorSelector>
                  <ContenidoSelector>
                    <ElementoSelector value="2025">2025</ElementoSelector>
                    <ElementoSelector value="2024">2024</ElementoSelector>
                    <ElementoSelector value="2023">2023</ElementoSelector>
                  </ContenidoSelector>
                </Selector>
              </div>
              <div className="space-y-2">
                <Etiqueta>Tipo de Reporte</Etiqueta>
                <Selector defaultValue="completo">
                  <DisparadorSelector>
                    <ValorSelector />
                  </DisparadorSelector>
                  <ContenidoSelector>
                    <ElementoSelector value="completo">Historial Completo</ElementoSelector>
                    <ElementoSelector value="calificaciones">Solo Calificaciones</ElementoSelector>
                    <ElementoSelector value="asistencias">Solo Asistencias</ElementoSelector>
                  </ContenidoSelector>
                </Selector>
              </div>
            </div>
          </ContenidoTarjeta>
        </Tarjeta>

        {/* Historial por Año */}
        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Historial por Año</TituloTarjeta>
            <DescripcionTarjeta>Resumen de tu rendimiento académico anual</DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <Tabla>
              <CabeceraTabla>
                <FilaTabla>
                  <EncabezadoTabla>Año</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Promedio</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Estado</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Acciones</EncabezadoTabla>
                </FilaTabla>
              </CabeceraTabla>
              <CuerpoTabla>
                {historialAnual.map((hist) => (
                  <FilaTabla key={hist.ano}>
                    <CeldaTabla className="font-medium">{hist.ano}</CeldaTabla>
                    <CeldaTabla className="text-center text-lg font-bold text-green-600">
                      {hist.promedio.toFixed(1)}
                    </CeldaTabla>
                    <CeldaTabla className="text-center">
                      <Insignia variant={hist.estado === "En Curso" ? "secondary" : "default"}>{hist.estado}</Insignia>
                    </CeldaTabla>
                    <CeldaTabla className="text-center">
                      <Boton size="sm" variant="outline">
                        Ver Detalles
                      </Boton>
                    </CeldaTabla>
                  </FilaTabla>
                ))}
              </CuerpoTabla>
            </Tabla>
          </ContenidoTarjeta>
        </Tarjeta>

        {/* Logros y Reconocimientos */}
        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Logros y Reconocimientos
            </TituloTarjeta>
            <DescripcionTarjeta>Tus logros académicos destacados</DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
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
          </ContenidoTarjeta>
        </Tarjeta>
      </div>
    </LayoutDashboard>
  )
}

export default PaginaHistorialEstudiante
