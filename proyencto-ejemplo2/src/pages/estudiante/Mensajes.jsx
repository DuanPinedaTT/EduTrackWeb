import { DisenoTablero } from "@/components/layout-dashboard"
import { Tarjeta, ContenidoTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Inbox, Send } from "lucide-react"

export default function PaginaMensajesEstudiante() {
  return (
    <DisenoTablero rolRequerido="estudiante">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mis Mensajes</h1>
          <p className="text-muted-foreground">Mensajes de tus profesores y el sistema</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
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

          <Tarjeta>
            <EncabezadoTarjeta>
              <TituloTarjeta className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Mensajes Enviados
              </TituloTarjeta>
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <p className="text-muted-foreground text-center py-8">No has enviado mensajes</p>
            </ContenidoTarjeta>
          </Tarjeta>
        </div>
      </div>
    </DisenoTablero>
  )
}
