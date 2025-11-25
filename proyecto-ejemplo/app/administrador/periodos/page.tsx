"use client"

import { LayoutDashboard } from "@/components/layout-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nuevo Periodo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Periodo</DialogTitle>
                <DialogDescription>Ingresa los datos del nuevo periodo académico</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nombre del Periodo</Label>
                  <Input placeholder="Ej: Primer Periodo 2025" />
                </div>
                <div className="space-y-2">
                  <Label>Fecha de Inicio</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Fecha de Fin</Label>
                  <Input type="date" />
                </div>
                <Button className="w-full">Guardar Periodo</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Periodo Activo</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Primer Periodo</div>
              <p className="text-xs text-muted-foreground">Enero - Marzo 2025</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Periodos</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Periodos en 2025</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Días Restantes</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">Del periodo actual</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Periodos Académicos 2025</CardTitle>
            <CardDescription>Calendario de periodos del año académico</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Periodo</TableHead>
                  <TableHead>Fecha de Inicio</TableHead>
                  <TableHead>Fecha de Fin</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {periodos.map((periodo) => {
                  const inicio = new Date(periodo.fechaInicio)
                  const fin = new Date(periodo.fechaFin)
                  const duracion = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))

                  return (
                    <TableRow key={periodo.id}>
                      <TableCell className="font-medium">{periodo.nombre}</TableCell>
                      <TableCell>{inicio.toLocaleDateString()}</TableCell>
                      <TableCell>{fin.toLocaleDateString()}</TableCell>
                      <TableCell>{duracion} días</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={obtenerVarianteEstado(periodo.estado) as any}>{periodo.estado}</Badge>
                      </TableCell>
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

export default PaginaPeriodos
