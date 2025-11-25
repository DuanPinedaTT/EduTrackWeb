import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAutenticacion } from "@/components/proveedor-autenticacion"
import { MenuNavegacion } from "@/components/navegacion-dashboard"
import { mapUiRoleToApi } from "@/lib/roles"

export function DisenoTablero({ children, rolRequerido }) {
  const { usuario, estaAutenticado } = useAutenticacion()
  const navigate = useNavigate()

  const rolObjetivo = rolRequerido ? mapUiRoleToApi(rolRequerido) : undefined
  const coincideRol = !rolObjetivo || usuario?.rolSistema === rolObjetivo

  useEffect(() => {
    if (!estaAutenticado) {
      navigate("/")
      return
    }

    if (!coincideRol) {
      navigate("/")
    }
  }, [estaAutenticado, coincideRol, navigate])

  if (!estaAutenticado || !coincideRol) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 flex-shrink-0">
        <MenuNavegacion />
      </aside>
      <main className="flex-1 overflow-y-auto bg-background">
        <div className="container mx-auto p-6 md:p-8">{children}</div>
      </main>
    </div>
  )
}

const LayoutDashboard = DisenoTablero

export { LayoutDashboard }
