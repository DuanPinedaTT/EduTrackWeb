import { useCallback, useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"

export function useEstadisticas() {
  const [estadisticas, setEstadisticas] = useState({
    totalDocentes: 0,
    totalCursos: 0,
    totalEstudiantes: 0,
  })
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  const cargar = useCallback(async () => {
    try {
      setCargando(true)
      setError("")
      const data = await apiClient.get("/api/Estadisticas")
      setEstadisticas({
        totalDocentes: data.totalDocentes ?? 0,
        totalCursos: data.totalCursos ?? 0,
        totalEstudiantes: data.totalEstudiantes ?? 0,
      })
    } catch (err) {
      setError(err.message || "No se pudieron cargar las estadísticas")
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  return { estadisticas, cargando, error, recargar: cargar }
}
