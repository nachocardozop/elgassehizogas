"use client"

import { useState } from "react"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function FormularioActualizacionCombustible({ tiposCombustible, onSubmit }) {
  const [formData, setFormData] = useState({
    tipoCombustible: "",
    cantidad: "",
    fecha: new Date(),
    hora: "12",
    minuto: "00",
    ampm: "PM",
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
    })

    // Resetear formulario
    setFormData({
      tipoCombustible: "",
      cantidad: "",
      fecha: new Date(),
      hora: "12",
      minuto: "00",
      ampm: "PM",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actualizar Disponibilidad de Combustible</CardTitle>
        <CardDescription>Ingresa detalles sobre una nueva entrega de combustible a tu estación</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
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
              {formData.cantidad ? Math.floor(Number.parseInt(formData.cantidad) / 35) : 0} vehículos (basado en un
              promedio de 35 litros por vehículo)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Hora de Inicio de Venta</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="sr-only">
                  Fecha
                </Label>
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
                <div className="grid gap-1">
                  <Label htmlFor="hour" className="sr-only">
                    Hora
                  </Label>
                  <Select value={formData.hora} onValueChange={(valor) => handleChange("hora", valor)}>
                    <SelectTrigger id="hour" className="w-[70px]">
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
                </div>
                <span className="text-xl">:</span>
                <div className="grid gap-1">
                  <Label htmlFor="minute" className="sr-only">
                    Minuto
                  </Label>
                  <Select value={formData.minuto} onValueChange={(valor) => handleChange("minuto", valor)}>
                    <SelectTrigger id="minute" className="w-[70px]">
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
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="ampm" className="sr-only">
                    AM/PM
                  </Label>
                  <Select value={formData.ampm} onValueChange={(valor) => handleChange("ampm", valor)}>
                    <SelectTrigger id="ampm" className="w-[70px]">
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
            <p className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Establece la hora en que comenzarás a vender este combustible
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            type="button"
            onClick={() => document.querySelector('[data-value="resumen"]').click()}
          >
            Cancelar
          </Button>
          <Button type="submit">Enviar Actualización</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
