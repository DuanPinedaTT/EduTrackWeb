"use client"

import { useState } from "react"
import { LayoutDashboard } from "@/components/layout-dashboard"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Boton } from "@/components/ui/button"
import { Etiqueta } from "@/components/ui/label"
import { Selector, ContenidoSelector, ElementoSelector, DisparadorSelector, ValorSelector } from "@/components/ui/select"
import { Tabla, CuerpoTabla, CeldaTabla, CabeceraTabla, EncabezadoTabla, FilaTabla } from "@/components/ui/table"
import { Insignia } from "@/components/ui/badge"
import { Check, X, Clock } from "lucide-react"

const PaginaAsistencias = () => {
  const [materiaSeleccionada, setMateriaSeleccionada] = useState("matematicas-10a")
  const [asistencias, setAsistencias] = useState<Record<number, "presente" | "ausente" | "tarde">>({})

  const estudiantes = [
    { id: 1, nombre: "Juan Pérez", asistenciaTotal: 45, faltas: 3 },
    { id: 2, nombre: "María García", asistenciaTotal: 48, faltas: 0 },
    { id: 3, nombre: "Carlos López", asistenciaTotal: 42, faltas: 6 },
    { id: 4, nombre: "Ana Martínez", asistenciaTotal: 47, faltas: 1 },
    { id: 5, nombre: "Luis Rodríguez", asistenciaTotal: 44, faltas: 4 },
  ]

  const marcarAsistencia = (estudianteId: number, estado: "presente" | "ausente" | "tarde") => {
    setAsistencias((prev) => ({
      ...prev,
      [estudianteId]: estado,
    }))
  }

  const guardarAsistencias = () => {
    alert("Asistencias guardadas correctamente")
  }

  return (
    <LayoutDashboard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Asistencias</h1>
            <p className="text-muted-foreground">Registra la asistencia de tus estudiantes</p>
          </div>
          <Boton className="gap-2" onClick={guardarAsistencias}>
            <Check className="w-4 h-4" />
            Guardar Asistencias
          </Boton>
        </div>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Configuración</TituloTarjeta>
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
                <Etiqueta>Fecha</Etiqueta>
                <Selector defaultValue="hoy">
                  <DisparadorSelector>
                    <ValorSelector />
                  </DisparadorSelector>
                  <ContenidoSelector>
                    <ElementoSelector value="hoy">Hoy - {new Date().toLocaleDateString()}</ElementoSelector>
                    <ElementoSelector value="ayer">Ayer</ElementoSelector>
                    <ElementoSelector value="otra">Otra fecha...</ElementoSelector>
                  </ContenidoSelector>
                </Selector>
              </div>
              <div className="space-y-2">
                <Etiqueta>Hora de Clase</Etiqueta>
                <Selector defaultValue="1">
                  <DisparadorSelector>
                    <ValorSelector />
                  </DisparadorSelector>
                  <ContenidoSelector>
                    <ElementoSelector value="1">7:00 AM - 8:00 AM</ElementoSelector>
                    <ElementoSelector value="2">8:00 AM - 9:00 AM</ElementoSelector>
                    <ElementoSelector value="3">9:00 AM - 10:00 AM</ElementoSelector>
                  </ContenidoSelector>
                </Selector>
              </div>
            </div>
          </ContenidoTarjeta>
        </Tarjeta>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Lista de Asistencia - Matemáticas 10-A</TituloTarjeta>
            <DescripcionTarjeta>Marca la asistencia de cada estudiante</DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <Tabla>
              <CabeceraTabla>
                <FilaTabla>
                  <EncabezadoTabla>Estudiante</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Asistencias</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Faltas</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Estado Hoy</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Acciones</EncabezadoTabla>
                </FilaTabla>
              </CabeceraTabla>
              <CuerpoTabla>
                {estudiantes.map((estudiante) => {
                  const estadoActual = asistencias[estudiante.id]
                  return (
                    <FilaTabla key={estudiante.id}>
                      <CeldaTabla className="font-medium">{estudiante.nombre}</CeldaTabla>
                      <CeldaTabla className="text-center text-green-600 font-medium">
                        {estudiante.asistenciaTotal}
                      </CeldaTabla>
                      <CeldaTabla className="text-center text-red-600 font-medium">{estudiante.faltas}</CeldaTabla>
                      <CeldaTabla className="text-center">
                        {estadoActual === "presente" && <Insignia className="bg-green-600">Presente</Insignia>}
                        {estadoActual === "ausente" && <Insignia variant="destructive">Ausente</Insignia>}
                        {estadoActual === "tarde" && <Insignia className="bg-orange-600">Tarde</Insignia>}
                        {!estadoActual && <Insignia variant="outline">Sin marcar</Insignia>}
                      </CeldaTabla>
                      <CeldaTabla>
                        <div className="flex items-center justify-center gap-2">
                          <Boton
                            size="sm"
                            variant={estadoActual === "presente" ? "default" : "outline"}
                            onClick={() => marcarAsistencia(estudiante.id, "presente")}
                            className="gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Presente
                          </Boton>
                          <Boton
                            size="sm"
                            variant={estadoActual === "tarde" ? "default" : "outline"}
                            onClick={() => marcarAsistencia(estudiante.id, "tarde")}
                            className="gap-1"
                          >
                            <Clock className="w-3 h-3" />
                            Tarde
                          </Boton>
                          <Boton
                            size="sm"
                            variant={estadoActual === "ausente" ? "destructive" : "outline"}
                            onClick={() => marcarAsistencia(estudiante.id, "ausente")}
                            className="gap-1"
                          >
                            <X className="w-3 h-3" />
                            Ausente
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

export default PaginaAsistencias
