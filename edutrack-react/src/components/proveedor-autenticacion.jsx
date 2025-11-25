import { createContext, useContext, useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"

const ContextoAutenticacion = createContext(undefined)

const usuariosPrueba = [
  {
    id: "1",
    nombre: "Admin Principal",
    email: "admin@edutrack.com",
    contrasena: "admin123",
    rol: "administrador",
  },
  {
    id: "2",
    nombre: "Prof. María García",
    email: "docente@edutrack.com",
    contrasena: "docente123",
    rol: "docente",
  },
  {
    id: "3",
    nombre: "Juan Pérez",
    email: "estudiante@edutrack.com",
    contrasena: "estudiante123",
    rol: "estudiante",
  },
]

export function ProveedorAutenticacion({ children }) {
  const [usuario, setUsuario] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const almacenado = localStorage.getItem("usuario")
    if (almacenado) {
      setUsuario(JSON.parse(almacenado))
    }
  }, [])

  const iniciarSesion = async (email, contrasena) => {
    const encontrado = usuariosPrueba.find((u) => u.email === email && u.contrasena === contrasena)

    if (encontrado) {
      const { contrasena: _omitida, ...usuarioSinContrasena } = encontrado
      setUsuario(usuarioSinContrasena)
      localStorage.setItem("usuario", JSON.stringify(usuarioSinContrasena))

      switch (usuarioSinContrasena.rol) {
        case "administrador":
          navigate("/administrador/dashboard")
          break
        case "docente":
          navigate("/docente/dashboard")
          break
        case "estudiante":
          navigate("/estudiante/dashboard")
          break
        default:
          navigate("/")
      }
      return true
    }

    return false
  }

  const cerrarSesion = () => {
    setUsuario(null)
    localStorage.removeItem("usuario")
    navigate("/")
  }

  const value = useMemo(
    () => ({
      usuario,
      iniciarSesion,
      cerrarSesion,
      estaAutenticado: Boolean(usuario),
    }),
    [usuario],
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
