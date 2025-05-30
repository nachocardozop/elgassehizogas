"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, MapPin, Share2, Calculator } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatearFechaHora, calcularCombustibleRestante } from "@/lib/utils"

export default function PaginaDetalleEstacion({ params }) {
  const [estacion, setEstacion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [autosDelante, setAutosDelante] = useState(0)
  const [combustibleSeleccionado, setCombustibleSeleccionado] = useState(null)

  useEffect(() => {
    fetchEstacion()
  }, [params.id])

  const fetchEstacion = async () => {
    try {
      const response = await fetch(`/api/stations/${params.id}/public`)
      if (response.ok) {
        const data = await response.json()
        setEstacion(data)
        if (data.fuel_records?.length > 0) {
          setCombustibleSeleccionado(data.fuel_records[0].id)
        }
      }
    } catch (error) {
      console.error("Error fetching station:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando estación...</p>
        </div>
      </div>
    )
  }

  if (!estacion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Estación no encontrada</h2>
          <Link href="/">
            <Button>Volver al inicio</Button>
          </Link>
        </div>
      </div>
    )
  }

  const actualizacionSeleccionada =
    estacion.fuel_records?.find((record) => record.id === combustibleSeleccionado) || estacion.fuel_records?.[0]

  if (!actualizacionSeleccionada) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
          <div className="container flex h-14 items-center justify-between py-2 px-4">
            <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </div>
        </header>
        <main className="container py-4 px-4">
          <div className="text-center py-12">
            <h2 className="text-xl font-bold mb-2">{estacion.name}</h2>
            <p className="text-muted-foreground">Sin información de combustible disponible</p>
          </div>
        </main>
      </div>
    )
  }

  // Calcular si hay suficiente combustible para los autos delante
  const litrosNecesarios = autosDelante * 35
  const haySuficiente = actualizacionSeleccionada.quantity >= litrosNecesarios
  const combustibleRestante = calcularCombustibleRestante(actualizacionSeleccionada.quantity, autosDelante)
  const tiempoEspera = autosDelante * 2 // 2 minutos por vehículo promedio

  // Determinar recomendación
  let recomendacion = ""
  let colorRecomendacion = ""
  if (actualizacionSeleccionada.status === "empty") {
    recomendacion = "Esta estación no tiene combustible. Busca otra estación."
    colorRecomendacion = "bg-red-50 text-red-800 border-red-200"
  } else if (!haySuficiente) {
    recomendacion = "No hay suficiente combustible para tu posición en la fila. Busca otra estación."
    colorRecomendacion = "bg-red-50 text-red-800 border-red-200"
  } else if (tiempoEspera > 60) {
    recomendacion = `El tiempo de espera es largo (${Math.floor(tiempoEspera / 60)} horas y ${
      tiempoEspera % 60
    } minutos). Considera buscar otra estación.`
    colorRecomendacion = "bg-yellow-50 text-yellow-800 border-yellow-200"
  } else {
    recomendacion = `Hay suficiente combustible para tu posición. Tiempo estimado de espera: ${tiempoEspera} minutos.`
    colorRecomendacion = "bg-green-50 text-green-800 border-green-200"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header optimizado para móvil */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between py-2 px-4">
          <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs px-3">
              <Share2 className="h-3 w-3 mr-1" />
              Compartir
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-4 px-4 space-y-4">
        {/* Información de la estación */}
        <div className="space-y-2">
          <h1 className="text-xl font-bold leading-tight">{estacion.name}</h1>
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>
              {estacion.city}, {estacion.department}
            </span>
          </div>
        </div>

        {/* Calculadora de posición - Destacada en móvil */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Estima tus Posibilidades
            </CardTitle>
            <CardDescription>Calcula si habrá suficiente combustible para tu posición</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="autos-delante" className="text-base font-medium">
                ¿Cuántos autos tienes delante?
              </Label>
              <Input
                id="autos-delante"
                type="number"
                min="0"
                value={autosDelante}
                onChange={(e) => setAutosDelante(Number.parseInt(e.target.value) || 0)}
                className="h-12 text-lg text-center"
                placeholder="0"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded-lg p-3 text-center bg-background">
                <div className="text-xl font-bold mb-1">{haySuficiente ? combustibleRestante : 0}</div>
                <div className="text-xs text-muted-foreground">Litros restantes</div>
              </div>

              <div className="border rounded-lg p-3 text-center bg-background">
                <div className="text-xl font-bold mb-1">{tiempoEspera} min</div>
                <div className="text-xs text-muted-foreground">Tiempo estimado</div>
              </div>
            </div>

            <div className={`p-3 rounded-lg text-sm border ${colorRecomendacion}`}>
              <p className="font-medium mb-1">Recomendación:</p>
              <p>{recomendacion}</p>
            </div>
          </CardContent>
        </Card>

        {/* Disponibilidad de combustible */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Disponibilidad de Combustible</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {estacion.fuel_records.map((record) => (
              <div
                key={record.id}
                className={`border rounded-lg p-3 ${
                  record.id === combustibleSeleccionado ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => setCombustibleSeleccionado(record.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{record.fuel_type}</div>
                  <Badge
                    variant={
                      record.status === "empty" ? "destructive" : record.status === "selling" ? "success" : "outline"
                    }
                    className="text-xs"
                  >
                    {record.status === "empty" ? "Vacío" : record.status === "selling" ? "Vendiendo" : "Próximamente"}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Disponible:</span>
                    <span className="font-medium">
                      {record.quantity > 0 ? (
                        <>
                          {record.quantity}L (~{Math.floor(record.quantity / 35)} autos)
                        </>
                      ) : (
                        "Sin combustible"
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {record.status === "upcoming" ? "Inicia:" : "Iniciado:"}
                    </span>
                    <span className="font-medium flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatearFechaHora(record.start_time)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Información de contacto */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              {estacion.phone && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Teléfono:</span>
                  <span className="font-medium">{estacion.phone}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">Horario:</span>
                <span className="font-medium">24 horas</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Última actualización:</span>
                <span className="font-medium">{formatearFechaHora(estacion.updated_at)}</span>
              </div>
            </div>

            <Button className="w-full h-12 mt-4">
              <MapPin className="h-4 w-4 mr-2" />
              Obtener Direcciones
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
