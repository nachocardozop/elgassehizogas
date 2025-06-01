"use client"

import { useState, useEffect } from "react"
import { Clock, Droplet, MapPin, Search, Filter, Fuel, Timer, TrendingDown } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { formatearFechaHora } from "@/lib/utils"

// Función para calcular combustible restante en tiempo real
const calcularCombustibleRestante = (fuelRecord) => {
  if (!fuelRecord || fuelRecord.status === "empty") return 0

  const ahora = new Date()
  const inicioVenta = new Date(fuelRecord.start_time)

  // Si aún no ha empezado la venta, devolver cantidad completa
  if (ahora < inicioVenta) return fuelRecord.quantity

  // Calcular minutos transcurridos desde el inicio
  const minutosTranscurridos = Math.floor((ahora - inicioVenta) / (1000 * 60))

  // Estimación: 1 auto cada 2 minutos, 35 litros por auto
  const autosAtendidos = Math.floor(minutosTranscurridos / 2)
  const litrosVendidos = autosAtendidos * 35

  return Math.max(0, fuelRecord.quantity - litrosVendidos)
}

// Función para calcular tiempo restante de venta
const calcularTiempoRestante = (fuelRecord) => {
  if (!fuelRecord || fuelRecord.status === "empty") return { horas: 0, minutos: 0, horaFin: null }

  const combustibleRestante = calcularCombustibleRestante(fuelRecord)
  const autosRestantes = Math.floor(combustibleRestante / 35)
  const minutosRestantes = autosRestantes * 2 // 2 minutos por auto

  const horas = Math.floor(minutosRestantes / 60)
  const minutos = minutosRestantes % 60

  // Calcular hora estimada de fin
  const ahora = new Date()
  const horaFin = new Date(ahora.getTime() + minutosRestantes * 60000)

  return { horas, minutos, horaFin }
}

// Función para ordenar estaciones por prioridad de estado
const ordenarPorPrioridad = (estaciones) => {
  const prioridades = {
    selling: 1, // Vendiendo
    upcoming: 2, // Programado
    empty: 3, // Hasta nuevo aviso
  }

  return [...estaciones].sort((a, b) => {
    // Asegurarse de que fuel_records sea un array y no sea null/undefined
    const fuelRecordsA = Array.isArray(a.fuel_records) ? a.fuel_records : []
    const fuelRecordsB = Array.isArray(b.fuel_records) ? b.fuel_records : []

    const fuelA = fuelRecordsA.length > 0 ? fuelRecordsA[0] : null
    const fuelB = fuelRecordsB.length > 0 ? fuelRecordsB[0] : null

    // Si una estación no tiene registros de combustible, ponerla al final
    if (!fuelA && fuelB) return 1
    if (fuelA && !fuelB) return -1
    if (!fuelA && !fuelB) return 0

    const prioridadA = fuelA ? prioridades[fuelA.status] || 4 : 4
    const prioridadB = fuelB ? prioridades[fuelB.status] || 4 : 4

    if (prioridadA !== prioridadB) {
      return prioridadA - prioridadB
    }

    // Si tienen la misma prioridad, ordenar por cantidad de combustible (mayor primero)
    const cantidadA = fuelA ? calcularCombustibleRestante(fuelA) : 0
    const cantidadB = fuelB ? calcularCombustibleRestante(fuelB) : 0

    return cantidadB - cantidadA
  })
}

export function ListaEstacionesPublica() {
  const [estaciones, setEstaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busqueda, setBusqueda] = useState("")
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState("todos")
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState("todas")
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)
  const [tiempoActual, setTiempoActual] = useState(new Date())

  // Actualizar tiempo cada minuto para cálculos en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setTiempoActual(new Date())
    }, 60000) // Actualizar cada minuto

    return () => clearInterval(interval)
  }, [])

  // Fetch real data from API
  useEffect(() => {
    const fetchEstaciones = async () => {
      try {
        console.log("Fetching stations from /api/public/stations...")
        const response = await fetch("/api/public/stations")
        console.log("Response status:", response.status)

        if (response.ok) {
          const data = await response.json()
          console.log("Estaciones cargadas:", data) // Para depuración

          // Asegurarse de que cada estación tenga un array fuel_records
          const transformedData = data.map((station) => ({
            ...station,
            fuel_records: Array.isArray(station.fuel_records) ? station.fuel_records : [],
          }))

          setEstaciones(transformedData)
          setError(null)
        } else {
          const errorText = await response.text()
          console.error("Error response:", errorText)
          setError(`Error ${response.status}: ${errorText}`)
          setEstaciones([])
        }
      } catch (error) {
        console.error("Error fetching stations:", error)
        setError(`Network error: ${error.message}`)
        setEstaciones([])
      } finally {
        setLoading(false)
      }
    }

    fetchEstaciones()
  }, [])

  // Obtener departamentos únicos
  const departamentos = [...new Set(estaciones.map((estacion) => estacion.department))].filter(Boolean).sort()

  // Obtener ciudades del departamento seleccionado
  const ciudades =
    departamentoSeleccionado === "todos"
      ? []
      : [
          ...new Set(
            estaciones
              .filter((estacion) => estacion.department === departamentoSeleccionado)
              .map((estacion) => estacion.city),
          ),
        ]
          .filter(Boolean)
          .sort()

  const estacionesFiltradas = estaciones.filter((estacion) => {
    const coincideTexto =
      estacion.name?.toLowerCase().includes(busqueda.toLowerCase()) ||
      estacion.address?.toLowerCase().includes(busqueda.toLowerCase()) ||
      estacion.city?.toLowerCase().includes(busqueda.toLowerCase())

    const coincideDepartamento =
      departamentoSeleccionado === "todos" || estacion.department === departamentoSeleccionado

    const coincideCiudad = ciudadSeleccionada === "todas" || estacion.city === ciudadSeleccionada

    return coincideTexto && coincideDepartamento && coincideCiudad
  })

  // Ordenar por prioridad
  const estacionesOrdenadas = ordenarPorPrioridad(estacionesFiltradas)

  const handleDepartamentoChange = (valor) => {
    setDepartamentoSeleccionado(valor)
    setCiudadSeleccionada("todas")
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Cargando estaciones...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error al cargar estaciones</h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Debug info */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-gray-100 p-2 rounded text-xs">Debug: {estaciones.length} estaciones cargadas</div>
      )}

      {/* Búsqueda y filtros */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar estaciones..."
            className="pl-9 h-12 text-base"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Sheet open={filtrosAbiertos} onOpenChange={setFiltrosAbiertos}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex-1 h-12">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
                {(departamentoSeleccionado !== "todos" || ciudadSeleccionada !== "todas") && (
                  <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                    {(departamentoSeleccionado !== "todos" ? 1 : 0) + (ciudadSeleccionada !== "todas" ? 1 : 0)}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[400px]">
              <SheetHeader>
                <SheetTitle>Filtrar estaciones</SheetTitle>
                <SheetDescription>Selecciona departamento y ciudad para filtrar las estaciones</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Departamento</label>
                  <Select value={departamentoSeleccionado} onValueChange={handleDepartamentoChange}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los departamentos</SelectItem>
                      {departamentos.map((departamento) => (
                        <SelectItem key={departamento} value={departamento}>
                          {departamento}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Ciudad</label>
                  <Select
                    value={ciudadSeleccionada}
                    onValueChange={setCiudadSeleccionada}
                    disabled={departamentoSeleccionado === "todos"}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Ciudad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas las ciudades</SelectItem>
                      {ciudades.map((ciudad) => (
                        <SelectItem key={ciudad} value={ciudad}>
                          {ciudad}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setDepartamentoSeleccionado("todos")
                      setCiudadSeleccionada("todas")
                    }}
                  >
                    Limpiar
                  </Button>
                  <Button className="flex-1" onClick={() => setFiltrosAbiertos(false)}>
                    Aplicar
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Lista de estaciones mejorada */}
      <div className="space-y-3">
        {estacionesOrdenadas.map((estacion) => {
          // Asegurarse de que fuel_records sea un array
          const fuelRecords = Array.isArray(estacion.fuel_records) ? estacion.fuel_records : []
          const latestFuel = fuelRecords.length > 0 ? fuelRecords[0] : null

          if (!latestFuel) {
            return (
              <Card key={estacion.id} className="overflow-hidden opacity-60">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base leading-tight">{estacion.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1 text-sm">
                        <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{estacion.city || "Sin ubicación"}</span>
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-xs px-2 py-1">
                      Sin información
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    Sin información de combustible disponible
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 pt-3">
                  <Link href={`/estaciones/${estacion.id}`} className="w-full">
                    <Button variant="outline" className="w-full h-10">
                      Ver Detalles
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )
          }

          const combustibleRestante = calcularCombustibleRestante(latestFuel)
          const autosRestantes = Math.floor(combustibleRestante / 35)
          const tiempoRestante = calcularTiempoRestante(latestFuel)
          const autosIniciales = Math.floor(latestFuel.quantity / 35)

          // Determinar estado y color
          let estadoTexto = ""
          let estadoColor = ""
          let estadoIcon = null

          switch (latestFuel.status) {
            case "selling":
              estadoTexto = "Vendiendo"
              estadoColor = "bg-green-600 text-white"
              estadoIcon = <Fuel className="h-3 w-3" />
              break
            case "upcoming":
              estadoTexto = "Programado"
              estadoColor = "bg-blue-600 text-white"
              estadoIcon = <Clock className="h-3 w-3" />
              break
            case "empty":
              estadoTexto = "Hasta nuevo aviso"
              estadoColor = "bg-red-600 text-white"
              estadoIcon = <Droplet className="h-3 w-3" />
              break
            default:
              estadoTexto = "Desconocido"
              estadoColor = "bg-gray-600 text-white"
          }

          return (
            <Card key={estacion.id} className="overflow-hidden border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base leading-tight">{estacion.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1 text-sm">
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{estacion.city || "Sin ubicación"}</span>
                    </CardDescription>
                  </div>
                  <Badge className={`text-xs px-2 py-1 flex items-center gap-1 ${estadoColor}`}>
                    {estadoIcon}
                    {estadoTexto}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                {/* Combustible llegado/programado */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-blue-900">
                      Combustible {latestFuel.status === "upcoming" ? "programado" : "llegado"}
                    </span>
                    <Fuel className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-lg font-bold text-blue-900">{latestFuel.quantity.toLocaleString()}L</div>
                  <div className="text-xs text-blue-700">~{autosIniciales} vehículos estimados</div>
                </div>

                {/* Hora programada */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {latestFuel.status === "upcoming" ? "Inicia venta:" : "Inició venta:"}
                  </span>
                  <span className="text-sm font-medium flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatearFechaHora(latestFuel.start_time)}
                  </span>
                </div>

                {/* Combustible restante (solo si está vendiendo) */}
                {latestFuel.status === "selling" && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-green-900">Combustible restante</span>
                      <TrendingDown className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-lg font-bold text-green-900">{combustibleRestante.toLocaleString()}L</div>
                    <div className="text-xs text-green-700">~{autosRestantes} vehículos pueden comprar aún</div>
                  </div>
                )}

                {/* Tiempo estimado de venta */}
                {latestFuel.status !== "empty" && (
                  <div className="bg-orange-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-orange-900">
                        {latestFuel.status === "selling" ? "Tiempo restante" : "Duración estimada"}
                      </span>
                      <Timer className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="text-lg font-bold text-orange-900">
                      {tiempoRestante.horas}h {tiempoRestante.minutos}m
                    </div>
                    {tiempoRestante.horaFin && latestFuel.status === "selling" && (
                      <div className="text-xs text-orange-700">
                        Hasta aprox.{" "}
                        {tiempoRestante.horaFin.toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>

              <CardFooter className="bg-muted/30 pt-3">
                <Link href={`/estaciones/${estacion.id}`} className="w-full">
                  <Button className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-medium">
                    ¿Alcanzará para mí?
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )
        })}

        {estacionesOrdenadas.length === 0 && (
          <div className="text-center py-12">
            <Droplet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No se encontraron estaciones</h3>
            <p className="text-muted-foreground mt-2">
              {estaciones.length === 0
                ? "No hay estaciones registradas aún"
                : "Intenta ajustar tus criterios de búsqueda"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
