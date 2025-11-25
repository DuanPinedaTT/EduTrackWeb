"use client"

import { useState } from "react"
import { LayoutDashboard } from "@/components/layout-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const PaginaMaterias = () => {
  const [busqueda, setBusqueda] = useState("")

  const materias = [
    { id: 1, nombre: "Matemáticas", codigo: "MAT-101", grado: "10°", docente: "Prof. García", estudiantes: 32 },
    { id: 2, nombre: "Física", codigo: "FIS-201", grado: "11°", docente: "Prof. Martínez", estudiantes: 28 },
    { id: 3, nombre: "Química", codigo: "QUI-101", grado: "10°", docente: "Prof. López", estudiantes: 30 },
    { id: 4, nombre: "Inglés", codigo: "ING-101", grado: "10°", docente: "Prof. Rodríguez", estudiantes: 35 },
    { id: 5, nombre: "Historia", codigo: "HIS-101", grado: "10°", docente: "Prof. Pérez", estudiantes: 33 },
  ]

  return (
    <LayoutDashboard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Materias</h1>
            <p className="text-muted-foreground">Administra las materias del sistema</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nueva Materia
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Nueva Materia</DialogTitle>
                <DialogDescription>Ingresa los datos de la nueva materia</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nombre de la Materia</Label>
                  <Input placeholder="Ej: Matemáticas" />
                </div>
                <div className="space-y-2">
                  <Label>Código</Label>
                  <Input placeholder="Ej: MAT-101" />
                </div>
                <div className="space-y-2">
                  <Label>Grado</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar grado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6° Grado</SelectItem>
                      <SelectItem value="7">7° Grado</SelectItem>
                      <SelectItem value="8">8° Grado</SelectItem>
                      <SelectItem value="9">9° Grado</SelectItem>
                      <SelectItem value="10">10° Grado</SelectItem>
                      <SelectItem value="11">11° Grado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Docente Asignado</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar docente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Prof. García</SelectItem>
                      <SelectItem value="2">Prof. Martínez</SelectItem>
                      <SelectItem value="3">Prof. López</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Guardar Materia</Button>
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
                <Label>Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar materia..."
                    className="pl-9"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Grado</Label>
                <Select defaultValue="todos">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los grados</SelectItem>
                    <SelectItem value="10">10° Grado</SelectItem>
                    <SelectItem value="11">11° Grado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Docente</Label>
                <Select defaultValue="todos">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los docentes</SelectItem>
                    <SelectItem value="1">Prof. García</SelectItem>
                    <SelectItem value="2">Prof. Martínez</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Materias</CardTitle>
            <CardDescription>Total: {materias.length} materias registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Materia</TableHead>
                  <TableHead>Grado</TableHead>
                  <TableHead>Docente</TableHead>
                  <TableHead className="text-center">Estudiantes</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materias.map((materia) => (
                  <TableRow key={materia.id}>
                    <TableCell className="font-mono">{materia.codigo}</TableCell>
                    <TableCell className="font-medium">{materia.nombre}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{materia.grado}</Badge>
                    </TableCell>
                    <TableCell>{materia.docente}</TableCell>
                    <TableCell className="text-center">{materia.estudiantes}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </LayoutDashboard>
  )
}

export default PaginaMaterias
