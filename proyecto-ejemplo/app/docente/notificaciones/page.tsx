"use client"

import { useState } from "react"
import { LayoutDashboard } from "@/components/layout-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Send, Calendar, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function PaginaNotificaciones() {
  const [titulo, setTitulo] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [destinatario, setDestinatario] = useState("")

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
    <LayoutDashboard>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Notificaciones</h1>
          <p className="text-muted-foreground">Envía notificaciones a tus estudiantes sobre tareas y evaluaciones</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Formulario de Nueva Notificación */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Nueva Notificación
              </CardTitle>
              <CardDescription>Envía un mensaje a tus estudiantes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="destinatario">Destinatarios</Label>
                <Select value={destinatario} onValueChange={setDestinatario}>
                  <SelectTrigger id="destinatario">
                    <SelectValue placeholder="Seleccionar destinatarios" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matematicas-10a">Matemáticas 10-A</SelectItem>
                    <SelectItem value="fisica-11b">Física 11-B</SelectItem>
                    <SelectItem value="quimica-10c">Química 10-C</SelectItem>
                    <SelectItem value="todos">Todos mis estudiantes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  placeholder="Ej: Examen de Matemáticas"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mensaje">Mensaje</Label>
                <Textarea
                  id="mensaje"
                  placeholder="Escribe el contenido de la notificación..."
                  rows={5}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Notificación</Label>
                <Select defaultValue="general">
                  <SelectTrigger id="tipo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="tarea">Tarea</SelectItem>
                    <SelectItem value="examen">Examen</SelectItem>
                    <SelectItem value="alerta">Alerta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full gap-2" onClick={enviarNotificacion}>
                <Send className="w-4 h-4" />
                Enviar Notificación
              </Button>
            </CardContent>
          </Card>

          {/* Historial de Notificaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificaciones Enviadas
              </CardTitle>
              <CardDescription>Historial de tus notificaciones recientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notificacionesEnviadas.map((notif) => (
                  <div key={notif.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold">{notif.titulo}</h4>
                      <Badge variant="outline" className="text-xs">
                        {new Date(notif.fecha).toLocaleDateString()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{notif.mensaje}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>Enviado a: {notif.destinatarios}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plantillas Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Plantillas Rápidas</CardTitle>
            <CardDescription>Usa estas plantillas para enviar notificaciones comunes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <Button
                variant="outline"
                className="h-auto flex-col items-start p-4 gap-2 bg-transparent"
                onClick={() => {
                  setTitulo("Recordatorio de Examen")
                  setMensaje(
                    "Les recuerdo que tenemos examen programado. Por favor estudien los temas vistos en clase.",
                  )
                }}
              >
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <div className="text-left">
                  <p className="font-medium">Recordatorio de Examen</p>
                  <p className="text-xs text-muted-foreground">Notificar sobre próximo examen</p>
                </div>
              </Button>

              <Button
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
              </Button>

              <Button
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
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutDashboard>
  )
}
