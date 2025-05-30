"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FuelForm() {
  const router = useRouter()
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingStations, setLoadingStations] = useState(true)
  
  const [formData, setFormData] = useState({
    station_id: "",
    fuel_type: "",
    quantity: "",
    start_time: "",
    status: "upcoming"
  })

  // Load stations on component mount
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch('/api/admin/stations')
        if (response.ok) {
          const data = await response.json()
          setStations(data)
        } else {
          alert('Error al cargar estaciones')
        }
      } catch (error) {
        alert('Error al cargar estaciones')
      } finally {
        setLoadingStations(false)
      }
    }

    fetchStations()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/fuel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          station_id: parseInt(formData.station_id),
          fuel_type: formData.fuel_type,
          quantity: parseInt(formData.quantity),
          start_time: formData.start_time,
          status: formData.status
        }),
      })

      if (response.ok) {
        router.push('/admin')
      } else {
        alert('Error al crear el registro')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear el registro')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Set default datetime to current time
  const getCurrentDateTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      start_time: getCurrentDateTime()
    }))
  }, [])

  if (loadingStations) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Cargando estaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevo Registro de Combustible</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="station_id">Estación de Servicio</Label>
            <select
              id="station_id"
              value={formData.station_id}
              onChange={(e) => handleChange('station_id', e.target.value)}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Selecciona una estación</option>
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name} - {station.city}, {station.department}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fuel_type">Tipo de Combustible</Label>
              <select
                id="fuel_type"
                value={formData.fuel_type}
                onChange={(e) => handleChange('fuel_type', e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selecciona el tipo</option>
                <option value="Gasolina Especial">Gasolina Especial</option>
                <option value="Gasolina Premium">Gasolina Premium</option>
                <option value="Diesel">Diesel</option>
                <option value="GNV">GNV</option>
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quantity">Cantidad (Litros)</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="ej: 5000"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start_time">Hora de Inicio de Venta</Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => handleChange('start_time', e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Estado</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="upcoming">Próximamente</option>
                <option value="selling">Vendiendo</option>
                <option value="empty">Vacío</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}