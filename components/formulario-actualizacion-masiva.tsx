"use client"

import { useState } from "react"
import { CalendarIcon, Clock, Info } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

export function FormularioActualizacionMasiva({ estacionesSeleccionadas, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    tipoCombustible: "Gasolina",
    cantidad: "",
    fecha: new Date(),
    hora: "12",
    minuto: "00",
    ampm: "PM",
    aplicarMismaHora: true,
  })

  const handleChange = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Crear un objeto de fecha a partir de los datos del formulario
    const horaInicio = new Date(formData.fecha)
    const hora = Number.parseInt(formData.hora) + (formData.ampm === "PM" && formData.hora !== "12" ? 12 : 0)
    const minuto = Number.parseInt(formData.minuto)

    horaInicio.setHours(hora, minuto, 0, 0)

    onSubmit({
      tipoCombustible: formData.tipoCombustible,
      cantidad: Number.parseInt(formData.cantidad),
      horaInicio: horaInicio.toISOString(),
      estado: horaInicio > new Date() ? "proximo" : "vendiendo",
      aplicarMismaHora: formData.aplicarMismaHora,
    })
  }

  // Obtener todos los tipos de combustible únicos de las estaciones seleccionadas
  const tiposCombustible = [...new Set(estacionesSeleccionadas.flatMap((estacion) => estacion.tiposCombustible))]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Actualización masiva</AlertTitle>
        <AlertDescription>
          Estás a punto de actualizar {estacionesSeleccionadas.length} estaciones a la vez. Esta acción actualizará la
          disponibilidad de combustible para todas las estaciones seleccionadas.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="fuel-type">Tipo de Combustible</Label>
            <Select
              value={formData.tipoCombustible}
              onValueChange={(valor) => handleChange("tipoCombustible", valor)}
              required
            >
              <SelectTrigger id="fuel-type">
                <SelectValue placeholder="Selecciona tipo de combustible" />
              </SelectTrigger>
              <SelectContent>
                {tiposCombustible.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Cantidad (litros)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Ingresa cantidad en litros"
              value={formData.cantidad}
              onChange={(e) => handleChange("cantidad", e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Esto servirá aproximadamente a{" "}
              {formData.cantidad ? Math.floor(Number.parseInt(formData.cantidad) / 35) : 0} vehículos por estación
              (basado en un promedio de 35 litros por vehículo)
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Hora de Inicio de Venta</Label>
            <div className="grid gap-4">
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.fecha && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.fecha ? (
                        format(formData.fecha, "PPP", { locale: es })
                      ) : (
                        <span>Selecciona una fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.fecha}
                      onSelect={(fecha) => handleChange("fecha", fecha)}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center gap-2">
                <Select value={formData.hora} onValueChange={(valor) => handleChange("hora", valor)}>
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
                <Select value={formData.minuto} onValueChange={(valor) => handleChange("minuto", valor)}>
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
                <Select value={formData.ampm} onValueChange={(valor) => handleChange("ampm", valor)}>
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
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="misma-hora"
                checked={formData.aplicarMismaHora}
                onCheckedChange={(checked) => handleChange("aplicarMismaHora", checked)}
              />
              <label
                htmlFor="misma-hora"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Aplicar la misma hora a todas las estaciones
              </label>
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Establece la hora en que comenzará la venta de este combustible
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Estaciones Seleccionadas ({estacionesSeleccionadas.length})</Label>
        <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto">
          {estacionesSeleccionadas.map((estacion) => (
            <div key={estacion.id} className="py-2 border-b last:border-0">
              <div className="font-medium">{estacion.nombre}</div>
              <div className="text-sm text-muted-foreground">{estacion.direccion}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Actualizar Todas las Estaciones</Button>
      </div>
    </form>
  )
}
