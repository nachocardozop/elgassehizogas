import { Fuel, MapPin, Shield } from "lucide-react"
import Link from "next/link"
import { ListaEstacionesPublica } from "@/components/public/lista-estaciones-publica"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between py-2 px-4">
          <div className="flex items-center gap-2">
            <Fuel className="h-5 w-5 text-red-600" />
            <h1 className="text-lg font-bold">El gas se hizo gas</h1>
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/mapa">
              <Button variant="outline" size="sm" className="text-xs px-3 py-2">
                <MapPin className="mr-1 h-3 w-3" />
                Mapa
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline" size="sm" className="text-xs px-3 py-2">
                <Shield className="mr-1 h-3 w-3" />
                Admin
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-4 px-4">
        <section>
          <h2 className="text-xl font-bold mb-4">Estaciones de Servicio</h2>
          <ListaEstacionesPublica />
        </section>
      </main>
      <footer className="border-t py-4">
        <div className="container px-4">
          <p className="text-center text-xs leading-loose text-muted-foreground">
            El gas se hizo gas - Información actualizada sobre disponibilidad de combustible
          </p>
        </div>
      </footer>
    </div>
  )
}
