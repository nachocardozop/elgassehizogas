"use client"

import { useState } from "react"
import { Clock, Droplet, MapPin, Search } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatDateTime } from "@/lib/utils"

// Mock data - in a real app, this would come from a database
const mockStations = [
  {
    id: "1",
    name: "Estación YPFB Central",
    address: "Av. 16 de Julio, La Paz",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    fuelAmount: 5000,
    startTime: new Date(Date.now() + 1000 * 60 * 15).toISOString(), // 15 minutes from now
    status: "upcoming",
    fuelType: "Gasoline",
  },
  {
    id: "2",
    name: "Estación Cochabamba Norte",
    address: "Av. Blanco Galindo, Cochabamba",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
    fuelAmount: 2500,
    startTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // Started 1 hour ago
    status: "selling",
    fuelType: "Gasoline",
  },
  {
    id: "3",
    name: "Estación Santa Cruz Sur",
    address: "Av. Santos Dumont, Santa Cruz",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    fuelAmount: 0,
    startTime: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // Started 3 hours ago
    status: "empty",
    fuelType: "Diesel",
  },
  {
    id: "4",
    name: "Estación Oruro Central",
    address: "Calle Bolívar, Oruro",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    fuelAmount: 3200,
    startTime: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 30 minutes from now
    status: "upcoming",
    fuelType: "Gasoline",
  },
]

export function StationList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [stations, setStations] = useState(mockStations)

  const filteredStations = stations.filter(
    (station) =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search stations by name or location..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStations.map((station) => (
          <Card key={station.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{station.name}</CardTitle>
                <Badge
                  variant={
                    station.status === "empty" ? "destructive" : station.status === "selling" ? "success" : "outline"
                  }
                >
                  {station.status === "empty" ? "Empty" : station.status === "selling" ? "Selling Now" : "Upcoming"}
                </Badge>
              </div>
              <CardDescription className="flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {station.address}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Fuel Type:</span>
                  <span className="font-medium">{station.fuelType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Available:</span>
                  <span className="font-medium">
                    {station.fuelAmount > 0 ? (
                      <>
                        {station.fuelAmount} liters
                        <span className="text-sm text-muted-foreground ml-1">
                          (~{Math.floor(station.fuelAmount / 35)} cars)
                        </span>
                      </>
                    ) : (
                      "Out of fuel"
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {station.status === "upcoming" ? "Starts selling:" : "Started selling:"}
                  </span>
                  <span className="font-medium flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {formatDateTime(station.startTime)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Last updated:</span>
                  <span>{formatDateTime(station.lastUpdated)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 pt-3">
              <Link href={`/stations/${station.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}

        {filteredStations.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Droplet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No stations found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
