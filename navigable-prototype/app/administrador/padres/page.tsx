"use client"

import { LayoutDashboard } from "@/components/layout-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UserCheck, Plus, Search, Mail, Phone, LinkIcon, Edit, Trash2 } from "lucide-react"
import { useState } from "react"

const padresSimulados = [
  {
    id: 1,
    nombre: "Carlos Rodríguez",
    email: "carlos.r@email.com",
    telefono: "300-123-4567",
    estudiantes: ["Ana Rodríguez (10-A)", "Luis Rodríguez (8-B)"],
    estado: "activo",
  },
  {
    id: 2,
    nombre: "María Gómez",
    email: "maria.g@email.com",
    telefono: "310-987-6543",
    estudiantes: ["Pedro Gómez (11-A)"],
    estado: "activo",
  },
  {
    id: 3,
    nombre: "José Martínez",
    email: "jose.m@email.com",
    telefono: "320-456-7890",
    estudiantes: ["Laura Martínez (9-B)"],
    estado: "pendiente",
  },
]

export default function PaginaPadres() {
  const [busqueda, setBusqueda] = useState("")
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [nuevoPadre, setNuevoPadre] = useState({
    nombre: "",
    email: "",
    telefono: "",
    estudiante: "",
  })

  const registrarPadre = () => {
    console.log("[v0] Registrando padre:", nuevoPadre)
    alert("Padre de familia registrado exitosamente")
    setNuevoPadre({ nombre: "", email: "", telefono: "", estudiante: "" })
    setDialogoAbierto(false)
  }

  const enviarInvitacion = (padre: any) => {
    console.log("[v0] Enviando invitación a:", padre.email)
    alert(`Invitación enviada a ${padre.nombre}`)
  }

  return (
    <LayoutDashboard rolRequerido="administrador">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Padres de Familia</h1>
          <p className="text-muted-foreground">Administra padres y acudientes del sistema</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Padres</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Registrados en el sistema</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cuentas Activas</CardTitle>
              <UserCheck className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Con acceso al sistema</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Invitaciones Pendientes</CardTitle>
              <Mail className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Sin activar cuenta</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Padres Registrados</CardTitle>
                <CardDescription>Lista de padres y acudientes vinculados</CardDescription>
              </div>
              <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Registrar Padre
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Nuevo Padre</DialogTitle>
                    <DialogDescription>Complete la información del padre o acudiente</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre Completo</Label>
                      <Input
                        id="nombre"
                        value={nuevoPadre.nombre}
                        onChange={(e) => setNuevoPadre({ ...nuevoPadre, nombre: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={nuevoPadre.email}
                        onChange={(e) => setNuevoPadre({ ...nuevoPadre, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        value={nuevoPadre.telefono}
                        onChange={(e) => setNuevoPadre({ ...nuevoPadre, telefono: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estudiante">Estudiante a Vincular</Label>
                      <Input
                        id="estudiante"
                        placeholder="Nombre del estudiante"
                        value={nuevoPadre.estudiante}
                        onChange={(e) => setNuevoPadre({ ...nuevoPadre, estudiante: e.target.value })}
                      />
                    </div>
                    <Button onClick={registrarPadre} className="w-full">
                      Registrar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar padres..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Estudiantes</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {padresSimulados.map((padre) => (
                  <TableRow key={padre.id}>
                    <TableCell className="font-medium">{padre.nombre}</TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          {padre.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          {padre.telefono}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {padre.estudiantes.map((est, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <LinkIcon className="w-3 h-3" />
                            <span className="text-sm">{est}</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={padre.estado === "activo" ? "default" : "secondary"}>{padre.estado}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {padre.estado === "pendiente" && (
                          <Button size="sm" variant="outline" onClick={() => enviarInvitacion(padre)}>
                            <Mail className="w-3 h-3 mr-1" />
                            Invitar
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-3 h-3" />
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
