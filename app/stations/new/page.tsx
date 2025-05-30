import { ArrowLeft, Fuel } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function RegisterStationPage() {
  return (
    <div className="container max-w-2xl py-6">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to home
      </Link>

      <div className="flex items-center gap-2 mb-6">
        <Fuel className="h-6 w-6 text-red-600" />
        <h1 className="text-2xl font-bold">Register Your Gas Station</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Station Information</CardTitle>
          <CardDescription>Register your gas station to help the community during the fuel shortage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="station-name">Station Name</Label>
            <Input id="station-name" placeholder="Enter the name of your gas station" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="station-address">Address</Label>
            <Input id="station-address" placeholder="Full address of your station" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="owner-name">Owner Name</Label>
              <Input id="owner-name" placeholder="Your full name" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Contact Phone</Label>
              <Input id="phone" placeholder="Phone number" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Your email address" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Create a password" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Available Fuel Types</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="gasoline" />
                <label
                  htmlFor="gasoline"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Gasoline
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="diesel" />
                <label
                  htmlFor="diesel"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Diesel
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="premium" />
                <label
                  htmlFor="premium"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Premium Gasoline
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="other" />
                <label
                  htmlFor="other"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Other
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-2 pt-2">
            <Checkbox id="terms" />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </label>
              <p className="text-sm text-muted-foreground">
                I agree to provide accurate information about fuel availability at my station.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Register Station</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
