import { Fuel } from "lucide-react"
import Link from "next/link"
import { PanelAdministrador } from "@/components/panel-administrador"
import { Button } from "@/components/ui/button"

export default function PaginaAdmin() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Fuel className="h-6 w-6 text-red-600" />
            <Link href="/">
              <h1 className="text-xl font-bold">BuscaCombustible Bolivia</h1>
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline">Vista Pública</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Panel de Estación</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Panel de Administrador</h1>
          <p className="text-muted-foreground">
            Gestiona múltiples estaciones y actualiza la disponibilidad de combustible de forma masiva.
          </p>
        </div>

        <PanelAdministrador />
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row md:py-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            BuscaCombustible Bolivia - Ayudando a las comunidades durante la crisis de escasez de combustible
          </p>
        </div>
      </footer>
    </div>
  )
}
