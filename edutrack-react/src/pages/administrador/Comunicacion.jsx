import { useEffect, useMemo, useState } from "react"
import { DisenoTablero } from "@/components/layout-dashboard"
import { Insignia } from "@/components/ui/badge"
import { Boton } from "@/components/ui/button"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Entrada } from "@/components/ui/input"
import { Etiqueta } from "@/components/ui/label"
import { Selector, ContenidoSelector, ElementoSelector, DisparadorSelector, ValorSelector } from "@/components/ui/select"
import { Pestanas, ContenidoPestanas, ListaPestanas, DisparadorPestanas } from "@/components/ui/tabs"
import { AreaTexto } from "@/components/ui/textarea"
import { Bell, MessageSquare, Search, Send, Loader2, Copy } from "lucide-react"
import { apiClient } from "@/lib/api-client"

const anunciosIniciales = [
  {
    id: 1,
    titulo: "Inicio de clases segundo semestre",
    contenido: "Les informamos que las clases del segundo semestre iniciarán el 3 de febrero...",
    fecha: "2025-01-10",
    destinatarios: "Comunidad educativa",
  },
]

export default function PaginaComunicacion() {
  const [busqueda, setBusqueda] = useState("")
  const [docentes, setDocentes] = useState([])
  const [estudiantes, setEstudiantes] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")
  const [nuevoMensaje, setNuevoMensaje] = useState({ destinatario: "", asunto: "", mensaje: "" })
  const [nuevoAnuncio, setNuevoAnuncio] = useState({ titulo: "", contenido: "", destinatarios: "todos" })
  const [anuncios, setAnuncios] = useState(anunciosIniciales)
  const [mensajeEstado, setMensajeEstado] = useState("")

  useEffect(() => {
    const cargarContactos = async () => {
      try {
        setCargando(true)
        setError("")
        const [docentesResponse, estudiantesResponse] = await Promise.all([
          apiClient.get("/api/Usuarios?rol=docente"),
          apiClient.get("/api/Estudiantes"),
        ])
        setDocentes(docentesResponse)
        setEstudiantes(estudiantesResponse)
      } catch (err) {
        setError(err.message || "No se pudo cargar el directorio de contactos")
      } finally {
        setCargando(false)
      }
    }

    cargarContactos()
  }, [])

  const docentesFiltrados = useMemo(() => {
    const termino = busqueda.toLowerCase()
    return docentes.filter((docente) =>
      `${docente.nombre} ${docente.apellido}`.toLowerCase().includes(termino) || docente.email.toLowerCase().includes(termino),
    )
  }, [docentes, busqueda])

  const estudiantesFiltrados = useMemo(() => {
    const termino = busqueda.toLowerCase()
    return estudiantes.filter((estudiante) =>
      estudiante.nombre.toLowerCase().includes(termino) || estudiante.documento.toLowerCase().includes(termino),
    )
  }, [estudiantes, busqueda])

  const opcionesDestinatarios = useMemo(() => {
    const base = [
      { value: "docentes", label: `Todos los docentes (${docentes.length})` },
      { value: "estudiantes", label: `Todos los estudiantes (${estudiantes.length})` },
    ]
    const individuales = [
      ...docentes.map((doc) => ({ value: `docente-${doc.id}`, label: `${doc.nombre} ${doc.apellido}` })),
      ...estudiantes.map((est) => ({ value: `estudiante-${est.id}`, label: est.nombre })),
    ]
    return [...base, ...individuales]
  }, [docentes, estudiantes])

  const copiarValor = async (valor) => {
    try {
      await navigator.clipboard.writeText(valor)
      setMensajeEstado(`Copiado: ${valor}`)
      setTimeout(() => setMensajeEstado(""), 2500)
    } catch (err) {
      console.error("No se pudo copiar el texto", err)
    }
  }

  const enviarMensaje = (evento) => {
    evento.preventDefault()
    if (!nuevoMensaje.destinatario || !nuevoMensaje.asunto || !nuevoMensaje.mensaje) {
      setMensajeEstado("Completa todos los campos para enviar el mensaje")
      return
    }
    setMensajeEstado("Mensaje registrado para envío interno")
    setNuevoMensaje({ destinatario: "", asunto: "", mensaje: "" })
    setTimeout(() => setMensajeEstado(""), 3000)
  }

  const publicarAnuncio = (evento) => {
    evento.preventDefault()
    if (!nuevoAnuncio.titulo || !nuevoAnuncio.contenido) {
      setMensajeEstado("Completa el título y contenido del anuncio")
      return
    }
    const anuncio = {
      id: crypto.randomUUID(),
      ...nuevoAnuncio,
      fecha: new Date().toISOString(),
    }
    setAnuncios((prev) => [anuncio, ...prev])
    setNuevoAnuncio({ titulo: "", contenido: "", destinatarios: "todos" })
    setMensajeEstado("Anuncio publicado para la comunidad")
    setTimeout(() => setMensajeEstado(""), 3000)
  }

  return (
    <DisenoTablero rolRequerido="administrador">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Centro de Comunicación</h1>
          <p className="text-muted-foreground">Gestiona mensajes, anuncios y accede al directorio real de docentes y estudiantes</p>
        </div>

        {mensajeEstado && <p className="text-sm text-primary">{mensajeEstado}</p>}

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
                  Directorio de contactos
                </TituloTarjeta>
                <DescripcionTarjeta>Información obtenida directamente de /api/Usuarios y /api/Estudiantes</DescripcionTarjeta>
              </EncabezadoTarjeta>
              <ContenidoTarjeta className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Entrada
                    placeholder="Buscar por nombre, correo o documento"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold uppercase text-muted-foreground">Docentes</h3>
                      <Insignia variant="outline">{docentes.length}</Insignia>
                    </div>
                    <div className="space-y-2">
                      {cargando ? (
                        <p className="text-sm text-muted-foreground">Cargando docentes...</p>
                      ) : docentesFiltrados.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No se encontraron docentes.</p>
                      ) : (
                        docentesFiltrados.slice(0, 10).map((docente) => (
                          <div
                            key={docente.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">
                                {docente.nombre} {docente.apellido}
                              </p>
                              <p className="text-xs text-muted-foreground">{docente.email}</p>
                            </div>
                            <Boton variant="outline" size="sm" className="gap-2" onClick={() => copiarValor(docente.email)}>
                              <Copy className="w-3 h-3" />
                              Copiar
                            </Boton>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold uppercase text-muted-foreground">Estudiantes</h3>
                      <Insignia variant="outline">{estudiantes.length}</Insignia>
                    </div>
                    <div className="space-y-2">
                      {cargando ? (
                        <p className="text-sm text-muted-foreground">Cargando estudiantes...</p>
                      ) : estudiantesFiltrados.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No se encontraron estudiantes.</p>
                      ) : (
                        estudiantesFiltrados.slice(0, 10).map((estudiante) => (
                          <div
                            key={estudiante.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{estudiante.nombre}</p>
                              <p className="text-xs text-muted-foreground">Documento: {estudiante.documento}</p>
                            </div>
                            <Boton variant="outline" size="sm" className="gap-2" onClick={() => copiarValor(estudiante.documento)}>
                              <Copy className="w-3 h-3" />
                              Copiar ID
                            </Boton>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
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
                <form className="space-y-4" onSubmit={publicarAnuncio}>
                  <div className="space-y-2">
                    <Etiqueta>Título</Etiqueta>
                    <Entrada
                      placeholder="Ej: Reunión general"
                      value={nuevoAnuncio.titulo}
                      onChange={(e) => setNuevoAnuncio((prev) => ({ ...prev, titulo: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Etiqueta>Destinatarios</Etiqueta>
                    <Selector value={nuevoAnuncio.destinatarios} onValueChange={(value) => setNuevoAnuncio((prev) => ({ ...prev, destinatarios: value }))}>
                      <DisparadorSelector>
                        <ValorSelector />
                      </DisparadorSelector>
                      <ContenidoSelector>
                        <ElementoSelector value="todos">Toda la comunidad</ElementoSelector>
                        <ElementoSelector value="docentes">Solo docentes</ElementoSelector>
                        <ElementoSelector value="estudiantes">Solo estudiantes</ElementoSelector>
                      </ContenidoSelector>
                    </Selector>
                  </div>
                  <div className="space-y-2">
                    <Etiqueta>Contenido</Etiqueta>
                    <AreaTexto
                      rows={4}
                      placeholder="Escribe el detalle del anuncio"
                      value={nuevoAnuncio.contenido}
                      onChange={(e) => setNuevoAnuncio((prev) => ({ ...prev, contenido: e.target.value }))}
                    />
                  </div>
                  <Boton type="submit" className="w-full">
                    <Bell className="w-4 h-4 mr-2" />
                    Publicar anuncio
                  </Boton>
                </form>

                <div className="space-y-3">
                  {anuncios.map((anuncio) => (
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
              <ContenidoTarjeta>
                <form className="space-y-4" onSubmit={enviarMensaje}>
                  <div className="space-y-2">
                    <Etiqueta htmlFor="destinatario">Destinatario</Etiqueta>
                    <Selector
                      value={nuevoMensaje.destinatario}
                      onValueChange={(value) => setNuevoMensaje((prev) => ({ ...prev, destinatario: value }))}
                    >
                      <DisparadorSelector>
                        <ValorSelector placeholder="Seleccionar destinatario" />
                      </DisparadorSelector>
                      <ContenidoSelector>
                        {opcionesDestinatarios.map((opcion) => (
                          <ElementoSelector key={opcion.value} value={opcion.value}>
                            {opcion.label}
                          </ElementoSelector>
                        ))}
                      </ContenidoSelector>
                    </Selector>
                  </div>

                  <div className="space-y-2">
                    <Etiqueta htmlFor="asunto">Asunto</Etiqueta>
                    <Entrada
                      id="asunto"
                      placeholder="Asunto del mensaje"
                      value={nuevoMensaje.asunto}
                      onChange={(e) => setNuevoMensaje((prev) => ({ ...prev, asunto: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Etiqueta htmlFor="mensaje">Mensaje</Etiqueta>
                    <AreaTexto
                      id="mensaje"
                      placeholder="Escribe tu mensaje"
                      rows={6}
                      value={nuevoMensaje.mensaje}
                      onChange={(e) => setNuevoMensaje((prev) => ({ ...prev, mensaje: e.target.value }))}
                    />
                  </div>

                  <Boton type="submit" className="w-full">
                    {cargando ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                    Registrar envío
                  </Boton>
                </form>
              </ContenidoTarjeta>
            </Tarjeta>
          </ContenidoPestanas>
        </Pestanas>
      </div>
    </DisenoTablero>
  )
}
