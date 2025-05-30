"use client"

import { ArrowLeft, Fuel } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StationForm } from "@/components/admin/station-form"
import { UserButton } from "@clerk/nextjs"

export default function NewStationPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/stations">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Estaciones
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Fuel className="h-5 w-5 text-red-600" />
              <h1 className="text-xl font-bold">Nueva Estación</h1>
            </div>
          </div>
          <UserButton />
        </div>
      </header>
      <main className="container py-6 max-w-2xl">
        <StationForm />
      </main>
    </div>
  )
}
