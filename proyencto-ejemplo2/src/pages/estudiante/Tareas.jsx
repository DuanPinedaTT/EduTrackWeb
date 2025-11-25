import { DisenoTablero } from "@/components/layout-dashboard"
import { Insignia } from "@/components/ui/badge"
import { Boton } from "@/components/ui/button"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Pestanas, ContenidoPestanas, ListaPestanas, DisparadorPestanas } from "@/components/ui/tabs"
import { Calendar, CheckCircle, Clock, FileUp, ListTodo } from "lucide-react"

const tareasEstudiante = [
  {
    id: 1,
    titulo: "Taller de Ecuaciones",
    materia: "Matemáticas",
    profesor: "Profa. María García",
    fechaEntrega: "2025-01-25",
    estado: "pendiente",
    descripcion: "Resolver los ejercicios del 1 al 20 del capítulo 5",
  },
  {
    id: 2,
    titulo: "Ensayo sobre la Revolución",
    materia: "Historia",
    profesor: "Prof. Carlos López",
    fechaEntrega: "2025-01-20",
    estado: "entregada",
    calificacion: 4.5,
    descripcion: "Ensayo de mínimo 2 páginas",
  },
]

const subirArchivo = () => {
  alert("Seleccione el archivo a subir")
}

export default function PaginaTareasEstudiante() {
  return (
    <DisenoTablero rolRequerido="estudiante">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mis Tareas</h1>
          <p className="text-muted-foreground">Gestiona tus tareas y trabajos pendientes</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between pb-2">
              <TituloTarjeta className="text-sm font-medium">Tareas Pendientes</TituloTarjeta>
              <Clock className="h-4 w-4 text-destructive" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Por entregar</p>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between pb-2">
              <TituloTarjeta className="text-sm font-medium">Entregadas</TituloTarjeta>
              <CheckCircle className="h-4 w-4 text-secondary" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </ContenidoTarjeta>
          </Tarjeta>

          <Tarjeta>
            <EncabezadoTarjeta className="flex flex-row items-center justify-between pb-2">
              <TituloTarjeta className="text-sm font-medium">Promedio</TituloTarjeta>
              <ListTodo className="h-4 w-4 text-primary" />
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <div className="text-2xl font-bold">4.5</div>
              <p className="text-xs text-muted-foreground">En tareas calificadas</p>
            </ContenidoTarjeta>
          </Tarjeta>
        </div>

        <Pestanas defaultValue="pendientes" className="space-y-4">
          <ListaPestanas>
            <DisparadorPestanas value="pendientes">Pendientes</DisparadorPestanas>
            <DisparadorPestanas value="entregadas">Entregadas</DisparadorPestanas>
            <DisparadorPestanas value="todas">Todas</DisparadorPestanas>
          </ListaPestanas>

          <ContenidoPestanas value="pendientes" className="space-y-4">
            {tareasEstudiante
              .filter((tarea) => tarea.estado === "pendiente")
              .map((tarea) => (
                <Tarjeta key={tarea.id}>
                  <EncabezadoTarjeta>
                    <div className="flex items-start justify-between">
                      <div>
                        <TituloTarjeta>{tarea.titulo}</TituloTarjeta>
                        <DescripcionTarjeta>
                          {tarea.materia} - {tarea.profesor}
                        </DescripcionTarjeta>
                      </div>
                      <Insignia variant="destructive">Pendiente</Insignia>
                    </div>
                  </EncabezadoTarjeta>
                  <ContenidoTarjeta className="space-y-4">
                    <p className="text-sm">{tarea.descripcion}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Fecha de entrega: {tarea.fechaEntrega}</span>
                    </div>
                    <div className="flex gap-2">
                      <Boton onClick={subirArchivo}>
                        <FileUp className="w-4 h-4 mr-2" />
                        Subir Archivo
                      </Boton>
                      <Boton variant="outline">Ver Detalles</Boton>
                    </div>
                  </ContenidoTarjeta>
                </Tarjeta>
              ))}
          </ContenidoPestanas>

          <ContenidoPestanas value="entregadas" className="space-y-4">
            {tareasEstudiante
              .filter((tarea) => tarea.estado === "entregada")
              .map((tarea) => (
                <Tarjeta key={tarea.id}>
                  <EncabezadoTarjeta>
                    <div className="flex items-start justify-between">
                      <div>
                        <TituloTarjeta>{tarea.titulo}</TituloTarjeta>
                        <DescripcionTarjeta>
                          {tarea.materia} - {tarea.profesor}
                        </DescripcionTarjeta>
                      </div>
                      <div className="flex items-center gap-2">
                        <Insignia variant="secondary">Entregada</Insignia>
                        {tarea.calificacion && <Insignia className="bg-primary">{tarea.calificacion}</Insignia>}
                      </div>
                    </div>
                  </EncabezadoTarjeta>
                  <ContenidoTarjeta className="space-y-4">
                    <p className="text-sm">{tarea.descripcion}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>Entregado: {tarea.fechaEntrega}</span>
                      </div>
                      {tarea.calificacion && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-secondary" />
                          <span>Calificada</span>
                        </div>
                      )}
                    </div>
                    <Boton variant="outline" size="sm">
                      Ver Retroalimentación
                    </Boton>
                  </ContenidoTarjeta>
                </Tarjeta>
              ))}
          </ContenidoPestanas>

          <ContenidoPestanas value="todas" className="space-y-4">
            {tareasEstudiante.map((tarea) => (
              <Tarjeta key={tarea.id}>
                <EncabezadoTarjeta>
                  <div className="flex items-start justify-between">
                    <div>
                      <TituloTarjeta>{tarea.titulo}</TituloTarjeta>
                      <DescripcionTarjeta>
                        {tarea.materia} - {tarea.profesor}
                      </DescripcionTarjeta>
                    </div>
                    <Insignia variant={tarea.estado === "pendiente" ? "destructive" : "secondary"}>{tarea.estado}</Insignia>
                  </div>
                </EncabezadoTarjeta>
              </Tarjeta>
            ))}
          </ContenidoPestanas>
        </Pestanas>
      </div>
    </DisenoTablero>
  )
}
