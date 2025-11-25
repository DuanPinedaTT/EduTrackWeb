"use client"

import { useState } from "react"
import { LayoutDashboard } from "@/components/layout-dashboard"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Boton } from "@/components/ui/button"
import { Entrada } from "@/components/ui/input"
import { Etiqueta } from "@/components/ui/label"
import { AreaTexto } from "@/components/ui/textarea"
import { Selector, ContenidoSelector, ElementoSelector, DisparadorSelector, ValorSelector } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import { Insignia } from "@/components/ui/badge"
import {
  Dialogo,
  ContenidoDialogo,
  DescripcionDialogo,
  EncabezadoDialogo,
  TituloDialogo,
  ActivadorDialogo,
} from "@/components/ui/dialog"

export default function PaginaObservaciones() {
  const [busqueda, setBusqueda] = useState("")

  const observaciones = [
    {
      id: 1,
      estudiante: "Juan Pérez",
      materia: "Matemáticas 10-A",
      fecha: "2025-01-10",
      tipo: "Positiva",
      observacion: "Excelente participación en clase y ayuda a sus compañeros",
    },
    {
      id: 2,
      estudiante: "Carlos López",
      materia: "Matemáticas 10-A",
      fecha: "2025-01-08",
      tipo: "Atención",
      observacion: "Necesita refuerzo en operaciones con fracciones",
    },
    {
      id: 3,
      estudiante: "María García",
      materia: "Física 11-B",
      fecha: "2025-01-05",
      tipo: "Positiva",
      observacion: "Demuestra gran comprensión de los conceptos de cinemática",
    },
    {
      id: 4,
      estudiante: "Luis Rodríguez",
      materia: "Matemáticas 10-A",
      fecha: "2025-01-03",
      tipo: "Disciplinaria",
      observacion: "Llegó tarde a clase en varias ocasiones",
    },
  ]

  const obtenerVarianteTipo = (tipo: string) => {
    switch (tipo) {
      case "Positiva":
        return "default"
      case "Atención":
        return "secondary"
      case "Disciplinaria":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <LayoutDashboard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Registro de Observaciones</h1>
            <p className="text-muted-foreground">Registra observaciones sobre el desempeño de tus estudiantes</p>
          </div>
          <Dialogo>
            <ActivadorDialogo asChild>
              <Boton className="gap-2">
                <Plus className="w-4 h-4" />
                Nueva Observación
              </Boton>
            </ActivadorDialogo>
            <ContenidoDialogo>
              <EncabezadoDialogo>
                <TituloDialogo>Registrar Nueva Observación</TituloDialogo>
                <DescripcionDialogo>Agrega una observación sobre un estudiante</DescripcionDialogo>
              </EncabezadoDialogo>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Etiqueta>Estudiante</Etiqueta>
                  <Selector>
                    <DisparadorSelector>
                      <ValorSelector placeholder="Seleccionar estudiante" />
                    </DisparadorSelector>
                    <ContenidoSelector>
                      <ElementoSelector value="1">Juan Pérez</ElementoSelector>
                      <ElementoSelector value="2">María García</ElementoSelector>
                      <ElementoSelector value="3">Carlos López</ElementoSelector>
                    </ContenidoSelector>
                  </Selector>
                </div>
                <div className="space-y-2">
                  <Etiqueta>Materia</Etiqueta>
                  <Selector>
                    <DisparadorSelector>
                      <ValorSelector placeholder="Seleccionar materia" />
                    </DisparadorSelector>
                    <ContenidoSelector>
                      <ElementoSelector value="mat">Matemáticas 10-A</ElementoSelector>
                      <ElementoSelector value="fis">Física 11-B</ElementoSelector>
                      <ElementoSelector value="qui">Química 10-C</ElementoSelector>
                    </ContenidoSelector>
                  </Selector>
                </div>
                <div className="space-y-2">
                  <Etiqueta>Tipo de Observación</Etiqueta>
                  <Selector>
                    <DisparadorSelector>
                      <ValorSelector placeholder="Seleccionar tipo" />
                    </DisparadorSelector>
                    <ContenidoSelector>
                      <ElementoSelector value="positiva">Positiva</ElementoSelector>
                      <ElementoSelector value="atencion">Requiere Atención</ElementoSelector>
                      <ElementoSelector value="disciplinaria">Disciplinaria</ElementoSelector>
                    </ContenidoSelector>
                  </Selector>
                </div>
                <div className="space-y-2">
                  <Etiqueta>Observación</Etiqueta>
                  <AreaTexto placeholder="Describe la observación..." rows={4} />
                </div>
                <Boton className="w-full">Guardar Observación</Boton>
              </div>
            </ContenidoDialogo>
          </Dialogo>
        </div>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Filtros</TituloTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Etiqueta>Materia</Etiqueta>
                <Selector defaultValue="todas">
                  <DisparadorSelector>
                    <ValorSelector />
                  </DisparadorSelector>
                  <ContenidoSelector>
                    <ElementoSelector value="todas">Todas las materias</ElementoSelector>
                    <ElementoSelector value="mat">Matemáticas 10-A</ElementoSelector>
                    <ElementoSelector value="fis">Física 11-B</ElementoSelector>
                    <ElementoSelector value="qui">Química 10-C</ElementoSelector>
                  </ContenidoSelector>
                </Selector>
              </div>
              <div className="space-y-2">
                <Etiqueta>Tipo</Etiqueta>
                <Selector defaultValue="todos">
                  <DisparadorSelector>
                    <ValorSelector />
                  </DisparadorSelector>
                  <ContenidoSelector>
                    <ElementoSelector value="todos">Todos los tipos</ElementoSelector>
                    <ElementoSelector value="positiva">Positivas</ElementoSelector>
                    <ElementoSelector value="atencion">Requiere Atención</ElementoSelector>
                    <ElementoSelector value="disciplinaria">Disciplinarias</ElementoSelector>
                  </ContenidoSelector>
                </Selector>
              </div>
              <div className="space-y-2">
                <Etiqueta>Buscar</Etiqueta>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Entrada
                    placeholder="Buscar estudiante..."
                    className="pl-9"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </ContenidoTarjeta>
        </Tarjeta>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Observaciones Registradas</TituloTarjeta>
            <DescripcionTarjeta>Historial de observaciones de tus estudiantes</DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <div className="space-y-4">
              {observaciones.map((obs) => (
                <div key={obs.id} className="p-4 border rounded-lg space-y-3 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{obs.estudiante}</h4>
                      <p className="text-sm text-muted-foreground">{obs.materia}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Insignia variant={obtenerVarianteTipo(obs.tipo) as any}>{obs.tipo}</Insignia>
                      <span className="text-xs text-muted-foreground">{new Date(obs.fecha).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-sm">{obs.observacion}</p>
                  <div className="flex gap-2">
                    <Boton size="sm" variant="outline">
                      Editar
                    </Boton>
                    <Boton size="sm" variant="ghost" className="text-destructive">
                      Eliminar
                    </Boton>
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
