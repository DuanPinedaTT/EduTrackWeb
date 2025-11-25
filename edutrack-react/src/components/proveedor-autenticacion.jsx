import { createContext, useContext, useState, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { apiClient } from "@/lib/api-client"
import { getDefaultRouteForRole, mapApiRoleToUi, mapUiRoleToApi } from "@/lib/roles"

const ContextoAutenticacion = createContext(undefined)
const STORAGE_KEY = "usuario"

const readStoredUser = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return null
    const parsed = JSON.parse(data)
    if (!parsed) return null
    if (parsed.rolSistema) {
      return parsed
    }
    const rolSistema = mapUiRoleToApi(parsed.rol) || parsed.rol || undefined
    return {
      ...parsed,
      rolSistema,
      rol: parsed.rol || mapApiRoleToUi(rolSistema),
    }
  } catch (error) {
    console.error("No se pudo leer el usuario almacenado", error)
    return null
  }
}

const buildUsuario = (apiUser) => {
  if (!apiUser) return null
  const nombre = apiUser.nombre ?? apiUser.Nombre ?? ""
  const apellido = apiUser.apellido ?? apiUser.Apellido ?? ""
  const rolSistema = (apiUser.rol ?? apiUser.Rol ?? "").toLowerCase()
  return {
    id: apiUser.id ?? apiUser.Id,
    nombre: `${nombre} ${apellido}`.trim() || apiUser.user || apiUser.User || apiUser.email || apiUser.Email,
    email: apiUser.email ?? apiUser.Email,
    username: apiUser.user ?? apiUser.User,
    rolSistema,
    rol: mapApiRoleToUi(rolSistema),
  }
}

export function ProveedorAutenticacion({ children }) {
  const [usuario, setUsuario] = useState(() => readStoredUser())
  const [token, setToken] = useState(() => localStorage.getItem(apiClient.SESSION_STORAGE_KEY) || null)
  const navigate = useNavigate()

  const persistSession = useCallback((user, accessToken) => {
    if (!user || !accessToken) return
    setUsuario(user)
    setToken(accessToken)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    localStorage.setItem(apiClient.SESSION_STORAGE_KEY, accessToken)
  }, [])

  const clearSession = useCallback(() => {
    setUsuario(null)
    setToken(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(apiClient.SESSION_STORAGE_KEY)
  }, [])

  const iniciarSesion = useCallback(
    async (identificador, contrasena) => {
      try {
        const response = await apiClient.post("/api/Auth/login", {
          user: identificador,
          password: contrasena,
        })

        const usuarioNormalizado = buildUsuario(response.user)
        const accessToken = response.token

        persistSession(usuarioNormalizado, accessToken)

        navigate(getDefaultRouteForRole(usuarioNormalizado?.rolSistema))
        return usuarioNormalizado
      } catch (error) {
        console.error("Error iniciando sesión", error)
        clearSession()
        throw error
      }
    },
    [clearSession, navigate, persistSession],
  )

  const cerrarSesion = () => {
    clearSession()
    navigate("/")
  }

  const value = useMemo(
    () => ({
      usuario,
      token,
      iniciarSesion,
      cerrarSesion,
      estaAutenticado: Boolean(usuario && token),
    }),
    [usuario, token, iniciarSesion],
  )

  return <ContextoAutenticacion.Provider value={value}>{children}</ContextoAutenticacion.Provider>
}

export function useAutenticacion() {
  const contexto = useContext(ContextoAutenticacion)
  if (!contexto) {
    throw new Error("useAutenticacion debe usarse dentro de ProveedorAutenticacion")
  }
  return contexto
}
