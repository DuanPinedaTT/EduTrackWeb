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
import { Selector, ContenidoSelector, ElementoSelector, DisparadorSelector, ValorSelector } from "@/components/ui/select"
import { Pestanas, ContenidoPestanas, ListaPestanas, DisparadorPestanas } from "@/components/ui/tabs"
import { AreaTexto } from "@/components/ui/textarea"
import { Calendar, CheckCircle, Clock, FileText, ListTodo, Plus } from "lucide-react"

const tareasSimuladas = [
  {
    id: 1,
    titulo: "Taller de Ecuaciones",
    materia: "Matemáticas",
    curso: "10-A",
    fechaEntrega: "2025-01-25",
    entregas: { total: 25, entregadas: 18, pendientes: 7 },
    estado: "activa",
  },
  {
    id: 2,
    titulo: "Ensayo sobre la Revolución",
    materia: "Historia",
    curso: "11-B",
    fechaEntrega: "2025-01-20",
    entregas: { total: 22, entregadas: 22, pendientes: 0 },
    estado: "cerrada",
  },
]

export default function PaginaTareasDocente() {
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [nuevaTarea, setNuevaTarea] = useState({ titulo: "", descripcion: "", materia: "", curso: "", fechaEntrega: "" })

  const crearTarea = () => {
    console.log("[v0] Creando tarea:", nuevaTarea)
    alert("Tarea creada exitosamente")
    setNuevaTarea({ titulo: "", descripcion: "", materia: "", curso: "", fechaEntrega: "" })
    setDialogoAbierto(false)
  }

  return (
    <DisenoTablero rolRequerido="docente">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Tareas</h1>
            <p className="text-muted-foreground">Crea y administra tareas para tus estudiantes</p>
          </div>
          <Dialogo open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
            <ActivadorDialogo asChild>
              <Boton>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Tarea
              </Boton>
            </ActivadorDialogo>
            <ContenidoDialogo className="max-w-2xl">
              <EncabezadoDialogo>
                <TituloDialogo>Crear Nueva Tarea</TituloDialogo>
                <DescripcionDialogo>Complete la información de la tarea</DescripcionDialogo>
              </EncabezadoDialogo>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Etiqueta htmlFor="titulo">Título de la Tarea</Etiqueta>
                  <Entrada
                    id="titulo"
                    placeholder="Ej: Taller de Matemáticas Capítulo 5"
                    value={nuevaTarea.titulo}
                    onChange={(e) => setNuevaTarea({ ...nuevaTarea, titulo: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Etiqueta htmlFor="materia">Materia</Etiqueta>
                    <Selector value={nuevaTarea.materia} onValueChange={(value) => setNuevaTarea({ ...nuevaTarea, materia: value })}>
                      <DisparadorSelector>
                        <ValorSelector placeholder="Seleccionar" />
                      </DisparadorSelector>
                      <ContenidoSelector>
                        <ElementoSelector value="matematicas">Matemáticas</ElementoSelector>
                        <ElementoSelector value="fisica">Física</ElementoSelector>
                        <ElementoSelector value="quimica">Química</ElementoSelector>
                      </ContenidoSelector>
                    </Selector>
                  </div>
                  <div className="space-y-2">
                    <Etiqueta htmlFor="curso">Curso</Etiqueta>
                    <Selector value={nuevaTarea.curso} onValueChange={(value) => setNuevaTarea({ ...nuevaTarea, curso: value })}>
                      <DisparadorSelector>
                        <ValorSelector placeholder="Seleccionar" />
                      </DisparadorSelector>
                      <ContenidoSelector>
                        <ElementoSelector value="10-a">10-A</ElementoSelector>
                        <ElementoSelector value="10-b">10-B</ElementoSelector>
                        <ElementoSelector value="11-a">11-A</ElementoSelector>
                      </ContenidoSelector>
                    </Selector>
                  </div>
                </div>
                <div className="space-y-2">
                  <Etiqueta htmlFor="descripcion">Descripción</Etiqueta>
                  <AreaTexto
                    id="descripcion"
                    placeholder="Describe las instrucciones de la tarea..."
                    rows={4}
                    value={nuevaTarea.descripcion}
                    onChange={(e) => setNuevaTarea({ ...nuevaTarea, descripcion: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Etiqueta htmlFor="fechaEntrega">Fecha de Entrega</Etiqueta>
                  <Entrada
                    id="fechaEntrega"
                    type="date"
                    value={nuevaTarea.fechaEntrega}
                    onChange={(e) => setNuevaTarea({ ...nuevaTarea, fechaEntrega: e.target.value })}
                  />
                </div>
                <Boton onClick={crearTarea} className="w-full">
                  Crear Tarea
                </Boton>
              </div>
            </ContenidoDialogo>
          </Dialogo>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between pb-2">
              <TituloTarjeta className="text-sm font-medium">Tareas Activas</TituloTarjeta>
              <ListTodo className="h-4 w-4 text-primary" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">En curso</p>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between pb-2">
              <TituloTarjeta className="text-sm font-medium">Entregas Pendientes</TituloTarjeta>
              <Clock className="h-4 w-4 text-destructive" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">Por revisar</p>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between pb-2">
              <TituloTarjeta className="text-sm font-medium">Tareas Completadas</TituloTarjeta>
              <CheckCircle className="h-4 w-4 text-secondary" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </ContenidoTarjeta>
          </Tarjeta>
        </div>

        <Pestanas defaultValue="activas" className="space-y-4">
          <ListaPestanas>
            <DisparadorPestanas value="activas">Activas</DisparadorPestanas>
            <DisparadorPestanas value="cerradas">Cerradas</DisparadorPestanas>
            <DisparadorPestanas value="borradores">Borradores</DisparadorPestanas>
          </ListaPestanas>

          <ContenidoPestanas value="activas" className="space-y-4">
            {tareasSimuladas
              .filter((tarea) => tarea.estado === "activa")
              .map((tarea) => (
                <Tarjeta key={tarea.id}>
                  <EncabezadoTarjeta>
                    <div className="flex items-start justify-between">
                      <div>
                        <TituloTarjeta>{tarea.titulo}</TituloTarjeta>
                        <DescripcionTarjeta>
                          {tarea.materia} - {tarea.curso}
                        </DescripcionTarjeta>
                      </div>
                      <Insignia>Activa</Insignia>
                    </div>
                  </EncabezadoTarjeta>
                  <ContenidoTarjeta className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>Entrega: {tarea.fechaEntrega}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {tarea.entregas.entregadas}/{tarea.entregas.total} entregas
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso de entregas</span>
                        <span className="font-medium">
                          {Math.round((tarea.entregas.entregadas / tarea.entregas.total) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{ width: `${(tarea.entregas.entregadas / tarea.entregas.total) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Boton variant="outline" size="sm">
                        Ver Entregas
                      </Boton>
                      <Boton variant="outline" size="sm">
                        Editar
                      </Boton>
                      <Boton variant="outline" size="sm">
                        Cerrar Tarea
                      </Boton>
                    </div>
                  </ContenidoTarjeta>
                </Tarjeta>
              ))}
          </ContenidoPestanas>

          <ContenidoPestanas value="cerradas" className="space-y-4">
            {tareasSimuladas
              .filter((tarea) => tarea.estado === "cerrada")
              .map((tarea) => (
                <Tarjeta key={tarea.id}>
                  <EncabezadoTarjeta>
                    <div className="flex items-start justify-between">
                      <div>
                        <TituloTarjeta>{tarea.titulo}</TituloTarjeta>
                        <DescripcionTarjeta>
                          {tarea.materia} - {tarea.curso}
                        </DescripcionTarjeta>
                      </div>
                      <Insignia variant="secondary">Cerrada</Insignia>
                    </div>
                  </EncabezadoTarjeta>
                  <ContenidoTarjeta className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>Cerrada: {tarea.fechaEntrega}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        <span>100% entregas calificadas</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Boton variant="outline" size="sm">
                        Ver Resultados
                      </Boton>
                      <Boton variant="outline" size="sm">
                        Exportar
                      </Boton>
                    </div>
                  </ContenidoTarjeta>
                </Tarjeta>
              ))}
          </ContenidoPestanas>

          <ContenidoPestanas value="borradores">
            <Tarjeta>
              <ContenidoTarjeta className="flex flex-col items-center justify-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No hay borradores guardados</p>
              </ContenidoTarjeta>
            </Tarjeta>
          </ContenidoPestanas>
        </Pestanas>
      </div>
    </DisenoTablero>
  )
}
