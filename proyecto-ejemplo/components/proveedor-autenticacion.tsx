"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type TipoRol = "administrador" | "docente" | "estudiante" | null

interface Usuario {
  id: string
  nombre: string
  email: string
  rol: TipoRol
}

interface ContextoAutenticacion {
  usuario: Usuario | null
  iniciarSesion: (email: string, contrasena: string) => Promise<boolean>
  cerrarSesion: () => void
  estaAutenticado: boolean
}

const ContextoAutenticacion = createContext<ContextoAutenticacion | undefined>(undefined)

// Datos de prueba para el prototipo
const usuariosPrueba = [
  {
    id: "1",
    nombre: "Admin Principal",
    email: "admin@edutrack.com",
    contrasena: "admin123",
    rol: "administrador" as TipoRol,
  },
  {
    id: "2",
    nombre: "Prof. María García",
    email: "docente@edutrack.com",
    contrasena: "docente123",
    rol: "docente" as TipoRol,
  },
  {
    id: "3",
    nombre: "Juan Pérez",
    email: "estudiante@edutrack.com",
    contrasena: "estudiante123",
    rol: "estudiante" as TipoRol,
  },
]

export const ProveedorAutenticacion = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Verificar si hay sesión guardada
    const usuarioGuardado = localStorage.getItem("usuario")
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado))
    }
  }, [])

  const iniciarSesion = async (email: string, contrasena: string): Promise<boolean> => {
    // Simular autenticación
    const usuarioEncontrado = usuariosPrueba.find((u) => u.email === email && u.contrasena === contrasena)

    if (usuarioEncontrado) {
      const { contrasena: _, ...usuarioSinContrasena } = usuarioEncontrado
      setUsuario(usuarioSinContrasena)
      localStorage.setItem("usuario", JSON.stringify(usuarioSinContrasena))

      // Redirigir según el rol
      switch (usuarioEncontrado.rol) {
        case "administrador":
          router.push("/administrador/dashboard")
          break
        case "docente":
          router.push("/docente/dashboard")
          break
        case "estudiante":
          router.push("/estudiante/dashboard")
          break
      }
      return true
    }
    return false
  }

  const cerrarSesion = () => {
    setUsuario(null)
    localStorage.removeItem("usuario")
    router.push("/")
  }

  return (
    <ContextoAutenticacion.Provider
      value={{
        usuario,
        iniciarSesion,
        cerrarSesion,
        estaAutenticado: !!usuario,
      }}
    >
      {children}
    </ContextoAutenticacion.Provider>
  )
}

export const useAutenticacion = () => {
  const contexto = useContext(ContextoAutenticacion)
  if (contexto === undefined) {
    throw new Error("useAutenticacion debe usarse dentro de ProveedorAutenticacion")
  }
  return contexto
}
