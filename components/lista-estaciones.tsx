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

// Datos de ejemplo con todas las ciudades de la imagen
const estacionesEjemplo = [
  // Santa Cruz de la Sierra
  {
    id: "1",
    nombre: "Estación YPFB Santa Cruz Centro",
    direccion: "Av. Cristo Redentor, Santa Cruz de la Sierra",
    departamento: "Santa Cruz",
    ciudad: "Santa Cruz de la Sierra",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    cantidadCombustible: 4500,
    horaInicio: new Date(Date.now() + 1000 * 60 * 25).toISOString(),
    estado: "proximo",
    tipoCombustible: "Gasolina",
  },
  // El Alto
  {
    id: "2",
    nombre: "Estación El Alto Norte",
    direccion: "Av. 6 de Marzo, El Alto",
    departamento: "La Paz",
    ciudad: "El Alto",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    cantidadCombustible: 3200,
    horaInicio: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    estado: "vendiendo",
    tipoCombustible: "Gasolina",
  },
  // La Paz
  {
    id: "3",
    nombre: "Estación YPFB Central La Paz",
    direccion: "Av. 16 de Julio, La Paz",
    departamento: "La Paz",
    ciudad: "La Paz",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    cantidadCombustible: 5000,
    horaInicio: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
    estado: "proximo",
    tipoCombustible: "Gasolina",
  },
  // Cochabamba
  {
    id: "4",
    nombre: "Estación Cochabamba Norte",
    direccion: "Av. Blanco Galindo, Cochabamba",
    departamento: "Cochabamba",
    ciudad: "Cochabamba",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    cantidadCombustible: 2500,
    horaInicio: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    estado: "vendiendo",
    tipoCombustible: "Gasolina",
  },
  // Oruro
  {
    id: "5",
    nombre: "Estación Oruro Central",
    direccion: "Calle Bolívar, Oruro",
    departamento: "Oruro",
    ciudad: "Oruro",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    cantidadCombustible: 3200,
    horaInicio: new Date(Date.now() + 1000 * 60 * 30).toISOString(),
    estado: "proximo",
    tipoCombustible: "Gasolina",
  },
  // Sucre
  {
    id: "6",
    nombre: "Estación Sucre Centro",
    direccion: "Av. Hernando Siles, Sucre",
    departamento: "Chuquisaca",
    ciudad: "Sucre",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    cantidadCombustible: 1800,
    horaInicio: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    estado: "vendiendo",
    tipoCombustible: "Gasolina",
  },
  // Potosí
  {
    id: "7",
    nombre: "Estación Potosí Norte",
    direccion: "Av. Universitaria, Potosí",
    departamento: "Potosí",
    ciudad: "Potosí",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    cantidadCombustible: 1500,
    horaInicio: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    estado: "vendiendo",
    tipoCombustible: "Diesel",
  },
  // Tarija
  {
    id: "8",
    nombre: "Estación Tarija",
    direccion: "Av. La Paz, Tarija",
    departamento: "Tarija",
    ciudad: "Tarija",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    cantidadCombustible: 2200,
    horaInicio: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    estado: "proximo",
    tipoCombustible: "Gasolina",
  },
  // Sacaba
  {
    id: "9",
    nombre: "Estación Sacaba",
    direccion: "Av. Petrolera, Sacaba",
    departamento: "Cochabamba",
    ciudad: "Sacaba",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    cantidadCombustible: 1900,
    horaInicio: new Date(Date.now() + 1000 * 60 * 40).toISOString(),
    estado: "proximo",
    tipoCombustible: "Gasolina",
  },
  // Quillacollo
  {
    id: "10",
    nombre: "Estación Quillacollo",
    direccion: "Av. Circunvalación, Quillacollo",
    departamento: "Cochabamba",
    ciudad: "Quillacollo",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    cantidadCombustible: 1600,
    horaInicio: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    estado: "vendiendo",
    tipoCombustible: "Gasolina",
  },
  // Warnes
  {
    id: "11",
    nombre: "Estación Warnes",
    direccion: "Carretera al Norte, Warnes",
    departamento: "Santa Cruz",
    ciudad: "Warnes",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    cantidadCombustible: 1400,
    horaInicio: new Date(Date.now() + 1000 * 60 * 50).toISOString(),
    estado: "proximo",
    tipoCombustible: "Diesel",
  },
  // Trinidad
  {
    id: "12",
    nombre: "Estación Beni Central",
    direccion: "Av. 6 de Agosto, Trinidad",
    departamento: "Beni",
    ciudad: "Trinidad",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
    cantidadCombustible: 1700,
    horaInicio: new Date(Date.now() + 1000 * 60 * 45).toISOString(),
    estado: "proximo",
    tipoCombustible: "Gasolina",
  },
  // Montero
  {
    id: "13",
    nombre: "Estación Montero",
    direccion: "Av. Integración, Montero",
    departamento: "Santa Cruz",
    ciudad: "Montero",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    cantidadCombustible: 1300,
    horaInicio: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    estado: "vendiendo",
    tipoCombustible: "Gasolina",
  },
  // Riberalta
  {
    id: "14",
    nombre: "Estación Riberalta",
    direccion: "Av. Costanera, Riberalta",
    departamento: "Beni",
    ciudad: "Riberalta",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
    cantidadCombustible: 1100,
    horaInicio: new Date(Date.now() + 1000 * 60 * 35).toISOString(),
    estado: "proximo",
    tipoCombustible: "Diesel",
  },
  // Yacuiba
  {
    id: "15",
    nombre: "Estación Yacuiba",
    direccion: "Av. Santa Cruz, Yacuiba",
    departamento: "Tarija",
    ciudad: "Yacuiba",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    cantidadCombustible: 1250,
    horaInicio: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    estado: "vendiendo",
    tipoCombustible: "Gasolina",
  },
  // La Guardia
  {
    id: "16",
    nombre: "Estación La Guardia",
    direccion: "Carretera a Cochabamba, La Guardia",
    departamento: "Santa Cruz",
    ciudad: "La Guardia",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    cantidadCombustible: 0,
    horaInicio: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    estado: "vacio",
    tipoCombustible: "Gasolina",
  },
]

// Obtener departamentos únicos
const departamentos = [...new Set(estacionesEjemplo.map((estacion) => estacion.departamento))].sort()

export function ListaEstaciones() {
  const [busqueda, setBusqueda] = useState("")
  const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState("todos")
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState("todas")
  const [estaciones, setEstaciones] = useState(estacionesEjemplo)
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)

  // Obtener ciudades del departamento seleccionado
  const ciudades =
    departamentoSeleccionado === "todos"
      ? []
      : [
          ...new Set(
            estacionesEjemplo
              .filter((estacion) => estacion.departamento === departamentoSeleccionado)
              .map((estacion) => estacion.ciudad),
          ),
        ].sort()

  const estacionesFiltradas = estaciones.filter((estacion) => {
    // Filtro de búsqueda por texto
    const coincideTexto =
      estacion.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      estacion.direccion.toLowerCase().includes(busqueda.toLowerCase()) ||
      estacion.ciudad.toLowerCase().includes(busqueda.toLowerCase())

    // Filtro por departamento
    const coincideDepartamento =
      departamentoSeleccionado === "todos" || estacion.departamento === departamentoSeleccionado

    // Filtro por ciudad
    const coincideCiudad = ciudadSeleccionada === "todas" || estacion.ciudad === ciudadSeleccionada

    return coincideTexto && coincideDepartamento && coincideCiudad
  })

  // Resetear ciudad cuando cambia el departamento
  const handleDepartamentoChange = (valor) => {
    setDepartamentoSeleccionado(valor)
    setCiudadSeleccionada("todas")
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
                    {departamentoSeleccionado !== "todos" ? 1 : 0}
                    {ciudadSeleccionada !== "todas" ? 1 : 0}
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
        {estacionesFiltradas.map((estacion) => (
          <Card key={estacion.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base leading-tight">{estacion.nombre}</CardTitle>
                  <CardDescription className="flex items-center mt-1 text-sm">
                    <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{estacion.ciudad}</span>
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    estacion.estado === "vacio"
                      ? "destructive"
                      : estacion.estado === "vendiendo"
                        ? "success"
                        : "outline"
                  }
                  className="text-xs px-2 py-1 flex-shrink-0"
                >
                  {estacion.estado === "vacio"
                    ? "Vacío"
                    : estacion.estado === "vendiendo"
                      ? "Vendiendo"
                      : "Próximamente"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Combustible:</span>
                  <span className="text-sm font-medium">{estacion.tipoCombustible}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Disponible:</span>
                  <span className="text-sm font-medium">
                    {estacion.cantidadCombustible > 0 ? (
                      <>
                        {estacion.cantidadCombustible}L
                        <span className="text-xs text-muted-foreground ml-1">
                          (~{Math.floor(estacion.cantidadCombustible / 35)})
                        </span>
                      </>
                    ) : (
                      "Sin combustible"
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {estacion.estado === "proximo" ? "Inicia:" : "Iniciado:"}
                  </span>
                  <span className="text-sm font-medium flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatearFechaHora(estacion.horaInicio)}
                  </span>
                </div>
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
        ))}

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
