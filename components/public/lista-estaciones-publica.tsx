"use client"

import { useState } from "react"
import { Clock, Droplet, MapPin, Search, Filter } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { formatearFechaHora } from "@/lib/utils"

// Mock data for preview - in real app this would come from API
const mockEstaciones = [
  {
    id: "1",
    name: "Estación YPFB Santa Cruz Centro",
    address: "Av. Cristo Redentor, Santa Cruz de la Sierra",
    department: "Santa Cruz",
    city: "Santa Cruz de la Sierra",
    phone: "+591 33312345",
    updated_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    fuel_records: [
      {
        id: "fuel1",
        fuel_type: "Gasolina",
        quantity: 4500,
        start_time: new Date(Date.now() + 1000 * 60 * 25).toISOString(),
        status: "upcoming",
        created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      },
    ],
  },
  {
    id: "2",
    name: "Estación El Alto Norte",
    address: "Av. 6 de Marzo, El Alto",
    department: "La Paz",
    city: "El Alto",
    phone: "+591 22334455",
    updated_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    fuel_records: [
      {
        id: "fuel2",
        fuel_type: "Gasolina",
        quantity: 3200,
        start_time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        status: "selling",
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
    ],
  },
  {
    id: "3",
    name: "Estación YPFB Central La Paz",
    address: "Av. 16 de Julio, La Paz",
    department: "La Paz",
    city: "La Paz",
    phone: "+591 22556677",
    updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    fuel_records: [
      {
        id: "fuel3",
        fuel_type: "Gasolina",
        quantity: 5000,
        start_time: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
        status: "upcoming",
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
    ],
  },
  {
    id: "4",
    name: "Estación La Guardia",
    address: "Carretera a Cochabamba, La Guardia",
    department: "Santa Cruz",
    city: "La Guardia",
    phone: "+591 33778899",
    updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    fuel_records: [
      {
        id: "fuel4",
        fuel_type: "Gasolina",
        quantity: 0,
        start_time: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        status: "empty",
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
    ],
  },
]

export function ListaEstacionesPublica() {
  const [estaciones] = useState(mockEstaciones)
  const [loading] = useState(false)
  const [busqueda, setBusqueda] = useState("")
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState("todos")
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState("todas")
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)

  // Obtener departamentos únicos
  const departamentos = [...new Set(estaciones.map((estacion) => estacion.department))].sort()

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
        ].sort()

  const estacionesFiltradas = estaciones.filter((estacion) => {
    // Filtro de búsqueda por texto
    const coincideTexto =
      estacion.name.toLowerCase().includes(busqueda.toLowerCase()) ||
      estacion.address.toLowerCase().includes(busqueda.toLowerCase()) ||
      estacion.city.toLowerCase().includes(busqueda.toLowerCase())

    // Filtro por departamento
    const coincideDepartamento =
      departamentoSeleccionado === "todos" || estacion.department === departamentoSeleccionado

    // Filtro por ciudad
    const coincideCiudad = ciudadSeleccionada === "todas" || estacion.city === ciudadSeleccionada

    return coincideTexto && coincideDepartamento && coincideCiudad
  })

  // Resetear ciudad cuando cambia el departamento
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

  return (
    <div className="space-y-4">
      {/* Búsqueda y filtros optimizados para móvil */}
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

        {/* Filtros en móvil usando Sheet */}
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

      {/* Lista de estaciones optimizada para móvil */}
      <div className="space-y-3">
        {estacionesFiltradas.map((estacion) => {
          // Get the latest fuel record for this station
          const latestFuel = estacion.fuel_records?.[0] || null

          return (
            <Card key={estacion.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base leading-tight">{estacion.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1 text-sm">
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{estacion.city}</span>
                    </CardDescription>
                  </div>
                  {latestFuel && (
                    <Badge
                      variant={
                        latestFuel.status === "empty"
                          ? "destructive"
                          : latestFuel.status === "selling"
                            ? "success"
                            : "outline"
                      }
                      className="text-xs px-2 py-1 flex-shrink-0"
                    >
                      {latestFuel.status === "empty"
                        ? "Vacío"
                        : latestFuel.status === "selling"
                          ? "Vendiendo"
                          : "Próximamente"}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {latestFuel ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Combustible:</span>
                      <span className="text-sm font-medium">{latestFuel.fuel_type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Disponible:</span>
                      <span className="text-sm font-medium">
                        {latestFuel.quantity > 0 ? (
                          <>
                            {latestFuel.quantity}L
                            <span className="text-xs text-muted-foreground ml-1">
                              (~{Math.floor(latestFuel.quantity / 35)})
                            </span>
                          </>
                        ) : (
                          "Sin combustible"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {latestFuel.status === "upcoming" ? "Inicia:" : "Iniciado:"}
                      </span>
                      <span className="text-sm font-medium flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatearFechaHora(latestFuel.start_time)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground text-sm">Sin información de combustible</div>
                )}
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
        })}

        {estacionesFiltradas.length === 0 && (
          <div className="text-center py-12">
            <Droplet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No se encontraron estaciones</h3>
            <p className="text-muted-foreground mt-2">Intenta ajustar tus criterios de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  )
}
