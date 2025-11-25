"use client"

import { Boton } from "@/components/ui/button"

import { LayoutDashboard } from "@/components/layout-dashboard"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Users, BookOpen, GraduationCap, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

const datosEstadisticas = [
  { mes: "Ene", promedio: 3.8 },
  { mes: "Feb", promedio: 3.9 },
  { mes: "Mar", promedio: 4.0 },
  { mes: "Abr", promedio: 3.7 },
  { mes: "May", promedio: 4.1 },
]

const datosRendimiento = [
  { curso: "10-A", promedio: 4.2 },
  { curso: "10-B", promedio: 3.8 },
  { curso: "11-A", promedio: 4.0 },
  { curso: "11-B", promedio: 3.9 },
]

export default function DashboardAdministrador() {
  return (
    <LayoutDashboard rolRequerido="administrador">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">Resumen general del sistema académico</p>
        </div>

        {/* Tarjetas de Estadísticas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between pb-2">
              <TituloTarjeta className="text-sm font-medium">Total Estudiantes</TituloTarjeta>
              <Users className="h-4 w-4 text-muted-foreground" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between pb-2">
              <TituloTarjeta className="text-sm font-medium">Total Docentes</TituloTarjeta>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-2xl font-bold">87</div>
              <p className="text-xs text-muted-foreground">+3 nuevos este mes</p>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between pb-2">
              <TituloTarjeta className="text-sm font-medium">Materias Activas</TituloTarjeta>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">En el periodo actual</p>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between pb-2">
              <TituloTarjeta className="text-sm font-medium">Promedio General</TituloTarjeta>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-2xl font-bold">4.1</div>
              <p className="text-xs text-muted-foreground">+0.2 puntos este mes</p>
            </ContenidoTarjeta>
          </Tarjeta>
        </div>

        {/* Gráficas */}
        <div className="grid gap-4 md:grid-cols-2">
          <Tarjeta>
            <EncabezadoTarjeta>
              <TituloTarjeta>Evolución del Promedio</TituloTarjeta>
              <DescripcionTarjeta>Promedio general por mes</DescripcionTarjeta>
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={datosEstadisticas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="promedio" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta>
              <TituloTarjeta>Rendimiento por Curso</TituloTarjeta>
              <DescripcionTarjeta>Promedio actual de cada curso</DescripcionTarjeta>
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datosRendimiento}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="curso" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Bar dataKey="promedio" fill="hsl(var(--secondary))" />
                </BarChart>
              </ResponsiveContainer>
              </ContenidoTarjeta>
          </Tarjeta>
        </div>

        {/* Alertas y Notificaciones */}
        <div className="grid gap-4 md:grid-cols-2">
          <Tarjeta>
            <EncabezadoTarjeta>
              <TituloTarjeta className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Alertas de Bajo Rendimiento
              </TituloTarjeta>
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                  <div>
                    <p className="font-medium">15 estudiantes</p>
                    <p className="text-sm text-muted-foreground">Con promedio menor a 3.0</p>
                  </div>
                  <Boton variant="outline" size="sm">
                    Ver Detalles
                  </Boton>
                </div>
                <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                  <div>
                    <p className="font-medium">8 estudiantes</p>
                    <p className="text-sm text-muted-foreground">Con más de 5 inasistencias</p>
                  </div>
                  <Boton variant="outline" size="sm">
                    Ver Detalles
                  </Boton>
                </div>
              </div>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta>
              <TituloTarjeta className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-secondary" />
                Actividades Recientes
              </TituloTarjeta>
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium">Nuevo docente registrado</p>
                    <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium">Calificaciones actualizadas - Matemáticas 10-A</p>
                    <p className="text-xs text-muted-foreground">Hace 5 horas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium">Nuevo periodo académico creado</p>
                    <p className="text-xs text-muted-foreground">Hace 1 día</p>
                  </div>
                </div>
              </div>
              </ContenidoTarjeta>
            </Tarjeta>
        </div>
      </div>
    </LayoutDashboard>
  )
}
