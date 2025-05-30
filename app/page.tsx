import { Fuel, MapPin } from "lucide-react"
import Link from "next/link"
import { ListaEstaciones } from "@/components/lista-estaciones"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Fuel className="h-6 w-6 text-red-600" />
            <h1 className="text-xl font-bold">BuscaCombustible Bolivia</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/estaciones/nueva">
              <Button variant="outline">
                <MapPin className="mr-2 h-4 w-4" />
                Registrar Estación
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button>Panel de Estación</Button>
            </Link>
            <Link href="/admin">
              <Button variant="secondary">Panel de Admin</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <section className="mb-8">
          <div className="rounded-lg bg-yellow-50 p-4 border border-yellow-200 mb-6">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">Alerta de Escasez de Combustible</h2>
            <p className="text-yellow-700">
              Debido a la escasez actual de combustible, la información de disponibilidad es actualizada por los dueños
              de estaciones. Cada vehículo consume aproximadamente 35 litros en promedio. Use esta estimación para
              decidir si quedarse en la fila.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold mb-4">Encuentra Combustible Disponible</h2>
              <p className="text-muted-foreground mb-6">
                Consulta actualizaciones en tiempo real de estaciones de servicio en toda Bolivia. Los propietarios
                actualizan la disponibilidad de combustible y los horarios estimados de venta para ayudarte a tomar
                decisiones informadas.
              </p>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex gap-4 flex-wrap">
                <Link href="/mapa">
                  <Button className="flex-1">
                    <MapPin className="mr-2 h-4 w-4" />
                    Ver Mapa
                  </Button>
                </Link>
                <Link href="/estaciones">
                  <Button variant="outline" className="flex-1">
                    Ver Todas las Estaciones
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Estaciones Recientemente Actualizadas</h2>
          <ListaEstaciones />
        </section>
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
