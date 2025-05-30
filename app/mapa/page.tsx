import { ArrowLeft, Fuel, MapPin } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PaginaMapa() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between py-2 px-4">
          <div className="flex items-center gap-2">
            <Fuel className="h-5 w-5 text-red-600" />
            <Link href="/">
              <h1 className="text-lg font-bold">El gas se hizo gas</h1>
            </Link>
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/">
              <Button variant="outline" size="sm" className="text-xs px-3">
                <ArrowLeft className="mr-1 h-3 w-3" />
                Lista
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        <div className="container py-3 px-4">
          <h1 className="text-xl font-bold mb-2">Mapa de Estaciones</h1>
          <p className="text-sm text-muted-foreground">Estaciones con combustible disponible</p>
        </div>

        <div className="flex-1 bg-muted flex items-center justify-center">
          <div className="text-center p-6">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-medium mb-2">Vista de Mapa</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              En una implementación real, esto mostraría un mapa interactivo con marcadores de estaciones codificados
              por color según el estado de disponibilidad de combustible.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
