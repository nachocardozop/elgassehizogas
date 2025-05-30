"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StationsTable() {
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStations()
  }, [])

  const fetchStations = async () => {
    try {
      const response = await fetch("/api/admin/stations")
      if (response.ok) {
        const data = await response.json()
        setStations(data)
      }
    } catch (error) {
      console.error("Error fetching stations:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteStation = async (id) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta estación?")) return

    try {
      const response = await fetch(`/api/admin/stations/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setStations(stations.filter((station) => station.id !== id))
      }
    } catch (error) {
      console.error("Error deleting station:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando estaciones...</div>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Estaciones de Servicio</CardTitle>
        <Link href="/admin/stations/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Estación
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Ciudad</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stations.map((station) => (
              <TableRow key={station.id}>
                <TableCell className="font-medium">{station.name}</TableCell>
                <TableCell>{station.city}</TableCell>
                <TableCell>{station.department}</TableCell>
                <TableCell>{station.phone || "N/A"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/stations/${station.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => deleteStation(station.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {stations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No hay estaciones registradas</div>
        )}
      </CardContent>
    </Card>
  )
}
