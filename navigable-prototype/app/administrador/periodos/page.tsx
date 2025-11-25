"use client"

import { LayoutDashboard } from "@/components/layout-dashboard"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Boton } from "@/components/ui/button"
import { Entrada } from "@/components/ui/input"
import { Etiqueta } from "@/components/ui/label"
import { Tabla, CuerpoTabla, CeldaTabla, EncabezadoTabla, CabeceraTabla, FilaTabla } from "@/components/ui/table"
import { Insignia } from "@/components/ui/badge"
import { Calendar, Plus, Edit, Trash2 } from "lucide-react"
import {
  Dialogo,
  ContenidoDialogo,
  DescripcionDialogo,
  EncabezadoDialogo,
  TituloDialogo,
  ActivadorDialogo,
} from "@/components/ui/dialog"

const PaginaPeriodos = () => {
  const periodos = [
    {
      id: 1,
      nombre: "Primer Periodo 2025",
      fechaInicio: "2025-01-15",
      fechaFin: "2025-03-30",
      estado: "Activo",
    },
    {
      id: 2,
      nombre: "Segundo Periodo 2025",
      fechaInicio: "2025-04-01",
      fechaFin: "2025-06-15",
      estado: "Próximo",
    },
    {
      id: 3,
      nombre: "Tercer Periodo 2025",
      fechaInicio: "2025-07-01",
      fechaFin: "2025-09-30",
      estado: "Próximo",
    },
    {
      id: 4,
      nombre: "Cuarto Periodo 2025",
      fechaInicio: "2025-10-01",
      fechaFin: "2025-11-30",
      estado: "Próximo",
    },
  ]

  const obtenerVarianteEstado = (estado: string) => {
    switch (estado) {
      case "Activo":
        return "default"
      case "Próximo":
        return "secondary"
      case "Finalizado":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <LayoutDashboard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Periodos Académicos</h1>
            <p className="text-muted-foreground">Administra los periodos académicos del año</p>
          </div>
          <Dialogo>
            <ActivadorDialogo asChild>
              <Boton className="gap-2">
                <Plus className="w-4 h-4" />
                Nuevo Periodo
              </Boton>
            </ActivadorDialogo>
            <ContenidoDialogo>
              <EncabezadoDialogo>
                <TituloDialogo>Registrar Nuevo Periodo</TituloDialogo>
                <DescripcionDialogo>Ingresa los datos del nuevo periodo académico</DescripcionDialogo>
              </EncabezadoDialogo>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Etiqueta>Nombre del Periodo</Etiqueta>
                  <Entrada placeholder="Ej: Primer Periodo 2025" />
                </div>
                <div className="space-y-2">
                  <Etiqueta>Fecha de Inicio</Etiqueta>
                  <Entrada type="date" />
                </div>
                <div className="space-y-2">
                  <Etiqueta>Fecha de Fin</Etiqueta>
                  <Entrada type="date" />
                </div>
                <Boton className="w-full">Guardar Periodo</Boton>
              </div>
            </ContenidoDialogo>
          </Dialogo>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between space-y-0 pb-2">
              <TituloTarjeta className="text-sm font-medium">Periodo Activo</TituloTarjeta>
              <Calendar className="h-4 w-4 text-green-600" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-2xl font-bold">Primer Periodo</div>
              <p className="text-xs text-muted-foreground">Enero - Marzo 2025</p>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between space-y-0 pb-2">
              <TituloTarjeta className="text-sm font-medium">Total Periodos</TituloTarjeta>
              <Calendar className="h-4 w-4 text-blue-600" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Periodos en 2025</p>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between space-y-0 pb-2">
              <TituloTarjeta className="text-sm font-medium">Días Restantes</TituloTarjeta>
              <Calendar className="h-4 w-4 text-orange-600" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">Del periodo actual</p>
            </ContenidoTarjeta>
          </Tarjeta>
        </div>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Periodos Académicos 2025</TituloTarjeta>
            <DescripcionTarjeta>Calendario de periodos del año académico</DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <Tabla>
              <CabeceraTabla>
                <FilaTabla>
                  <EncabezadoTabla>Periodo</EncabezadoTabla>
                  <EncabezadoTabla>Fecha de Inicio</EncabezadoTabla>
                  <EncabezadoTabla>Fecha de Fin</EncabezadoTabla>
                  <EncabezadoTabla>Duración</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Estado</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Acciones</EncabezadoTabla>
                </FilaTabla>
              </CabeceraTabla>
              <CuerpoTabla>
                {periodos.map((periodo) => {
                  const inicio = new Date(periodo.fechaInicio)
                  const fin = new Date(periodo.fechaFin)
                  const duracion = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))

                  return (
                    <FilaTabla key={periodo.id}>
                      <CeldaTabla className="font-medium">{periodo.nombre}</CeldaTabla>
                      <CeldaTabla>{inicio.toLocaleDateString()}</CeldaTabla>
                      <CeldaTabla>{fin.toLocaleDateString()}</CeldaTabla>
                      <CeldaTabla>{duracion} días</CeldaTabla>
                      <CeldaTabla className="text-center">
                        <Insignia variant={obtenerVarianteEstado(periodo.estado) as any}>{periodo.estado}</Insignia>
                      </CeldaTabla>
                      <CeldaTabla>
                        <div className="flex items-center justify-center gap-2">
                          <Boton size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Boton>
                          <Boton size="sm" variant="ghost" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Boton>
                        </div>
                      </CeldaTabla>
                    </FilaTabla>
                  )
                })}
              </CuerpoTabla>
            </Tabla>
          </ContenidoTarjeta>
        </Tarjeta>
      </div>
    </LayoutDashboard>
  )
}

export default PaginaPeriodos
