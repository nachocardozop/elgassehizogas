import { ArrowLeft, Fuel, MapPin } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PaginaMapa() {
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
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Lista
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        <div className="container py-4">
          <h1 className="text-2xl font-bold mb-2">Mapa de Estaciones de Servicio</h1>
          <p className="text-muted-foreground mb-4">Ver todas las estaciones con combustible disponible en el mapa</p>
        </div>

        <div className="flex-1 bg-muted flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-medium mb-2">Vista de Mapa</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              En una implementación real, esto mostraría un mapa interactivo con marcadores de estaciones codificados
              por color según el estado de disponibilidad de combustible.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
