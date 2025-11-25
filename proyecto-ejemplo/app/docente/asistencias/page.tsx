"use client"

import { useState } from "react"
import { LayoutDashboard } from "@/components/layout-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
          <Button className="gap-2" onClick={guardarAsistencias}>
            <Check className="w-4 h-4" />
            Guardar Asistencias
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Materia</Label>
                <Select value={materiaSeleccionada} onValueChange={setMateriaSeleccionada}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matematicas-10a">Matemáticas 10-A</SelectItem>
                    <SelectItem value="fisica-11b">Física 11-B</SelectItem>
                    <SelectItem value="quimica-10c">Química 10-C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fecha</Label>
                <Select defaultValue="hoy">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hoy">Hoy - {new Date().toLocaleDateString()}</SelectItem>
                    <SelectItem value="ayer">Ayer</SelectItem>
                    <SelectItem value="otra">Otra fecha...</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Hora de Clase</Label>
                <Select defaultValue="1">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">7:00 AM - 8:00 AM</SelectItem>
                    <SelectItem value="2">8:00 AM - 9:00 AM</SelectItem>
                    <SelectItem value="3">9:00 AM - 10:00 AM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Asistencia - Matemáticas 10-A</CardTitle>
            <CardDescription>Marca la asistencia de cada estudiante</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead className="text-center">Asistencias</TableHead>
                  <TableHead className="text-center">Faltas</TableHead>
                  <TableHead className="text-center">Estado Hoy</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estudiantes.map((estudiante) => {
                  const estadoActual = asistencias[estudiante.id]
                  return (
                    <TableRow key={estudiante.id}>
                      <TableCell className="font-medium">{estudiante.nombre}</TableCell>
                      <TableCell className="text-center text-green-600 font-medium">
                        {estudiante.asistenciaTotal}
                      </TableCell>
                      <TableCell className="text-center text-red-600 font-medium">{estudiante.faltas}</TableCell>
                      <TableCell className="text-center">
                        {estadoActual === "presente" && <Badge className="bg-green-600">Presente</Badge>}
                        {estadoActual === "ausente" && <Badge variant="destructive">Ausente</Badge>}
                        {estadoActual === "tarde" && <Badge className="bg-orange-600">Tarde</Badge>}
                        {!estadoActual && <Badge variant="outline">Sin marcar</Badge>}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant={estadoActual === "presente" ? "default" : "outline"}
                            onClick={() => marcarAsistencia(estudiante.id, "presente")}
                            className="gap-1"
                          >
                            <Check className="w-3 h-3" />
                            Presente
                          </Button>
                          <Button
                            size="sm"
                            variant={estadoActual === "tarde" ? "default" : "outline"}
                            onClick={() => marcarAsistencia(estudiante.id, "tarde")}
                            className="gap-1"
                          >
                            <Clock className="w-3 h-3" />
                            Tarde
                          </Button>
                          <Button
                            size="sm"
                            variant={estadoActual === "ausente" ? "destructive" : "outline"}
                            onClick={() => marcarAsistencia(estudiante.id, "ausente")}
                            className="gap-1"
                          >
                            <X className="w-3 h-3" />
                            Ausente
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </LayoutDashboard>
  )
}

export default PaginaAsistencias
