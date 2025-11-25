import { useState } from "react"
import { GraduationCap, BarChart3, Users, BookOpen, AlertCircle } from "lucide-react"
import { Boton } from "@/components/ui/button"
import { Tarjeta, ContenidoTarjeta, DescripcionTarjeta, EncabezadoTarjeta, TituloTarjeta } from "@/components/ui/card"
import { Entrada } from "@/components/ui/input"
import { Etiqueta } from "@/components/ui/label"
import { Alerta, DescripcionAlerta } from "@/components/ui/alert"
import { useAutenticacion } from "@/components/proveedor-autenticacion"

export default function Home() {
  const [email, setEmail] = useState("")
  const [contrasena, setContrasena] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)
  const { iniciarSesion } = useAutenticacion()

  const manejarEnvio = async (event) => {
    event.preventDefault()
    setError("")
    setCargando(true)

    const exito = await iniciarSesion(email, contrasena)

    if (!exito) {
      setError("Credenciales incorrectas. Por favor, intente nuevamente.")
    }

    setCargando(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary">EduTrack</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#caracteristicas" className="text-muted-foreground hover:text-foreground transition-colors">
              Características
            </a>
            <a href="#beneficios" className="text-muted-foreground hover:text-foreground transition-colors">
              Beneficios
            </a>
            <a href="#contacto" className="text-muted-foreground hover:text-foreground transition-colors">
              Contacto
            </a>
          </nav>
        </div>
      </header>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
              Sistema de Gestión Académica Inteligente
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Optimiza la administración educativa con análisis de rendimiento estudiantil, gestión de calificaciones y reportes automatizados.
            </p>
            <div className="flex flex-wrap gap-4">
              <Boton size="lg" className="gap-2">
                <GraduationCap className="w-5 h-5" />
                Comenzar Ahora
              </Boton>
              <Boton size="lg" variant="outline">
                Ver Demo
              </Boton>
            </div>
          </div>

          <Tarjeta className="shadow-xl">
            <EncabezadoTarjeta>
              <TituloTarjeta>Iniciar Sesión</TituloTarjeta>
              <DescripcionTarjeta>Ingrese sus credenciales para acceder al sistema</DescripcionTarjeta>
            </EncabezadoTarjeta>
            <ContenidoTarjeta>
              <form onSubmit={manejarEnvio} className="space-y-4">
                {error && (
                  <Alerta variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <DescripcionAlerta>{error}</DescripcionAlerta>
                  </Alerta>
                )}

                <div className="space-y-2">
                  <Etiqueta htmlFor="email">Correo Electrónico</Etiqueta>
                  <Entrada
                    id="email"
                    type="email"
                    placeholder="usuario@edutrack.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Etiqueta htmlFor="contrasena">Contraseña</Etiqueta>
                  <Entrada
                    id="contrasena"
                    type="password"
                    placeholder="••••••••"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    required
                  />
                </div>

                <Boton type="submit" className="w-full" disabled={cargando}>
                  {cargando ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Boton>

                <div className="text-sm text-center space-y-2 pt-4 border-t">
                  <p className="text-muted-foreground">Usuarios de prueba:</p>
                  <div className="space-y-1 text-xs">
                    <p>
                      <strong>Admin:</strong> admin@edutrack.com / admin123
                    </p>
                    <p>
                      <strong>Docente:</strong> docente@edutrack.com / docente123
                    </p>
                    <p>
                      <strong>Estudiante:</strong> estudiante@edutrack.com / estudiante123
                    </p>
                  </div>
                </div>
              </form>
            </ContenidoTarjeta>
          </Tarjeta>
        </div>
      </section>

      <section id="caracteristicas" className="bg-card/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Características Principales</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Tarjeta>
              <EncabezadoTarjeta>
                <Users className="w-12 h-12 text-primary mb-4" />
                <TituloTarjeta>Gestión de Usuarios</TituloTarjeta>
                <DescripcionTarjeta>Administre estudiantes, docentes y personal con roles personalizados</DescripcionTarjeta>
              </EncabezadoTarjeta>
            </Tarjeta>

            <Tarjeta>
              <EncabezadoTarjeta>
                <BookOpen className="w-12 h-12 text-secondary mb-4" />
                <TituloTarjeta>Control Académico</TituloTarjeta>
                <DescripcionTarjeta>Gestione materias, calificaciones, asistencias y periodos académicos</DescripcionTarjeta>
              </EncabezadoTarjeta>
            </Tarjeta>

            <Tarjeta>
              <EncabezadoTarjeta>
                <BarChart3 className="w-12 h-12 text-accent mb-4" />
                <TituloTarjeta>Análisis de Rendimiento</TituloTarjeta>
                <DescripcionTarjeta>Reportes estadísticos, gráficas y alertas de bajo rendimiento</DescripcionTarjeta>
              </EncabezadoTarjeta>
            </Tarjeta>
          </div>
        </div>
      </section>

      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 EduTrack. Sistema de Gestión Académica.</p>
          <p className="text-sm mt-2">Universidad Popular del Cesar - Duan Andrés Pineda Corrales</p>
        </div>
      </footer>
    </div>
  )
}
