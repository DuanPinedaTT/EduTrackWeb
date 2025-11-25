"use client"

import { LayoutDashboard } from "@/components/layout-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAutenticacion } from "@/components/proveedor-autenticacion"
import { Mail, Phone, MapPin, Calendar, Save, Shield } from "lucide-react"

export default function PaginaPerfilAdmin() {
  const { usuario } = useAutenticacion()

  return (
    <LayoutDashboard>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground">Administra tu información personal</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Actualiza tus datos personales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre Completo</Label>
                  <Input id="nombre" defaultValue={usuario?.nombre} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input id="email" type="email" defaultValue={usuario?.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" defaultValue="+57 300 555 1234" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documento">Documento</Label>
                  <Input id="documento" defaultValue="1234567890" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input id="direccion" defaultValue="Calle Principal #123" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input id="ciudad" defaultValue="Valledupar" />
                </div>
              </div>
              <Button className="gap-2">
                <Save className="w-4 h-4" />
                Guardar Cambios
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{usuario?.nombre}</p>
                  <p className="text-sm text-muted-foreground capitalize">{usuario?.rol}</p>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{usuario?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>+57 300 555 1234</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>Valledupar, Cesar</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Administrador desde 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Seguridad</CardTitle>
            <CardDescription>Actualiza tu contraseña</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="actual">Contraseña Actual</Label>
                <Input id="actual" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nueva">Nueva Contraseña</Label>
                <Input id="nueva" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmar">Confirmar Contraseña</Label>
                <Input id="confirmar" type="password" />
              </div>
            </div>
            <Button className="mt-4">Cambiar Contraseña</Button>
          </CardContent>
        </Card>
      </div>
    </LayoutDashboard>
  )
}
