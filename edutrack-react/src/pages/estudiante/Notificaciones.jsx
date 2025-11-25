import { DisenoTablero } from "@/components/layout-dashboard"
import { Insignia } from "@/components/ui/badge"
import { Tarjeta, ContenidoTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Bell } from "lucide-react"

const notificaciones = [
  {
    id: 1,
    tipo: "tarea",
    titulo: "Nueva tarea de Matemáticas",
    mensaje: "El profesor ha publicado una nueva tarea con fecha de entrega 25/01/2025",
    fecha: "Hace 2 horas",
    leida: false,
  },
  {
    id: 2,
    tipo: "calificacion",
    titulo: "Calificación publicada",
    mensaje: "Tu ensayo de Historia ha sido calificado: 4.5",
    fecha: "Hace 1 día",
    leida: true,
  },
]

export default function PaginaNotificacionesEstudiante() {
  return (
    <DisenoTablero rolRequerido="estudiante">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Notificaciones</h1>
          <p className="text-muted-foreground">Mantente al día con tus actividades académicas</p>
        </div>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Todas las Notificaciones
            </TituloTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta className="space-y-3">
            {notificaciones.map((notif) => (
              <Tarjeta key={notif.id} className={!notif.leida ? "border-primary" : ""}>
                <ContenidoTarjeta className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{notif.titulo}</p>
                        {!notif.leida && <Insignia>Nueva</Insignia>}
                      </div>
                      <p className="text-sm text-muted-foreground">{notif.mensaje}</p>
                      <p className="text-xs text-muted-foreground mt-2">{notif.fecha}</p>
                    </div>
                  </div>
                </ContenidoTarjeta>
              </Tarjeta>
            ))}
          </ContenidoTarjeta>
        </Tarjeta>
      </div>
    </DisenoTablero>
  )
}
