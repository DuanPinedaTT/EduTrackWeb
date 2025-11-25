import { DisenoTablero } from "@/components/layout-dashboard"
import { useAutenticacion } from "@/components/proveedor-autenticacion"
import { Boton } from "@/components/ui/button"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Entrada } from "@/components/ui/input"
import { Etiqueta } from "@/components/ui/label"
import { Calendar, Mail, MapPin, Phone, Save, User } from "lucide-react"

export default function PaginaPerfilDocente() {
  const { usuario } = useAutenticacion()

  return (
    <DisenoTablero rolRequerido="docente">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground">Administra tu información personal</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Tarjeta className="md:col-span-2">
            <EncabezadoTarjeta>
              <TituloTarjeta>Información Personal</TituloTarjeta>
              <DescripcionTarjeta>Actualiza tus datos personales</DescripcionTarjeta>
            </EncabezadoTarjeta>
            <ContenidoTarjeta className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Etiqueta htmlFor="nombre">Nombre Completo</Etiqueta>
                  <Entrada id="nombre" defaultValue={usuario?.nombre} />
                </div>
                <div className="space-y-2">
                  <Etiqueta htmlFor="email">Correo Electrónico</Etiqueta>
                  <Entrada id="email" type="email" defaultValue={usuario?.email} />
                </div>
                <div className="space-y-2">
                  <Etiqueta htmlFor="telefono">Teléfono</Etiqueta>
                  <Entrada id="telefono" defaultValue="+57 300 123 4567" />
                </div>
                <div className="space-y-2">
                  <Etiqueta htmlFor="documento">Documento</Etiqueta>
                  <Entrada id="documento" defaultValue="1234567890" />
                </div>
                <div className="space-y-2">
                  <Etiqueta htmlFor="direccion">Dirección</Etiqueta>
                  <Entrada id="direccion" defaultValue="Calle 123 #45-67" />
                </div>
                <div className="space-y-2">
                  <Etiqueta htmlFor="ciudad">Ciudad</Etiqueta>
                  <Entrada id="ciudad" defaultValue="Valledupar" />
                </div>
              </div>
              <Boton className="gap-2">
                <Save className="w-4 h-4" />
                Guardar Cambios
              </Boton>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta>
              <TituloTarjeta>Resumen</TituloTarjeta>
            </EncabezadoTarjeta>
            <ContenidoTarjeta className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{usuario?.nombre}</p>
                  <p className="text-sm text-muted-foreground capitalize">{usuario?.rol}</p>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{usuario?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>+57 300 123 4567</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>Valledupar, Cesar</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Miembro desde 2024</span>
                </div>
              </div>
            </ContenidoTarjeta>
          </Tarjeta>
        </div>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Seguridad</TituloTarjeta>
            <DescripcionTarjeta>Actualiza tu contraseña</DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Etiqueta htmlFor="actual">Contraseña Actual</Etiqueta>
                <Entrada id="actual" type="password" />
              </div>
              <div className="space-y-2">
                <Etiqueta htmlFor="nueva">Nueva Contraseña</Etiqueta>
                <Entrada id="nueva" type="password" />
              </div>
              <div className="space-y-2">
                <Etiqueta htmlFor="confirmar">Confirmar Contraseña</Etiqueta>
                <Entrada id="confirmar" type="password" />
              </div>
            </div>
            <Boton className="mt-4">Cambiar Contraseña</Boton>
          </ContenidoTarjeta>
        </Tarjeta>
      </div>
    </DisenoTablero>
  )
}
