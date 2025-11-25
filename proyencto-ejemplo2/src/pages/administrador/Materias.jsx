import { useState } from "react"
import { DisenoTablero } from "@/components/layout-dashboard"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Boton } from "@/components/ui/button"
import { Entrada } from "@/components/ui/input"
import { Etiqueta } from "@/components/ui/label"
import { Tabla, CuerpoTabla, CeldaTabla, EncabezadoTabla, CabeceraTabla, FilaTabla } from "@/components/ui/table"
import { Insignia } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { Dialogo, ContenidoDialogo, DescripcionDialogo, EncabezadoDialogo, TituloDialogo, ActivadorDialogo } from "@/components/ui/dialog"
import { Selector, ContenidoSelector, ElementoSelector, DisparadorSelector, ValorSelector } from "@/components/ui/select"

const materias = [
  { id: 1, nombre: "Matemáticas", codigo: "MAT-101", grado: "10°", docente: "Prof. García", estudiantes: 32 },
  { id: 2, nombre: "Física", codigo: "FIS-201", grado: "11°", docente: "Prof. Martínez", estudiantes: 28 },
  { id: 3, nombre: "Química", codigo: "QUI-101", grado: "10°", docente: "Prof. López", estudiantes: 30 },
  { id: 4, nombre: "Inglés", codigo: "ING-101", grado: "10°", docente: "Prof. Rodríguez", estudiantes: 35 },
  { id: 5, nombre: "Historia", codigo: "HIS-101", grado: "10°", docente: "Prof. Pérez", estudiantes: 33 },
]

export default function PaginaMaterias() {
  const [busqueda, setBusqueda] = useState("")

  return (
    <DisenoTablero rolRequerido="administrador">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Materias</h1>
            <p className="text-muted-foreground">Administra las materias del sistema</p>
          </div>
          <Dialogo>
            <ActivadorDialogo asChild>
              <Boton className="gap-2">
                <Plus className="w-4 h-4" />
                Nueva Materia
              </Boton>
            </ActivadorDialogo>
            <ContenidoDialogo>
              <EncabezadoDialogo>
                <TituloDialogo>Registrar Nueva Materia</TituloDialogo>
                <DescripcionDialogo>Ingresa los datos de la nueva materia</DescripcionDialogo>
              </EncabezadoDialogo>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Etiqueta>Nombre de la Materia</Etiqueta>
                  <Entrada placeholder="Ej: Matemáticas" />
                </div>
                <div className="space-y-2">
                  <Etiqueta>Código</Etiqueta>
                  <Entrada placeholder="Ej: MAT-101" />
                </div>
                <div className="space-y-2">
                  <Etiqueta>Grado</Etiqueta>
                  <Selector>
                    <DisparadorSelector>
                      <ValorSelector placeholder="Seleccionar grado" />
                    </DisparadorSelector>
                    <ContenidoSelector>
                      <ElementoSelector value="6">6° Grado</ElementoSelector>
                      <ElementoSelector value="7">7° Grado</ElementoSelector>
                      <ElementoSelector value="8">8° Grado</ElementoSelector>
                      <ElementoSelector value="9">9° Grado</ElementoSelector>
                      <ElementoSelector value="10">10° Grado</ElementoSelector>
                      <ElementoSelector value="11">11° Grado</ElementoSelector>
                    </ContenidoSelector>
                  </Selector>
                </div>
                <div className="space-y-2">
                  <Etiqueta>Docente Asignado</Etiqueta>
                  <Selector>
                    <DisparadorSelector>
                      <ValorSelector placeholder="Seleccionar docente" />
                    </DisparadorSelector>
                    <ContenidoSelector>
                      <ElementoSelector value="1">Prof. García</ElementoSelector>
                      <ElementoSelector value="2">Prof. Martínez</ElementoSelector>
                      <ElementoSelector value="3">Prof. López</ElementoSelector>
                    </ContenidoSelector>
                  </Selector>
                </div>
                <Boton className="w-full">Guardar Materia</Boton>
              </div>
            </ContenidoDialogo>
          </Dialogo>
        </div>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Filtros</TituloTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Etiqueta>Buscar</Etiqueta>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Entrada
                    placeholder="Buscar materia..."
                    className="pl-9"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Etiqueta>Grado</Etiqueta>
                <Selector defaultValue="todos">
                  <DisparadorSelector>
                    <ValorSelector />
                  </DisparadorSelector>
                  <ContenidoSelector>
                    <ElementoSelector value="todos">Todos los grados</ElementoSelector>
                    <ElementoSelector value="10">10° Grado</ElementoSelector>
                    <ElementoSelector value="11">11° Grado</ElementoSelector>
                  </ContenidoSelector>
                </Selector>
              </div>
              <div className="space-y-2">
                <Etiqueta>Docente</Etiqueta>
                <Selector defaultValue="todos">
                  <DisparadorSelector>
                    <ValorSelector />
                  </DisparadorSelector>
                  <ContenidoSelector>
                    <ElementoSelector value="todos">Todos los docentes</ElementoSelector>
                    <ElementoSelector value="1">Prof. García</ElementoSelector>
                    <ElementoSelector value="2">Prof. Martínez</ElementoSelector>
                  </ContenidoSelector>
                </Selector>
              </div>
            </div>
          </ContenidoTarjeta>
        </Tarjeta>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Lista de Materias</TituloTarjeta>
            <DescripcionTarjeta>Total: {materias.length} materias registradas</DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <Tabla>
              <CabeceraTabla>
                <FilaTabla>
                  <EncabezadoTabla>Código</EncabezadoTabla>
                  <EncabezadoTabla>Materia</EncabezadoTabla>
                  <EncabezadoTabla>Grado</EncabezadoTabla>
                  <EncabezadoTabla>Docente</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Estudiantes</EncabezadoTabla>
                  <EncabezadoTabla className="text-center">Acciones</EncabezadoTabla>
                </FilaTabla>
              </CabeceraTabla>
              <CuerpoTabla>
                {materias
                  .filter((materia) =>
                    materia.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                    materia.codigo.toLowerCase().includes(busqueda.toLowerCase()),
                  )
                  .map((materia) => (
                    <FilaTabla key={materia.id}>
                      <CeldaTabla className="font-mono">{materia.codigo}</CeldaTabla>
                      <CeldaTabla className="font-medium">{materia.nombre}</CeldaTabla>
                      <CeldaTabla>
                        <Insignia variant="outline">{materia.grado}</Insignia>
                      </CeldaTabla>
                      <CeldaTabla>{materia.docente}</CeldaTabla>
                      <CeldaTabla className="text-center">{materia.estudiantes}</CeldaTabla>
                      <CeldaTabla>
                        <div className="flex items-center justify-center gap-2">
                          <Boton size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Boton>
                          <Boton size="sm" variant="ghost" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Boton>
                        </div>
                      </CeldaTabla>
                    </FilaTabla>
                  ))}
              </CuerpoTabla>
            </Tabla>
          </ContenidoTarjeta>
        </Tarjeta>
      </div>
    </DisenoTablero>
  )
}
