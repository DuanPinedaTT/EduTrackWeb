"use client"

import { useState } from "react"
import { LayoutDashboard } from "@/components/layout-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nueva Calificación
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Nueva Calificación</DialogTitle>
                <DialogDescription>Ingresa la calificación del estudiante</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Estudiante</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estudiante" />
                    </SelectTrigger>
                    <SelectContent>
                      {estudiantes.map((est) => (
                        <SelectItem key={est.id} value={est.id.toString()}>
                          {est.nombre}
                        </SelectItem>
                      ))}
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
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Calificación</Label>
                  <Input type="number" min="0" max="5" step="0.1" placeholder="0.0 - 5.0" />
                </div>
                <Button className="w-full">Guardar Calificación</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
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
                <Label>Buscar Estudiante</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nombre del estudiante..."
                    className="pl-9"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calificaciones - Matemáticas 10-A</CardTitle>
            <CardDescription>Primer Periodo 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead className="text-center">Nota 1</TableHead>
                  <TableHead className="text-center">Nota 2</TableHead>
                  <TableHead className="text-center">Nota 3</TableHead>
                  <TableHead className="text-center">Promedio</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estudiantes.map((estudiante) => {
                  const estado = obtenerEstadoNota(estudiante.promedio)
                  return (
                    <TableRow key={estudiante.id}>
                      <TableCell className="font-medium">{estudiante.nombre}</TableCell>
                      <TableCell className={`text-center ${obtenerColorNota(estudiante.nota1)}`}>
                        {estudiante.nota1.toFixed(1)}
                      </TableCell>
                      <TableCell className={`text-center ${obtenerColorNota(estudiante.nota2)}`}>
                        {estudiante.nota2.toFixed(1)}
                      </TableCell>
                      <TableCell className={`text-center ${obtenerColorNota(estudiante.nota3)}`}>
                        {estudiante.nota3.toFixed(1)}
                      </TableCell>
                      <TableCell className={`text-center font-bold ${obtenerColorNota(estudiante.promedio)}`}>
                        {estudiante.promedio.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={estado.variant}>{estado.label}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
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

export default PaginaCalificaciones
