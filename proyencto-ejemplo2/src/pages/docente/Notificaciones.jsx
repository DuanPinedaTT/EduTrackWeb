import { useState } from "react"
import { DisenoTablero } from "@/components/layout-dashboard"
import { Insignia } from "@/components/ui/badge"
import { Boton } from "@/components/ui/button"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Entrada } from "@/components/ui/input"
import { Etiqueta } from "@/components/ui/label"
import { Selector, ContenidoSelector, ElementoSelector, DisparadorSelector, ValorSelector } from "@/components/ui/select"
import { AreaTexto } from "@/components/ui/textarea"
import { AlertCircle, Bell, Calendar, Send } from "lucide-react"

const notificacionesEnviadas = [
  {
    id: 1,
    titulo: "Examen de Matemáticas",
    mensaje: "Recordatorio: Examen el próximo viernes",
    fecha: "2025-01-10",
    destinatarios: "Matemáticas 10-A",
  },
  {
    id: 2,
    titulo: "Tarea de Física",
    mensaje: "Entregar tarea sobre movimiento circular",
    fecha: "2025-01-08",
    destinatarios: "Física 11-B",
  },
  {
    id: 3,
    titulo: "Recuperación",
    mensaje: "Oportunidad de recuperación para estudiantes con bajo rendimiento",
    fecha: "2025-01-05",
    destinatarios: "Todos los cursos",
  },
]

export default function PaginaNotificacionesDocente() {
  const [titulo, setTitulo] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [destinatario, setDestinatario] = useState("")

  const enviarNotificacion = () => {
    if (!titulo || !mensaje || !destinatario) {
      alert("Por favor completa todos los campos")
      return
    }

    alert("Notificación enviada correctamente")
    setTitulo("")
    setMensaje("")
    setDestinatario("")
  }

  return (
    <DisenoTablero rolRequerido="docente">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Notificaciones</h1>
          <p className="text-muted-foreground">Envía notificaciones a tus estudiantes sobre tareas y evaluaciones</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Tarjeta>
            <EncabezadoTarjeta>
              <TituloTarjeta className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Nueva Notificación
              </TituloTarjeta>
              <DescripcionTarjeta>Envía un mensaje a tus estudiantes</DescripcionTarjeta>
            </EncabezadoTarjeta>
            <ContenidoTarjeta className="space-y-4">
              <div className="space-y-2">
                <Etiqueta htmlFor="destinatario">Destinatarios</Etiqueta>
                <Selector value={destinatario} onValueChange={setDestinatario}>
                  <DisparadorSelector id="destinatario">
                    <ValorSelector placeholder="Seleccionar destinatarios" />
                  </DisparadorSelector>
                  <ContenidoSelector>
                    <ElementoSelector value="matematicas-10a">Matemáticas 10-A</ElementoSelector>
                    <ElementoSelector value="fisica-11b">Física 11-B</ElementoSelector>
                    <ElementoSelector value="quimica-10c">Química 10-C</ElementoSelector>
                    <ElementoSelector value="todos">Todos mis estudiantes</ElementoSelector>
                  </ContenidoSelector>
                </Selector>
              </div>

              <div className="space-y-2">
                <Etiqueta htmlFor="titulo">Título</Etiqueta>
                <Entrada
                  id="titulo"
                  placeholder="Ej: Examen de Matemáticas"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Etiqueta htmlFor="mensaje">Mensaje</Etiqueta>
                <AreaTexto
                  id="mensaje"
                  placeholder="Escribe el contenido de la notificación..."
                  rows={5}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Etiqueta htmlFor="tipo">Tipo de Notificación</Etiqueta>
                <Selector defaultValue="general">
                  <DisparadorSelector id="tipo">
                    <ValorSelector />
                  </DisparadorSelector>
                  <ContenidoSelector>
                    <ElementoSelector value="general">General</ElementoSelector>
                    <ElementoSelector value="tarea">Tarea</ElementoSelector>
                    <ElementoSelector value="examen">Examen</ElementoSelector>
                    <ElementoSelector value="alerta">Alerta</ElementoSelector>
                  </ContenidoSelector>
                </Selector>
              </div>

              <Boton className="w-full gap-2" onClick={enviarNotificacion}>
                <Send className="w-4 h-4" />
                Enviar Notificación
              </Boton>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta>
              <TituloTarjeta className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificaciones Enviadas
              </TituloTarjeta>
              <DescripcionTarjeta>Historial de tus notificaciones recientes</DescripcionTarjeta>
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="space-y-4">
                {notificacionesEnviadas.map((notif) => (
                  <div key={notif.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold">{notif.titulo}</h4>
                      <Insignia variant="outline" className="text-xs">
                        {new Date(notif.fecha).toLocaleDateString()}
                      </Insignia>
                    </div>
                    <p className="text-sm text-muted-foreground">{notif.mensaje}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>Enviado a: {notif.destinatarios}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ContenidoTarjeta>
          </Tarjeta>
        </div>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Plantillas Rápidas</TituloTarjeta>
            <DescripcionTarjeta>Usa estas plantillas para notificaciones habituales</DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <div className="grid gap-3 md:grid-cols-3">
              <Boton
                variant="outline"
                className="h-auto flex-col items-start p-4 gap-2 bg-transparent"
                onClick={() => {
                  setTitulo("Recordatorio de Examen")
                  setMensaje("Les recuerdo que tenemos examen programado. Por favor estudien los temas vistos en clase.")
                }}
              >
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <div className="text-left">
                  <p className="font-medium">Recordatorio de Examen</p>
                  <p className="text-xs text-muted-foreground">Notificar sobre próximo examen</p>
                </div>
              </Boton>

              <Boton
                variant="outline"
                className="h-auto flex-col items-start p-4 gap-2 bg-transparent"
                onClick={() => {
                  setTitulo("Entrega de Tarea")
                  setMensaje("Recuerden entregar la tarea asignada antes de la fecha límite.")
                }}
              >
                <Calendar className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium">Entrega de Tarea</p>
                  <p className="text-xs text-muted-foreground">Recordar fecha de entrega</p>
                </div>
              </Boton>

              <Boton
                variant="outline"
                className="h-auto flex-col items-start p-4 gap-2 bg-transparent"
                onClick={() => {
                  setTitulo("Felicitaciones")
                  setMensaje("¡Excelente trabajo en el último examen! Sigan así.")
                }}
              >
                <Bell className="w-5 h-5 text-green-600" />
                <div className="text-left">
                  <p className="font-medium">Felicitaciones</p>
                  <p className="text-xs text-muted-foreground">Reconocer buen desempeño</p>
                </div>
              </Boton>
            </div>
          </ContenidoTarjeta>
        </Tarjeta>
      </div>
    </DisenoTablero>
  )
}
