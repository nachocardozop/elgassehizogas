"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Clock,
  MapPin,
  Share2,
  Calculator,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  MapIcon,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatearFechaHora } from "@/lib/utils"

// Funciones de cálculo reutilizadas
const calcularCombustibleRestante = (fuelRecord) => {
  if (!fuelRecord || fuelRecord.status === "empty") return 0

  const ahora = new Date()
  const inicioVenta = new Date(fuelRecord.start_time)

  if (ahora < inicioVenta) return fuelRecord.quantity

  const minutosTranscurridos = Math.floor((ahora - inicioVenta) / (1000 * 60))
  const autosAtendidos = Math.floor(minutosTranscurridos / 2)
  const litrosVendidos = autosAtendidos * 35

  return Math.max(0, fuelRecord.quantity - litrosVendidos)
}

const calcularTiempoRestante = (fuelRecord) => {
  if (!fuelRecord || fuelRecord.status === "empty") return { horas: 0, minutos: 0, horaFin: null }

  const combustibleRestante = calcularCombustibleRestante(fuelRecord)
  const autosRestantes = Math.floor(combustibleRestante / 35)
  const minutosRestantes = autosRestantes * 2

  const horas = Math.floor(minutosRestantes / 60)
  const minutos = minutosRestantes % 60

  const ahora = new Date()
  const horaFin = new Date(ahora.getTime() + minutosRestantes * 60000)

  return { horas, minutos, horaFin }
}

export default function PaginaDetalleEstacion({ params }) {
  const [estacion, setEstacion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [autosDelante, setAutosDelante] = useState(0)
  const [cuadrasDelante, setCuadrasDelante] = useState(0)
  const [tipoDistancia, setTipoDistancia] = useState("autos")
  const [tiempoActual, setTiempoActual] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTiempoActual(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetchEstacion()
  }, [params.id])

  const fetchEstacion = async () => {
    try {
      const response = await fetch(`/api/public/stations/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        console.log("Estación cargada:", data) // Para depuración

        // Asegurarse de que fuel_records sea un array
        if (data) {
          data.fuel_records = Array.isArray(data.fuel_records) ? data.fuel_records : []
        }

        setEstacion(data)
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

  // Asegurarse de que fuel_records sea un array
  const fuelRecords = Array.isArray(estacion.fuel_records) ? estacion.fuel_records : []
  const latestFuel = fuelRecords.length > 0 ? fuelRecords[0] : null

  if (!latestFuel) {
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

  const combustibleRestante = calcularCombustibleRestante(latestFuel)
  const tiempoRestante = calcularTiempoRestante(latestFuel)
  const autosIniciales = Math.floor(latestFuel.quantity / 35)
  const autosRestantes = Math.floor(combustibleRestante / 35)

  // Calcular posición en fila
  let autosEnFila = autosDelante
  if (tipoDistancia === "cuadras") {
    // Estimación: 8 autos por cuadra
    autosEnFila = cuadrasDelante * 8
  }

  const litrosNecesarios = autosEnFila * 35
  const haySuficiente = combustibleRestante >= litrosNecesarios
  const tiempoEspera = autosEnFila * 2 // 2 minutos por auto

  // Análisis inteligente
  let recomendacion = ""
  let colorRecomendacion = ""
  let iconoRecomendacion = null

  if (latestFuel.status === "empty") {
    recomendacion = "Esta estación no tiene combustible disponible. Te recomendamos buscar otra estación."
    colorRecomendacion = "bg-red-50 text-red-800 border-red-200"
    iconoRecomendacion = <XCircle className="h-5 w-5 text-red-600" />
  } else if (latestFuel.status === "upcoming") {
    const minutosHastaInicio = Math.floor((new Date(latestFuel.start_time) - new Date()) / (1000 * 60))
    if (minutosHastaInicio > 60) {
      recomendacion = `La venta comenzará en ${Math.floor(minutosHastaInicio / 60)} horas y ${minutosHastaInicio % 60} minutos. Considera llegar 30-60 minutos antes para asegurar tu lugar.`
      colorRecomendacion = "bg-blue-50 text-blue-800 border-blue-200"
      iconoRecomendacion = <Clock className="h-5 w-5 text-blue-600" />
    } else {
      recomendacion = `La venta comenzará pronto (${minutosHastaInicio} minutos). Es un buen momento para dirigirte a la estación.`
      colorRecomendacion = "bg-green-50 text-green-800 border-green-200"
      iconoRecomendacion = <CheckCircle className="h-5 w-5 text-green-600" />
    }
  } else if (!haySuficiente) {
    recomendacion =
      "Basado en tu posición estimada en la fila, es probable que no haya suficiente combustible. Te recomendamos buscar otra estación."
    colorRecomendacion = "bg-red-50 text-red-800 border-red-200"
    iconoRecomendacion = <XCircle className="h-5 w-5 text-red-600" />
  } else if (tiempoEspera > 120) {
    recomendacion = `El tiempo de espera estimado es largo (${Math.floor(tiempoEspera / 60)} horas). Hay combustible suficiente, pero considera si vale la pena la espera.`
    colorRecomendacion = "bg-yellow-50 text-yellow-800 border-yellow-200"
    iconoRecomendacion = <AlertTriangle className="h-5 w-5 text-yellow-600" />
  } else {
    recomendacion = `¡Buenas noticias! Hay suficiente combustible para tu posición. Tiempo estimado de espera: ${Math.floor(tiempoEspera / 60)}h ${tiempoEspera % 60}m.`
    colorRecomendacion = "bg-green-50 text-green-800 border-green-200"
    iconoRecomendacion = <CheckCircle className="h-5 w-5 text-green-600" />
  }

  return (
    <div className="min-h-screen bg-background">
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
              {estacion.city || "Sin ciudad"}, {estacion.department || "Sin departamento"}
            </span>
          </div>
        </div>

        {/* Resumen de información de la tarjeta */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="text-lg">Resumen de Disponibilidad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-900">{latestFuel.quantity.toLocaleString()}L</div>
                <div className="text-xs text-blue-700">Combustible inicial</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-900">{combustibleRestante.toLocaleString()}L</div>
                <div className="text-xs text-green-700">Restante ahora</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-orange-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-orange-900">
                  {tiempoRestante.horas}h {tiempoRestante.minutos}m
                </div>
                <div className="text-xs text-orange-700">Tiempo restante</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-purple-900">
                  {tiempoRestante.horaFin
                    ? tiempoRestante.horaFin.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--:--"}
                </div>
                <div className="text-xs text-purple-700">Hora estimada fin</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Análisis inteligente */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Análisis Inteligente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded-lg border flex items-start gap-3 ${colorRecomendacion}`}>
              {iconoRecomendacion}
              <div>
                <h4 className="font-medium mb-1">Recomendación:</h4>
                <p className="text-sm">{recomendacion}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calculadora mejorada */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              ¿Ya estás en la fila?
            </CardTitle>
            <CardDescription>
              Si ya estás haciendo fila, ingresa tu posición para un cálculo más preciso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label className="text-base font-medium">¿Cómo quieres medir tu posición?</Label>
              <Select value={tipoDistancia} onValueChange={setTipoDistancia}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="autos">Número de autos delante</SelectItem>
                  <SelectItem value="cuadras">Número de cuadras de distancia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {tipoDistancia === "autos" ? (
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
            ) : (
              <div className="space-y-2">
                <Label htmlFor="cuadras-delante" className="text-base font-medium">
                  ¿A cuántas cuadras estás de la estación?
                </Label>
                <Input
                  id="cuadras-delante"
                  type="number"
                  min="0"
                  step="0.5"
                  value={cuadrasDelante}
                  onChange={(e) => setCuadrasDelante(Number.parseFloat(e.target.value) || 0)}
                  className="h-12 text-lg text-center"
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">Estimamos ~8 autos por cuadra</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded-lg p-3 text-center bg-background">
                <div className="text-xl font-bold mb-1">
                  {haySuficiente ? (combustibleRestante - litrosNecesarios).toLocaleString() : 0}L
                </div>
                <div className="text-xs text-muted-foreground">Litros restantes después</div>
              </div>

              <div className="border rounded-lg p-3 text-center bg-background">
                <div className="text-xl font-bold mb-1">
                  {Math.floor(tiempoEspera / 60)}h {tiempoEspera % 60}m
                </div>
                <div className="text-xs text-muted-foreground">Tiempo estimado</div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Posición estimada: {autosEnFila} autos delante</p>
              <p>Combustible necesario: {litrosNecesarios.toLocaleString()}L</p>
            </div>
          </CardContent>
        </Card>

        {/* Información de contacto */}
        <Card>
          <CardHeader>
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
              <MapIcon className="h-4 w-4 mr-2" />
              Obtener Direcciones
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
