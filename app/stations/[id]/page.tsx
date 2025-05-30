import { ArrowLeft, Clock, MapPin, Share2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDateTime } from "@/lib/utils"

// Mock data - in a real app, this would come from a database
const getStationById = (id) => {
  return {
    id: "1",
    name: "Estación YPFB Central",
    address: "Av. 16 de Julio, La Paz",
    coordinates: { lat: -16.5, lng: -68.15 },
    phone: "+591 77712345",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    fuelUpdates: [
      {
        id: "gas1",
        fuelType: "Gasoline",
        amount: 5000,
        startTime: new Date(Date.now() + 1000 * 60 * 15).toISOString(), // 15 minutes from now
        status: "upcoming",
        lastUpdated: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      },
      {
        id: "diesel1",
        fuelType: "Diesel",
        amount: 0,
        startTime: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
        status: "empty",
        lastUpdated: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
      },
    ],
  }
}

export default function StationDetailPage({ params }) {
  const station = getStationById(params.id)

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to stations
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{station.name}</h1>
            <div className="flex items-center text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{station.address}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button size="sm">Get Directions</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fuel Availability</CardTitle>
            <CardDescription>Current fuel status at this station</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {station.fuelUpdates.map((update) => (
              <div key={update.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="font-medium text-lg">{update.fuelType}</div>
                  <Badge
                    variant={
                      update.status === "empty" ? "destructive" : update.status === "selling" ? "success" : "outline"
                    }
                  >
                    {update.status === "empty" ? "Empty" : update.status === "selling" ? "Selling Now" : "Upcoming"}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Available:</span>
                    <span className="font-medium">
                      {update.amount > 0 ? (
                        <>
                          {update.amount} liters
                          <span className="text-sm text-muted-foreground ml-1">
                            (~{Math.floor(update.amount / 35)} cars)
                          </span>
                        </>
                      ) : (
                        "Out of fuel"
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {update.status === "upcoming" ? "Starts selling:" : "Started selling:"}
                    </span>
                    <span className="font-medium flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {formatDateTime(update.startTime)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Last updated:</span>
                    <span>{formatDateTime(update.lastUpdated)}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-md bg-muted p-4">
              <h3 className="font-medium mb-2">Estimate Your Chances</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Based on an average of 35 liters per vehicle, you can estimate if there will be enough fuel for your
                position in line.
              </p>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="border rounded-md p-3">
                  <div className="text-2xl font-bold mb-1">{Math.floor(station.fuelUpdates[0].amount / 35)}</div>
                  <div className="text-xs text-muted-foreground">Estimated cars served</div>
                </div>

                <div className="border rounded-md p-3">
                  <div className="text-2xl font-bold mb-1">
                    {station.fuelUpdates[0].status === "upcoming"
                      ? formatDateTime(station.fuelUpdates[0].startTime).split(" ")[1]
                      : "In progress"}
                  </div>
                  <div className="text-xs text-muted-foreground">Start time</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Station Information</CardTitle>
            <CardDescription>Details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
              <MapPin className="h-8 w-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Map view</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{station.phone}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Operating Hours:</span>
                <span className="font-medium">24 hours</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Fuel Types:</span>
                <span className="font-medium">{station.fuelUpdates.map((update) => update.fuelType).join(", ")}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Station Update:</span>
                <span className="font-medium">{formatDateTime(station.lastUpdated)}</span>
              </div>
            </div>

            <div className="rounded-md bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800">
              <h3 className="font-medium mb-1">Important Notice</h3>
              <p>
                Due to the ongoing fuel shortage, availability information may change rapidly. Please check back
                frequently for updates.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
