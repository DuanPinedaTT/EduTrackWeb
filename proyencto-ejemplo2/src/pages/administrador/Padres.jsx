import { useState } from "react"
import { DisenoTablero } from "@/components/layout-dashboard"
import { Insignia } from "@/components/ui/badge"
import { Boton } from "@/components/ui/button"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import {
  Dialogo,
  ContenidoDialogo,
  DescripcionDialogo,
  EncabezadoDialogo,
  TituloDialogo,
  ActivadorDialogo,
} from "@/components/ui/dialog"
import { Entrada } from "@/components/ui/input"
import { Etiqueta } from "@/components/ui/label"
import { Tabla, CuerpoTabla, CeldaTabla, EncabezadoTabla, CabeceraTabla, FilaTabla } from "@/components/ui/table"
import { Edit, LinkIcon, Mail, Phone, Plus, Search, Trash2, UserCheck } from "lucide-react"

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
  const [nuevoPadre, setNuevoPadre] = useState({ nombre: "", email: "", telefono: "", estudiante: "" })

  const registrarPadre = () => {
    console.log("[v0] Registrando padre:", nuevoPadre)
    alert("Padre de familia registrado exitosamente")
    setNuevoPadre({ nombre: "", email: "", telefono: "", estudiante: "" })
    setDialogoAbierto(false)
  }

  const enviarInvitacion = (padre) => {
    console.log("[v0] Enviando invitación a:", padre.email)
    alert(`Invitación enviada a ${padre.nombre}`)
  }

  return (
    <DisenoTablero rolRequerido="administrador">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Padres de Familia</h1>
          <p className="text-muted-foreground">Administra padres y acudientes del sistema</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between pb-2">
              <TituloTarjeta className="text-sm font-medium">Total Padres</TituloTarjeta>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Registrados en el sistema</p>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between pb-2">
              <TituloTarjeta className="text-sm font-medium">Cuentas Activas</TituloTarjeta>
              <UserCheck className="h-4 w-4 text-secondary" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Con acceso al sistema</p>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between pb-2">
              <TituloTarjeta className="text-sm font-medium">Invitaciones Pendientes</TituloTarjeta>
              <Mail className="h-4 w-4 text-destructive" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Sin activar cuenta</p>
            </ContenidoTarjeta>
          </Tarjeta>
        </div>

        <Tarjeta>
          <EncabezadoTarjeta>
            <div className="flex items-center justify-between">
              <div>
                <TituloTarjeta>Padres Registrados</TituloTarjeta>
                <DescripcionTarjeta>Lista de padres y acudientes vinculados</DescripcionTarjeta>
              </div>
              <Dialogo open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
                <ActivadorDialogo asChild>
                  <Boton>
                    <Plus className="w-4 h-4 mr-2" />
                    Registrar Padre
                  </Boton>
                </ActivadorDialogo>
                <ContenidoDialogo>
                  <EncabezadoDialogo>
                    <TituloDialogo>Registrar Nuevo Padre</TituloDialogo>
                    <DescripcionDialogo>Complete la información del padre o acudiente</DescripcionDialogo>
                  </EncabezadoDialogo>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Etiqueta htmlFor="nombre">Nombre Completo</Etiqueta>
                      <Entrada
                        id="nombre"
                        value={nuevoPadre.nombre}
                        onChange={(e) => setNuevoPadre({ ...nuevoPadre, nombre: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Etiqueta htmlFor="email">Correo Electrónico</Etiqueta>
                      <Entrada
                        id="email"
                        type="email"
                        value={nuevoPadre.email}
                        onChange={(e) => setNuevoPadre({ ...nuevoPadre, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Etiqueta htmlFor="telefono">Teléfono</Etiqueta>
                      <Entrada
                        id="telefono"
                        value={nuevoPadre.telefono}
                        onChange={(e) => setNuevoPadre({ ...nuevoPadre, telefono: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Etiqueta htmlFor="estudiante">Estudiante a Vincular</Etiqueta>
                      <Entrada
                        id="estudiante"
                        placeholder="Nombre del estudiante"
                        value={nuevoPadre.estudiante}
                        onChange={(e) => setNuevoPadre({ ...nuevoPadre, estudiante: e.target.value })}
                      />
                    </div>
                    <Boton onClick={registrarPadre} className="w-full">
                      Registrar
                    </Boton>
                  </div>
                </ContenidoDialogo>
              </Dialogo>
            </div>
          </EncabezadoTarjeta>
          <ContenidoTarjeta className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Entrada
                placeholder="Buscar padres..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>

            <Tabla>
              <CabeceraTabla>
                <FilaTabla>
                  <EncabezadoTabla>Nombre</EncabezadoTabla>
                  <EncabezadoTabla>Contacto</EncabezadoTabla>
                  <EncabezadoTabla>Estudiantes</EncabezadoTabla>
                  <EncabezadoTabla>Estado</EncabezadoTabla>
                  <EncabezadoTabla>Acciones</EncabezadoTabla>
                </FilaTabla>
              </CabeceraTabla>
              <CuerpoTabla>
                {padresSimulados.map((padre) => (
                  <FilaTabla key={padre.id}>
                    <CeldaTabla className="font-medium">{padre.nombre}</CeldaTabla>
                    <CeldaTabla>
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
                    </CeldaTabla>
                    <CeldaTabla>
                      <div className="space-y-1">
                        {padre.estudiantes.map((estudiante, indice) => (
                          <div key={indice} className="flex items-center gap-2">
                            <LinkIcon className="w-3 h-3" />
                            <span className="text-sm">{estudiante}</span>
                          </div>
                        ))}
                      </div>
                    </CeldaTabla>
                    <CeldaTabla>
                      <Insignia variant={padre.estado === "activo" ? "default" : "secondary"}>{padre.estado}</Insignia>
                    </CeldaTabla>
                    <CeldaTabla>
                      <div className="flex gap-2">
                        {padre.estado === "pendiente" && (
                          <Boton size="sm" variant="outline" onClick={() => enviarInvitacion(padre)}>
                            <Mail className="w-3 h-3 mr-1" />
                            Invitar
                          </Boton>
                        )}
                        <Boton size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Boton>
                        <Boton size="sm" variant="outline">
                          <Trash2 className="w-3 h-3" />
                        </Boton>
                      </div>
                    </CeldaTabla>
                  </FilaTabla>
                ))}
              </CuerpoTabla>
            </Tabla>
          </ContenidoTarjeta>
        </Tarjeta>
      </div>
    </DisenoTablero>
  )
}
