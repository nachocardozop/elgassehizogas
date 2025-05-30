"use client"

import { useState, useEffect } from "react"
import { Plus, Upload, BarChart3 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStations: 0,
    totalFuelRecords: 0,
    activeStations: 0,
    recentUpdates: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estaciones</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registros de Combustible</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFuelRecords}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estaciones Activas</CardTitle>
            <div className="h-4 w-4 bg-green-500 rounded-full" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeStations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actualizaciones Hoy</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentUpdates}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gestión de Estaciones</CardTitle>
            <CardDescription>Administra las estaciones de servicio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/stations">
              <Button className="w-full">Ver Todas las Estaciones</Button>
            </Link>
            <Link href="/admin/stations/new">
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Estación
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registros de Combustible</CardTitle>
            <CardDescription>Administra la disponibilidad de combustible</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/fuel">
              <Button className="w-full">Ver Todos los Registros</Button>
            </Link>
            <Link href="/admin/fuel/new">
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Registro
              </Button>
            </Link>
            <Link href="/admin/fuel/batch">
              <Button variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Carga Masiva (CSV)
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
