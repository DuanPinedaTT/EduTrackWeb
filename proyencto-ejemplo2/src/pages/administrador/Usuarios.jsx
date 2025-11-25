import { useState } from "react"
import { DisenoTablero } from "@/components/layout-dashboard"
import { Boton } from "@/components/ui/button"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Entrada } from "@/components/ui/input"
import { Etiqueta } from "@/components/ui/label"
import { Selector, ContenidoSelector, ElementoSelector, DisparadorSelector, ValorSelector } from "@/components/ui/select"
import { Tabla, CuerpoTabla, CeldaTabla, EncabezadoTabla, CabeceraTabla, FilaTabla } from "@/components/ui/table"
import { Dialogo, ContenidoDialogo, DescripcionDialogo, EncabezadoDialogo, TituloDialogo, ActivadorDialogo } from "@/components/ui/dialog"
import { UserPlus, Search, Edit, Trash2, Mail, Phone } from "lucide-react"
import { Insignia } from "@/components/ui/badge"

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
    <DisenoTablero rolRequerido="administrador">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">Administre estudiantes, docentes y personal</p>
          </div>
          <Dialogo open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
            <ActivadorDialogo asChild>
              <Boton className="gap-2">
                <UserPlus className="w-4 h-4" />
                Nuevo Usuario
              </Boton>
            </ActivadorDialogo>
            <ContenidoDialogo className="max-w-2xl">
              <EncabezadoDialogo>
                <TituloDialogo>Registrar Nuevo Usuario</TituloDialogo>
                <DescripcionDialogo>Complete los datos del nuevo usuario</DescripcionDialogo>
              </EncabezadoDialogo>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Etiqueta htmlFor="nombre">Nombre Completo</Etiqueta>
                    <Entrada id="nombre" placeholder="Ej: Juan Pérez" />
                  </div>
                  <div className="space-y-2">
                    <Etiqueta htmlFor="email">Correo Electrónico</Etiqueta>
                    <Entrada id="email" type="email" placeholder="usuario@edutrack.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Etiqueta htmlFor="telefono">Teléfono</Etiqueta>
                    <Entrada id="telefono" placeholder="3001234567" />
                  </div>
                  <div className="space-y-2">
                    <Etiqueta htmlFor="rol">Rol</Etiqueta>
                    <Selector>
                      <DisparadorSelector>
                        <ValorSelector placeholder="Seleccione un rol" />
                      </DisparadorSelector>
                      <ContenidoSelector>
                        <ElementoSelector value="estudiante">Estudiante</ElementoSelector>
                        <ElementoSelector value="docente">Docente</ElementoSelector>
                        <ElementoSelector value="administrador">Administrador</ElementoSelector>
                      </ContenidoSelector>
                    </Selector>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Etiqueta htmlFor="contrasena">Contraseña</Etiqueta>
                    <Entrada id="contrasena" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Etiqueta htmlFor="confirmar">Confirmar Contraseña</Etiqueta>
                    <Entrada id="confirmar" type="password" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Boton type="button" variant="outline" onClick={() => setDialogoAbierto(false)}>
                    Cancelar
                  </Boton>
                  <Boton type="submit">Registrar Usuario</Boton>
                </div>
              </form>
            </ContenidoDialogo>
          </Dialogo>
        </div>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Lista de Usuarios</TituloTarjeta>
            <DescripcionTarjeta>Total: {usuariosMock.length} usuarios registrados</DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Entrada
                  placeholder="Buscar por nombre o email..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Selector value={filtroRol} onValueChange={setFiltroRol}>
                <DisparadorSelector className="w-[180px]">
                  <ValorSelector />
                </DisparadorSelector>
                <ContenidoSelector>
                  <ElementoSelector value="todos">Todos los roles</ElementoSelector>
                  <ElementoSelector value="estudiante">Estudiantes</ElementoSelector>
                  <ElementoSelector value="docente">Docentes</ElementoSelector>
                  <ElementoSelector value="administrador">Administradores</ElementoSelector>
                </ContenidoSelector>
              </Selector>
            </div>

            <div className="rounded-md border">
              <Tabla>
                <CabeceraTabla>
                  <FilaTabla>
                    <EncabezadoTabla>Nombre</EncabezadoTabla>
                    <EncabezadoTabla>Email</EncabezadoTabla>
                    <EncabezadoTabla>Teléfono</EncabezadoTabla>
                    <EncabezadoTabla>Rol</EncabezadoTabla>
                    <EncabezadoTabla>Estado</EncabezadoTabla>
                    <EncabezadoTabla className="text-right">Acciones</EncabezadoTabla>
                  </FilaTabla>
                </CabeceraTabla>
                <CuerpoTabla>
                  {usuariosFiltrados.map((usuario) => (
                    <FilaTabla key={usuario.id}>
                      <CeldaTabla className="font-medium">{usuario.nombre}</CeldaTabla>
                      <CeldaTabla>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {usuario.email}
                        </div>
                      </CeldaTabla>
                      <CeldaTabla>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          {usuario.telefono}
                        </div>
                      </CeldaTabla>
                      <CeldaTabla>
                        <Insignia variant={usuario.rol === "administrador" ? "default" : "secondary"}>{usuario.rol}</Insignia>
                      </CeldaTabla>
                      <CeldaTabla>
                        <Insignia variant={usuario.estado === "activo" ? "default" : "outline"}>{usuario.estado}</Insignia>
                      </CeldaTabla>
                      <CeldaTabla className="text-right">
                        <div className="flex justify-end gap-2">
                          <Boton variant="ghost" size="icon">
                            <Edit className="w-4 h-4" />
                          </Boton>
                          <Boton variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Boton>
                        </div>
                      </CeldaTabla>
                    </FilaTabla>
                  ))}
                </CuerpoTabla>
              </Tabla>
            </div>
          </ContenidoTarjeta>
        </Tarjeta>
      </div>
    </DisenoTablero>
  )
}
