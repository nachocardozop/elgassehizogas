"use client"

import { useState } from "react"
import { CalendarIcon, Download, FileSpreadsheet, Plus, Upload } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FormularioActualizacionMasiva } from "@/components/formulario-actualizacion-masiva"

// Datos de ejemplo - en una app real, esto vendría de una base de datos
const estacionesEjemplo = [
  {
    id: "1",
    nombre: "Estación YPFB Central",
    direccion: "Av. 16 de Julio, La Paz",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // hace 30 minutos
    tiposCombustible: ["Gasolina", "Diesel"],
  },
  {
    id: "2",
    nombre: "Estación Cochabamba Norte",
    direccion: "Av. Blanco Galindo, Cochabamba",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // hace 10 minutos
    tiposCombustible: ["Gasolina", "Diesel"],
  },
  {
    id: "3",
    nombre: "Estación Santa Cruz Sur",
    direccion: "Av. Santos Dumont, Santa Cruz",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // hace 2 horas
    tiposCombustible: ["Gasolina", "Diesel"],
  },
  {
    id: "4",
    nombre: "Estación Oruro Central",
    direccion: "Calle Bolívar, Oruro",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // hace 45 minutos
    tiposCombustible: ["Gasolina"],
  },
  {
    id: "5",
    nombre: "Estación Potosí",
    direccion: "Av. Universitaria, Potosí",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // hace 3 horas
    tiposCombustible: ["Gasolina", "Diesel"],
  },
  {
    id: "6",
    nombre: "Estación Sucre Centro",
    direccion: "Calle Junín, Sucre",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // hace 4 horas
    tiposCombustible: ["Gasolina", "Diesel"],
  },
]

export function PanelAdministrador() {
  const [estaciones, setEstaciones] = useState(estacionesEjemplo)
  const [estacionesSeleccionadas, setEstacionesSeleccionadas] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [mostrarFormularioMasivo, setMostrarFormularioMasivo] = useState(false)

  const estacionesFiltradas = estaciones.filter(
    (estacion) =>
      estacion.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      estacion.direccion.toLowerCase().includes(busqueda.toLowerCase()),
  )

  const toggleSeleccionEstacion = (id) => {
    setEstacionesSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((estacionId) => estacionId !== id) : [...prev, id],
    )
  }

  const seleccionarTodas = () => {
    if (estacionesSeleccionadas.length === estacionesFiltradas.length) {
      setEstacionesSeleccionadas([])
    } else {
      setEstacionesSeleccionadas(estacionesFiltradas.map((estacion) => estacion.id))
    }
  }

  const handleActualizacionMasiva = (datosActualizacion) => {
    // En una app real, esto enviaría datos al servidor
    console.log("Actualizando estaciones:", estacionesSeleccionadas)
    console.log("Datos de actualización:", datosActualizacion)

    // Aquí simularíamos la actualización de las estaciones seleccionadas
    setMostrarFormularioMasivo(false)
    setEstacionesSeleccionadas([])

    // Mostrar mensaje de éxito (en una app real)
    alert(`Se actualizaron ${estacionesSeleccionadas.length} estaciones con éxito`)
  }

  return (
    <Tabs defaultValue="estaciones" className="space-y-6">
      <TabsList>
        <TabsTrigger value="estaciones">Estaciones</TabsTrigger>
        <TabsTrigger value="actualizacion-masiva">Actualización Masiva</TabsTrigger>
        <TabsTrigger value="importar">Importar/Exportar</TabsTrigger>
        <TabsTrigger value="reportes">Reportes</TabsTrigger>
      </TabsList>

      <TabsContent value="estaciones" className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Gestión de Estaciones</CardTitle>
                <CardDescription>Administra todas las estaciones de servicio registradas</CardDescription>
              </div>
              <Button onClick={() => setMostrarFormularioMasivo(true)} disabled={estacionesSeleccionadas.length === 0}>
                <Plus className="mr-2 h-4 w-4" />
                Actualización Masiva ({estacionesSeleccionadas.length})
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Input
                    placeholder="Buscar estaciones..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
                <Select defaultValue="todas">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por región" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las regiones</SelectItem>
                    <SelectItem value="la-paz">La Paz</SelectItem>
                    <SelectItem value="cochabamba">Cochabamba</SelectItem>
                    <SelectItem value="santa-cruz">Santa Cruz</SelectItem>
                    <SelectItem value="otras">Otras ciudades</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={
                            estacionesSeleccionadas.length > 0 &&
                            estacionesSeleccionadas.length === estacionesFiltradas.length
                          }
                          onCheckedChange={seleccionarTodas}
                        />
                      </TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="hidden md:table-cell">Dirección</TableHead>
                      <TableHead className="hidden md:table-cell">Tipos de Combustible</TableHead>
                      <TableHead className="hidden md:table-cell">Última Actualización</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {estacionesFiltradas.length > 0 ? (
                      estacionesFiltradas.map((estacion) => (
                        <TableRow key={estacion.id}>
                          <TableCell>
                            <Checkbox
                              checked={estacionesSeleccionadas.includes(estacion.id)}
                              onCheckedChange={() => toggleSeleccionEstacion(estacion.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{estacion.nombre}</TableCell>
                          <TableCell className="hidden md:table-cell">{estacion.direccion}</TableCell>
                          <TableCell className="hidden md:table-cell">{estacion.tiposCombustible.join(", ")}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {format(new Date(estacion.ultimaActualizacion), "dd/MM/yyyy HH:mm")}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Ver
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No se encontraron estaciones.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {mostrarFormularioMasivo && (
          <Card>
            <CardHeader>
              <CardTitle>Actualización Masiva de Combustible</CardTitle>
              <CardDescription>
                Actualiza la disponibilidad de combustible para {estacionesSeleccionadas.length} estaciones
                seleccionadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormularioActualizacionMasiva
                estacionesSeleccionadas={estacionesSeleccionadas.map((id) =>
                  estaciones.find((estacion) => estacion.id === id),
                )}
                onSubmit={handleActualizacionMasiva}
                onCancel={() => setMostrarFormularioMasivo(false)}
              />
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="actualizacion-masiva">
        <Card>
          <CardHeader>
            <CardTitle>Actualización Masiva de Combustible</CardTitle>
            <CardDescription>
              Actualiza la disponibilidad de combustible para múltiples estaciones a la vez
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Selecciona Región</Label>
                <Select defaultValue="todas">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una región" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las regiones</SelectItem>
                    <SelectItem value="la-paz">La Paz</SelectItem>
                    <SelectItem value="cochabamba">Cochabamba</SelectItem>
                    <SelectItem value="santa-cruz">Santa Cruz</SelectItem>
                    <SelectItem value="otras">Otras ciudades</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tipo de Combustible</Label>
                <Select defaultValue="gasolina">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo de combustible" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gasolina">Gasolina</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="premium">Gasolina Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cantidad">Cantidad (litros)</Label>
                <Input id="cantidad" type="number" placeholder="Ingresa cantidad en litros" />
              </div>

              <div className="space-y-2">
                <Label>Hora de Inicio de Venta</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          <span>Selecciona una fecha</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" locale={es} />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select defaultValue="12">
                      <SelectTrigger className="w-[70px]">
                        <SelectValue placeholder="Hora" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0")).map((hora) => (
                          <SelectItem key={hora} value={hora}>
                            {hora}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-xl">:</span>
                    <Select defaultValue="00">
                      <SelectTrigger className="w-[70px]">
                        <SelectValue placeholder="Min" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, "0")).map((minuto) => (
                          <SelectItem key={minuto} value={minuto}>
                            {minuto}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select defaultValue="PM">
                      <SelectTrigger className="w-[70px]">
                        <SelectValue placeholder="AM/PM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Estaciones Afectadas</Label>
                <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto">
                  {estaciones.map((estacion) => (
                    <div key={estacion.id} className="flex items-center space-x-2 py-2">
                      <Checkbox id={`estacion-${estacion.id}`} />
                      <label
                        htmlFor={`estacion-${estacion.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {estacion.nombre} - {estacion.direccion}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancelar</Button>
            <Button>Actualizar Todas las Estaciones</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="importar">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Importar Datos</CardTitle>
              <CardDescription>Importa datos de combustible desde un archivo CSV o Excel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Formato de Archivo</Label>
                <Select defaultValue="csv">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Archivo</Label>
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm mb-2">Arrastra y suelta un archivo o</p>
                  <Button variant="outline" size="sm">
                    Seleccionar Archivo
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Plantilla de Ejemplo</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Descarga una plantilla para ver el formato correcto para la importación masiva.
                </p>
                <Button variant="outline" size="sm" className="w-fit">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Plantilla
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Importar Datos
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exportar Datos</CardTitle>
              <CardDescription>Exporta datos de combustible a un archivo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Tipo de Datos</Label>
                <Select defaultValue="estaciones">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo de datos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="estaciones">Estaciones</SelectItem>
                    <SelectItem value="actualizaciones">Actualizaciones de Combustible</SelectItem>
                    <SelectItem value="todo">Todos los Datos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Formato de Exportación</Label>
                <Select defaultValue="csv">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Rango de Fechas</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>Fecha Inicio</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" locale={es} />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>Fecha Fin</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" locale={es} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Exportar Datos
              </Button>
            </CardFooter>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="reportes">
        <Card>
          <CardHeader>
            <CardTitle>Reportes y Estadísticas</CardTitle>
            <CardDescription>Visualiza datos sobre la disponibilidad de combustible</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="border rounded-md p-4 text-center">
                <h3 className="text-2xl font-bold mb-2">24</h3>
                <p className="text-sm text-muted-foreground">Estaciones Activas</p>
              </div>
              <div className="border rounded-md p-4 text-center">
                <h3 className="text-2xl font-bold mb-2">15,000</h3>
                <p className="text-sm text-muted-foreground">Litros Disponibles</p>
              </div>
              <div className="border rounded-md p-4 text-center">
                <h3 className="text-2xl font-bold mb-2">8</h3>
                <p className="text-sm text-muted-foreground">Estaciones Vacías</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Reporte</Label>
              <Select defaultValue="disponibilidad">
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tipo de reporte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponibilidad">Disponibilidad de Combustible</SelectItem>
                  <SelectItem value="tendencias">Tendencias de Consumo</SelectItem>
                  <SelectItem value="estaciones">Actividad de Estaciones</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Rango de Fechas</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>Fecha Inicio</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" locale={es} />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>Fecha Fin</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" locale={es} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="aspect-[2/1] bg-muted rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Aquí se mostraría la visualización del reporte</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Reporte
            </Button>
            <Button>Generar Reporte</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
