"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAutenticacion } from "./proveedor-autenticacion"
import { NavegacionDashboard } from "./navegacion-dashboard"

interface LayoutDashboardProps {
  children: React.ReactNode
  rolRequerido?: "administrador" | "docente" | "estudiante"
}

export const LayoutDashboard = ({ children, rolRequerido }: LayoutDashboardProps) => {
  const { usuario, estaAutenticado } = useAutenticacion()
  const router = useRouter()

  useEffect(() => {
    if (!estaAutenticado) {
      router.push("/")
      return
    }

    if (rolRequerido && usuario?.rol !== rolRequerido) {
      router.push("/")
    }
  }, [estaAutenticado, usuario, rolRequerido, router])

  if (!estaAutenticado || (rolRequerido && usuario?.rol !== rolRequerido)) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 flex-shrink-0">
        <NavegacionDashboard />
      </aside>
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="container mx-auto p-6 md:p-8">{children}</div>
      </main>
    </div>
  )
}
