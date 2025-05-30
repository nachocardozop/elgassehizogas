"use client"

import { ArrowLeft, MapPin } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BatchStationsUpload } from "@/components/admin/batch-stations-upload"
import { UserButton } from "@clerk/nextjs"

export default function BatchStationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Panel Admin
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl font-bold">Carga Masiva de Estaciones</h1>
            </div>
          </div>
          <UserButton />
        </div>
      </header>
      <main className="container py-6 max-w-4xl">
        <BatchStationsUpload />
      </main>
    </div>
  )
}