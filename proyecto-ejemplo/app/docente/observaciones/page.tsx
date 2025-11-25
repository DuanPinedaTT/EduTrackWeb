"use client"

import { useState } from "react"
import { LayoutDashboard } from "@/components/layout-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nueva Observación
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Nueva Observación</DialogTitle>
                <DialogDescription>Agrega una observación sobre un estudiante</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Estudiante</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estudiante" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Juan Pérez</SelectItem>
                      <SelectItem value="2">María García</SelectItem>
                      <SelectItem value="3">Carlos López</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Materia</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar materia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mat">Matemáticas 10-A</SelectItem>
                      <SelectItem value="fis">Física 11-B</SelectItem>
                      <SelectItem value="qui">Química 10-C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Observación</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="positiva">Positiva</SelectItem>
                      <SelectItem value="atencion">Requiere Atención</SelectItem>
                      <SelectItem value="disciplinaria">Disciplinaria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Observación</Label>
                  <Textarea placeholder="Describe la observación..." rows={4} />
                </div>
                <Button className="w-full">Guardar Observación</Button>
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
                <Select defaultValue="todas">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las materias</SelectItem>
                    <SelectItem value="mat">Matemáticas 10-A</SelectItem>
                    <SelectItem value="fis">Física 11-B</SelectItem>
                    <SelectItem value="qui">Química 10-C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select defaultValue="todos">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los tipos</SelectItem>
                    <SelectItem value="positiva">Positivas</SelectItem>
                    <SelectItem value="atencion">Requiere Atención</SelectItem>
                    <SelectItem value="disciplinaria">Disciplinarias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar estudiante..."
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
            <CardTitle>Observaciones Registradas</CardTitle>
            <CardDescription>Historial de observaciones de tus estudiantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {observaciones.map((obs) => (
                <div key={obs.id} className="p-4 border rounded-lg space-y-3 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{obs.estudiante}</h4>
                      <p className="text-sm text-muted-foreground">{obs.materia}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={obtenerVarianteTipo(obs.tipo) as any}>{obs.tipo}</Badge>
                      <span className="text-xs text-muted-foreground">{new Date(obs.fecha).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-sm">{obs.observacion}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Editar
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive">
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutDashboard>
  )
}
