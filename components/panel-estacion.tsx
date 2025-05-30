"use client"

import { useState } from "react"
import { Clock, Droplet, DropletIcon as DropletOff, Truck } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormularioActualizacionCombustible } from "@/components/formulario-actualizacion-combustible"
import { formatearFechaHora } from "@/lib/utils"

// Datos de ejemplo - en una app real, esto vendría de una base de datos
const datosEstacionEjemplo = {
  id: "1",
  nombre: "Estación YPFB Central",
  direccion: "Av. 16 de Julio, La Paz",
  propietario: "Juan Pérez",
  telefono: "+591 77712345",
  tiposCombustible: ["Gasolina", "Diesel"],
  actualizaciones: [
    {
      id: "update1",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // hace 30 minutos
      tipoCombustible: "Gasolina",
      cantidad: 5000,
      horaInicio: new Date(Date.now() + 1000 * 60 * 15).toISOString(), // 15 minutos desde ahora
      estado: "proximo",
    },
    {
      id: "update2",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // hace 2 horas
      tipoCombustible: "Diesel",
      cantidad: 3000,
      horaInicio: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // hace 90 minutos
      estado: "vacio",
    },
  ],
}

export function PanelEstacion() {
  const [datosEstacion, setDatosEstacion] = useState(datosEstacionEjemplo)

  const manejarActualizacionCombustible = (datosActualizacion) => {
    // En una app real, esto enviaría datos al servidor
    const nuevaActualizacion = {
      id: `update${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...datosActualizacion,
    }

    setDatosEstacion({
      ...datosEstacion,
      actualizaciones: [nuevaActualizacion, ...datosEstacion.actualizaciones],
    })
  }

  const marcarComoVacio = (idActualizacion) => {
    // En una app real, esto enviaría datos al servidor
    setDatosEstacion({
      ...datosEstacion,
      actualizaciones: datosEstacion.actualizaciones.map((actualizacion) =>
        actualizacion.id === idActualizacion ? { ...actualizacion, estado: "vacio", cantidad: 0 } : actualizacion,
      ),
    })
  }

  return (
    <Tabs defaultValue="resumen" className="space-y-6">
      <TabsList>
        <TabsTrigger value="resumen">Resumen</TabsTrigger>
        <TabsTrigger value="actualizar">Actualizar Combustible</TabsTrigger>
        <TabsTrigger value="historial">Historial</TabsTrigger>
        <TabsTrigger value="ajustes">Ajustes</TabsTrigger>
      </TabsList>

      <TabsContent value="resumen" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Estación</CardTitle>
            <CardDescription>Detalles de tu estación de servicio registrada</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Detalles de la Estación</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nombre:</span>
                    <span className="font-medium">{datosEstacion.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dirección:</span>
                    <span className="font-medium">{datosEstacion.direccion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Propietario:</span>
                    <span className="font-medium">{datosEstacion.propietario}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contacto:</span>
                    <span className="font-medium">{datosEstacion.telefono}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Estado Actual del Combustible</h3>
                <div className="space-y-4">
                  {datosEstacion.tiposCombustible.map((tipoCombustible) => {
                    const ultimaActualizacion = datosEstacion.actualizaciones
                      .filter((actualizacion) => actualizacion.tipoCombustible === tipoCombustible)
                      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]

                    return (
                      <div key={tipoCombustible} className="border rounded-md p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{tipoCombustible}</span>
                          <div
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              ultimaActualizacion?.estado === "vacio"
                                ? "bg-red-100 text-red-800"
                                : ultimaActualizacion?.estado === "vendiendo"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {ultimaActualizacion?.estado === "vacio"
                              ? "Vacío"
                              : ultimaActualizacion?.estado === "vendiendo"
                                ? "Vendiendo Ahora"
                                : "Próximamente"}
                          </div>
                        </div>

                        {ultimaActualizacion ? (
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Cantidad:</span>
                              <span>{ultimaActualizacion.cantidad} litros</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                {new Date(ultimaActualizacion.horaInicio) > new Date() ? "Comienza:" : "Comenzó:"}
                              </span>
                              <span>{formatearFechaHora(ultimaActualizacion.horaInicio)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Última actualización:</span>
                              <span>{formatearFechaHora(ultimaActualizacion.timestamp)}</span>
                            </div>

                            {ultimaActualizacion.estado !== "vacio" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full mt-2"
                                onClick={() => marcarComoVacio(ultimaActualizacion.id)}
                              >
                                <DropletOff className="h-3.5 w-3.5 mr-1" />
                                Marcar como Vacío
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-2 text-muted-foreground text-sm">Sin actualizaciones aún</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => document.querySelector('[data-value="actualizar"]').click()}>
              <Truck className="h-4 w-4 mr-2" />
              Actualizar Disponibilidad de Combustible
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="actualizar">
        <FormularioActualizacionCombustible
          tiposCombustible={datosEstacion.tiposCombustible}
          onSubmit={manejarActualizacionCombustible}
        />
      </TabsContent>

      <TabsContent value="historial" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Historial de Actualizaciones</CardTitle>
            <CardDescription>Actualizaciones previas de combustible para tu estación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {datosEstacion.actualizaciones.length > 0 ? (
                datosEstacion.actualizaciones.map((actualizacion) => (
                  <div key={actualizacion.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">{actualizacion.tipoCombustible}</div>
                      <div
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          actualizacion.estado === "vacio"
                            ? "bg-red-100 text-red-800"
                            : actualizacion.estado === "vendiendo"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {actualizacion.estado === "vacio"
                          ? "Vacío"
                          : actualizacion.estado === "vendiendo"
                            ? "Vendiendo"
                            : "Próximamente"}
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cantidad:</span>
                        <span>{actualizacion.cantidad} litros</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {new Date(actualizacion.horaInicio) > new Date() ? "Comienza:" : "Comenzó:"}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {formatearFechaHora(actualizacion.horaInicio)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Actualizado:</span>
                        <span>{formatearFechaHora(actualizacion.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Droplet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Sin actualizaciones aún</h3>
                  <p className="text-muted-foreground mt-2">
                    Cuando agregues actualizaciones de combustible, aparecerán aquí
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="ajustes">
        <Card>
          <CardHeader>
            <CardTitle>Ajustes de la Estación</CardTitle>
            <CardDescription>Administra la información de tu estación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="station-name">Nombre de la Estación</Label>
                <Input id="station-name" defaultValue={datosEstacion.nombre} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="station-address">Dirección</Label>
                <Input id="station-address" defaultValue={datosEstacion.direccion} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="station-owner">Nombre del Propietario</Label>
                <Input id="station-owner" defaultValue={datosEstacion.propietario} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="station-phone">Teléfono de Contacto</Label>
                <Input id="station-phone" defaultValue={datosEstacion.telefono} />
              </div>
              <div className="grid gap-2">
                <Label>Tipos de Combustible Disponibles</Label>
                <div className="flex flex-wrap gap-2">
                  {datosEstacion.tiposCombustible.map((tipo) => (
                    <div key={tipo} className="flex items-center border rounded-md px-3 py-1">
                      <span>{tipo}</span>
                    </div>
                  ))}
                  <Button variant="outline" size="sm">
                    + Añadir Tipo de Combustible
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">Cancelar</Button>
            <Button>Guardar Cambios</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
