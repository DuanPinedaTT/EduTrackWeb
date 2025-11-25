"use client"

import { LayoutDashboard } from "@/components/layout-dashboard"
import { Tarjeta, ContenidoTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Boton } from "@/components/ui/button"
import { Entrada } from "@/components/ui/input"
import { Etiqueta } from "@/components/ui/label"
import { AreaTexto } from "@/components/ui/textarea"
import { Pestanas, ContenidoPestanas, ListaPestanas, DisparadorPestanas } from "@/components/ui/tabs"
import { Send, Inbox } from "lucide-react"
import { useState } from "react"

export default function PaginaComunicacionDocente() {
  const [nuevoMensaje, setNuevoMensaje] = useState({ destinatario: "", mensaje: "" })

  return (
    <LayoutDashboard rolRequerido="docente">
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
                  <Entrada placeholder="Buscar usuario..." />
                </div>
                <div className="space-y-2">
                  <Etiqueta>Mensaje</Etiqueta>
                  <AreaTexto rows={6} placeholder="Escriba su mensaje..." />
                </div>
                <Boton className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Enviar
                </Boton>
              </ContenidoTarjeta>
            </Tarjeta>
          </ContenidoPestanas>
        </Pestanas>
      </div>
    </LayoutDashboard>
  )
}
