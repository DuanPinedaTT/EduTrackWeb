"use client"

import { useState } from "react"
import { LayoutDashboard } from "@/components/layout-dashboard"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Boton } from "@/components/ui/button"
import { Entrada } from "@/components/ui/input"
import { Etiqueta } from "@/components/ui/label"
import { Selector, ContenidoSelector, ElementoSelector, DisparadorSelector, ValorSelector } from "@/components/ui/select"
import { Tabla, CuerpoTabla, CeldaTabla, CabeceraTabla, EncabezadoTabla, FilaTabla } from "@/components/ui/table"
import { Insignia } from "@/components/ui/badge"
import { Search, Plus, Edit } from "lucide-react"
import {
  Dialogo,
  ContenidoDialogo,
  DescripcionDialogo,
  EncabezadoDialogo,
  TituloDialogo,
  ActivadorDialogo,
} from "@/components/ui/dialog"

const PaginaCalificaciones = () => {
  const [materiaSeleccionada, setMateriaSeleccionada] = useState("matematicas-10a")
  const [busqueda, setBusqueda] = useState("")
  const [modoEdicion, setModoEdicion] = useState<number | null>(null)

  const estudiantes = [
    { id: 1, nombre: "Juan Pérez", nota1: 4.2, nota2: 3.8, nota3: 4.5, promedio: 4.2 },
    { id: 2, nombre: "María García", nota1: 4.8, nota2: 4.5, nota3: 4.9, promedio: 4.7 },
    { id: 3, nombre: "Carlos López", nota1: 3.2, nota2: 2.8, nota3: 3.0, promedio: 3.0 },
    { id: 4, nombre: "Ana Martínez", nota1: 4.5, nota2: 4.3, nota3: 4.6, promedio: 4.5 },
    { id: 5, nombre: "Luis Rodríguez", nota1: 3.8, nota2: 3.5, nota3: 3.9, promedio: 3.7 },
  ]

  const obtenerColorNota = (nota: number) => {
    if (nota >= 4.5) return "text-green-600"
    if (nota >= 3.5) return "text-blue-600"
    if (nota >= 3.0) return "text-orange-600"
    return "text-red-600"
  }

  const obtenerEstadoNota = (nota: number) => {
    if (nota >= 4.5) return { label: "Excelente", variant: "default" as const }
    if (nota >= 3.5) return { label: "Bueno", variant: "secondary" as const }
    if (nota >= 3.0) return { label: "Aceptable", variant: "outline" as const }
    return { label: "Bajo", variant: "destructive" as const }
  }

  return (
    <LayoutDashboard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Calificaciones</h1>
            <p className="text-muted-foreground">Registra y administra las calificaciones de tus estudiantes</p>
          </div>
          <Dialogo>
            <ActivadorDialogo asChild>
              <Boton className="gap-2">
                <Plus className="w-4 h-4" />
                Nueva Calificación
              </Boton>
            </ActivadorDialogo>
            <ContenidoDialogo>
              <EncabezadoDialogo>
                <TituloDialogo>Registrar Nueva Calificación</TituloDialogo>
                <DescripcionDialogo>Ingresa la calificación del estudiante</DescripcionDialogo>
              </EncabezadoDialogo>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Etiqueta>Estudiante</Etiqueta>
                  <Selector>
                    <DisparadorSelector>
                      <ValorSelector placeholder="Seleccionar estudiante" />
                    </DisparadorSelector>
                    <ContenidoSelector>
                      {estudiantes.map((est) => (
                        <ElementoSelector key={est.id} value={est.id.toString()}>
                          {est.nombre}
                        </ElementoSelector>
                      ))}
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
                    </ContenidoSelector>
                  </Selector>
                </div>
                <div className="space-y-2">
                  <Etiqueta>Calificación</Etiqueta>
                  <Entrada type="number" min="0" max="5" step="0.1" placeholder="0.0 - 5.0" />
                </div>
                <Boton className="w-full">Guardar Calificación</Boton>
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
                <Selector value={materiaSeleccionada} onValueChange={setMateriaSeleccionada}>
                  <DisparadorSelector>
                    <ValorSelector />
                  </DisparadorSelector>
                  <ContenidoSelector>
                    <ElementoSelector value="matematicas-10a">Matemáticas 10-A</ElementoSelector>
                    <ElementoSelector value="fisica-11b">Física 11-B</ElementoSelector>
                    <ElementoSelector value="quimica-10c">Química 10-C</ElementoSelector>
                  </ContenidoSelector>
                </Selector>
              </div>
              <div className="space-y-2">
                <Etiqueta>Periodo</Etiqueta>
                <Selector defaultValue="1">
                  <DisparadorSelector>
                    <ValorSelector />
                  </DisparadorSelector>
                  <ContenidoSelector>
                    <ElementoSelector value="1">Primer Periodo</ElementoSelector>
                    <ElementoSelector value="2">Segundo Periodo</ElementoSelector>
                    <ElementoSelector value="3">Tercer Periodo</ElementoSelector>
                  </ContenidoSelector>
                </Selector>
              </div>
              <div className="space-y-2">
                <Etiqueta>Buscar Estudiante</Etiqueta>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Entrada
                    placeholder="Nombre del estudiante..."
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
            <TituloTarjeta>Calificaciones - Matemáticas 10-A</TituloTarjeta>
            <DescripcionTarjeta>Primer Periodo 2025</DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <Tabla>
              <CabeceraTabla>
                <FilaTabla>
                  <EncabezadoTabla>Estudiante</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Nota 1</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Nota 2</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Nota 3</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Promedio</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Estado</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Acciones</EncabezadoTabla>
                </FilaTabla>
              </CabeceraTabla>
              <CuerpoTabla>
                {estudiantes.map((estudiante) => {
                  const estado = obtenerEstadoNota(estudiante.promedio)
                  return (
                    <FilaTabla key={estudiante.id}>
                      <CeldaTabla className="font-medium">{estudiante.nombre}</CeldaTabla>
                      <CeldaTabla className={`text-center ${obtenerColorNota(estudiante.nota1)}`}>
                        {estudiante.nota1.toFixed(1)}
                      </CeldaTabla>
                      <CeldaTabla className={`text-center ${obtenerColorNota(estudiante.nota2)}`}>
                        {estudiante.nota2.toFixed(1)}
                      </CeldaTabla>
                      <CeldaTabla className={`text-center ${obtenerColorNota(estudiante.nota3)}`}>
                        {estudiante.nota3.toFixed(1)}
                      </CeldaTabla>
                      <CeldaTabla className={`text-center font-bold ${obtenerColorNota(estudiante.promedio)}`}>
                        {estudiante.promedio.toFixed(1)}
                      </CeldaTabla>
                      <CeldaTabla className="text-center">
                        <Insignia variant={estado.variant}>{estado.label}</Insignia>
                      </CeldaTabla>
                      <CeldaTabla className="text-center">
                        <Boton size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Boton>
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

export default PaginaCalificaciones
