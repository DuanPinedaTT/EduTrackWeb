"use client"

import { useState } from "react"
import { LayoutDashboard } from "@/components/layout-dashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UserPlus, Search, Edit, Trash2, Mail, Phone } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const usuariosMock = [
  {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan@edutrack.com",
    rol: "estudiante",
    telefono: "3001234567",
    estado: "activo",
  },
  {
    id: 2,
    nombre: "María García",
    email: "maria@edutrack.com",
    rol: "docente",
    telefono: "3007654321",
    estado: "activo",
  },
  {
    id: 3,
    nombre: "Carlos López",
    email: "carlos@edutrack.com",
    rol: "estudiante",
    telefono: "3009876543",
    estado: "activo",
  },
  {
    id: 4,
    nombre: "Ana Martínez",
    email: "ana@edutrack.com",
    rol: "docente",
    telefono: "3005551234",
    estado: "inactivo",
  },
]

export default function PaginaUsuarios() {
  const [busqueda, setBusqueda] = useState("")
  const [filtroRol, setFiltroRol] = useState("todos")
  const [dialogoAbierto, setDialogoAbierto] = useState(false)

  const usuariosFiltrados = usuariosMock.filter((usuario) => {
    const coincideBusqueda =
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busqueda.toLowerCase())
    const coincideRol = filtroRol === "todos" || usuario.rol === filtroRol
    return coincideBusqueda && coincideRol
  })

  return (
    <LayoutDashboard rolRequerido="administrador">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">Administre estudiantes, docentes y personal</p>
          </div>
          <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="w-4 h-4" />
                Nuevo Usuario
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Usuario</DialogTitle>
                <DialogDescription>Complete los datos del nuevo usuario</DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre Completo</Label>
                    <Input id="nombre" placeholder="Ej: Juan Pérez" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input id="email" type="email" placeholder="usuario@edutrack.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input id="telefono" placeholder="3001234567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rol">Rol</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="estudiante">Estudiante</SelectItem>
                        <SelectItem value="docente">Docente</SelectItem>
                        <SelectItem value="administrador">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contrasena">Contraseña</Label>
                    <Input id="contrasena" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmar">Confirmar Contraseña</Label>
                    <Input id="confirmar" type="password" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogoAbierto(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Registrar Usuario</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuarios</CardTitle>
            <CardDescription>Total: {usuariosMock.length} usuarios registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filtroRol} onValueChange={setFiltroRol}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los roles</SelectItem>
                  <SelectItem value="estudiante">Estudiantes</SelectItem>
                  <SelectItem value="docente">Docentes</SelectItem>
                  <SelectItem value="administrador">Administradores</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuariosFiltrados.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">{usuario.nombre}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {usuario.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          {usuario.telefono}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={usuario.rol === "administrador" ? "default" : "secondary"}>{usuario.rol}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={usuario.estado === "activo" ? "default" : "outline"}>{usuario.estado}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutDashboard>
  )
}
