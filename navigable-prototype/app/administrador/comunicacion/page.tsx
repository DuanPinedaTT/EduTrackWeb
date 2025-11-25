"use client"

import { LayoutDashboard } from "@/components/layout-dashboard"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Boton } from "@/components/ui/button"
import { Entrada } from "@/components/ui/input"
import { Etiqueta } from "@/components/ui/label"
import { AreaTexto } from "@/components/ui/textarea"
import { Selector, ContenidoSelector, ElementoSelector, DisparadorSelector, ValorSelector } from "@/components/ui/select"
import { Insignia } from "@/components/ui/badge"
import { Pestanas, ContenidoPestanas, ListaPestanas, DisparadorPestanas } from "@/components/ui/tabs"
import { MessageSquare, Send, Bell, Search, Filter } from "lucide-react"
import { useState } from "react"

const mensajesSimulados = [
  {
    id: 1,
    de: "María García (Docente)",
    asunto: "Consulta sobre calificaciones",
    mensaje: "Buenos días, necesito apoyo con el sistema de calificaciones...",
    fecha: "2025-01-15 10:30",
    leido: false,
  },
  {
    id: 2,
    de: "Juan Pérez (Estudiante)",
    asunto: "Solicitud de certificado",
    mensaje: "Requiero un certificado de estudio para...",
    fecha: "2025-01-14 15:20",
    leido: true,
  },
]

const anunciosSimulados = [
  {
    id: 1,
    titulo: "Inicio de clases segundo semestre",
    contenido: "Les informamos que las clases del segundo semestre iniciarán el 3 de febrero...",
    fecha: "2025-01-10",
    destinatarios: "Todos",
  },
]

export default function PaginaComunicacion() {
  const [busqueda, setBusqueda] = useState("")
  const [nuevoMensaje, setNuevoMensaje] = useState({ destinatario: "", asunto: "", mensaje: "" })
  const [nuevoAnuncio, setNuevoAnuncio] = useState({ titulo: "", contenido: "", destinatarios: "" })

  const enviarMensaje = () => {
    console.log("[v0] Enviando mensaje:", nuevoMensaje)
    alert("Mensaje enviado exitosamente")
    setNuevoMensaje({ destinatario: "", asunto: "", mensaje: "" })
  }

  const publicarAnuncio = () => {
    console.log("[v0] Publicando anuncio:", nuevoAnuncio)
    alert("Anuncio publicado exitosamente")
    setNuevoAnuncio({ titulo: "", contenido: "", destinatarios: "" })
  }

  return (
    <LayoutDashboard rolRequerido="administrador">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Centro de Comunicación</h1>
          <p className="text-muted-foreground">Gestiona mensajes, anuncios y notificaciones</p>
        </div>

        <Pestanas defaultValue="mensajes" className="space-y-4">
          <ListaPestanas>
            <DisparadorPestanas value="mensajes">Mensajes</DisparadorPestanas>
            <DisparadorPestanas value="anuncios">Anuncios</DisparadorPestanas>
            <DisparadorPestanas value="nuevo">Nuevo Mensaje</DisparadorPestanas>
          </ListaPestanas>

          <ContenidoPestanas value="mensajes" className="space-y-4">
            <Tarjeta>
              <EncabezadoTarjeta>
                <TituloTarjeta className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Bandeja de Entrada
                </TituloTarjeta>
                <DescripcionTarjeta>Mensajes recibidos de docentes, estudiantes y padres</DescripcionTarjeta>
              </EncabezadoTarjeta>
              <ContenidoTarjeta className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Entrada
                      placeholder="Buscar mensajes..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Boton variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrar
                  </Boton>
                </div>

                <div className="space-y-2">
                  {mensajesSimulados.map((mensaje) => (
                    <Tarjeta key={mensaje.id} className={!mensaje.leido ? "border-primary" : ""}>
                      <ContenidoTarjeta className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{mensaje.de}</p>
                              {!mensaje.leido && <Insignia variant="default">Nuevo</Insignia>}
                            </div>
                            <p className="text-sm font-medium mt-1">{mensaje.asunto}</p>
                            <p className="text-sm text-muted-foreground mt-1">{mensaje.mensaje}</p>
                            <p className="text-xs text-muted-foreground mt-2">{mensaje.fecha}</p>
                          </div>
                          <Boton size="sm">Responder</Boton>
                        </div>
                      </ContenidoTarjeta>
                    </Tarjeta>
                  ))}
                </div>
              </ContenidoTarjeta>
            </Tarjeta>
          </ContenidoPestanas>

          <ContenidoPestanas value="anuncios" className="space-y-4">
            <Tarjeta>
              <EncabezadoTarjeta>
                <TituloTarjeta className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Anuncios Publicados
                </TituloTarjeta>
                <DescripcionTarjeta>Comunicados generales a la comunidad educativa</DescripcionTarjeta>
              </EncabezadoTarjeta>
              <ContenidoTarjeta className="space-y-4">
                <Boton className="w-full">
                  <Bell className="w-4 h-4 mr-2" />
                  Nuevo Anuncio
                </Boton>

                <div className="space-y-3">
                  {anunciosSimulados.map((anuncio) => (
                    <Tarjeta key={anuncio.id}>
                      <EncabezadoTarjeta>
                        <div className="flex items-start justify-between">
                          <div>
                            <TituloTarjeta className="text-lg">{anuncio.titulo}</TituloTarjeta>
                            <DescripcionTarjeta>{anuncio.fecha}</DescripcionTarjeta>
                          </div>
                          <Insignia>{anuncio.destinatarios}</Insignia>
                        </div>
                      </EncabezadoTarjeta>
                      <ContenidoTarjeta>
                        <p className="text-sm">{anuncio.contenido}</p>
                        <div className="flex gap-2 mt-4">
                          <Boton size="sm" variant="outline">
                            Editar
                          </Boton>
                          <Boton size="sm" variant="outline">
                            Eliminar
                          </Boton>
                        </div>
                      </ContenidoTarjeta>
                    </Tarjeta>
                  ))}
                </div>
              </ContenidoTarjeta>
            </Tarjeta>
          </ContenidoPestanas>

          <ContenidoPestanas value="nuevo" className="space-y-4">
            <Tarjeta>
              <EncabezadoTarjeta>
                <TituloTarjeta className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Enviar Nuevo Mensaje
                </TituloTarjeta>
              </EncabezadoTarjeta>
              <ContenidoTarjeta className="space-y-4">
                <div className="space-y-2">
                  <Etiqueta htmlFor="destinatario">Destinatario</Etiqueta>
                  <Selector
                    value={nuevoMensaje.destinatario}
                    onValueChange={(value) => setNuevoMensaje({ ...nuevoMensaje, destinatario: value })}
                  >
                    <DisparadorSelector>
                      <ValorSelector placeholder="Seleccionar destinatario" />
                    </DisparadorSelector>
                    <ContenidoSelector>
                      <ElementoSelector value="docentes">Todos los docentes</ElementoSelector>
                      <ElementoSelector value="estudiantes">Todos los estudiantes</ElementoSelector>
                      <ElementoSelector value="padres">Todos los padres</ElementoSelector>
                      <ElementoSelector value="individual">Usuario individual</ElementoSelector>
                    </ContenidoSelector>
                  </Selector>
                </div>

                <div className="space-y-2">
                  <Etiqueta htmlFor="asunto">Asunto</Etiqueta>
                  <Entrada
                    id="asunto"
                    placeholder="Asunto del mensaje"
                    value={nuevoMensaje.asunto}
                    onChange={(e) => setNuevoMensaje({ ...nuevoMensaje, asunto: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Etiqueta htmlFor="mensaje">Mensaje</Etiqueta>
                  <AreaTexto
                    id="mensaje"
                    placeholder="Escriba su mensaje aquí..."
                    rows={6}
                    value={nuevoMensaje.mensaje}
                    onChange={(e) => setNuevoMensaje({ ...nuevoMensaje, mensaje: e.target.value })}
                  />
                </div>

                <Boton onClick={enviarMensaje} className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Mensaje
                </Boton>
              </ContenidoTarjeta>
            </Tarjeta>
          </ContenidoPestanas>
        </Pestanas>
      </div>
    </LayoutDashboard>
  )
}
