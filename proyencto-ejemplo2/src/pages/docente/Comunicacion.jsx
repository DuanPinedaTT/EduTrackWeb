import { useState } from "react"
import { DisenoTablero } from "@/components/layout-dashboard"
import { Boton } from "@/components/ui/button"
import { Tarjeta, ContenidoTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Entrada } from "@/components/ui/input"
import { Etiqueta } from "@/components/ui/label"
import { Pestanas, ContenidoPestanas, ListaPestanas, DisparadorPestanas } from "@/components/ui/tabs"
import { AreaTexto } from "@/components/ui/textarea"
import { Inbox, Send } from "lucide-react"

export default function PaginaComunicacionDocente() {
  const [nuevoMensaje, setNuevoMensaje] = useState({ destinatario: "", mensaje: "" })

  const actualizarCampo = (campo, valor) => {
    setNuevoMensaje((prev) => ({ ...prev, [campo]: valor }))
  }

  const enviarMensaje = () => {
    console.log("[v0] Enviar mensaje", nuevoMensaje)
    alert("Mensaje enviado")
    setNuevoMensaje({ destinatario: "", mensaje: "" })
  }

  return (
    <DisenoTablero rolRequerido="docente">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mensajería</h1>
          <p className="text-muted-foreground">Comunícate con estudiantes, padres y otros docentes</p>
        </div>

        <Pestanas defaultValue="recibidos" className="space-y-4">
          <ListaPestanas>
            <DisparadorPestanas value="recibidos">Recibidos</DisparadorPestanas>
            <DisparadorPestanas value="enviados">Enviados</DisparadorPestanas>
            <DisparadorPestanas value="nuevo">Nuevo Mensaje</DisparadorPestanas>
          </ListaPestanas>

          <ContenidoPestanas value="recibidos">
            <Tarjeta>
              <EncabezadoTarjeta>
                <TituloTarjeta className="flex items-center gap-2">
                  <Inbox className="w-5 h-5" />
                  Mensajes Recibidos
                </TituloTarjeta>
              </EncabezadoTarjeta>
              <ContenidoTarjeta>
                <p className="text-muted-foreground text-center py-8">No hay mensajes nuevos</p>
              </ContenidoTarjeta>
            </Tarjeta>
          </ContenidoPestanas>

          <ContenidoPestanas value="nuevo">
            <Tarjeta>
              <EncabezadoTarjeta>
                <TituloTarjeta className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Enviar Mensaje
                </TituloTarjeta>
              </EncabezadoTarjeta>
              <ContenidoTarjeta className="space-y-4">
                <div className="space-y-2">
                  <Etiqueta>Destinatario</Etiqueta>
                  <Entrada
                    placeholder="Buscar usuario..."
                    value={nuevoMensaje.destinatario}
                    onChange={(e) => actualizarCampo("destinatario", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Etiqueta>Mensaje</Etiqueta>
                  <AreaTexto
                    rows={6}
                    placeholder="Escriba su mensaje..."
                    value={nuevoMensaje.mensaje}
                    onChange={(e) => actualizarCampo("mensaje", e.target.value)}
                  />
                </div>
                <Boton className="w-full" onClick={enviarMensaje}>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar
                </Boton>
              </ContenidoTarjeta>
            </Tarjeta>
          </ContenidoPestanas>
        </Pestanas>
      </div>
    </DisenoTablero>
  )
}
