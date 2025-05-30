"use client"

import { useState } from "react"
import { Clock, Droplet, DropletIcon as DropletOff, Truck } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FuelUpdateForm } from "@/components/fuel-update-form"
import { formatDateTime } from "@/lib/utils"

// Mock data - in a real app, this would come from a database
const mockStationData = {
  id: "1",
  name: "Estación YPFB Central",
  address: "Av. 16 de Julio, La Paz",
  owner: "Juan Perez",
  phone: "+591 77712345",
  fuelTypes: ["Gasoline", "Diesel"],
  updates: [
    {
      id: "update1",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      fuelType: "Gasoline",
      amount: 5000,
      startTime: new Date(Date.now() + 1000 * 60 * 15).toISOString(), // 15 minutes from now
      status: "upcoming",
    },
    {
      id: "update2",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
      fuelType: "Diesel",
      amount: 3000,
      startTime: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 90 minutes ago
      status: "empty",
    },
  ],
}

export function StationDashboard() {
  const [stationData, setStationData] = useState(mockStationData)

  const handleFuelUpdate = (updateData) => {
    // In a real app, this would send data to the server
    const newUpdate = {
      id: `update${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...updateData,
    }

    setStationData({
      ...stationData,
      updates: [newUpdate, ...stationData.updates],
    })
  }

  const markAsEmpty = (updateId) => {
    // In a real app, this would send data to the server
    setStationData({
      ...stationData,
      updates: stationData.updates.map((update) =>
        update.id === updateId ? { ...update, status: "empty", amount: 0 } : update,
      ),
    })
  }

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="update">Update Fuel</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Station Information</CardTitle>
            <CardDescription>Your registered gas station details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Station Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{stationData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address:</span>
                    <span className="font-medium">{stationData.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Owner:</span>
                    <span className="font-medium">{stationData.owner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact:</span>
                    <span className="font-medium">{stationData.phone}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Current Fuel Status</h3>
                <div className="space-y-4">
                  {stationData.fuelTypes.map((fuelType) => {
                    const latestUpdate = stationData.updates
                      .filter((update) => update.fuelType === fuelType)
                      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]

                    return (
                      <div key={fuelType} className="border rounded-md p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{fuelType}</span>
                          <div
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              latestUpdate?.status === "empty"
                                ? "bg-red-100 text-red-800"
                                : latestUpdate?.status === "selling"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {latestUpdate?.status === "empty"
                              ? "Empty"
                              : latestUpdate?.status === "selling"
                                ? "Selling Now"
                                : "Upcoming"}
                          </div>
                        </div>

                        {latestUpdate ? (
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Amount:</span>
                              <span>{latestUpdate.amount} liters</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                {new Date(latestUpdate.startTime) > new Date() ? "Starts:" : "Started:"}
                              </span>
                              <span>{formatDateTime(latestUpdate.startTime)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Last updated:</span>
                              <span>{formatDateTime(latestUpdate.timestamp)}</span>
                            </div>

                            {latestUpdate.status !== "empty" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full mt-2"
                                onClick={() => markAsEmpty(latestUpdate.id)}
                              >
                                <DropletOff className="h-3.5 w-3.5 mr-1" />
                                Mark as Empty
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-2 text-muted-foreground text-sm">No updates yet</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => document.querySelector('[data-value="update"]').click()}>
              <Truck className="h-4 w-4 mr-2" />
              Update Fuel Availability
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="update">
        <FuelUpdateForm fuelTypes={stationData.fuelTypes} onSubmit={handleFuelUpdate} />
      </TabsContent>

      <TabsContent value="history" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Update History</CardTitle>
            <CardDescription>Previous fuel updates for your station</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stationData.updates.length > 0 ? (
                stationData.updates.map((update) => (
                  <div key={update.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">{update.fuelType}</div>
                      <div
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          update.status === "empty"
                            ? "bg-red-100 text-red-800"
                            : update.status === "selling"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {update.status === "empty" ? "Empty" : update.status === "selling" ? "Selling" : "Upcoming"}
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span>{update.amount} liters</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {new Date(update.startTime) > new Date() ? "Starts:" : "Started:"}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {formatDateTime(update.startTime)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Updated:</span>
                        <span>{formatDateTime(update.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Droplet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No updates yet</h3>
                  <p className="text-muted-foreground mt-2">When you add fuel updates, they will appear here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Station Settings</CardTitle>
            <CardDescription>Manage your station information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="station-name">Station Name</Label>
                <Input id="station-name" defaultValue={stationData.name} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="station-address">Address</Label>
                <Input id="station-address" defaultValue={stationData.address} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="station-owner">Owner Name</Label>
                <Input id="station-owner" defaultValue={stationData.owner} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="station-phone">Contact Phone</Label>
                <Input id="station-phone" defaultValue={stationData.phone} />
              </div>
              <div className="grid gap-2">
                <Label>Available Fuel Types</Label>
                <div className="flex flex-wrap gap-2">
                  {stationData.fuelTypes.map((type) => (
                    <div key={type} className="flex items-center border rounded-md px-3 py-1">
                      <span>{type}</span>
                    </div>
                  ))}
                  <Button variant="outline" size="sm">
                    + Add Fuel Type
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
