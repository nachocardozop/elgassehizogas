"use client"

import { useState } from "react"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function FuelUpdateForm({ fuelTypes, onSubmit }) {
  const [formData, setFormData] = useState({
    fuelType: "",
    amount: "",
    date: new Date(),
    hour: "12",
    minute: "00",
    ampm: "PM",
  })

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Create a date object from the form data
    const startTime = new Date(formData.date)
    const hour = Number.parseInt(formData.hour) + (formData.ampm === "PM" && formData.hour !== "12" ? 12 : 0)
    const minute = Number.parseInt(formData.minute)

    startTime.setHours(hour, minute, 0, 0)

    onSubmit({
      fuelType: formData.fuelType,
      amount: Number.parseInt(formData.amount),
      startTime: startTime.toISOString(),
      status: startTime > new Date() ? "upcoming" : "selling",
    })

    // Reset form
    setFormData({
      fuelType: "",
      amount: "",
      date: new Date(),
      hour: "12",
      minute: "00",
      ampm: "PM",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Fuel Availability</CardTitle>
        <CardDescription>Enter details about a new fuel delivery to your station</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="fuel-type">Fuel Type</Label>
            <Select value={formData.fuelType} onValueChange={(value) => handleChange("fuelType", value)} required>
              <SelectTrigger id="fuel-type">
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                {fuelTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (liters)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount in liters"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              This will serve approximately {formData.amount ? Math.floor(Number.parseInt(formData.amount) / 35) : 0}{" "}
              cars (based on 35 liters per car average)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Selling Start Time</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="sr-only">
                  Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => handleChange("date", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center gap-2">
                <div className="grid gap-1">
                  <Label htmlFor="hour" className="sr-only">
                    Hour
                  </Label>
                  <Select value={formData.hour} onValueChange={(value) => handleChange("hour", value)}>
                    <SelectTrigger id="hour" className="w-[70px]">
                      <SelectValue placeholder="Hour" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0")).map((hour) => (
                        <SelectItem key={hour} value={hour}>
                          {hour}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <span className="text-xl">:</span>
                <div className="grid gap-1">
                  <Label htmlFor="minute" className="sr-only">
                    Minute
                  </Label>
                  <Select value={formData.minute} onValueChange={(value) => handleChange("minute", value)}>
                    <SelectTrigger id="minute" className="w-[70px]">
                      <SelectValue placeholder="Min" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, "0")).map((minute) => (
                        <SelectItem key={minute} value={minute}>
                          {minute}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="ampm" className="sr-only">
                    AM/PM
                  </Label>
                  <Select value={formData.ampm} onValueChange={(value) => handleChange("ampm", value)}>
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
              Set the time when you will start selling this fuel
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            type="button"
            onClick={() => document.querySelector('[data-value="overview"]').click()}
          >
            Cancel
          </Button>
          <Button type="submit">Submit Update</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
