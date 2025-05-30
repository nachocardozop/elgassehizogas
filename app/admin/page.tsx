"use client"

import { Fuel } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { UserButton } from "@clerk/nextjs"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Fuel className="h-6 w-6 text-red-600" />
            <Link href="/">
              <h1 className="text-xl font-bold">El gas se hizo gas - Admin</h1>
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline">Ver Sitio Público</Button>
            </Link>
            <UserButton />
          </nav>
        </div>
      </header>

      <main className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestiona estaciones de servicio y registros de combustible</p>
        </div>

        <AdminDashboard />
      </main>

      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row md:py-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            El gas se hizo gas - Panel de administración para gestión de combustible
          </p>
        </div>
      </footer>
    </div>
  )
}
