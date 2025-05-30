"use client"

import { useState } from "react"
import { Clock, Droplet, MapPin, Search } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatearFechaHora } from "@/lib/utils"

// Datos de ejemplo - en una app real, esto vendría de una base de datos
const estacionesEjemplo = [
  {
    id: "1",
    nombre: "Estación YPFB Central",
    direccion: "Av. 16 de Julio, La Paz",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // hace 30 minutos
    cantidadCombustible: 5000,
    horaInicio: new Date(Date.now() + 1000 * 60 * 15).toISOString(), // 15 minutos desde ahora
    estado: "proximo",
    tipoCombustible: "Gasolina",
  },
  {
    id: "2",
    nombre: "Estación Cochabamba Norte",
    direccion: "Av. Blanco Galindo, Cochabamba",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // hace 10 minutos
    cantidadCombustible: 2500,
    horaInicio: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // Comenzó hace 1 hora
    estado: "vendiendo",
    tipoCombustible: "Gasolina",
  },
  {
    id: "3",
    nombre: "Estación Santa Cruz Sur",
    direccion: "Av. Santos Dumont, Santa Cruz",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // hace 2 horas
    cantidadCombustible: 0,
    horaInicio: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // Comenzó hace 3 horas
    estado: "vacio",
    tipoCombustible: "Diesel",
  },
  {
    id: "4",
    nombre: "Estación Oruro Central",
    direccion: "Calle Bolívar, Oruro",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // hace 45 minutos
    cantidadCombustible: 3200,
    horaInicio: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 30 minutos desde ahora
    estado: "proximo",
    tipoCombustible: "Gasolina",
  },
]

export function ListaEstaciones() {
  const [busqueda, setBusqueda] = useState("")
  const [estaciones, setEstaciones] = useState(estacionesEjemplo)

  const estacionesFiltradas = estaciones.filter(
    (estacion) =>
      estacion.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      estacion.direccion.toLowerCase().includes(busqueda.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar estaciones por nombre o ubicación..."
          className="pl-8"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {estacionesFiltradas.map((estacion) => (
          <Card key={estacion.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{estacion.nombre}</CardTitle>
                <Badge
                  variant={
                    estacion.estado === "vacio"
                      ? "destructive"
                      : estacion.estado === "vendiendo"
                        ? "success"
                        : "outline"
                  }
                >
                  {estacion.estado === "vacio"
                    ? "Vacío"
                    : estacion.estado === "vendiendo"
                      ? "Vendiendo Ahora"
                      : "Próximamente"}
                </Badge>
              </div>
              <CardDescription className="flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {estacion.direccion}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tipo de Combustible:</span>
                  <span className="font-medium">{estacion.tipoCombustible}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Disponible:</span>
                  <span className="font-medium">
                    {estacion.cantidadCombustible > 0 ? (
                      <>
                        {estacion.cantidadCombustible} litros
                        <span className="text-sm text-muted-foreground ml-1">
                          (~{Math.floor(estacion.cantidadCombustible / 35)} vehículos)
                        </span>
                      </>
                    ) : (
                      "Sin combustible"
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {estacion.estado === "proximo" ? "Comienza a vender:" : "Comenzó a vender:"}
                  </span>
                  <span className="font-medium flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {formatearFechaHora(estacion.horaInicio)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Última actualización:</span>
                  <span>{formatearFechaHora(estacion.ultimaActualizacion)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 pt-3">
              <Link href={`/estaciones/${estacion.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  Ver Detalles
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}

        {estacionesFiltradas.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Droplet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No se encontraron estaciones</h3>
            <p className="text-muted-foreground mt-2">Intenta ajustar tus criterios de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  )
}
