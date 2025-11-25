import { useCallback, useEffect, useMemo, useState } from "react"
import { DisenoTablero } from "@/components/layout-dashboard"
import { Boton } from "@/components/ui/button"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Entrada } from "@/components/ui/input"
import { Etiqueta } from "@/components/ui/label"
import { Selector, ContenidoSelector, ElementoSelector, DisparadorSelector, ValorSelector } from "@/components/ui/select"
import { Tabla, CuerpoTabla, CeldaTabla, EncabezadoTabla, CabeceraTabla, FilaTabla } from "@/components/ui/table"
import { Dialogo, ContenidoDialogo, DescripcionDialogo, EncabezadoDialogo, TituloDialogo, ActivadorDialogo } from "@/components/ui/dialog"
import { UserPlus, Search, Trash2, Mail, Loader2 } from "lucide-react"
import { Insignia } from "@/components/ui/badge"
import { apiClient } from "@/lib/api-client"
import { mapUiRoleToApi } from "@/lib/roles"

const formularioInicial = {
  nombre: "",
  apellido: "",
  email: "",
  username: "",
  password: "",
  rol: "docente",
}

export default function PaginaUsuarios() {
  const [busqueda, setBusqueda] = useState("")
  const [filtroRol, setFiltroRol] = useState("todos")
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")
  const [formulario, setFormulario] = useState(formularioInicial)
  const [guardando, setGuardando] = useState(false)
  const [eliminandoId, setEliminandoId] = useState(null)
  const [errorFormulario, setErrorFormulario] = useState("")

  const cargarUsuarios = useCallback(async () => {
    try {
      setCargando(true)
      setError("")
      const data = await apiClient.get("/api/Usuarios")
      setUsuarios(
        data.map((usuario) => ({
          id: usuario.id,
          nombre: `${usuario.nombre} ${usuario.apellido}`.trim(),
          email: usuario.email,
          rol: usuario.rol === "admin" ? "administrador" : usuario.rol,
          rolSistema: usuario.rol,
          username: usuario.user,
        })),
      )
    } catch (err) {
      setError(err.message || "No fue posible cargar los usuarios.")
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargarUsuarios()
  }, [cargarUsuarios])

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((usuario) => {
      const termino = busqueda.toLowerCase()
      const coincideBusqueda =
        usuario.nombre.toLowerCase().includes(termino) ||
        usuario.email.toLowerCase().includes(termino) ||
        usuario.username.toLowerCase().includes(termino)

      const coincideRol = filtroRol === "todos" || usuario.rol === filtroRol
      return coincideBusqueda && coincideRol
    })
  }, [usuarios, filtroRol, busqueda])

  const manejarCambioFormulario = (campo, valor) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }))
  }

  const manejarRegistro = async (event) => {
    event.preventDefault()
    setErrorFormulario("")
    setGuardando(true)

    try {
      const endpoint = formulario.rol === "administrador" ? "/api/Usuarios/crear-admin" : "/api/Usuarios"
      await apiClient.post(endpoint, {
        user: formulario.username,
        password: formulario.password,
        nombre: formulario.nombre,
        apellido: formulario.apellido,
        email: formulario.email,
        rol: mapUiRoleToApi(formulario.rol),
      })

      setDialogoAbierto(false)
      setFormulario(formularioInicial)
      await cargarUsuarios()
    } catch (err) {
      setErrorFormulario(err.message || "No se pudo registrar el usuario.")
    } finally {
      setGuardando(false)
    }
  }

  const manejarEliminar = async (id) => {
    try {
      setEliminandoId(id)
      setError("")
      await apiClient.del(`/api/Usuarios/${id}`)
      await cargarUsuarios()
    } catch (err) {
      setError(err.message || "No se pudo eliminar el usuario.")
    } finally {
      setEliminandoId(null)
    }
  }

  return (
    <DisenoTablero rolRequerido="administrador">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">Administre estudiantes, docentes y personal</p>
          </div>
          <Dialogo open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
            <ActivadorDialogo asChild>
              <Boton className="gap-2">
                <UserPlus className="w-4 h-4" />
                Nuevo Usuario
              </Boton>
            </ActivadorDialogo>
            <ContenidoDialogo className="max-w-2xl">
              <EncabezadoDialogo>
                <TituloDialogo>Registrar Nuevo Usuario</TituloDialogo>
                <DescripcionDialogo>Complete los datos del nuevo usuario</DescripcionDialogo>
              </EncabezadoDialogo>
              <form className="space-y-4" onSubmit={manejarRegistro}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Etiqueta htmlFor="nombre">Nombre</Etiqueta>
                    <Entrada
                      id="nombre"
                      placeholder="Ej: Juan"
                      value={formulario.nombre}
                      onChange={(e) => manejarCambioFormulario("nombre", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Etiqueta htmlFor="apellido">Apellido</Etiqueta>
                    <Entrada
                      id="apellido"
                      placeholder="Ej: Pérez"
                      value={formulario.apellido}
                      onChange={(e) => manejarCambioFormulario("apellido", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Etiqueta htmlFor="email">Correo Electrónico</Etiqueta>
                    <Entrada
                      id="email"
                      type="email"
                      placeholder="usuario@edutrack.com"
                      value={formulario.email}
                      onChange={(e) => manejarCambioFormulario("email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Etiqueta htmlFor="username">Usuario</Etiqueta>
                    <Entrada
                      id="username"
                      placeholder="usuario01"
                      value={formulario.username}
                      onChange={(e) => manejarCambioFormulario("username", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Etiqueta htmlFor="rol">Rol</Etiqueta>
                    <Selector value={formulario.rol} onValueChange={(value) => manejarCambioFormulario("rol", value)}>
                      <DisparadorSelector>
                        <ValorSelector />
                      </DisparadorSelector>
                      <ContenidoSelector>
                        <ElementoSelector value="docente">Docente</ElementoSelector>
                        <ElementoSelector value="administrador">Administrador</ElementoSelector>
                      </ContenidoSelector>
                    </Selector>
                  </div>
                  <div className="space-y-2">
                    <Etiqueta htmlFor="password">Contraseña</Etiqueta>
                    <Entrada
                      id="password"
                      type="password"
                      value={formulario.password}
                      onChange={(e) => manejarCambioFormulario("password", e.target.value)}
                      required
                    />
                  </div>
                </div>
                {errorFormulario && <p className="text-sm text-destructive">{errorFormulario}</p>}
                <div className="flex justify-end gap-2 pt-4">
                  <Boton type="button" variant="outline" onClick={() => setDialogoAbierto(false)}>
                    Cancelar
                  </Boton>
                  <Boton type="submit" disabled={guardando} className="gap-2">
                    {guardando && <Loader2 className="w-4 h-4 animate-spin" />}
                    Registrar Usuario
                  </Boton>
                </div>
              </form>
            </ContenidoDialogo>
          </Dialogo>
        </div>

        <Tarjeta>
          <EncabezadoTarjeta>
            <TituloTarjeta>Lista de Usuarios</TituloTarjeta>
            <DescripcionTarjeta>
              {cargando ? "Cargando usuarios..." : `Total: ${usuarios.length} usuarios registrados`}
            </DescripcionTarjeta>
          </EncabezadoTarjeta>
          <ContenidoTarjeta>
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Entrada
                  placeholder="Buscar por nombre o email..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Selector value={filtroRol} onValueChange={setFiltroRol}>
                <DisparadorSelector className="w-[180px]">
                  <ValorSelector />
                </DisparadorSelector>
                <ContenidoSelector>
                  <ElementoSelector value="todos">Todos los roles</ElementoSelector>
                  <ElementoSelector value="docente">Docentes</ElementoSelector>
                  <ElementoSelector value="administrador">Administradores</ElementoSelector>
                </ContenidoSelector>
              </Selector>
            </div>

            {error && <p className="text-sm text-destructive mb-4">{error}</p>}

            <div className="rounded-md border">
              <Tabla>
                <CabeceraTabla>
                  <FilaTabla>
                    <EncabezadoTabla>Nombre</EncabezadoTabla>
                    <EncabezadoTabla>Usuario</EncabezadoTabla>
                    <EncabezadoTabla>Email</EncabezadoTabla>
                    <EncabezadoTabla>Rol</EncabezadoTabla>
                    <EncabezadoTabla className="text-right">Acciones</EncabezadoTabla>
                  </FilaTabla>
                </CabeceraTabla>
                <CuerpoTabla>
                  {cargando ? (
                    <FilaTabla>
                      <CeldaTabla colSpan={5} className="text-center">
                        Cargando información...
                      </CeldaTabla>
                    </FilaTabla>
                  ) : usuariosFiltrados.length === 0 ? (
                    <FilaTabla>
                      <CeldaTabla colSpan={5} className="text-center text-muted-foreground">
                        No se encontraron usuarios con los filtros aplicados.
                      </CeldaTabla>
                    </FilaTabla>
                  ) : (
                    usuariosFiltrados.map((usuario) => (
                      <FilaTabla key={usuario.id}>
                        <CeldaTabla className="font-medium">{usuario.nombre}</CeldaTabla>
                        <CeldaTabla>{usuario.username}</CeldaTabla>
                        <CeldaTabla>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            {usuario.email}
                          </div>
                        </CeldaTabla>
                        <CeldaTabla>
                          <Insignia variant={usuario.rol === "administrador" ? "default" : "secondary"}>{usuario.rol}</Insignia>
                        </CeldaTabla>
                        <CeldaTabla className="text-right">
                          <Boton
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => manejarEliminar(usuario.id)}
                            disabled={eliminandoId === usuario.id}
                          >
                            {eliminandoId === usuario.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Boton>
                        </CeldaTabla>
                      </FilaTabla>
                    ))
                  )}
                </CuerpoTabla>
              </Tabla>
            </div>
          </ContenidoTarjeta>
        </Tarjeta>
      </div>
    </DisenoTablero>
  )
}
