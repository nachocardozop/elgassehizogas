"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Upload } from "lucide-react"
import Link from "next/link"

export function FuelTable() {
  const [fuelRecords, setFuelRecords] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchFuelRecords = async () => {
    try {
      const response = await fetch('/api/admin/fuel')
      if (response.ok) {
        const data = await response.json()
        setFuelRecords(data)
      } else {
        alert('Error al cargar registros de combustible')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al cargar registros de combustible')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFuelRecords()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/fuel?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Registro eliminado exitosamente')
        fetchFuelRecords() // Refresh the list
      } else {
        alert('Error al eliminar el registro')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar el registro')
    }
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('es-BO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status) => {
    const styles = {
      upcoming: "bg-blue-100 text-blue-800 border-blue-200",
      selling: "bg-green-100 text-green-800 border-green-200", 
      empty: "bg-red-100 text-red-800 border-red-200"
    }
    
    const labels = {
      upcoming: "Próximamente",
      selling: "Vendiendo",
      empty: "Vacío"
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.upcoming}`}>
        {labels[status] || status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Cargando registros de combustible...</p>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Registros de Combustible</CardTitle>
          <div className="flex gap-2">
            <Link href="/admin/fuel/batch">
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Subir CSV
              </Button>
            </Link>
            <Link href="/admin/fuel/new">
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Registro
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {fuelRecords.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No hay registros de combustible aún</p>
            <Link href="/admin/fuel/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Crear primer registro
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium text-muted-foreground">Estación</th>
                  <th className="text-left p-2 font-medium text-muted-foreground">Ciudad</th>
                  <th className="text-left p-2 font-medium text-muted-foreground">Combustible</th>
                  <th className="text-left p-2 font-medium text-muted-foreground">Cantidad</th>
                  <th className="text-left p-2 font-medium text-muted-foreground">Inicio Venta</th>
                  <th className="text-left p-2 font-medium text-muted-foreground">Estado</th>
                  <th className="text-left p-2 font-medium text-muted-foreground">Creado</th>
                  <th className="text-left p-2 font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {fuelRecords.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{record.station_name}</td>
                    <td className="p-2 text-muted-foreground">{record.city}</td>
                    <td className="p-2">{record.fuel_type}</td>
                    <td className="p-2">{record.quantity.toLocaleString()} L</td>
                    <td className="p-2">{formatDateTime(record.start_time)}</td>
                    <td className="p-2">{getStatusBadge(record.status)}</td>
                    <td className="p-2 text-muted-foreground">{formatDateTime(record.created_at)}</td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(record.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}