import { ArrowLeft, Clock, MapPin, Share2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatearFechaHora } from "@/lib/utils"

// Datos de ejemplo - en una app real, esto vendría de una base de datos
const obtenerEstacionPorId = (id) => {
  return {
    id: "1",
    nombre: "Estación YPFB Central",
    direccion: "Av. 16 de Julio, La Paz",
    coordenadas: { lat: -16.5, lng: -68.15 },
    telefono: "+591 77712345",
    ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // hace 30 minutos
    actualizacionesCombustible: [
      {
        id: "gas1",
        tipoCombustible: "Gasolina",
        cantidad: 5000,
        horaInicio: new Date(Date.now() + 1000 * 60 * 15).toISOString(), // 15 minutos desde ahora
        estado: "proximo",
        ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // hace 30 minutos
      },
      {
        id: "diesel1",
        tipoCombustible: "Diesel",
        cantidad: 0,
        horaInicio: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // hace 3 horas
        estado: "vacio",
        ultimaActualizacion: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // hace 2 horas
      },
    ],
  }
}

export default function PaginaDetalleEstacion({ params }) {
  const estacion = obtenerEstacionPorId(params.id)

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Volver a estaciones
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{estacion.nombre}</h1>
            <div className="flex items-center text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{estacion.direccion}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
            <Button size="sm">Obtener Direcciones</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Disponibilidad de Combustible</CardTitle>
            <CardDescription>Estado actual del combustible en esta estación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {estacion.actualizacionesCombustible.map((actualizacion) => (
              <div key={actualizacion.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="font-medium text-lg">{actualizacion.tipoCombustible}</div>
                  <Badge
                    variant={
                      actualizacion.estado === "vacio"
                        ? "destructive"
                        : actualizacion.estado === "vendiendo"
                          ? "success"
                          : "outline"
                    }
                  >
                    {actualizacion.estado === "vacio"
                      ? "Vacío"
                      : actualizacion.estado === "vendiendo"
                        ? "Vendiendo Ahora"
                        : "Próximamente"}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Disponible:</span>
                    <span className="font-medium">
                      {actualizacion.cantidad > 0 ? (
                        <>
                          {actualizacion.cantidad} litros
                          <span className="text-sm text-muted-foreground ml-1">
                            (~{Math.floor(actualizacion.cantidad / 35)} vehículos)
                          </span>
                        </>
                      ) : (
                        "Sin combustible"
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      {actualizacion.estado === "proximo" ? "Comienza a vender:" : "Comenzó a vender:"}
                    </span>
                    <span className="font-medium flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {formatearFechaHora(actualizacion.horaInicio)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Última actualización:</span>
                    <span>{formatearFechaHora(actualizacion.ultimaActualizacion)}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-md bg-muted p-4">
              <h3 className="font-medium mb-2">Estima tus Posibilidades</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Basado en un promedio de 35 litros por vehículo, puedes estimar si habrá suficiente combustible para tu
                posición en la fila.
              </p>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="border rounded-md p-3">
                  <div className="text-2xl font-bold mb-1">
                    {Math.floor(estacion.actualizacionesCombustible[0].cantidad / 35)}
                  </div>
                  <div className="text-xs text-muted-foreground">Vehículos estimados</div>
                </div>

                <div className="border rounded-md p-3">
                  <div className="text-2xl font-bold mb-1">
                    {estacion.actualizacionesCombustible[0].estado === "proximo"
                      ? formatearFechaHora(estacion.actualizacionesCombustible[0].horaInicio).split(" ")[1]
                      : "En progreso"}
                  </div>
                  <div className="text-xs text-muted-foreground">Hora de inicio</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información de la Estación</CardTitle>
            <CardDescription>Detalles y información de contacto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
              <MapPin className="h-8 w-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Vista del mapa</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Teléfono:</span>
                <span className="font-medium">{estacion.telefono}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Horario de Operación:</span>
                <span className="font-medium">24 horas</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipos de Combustible:</span>
                <span className="font-medium">
                  {estacion.actualizacionesCombustible.map((actualizacion) => actualizacion.tipoCombustible).join(", ")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Última Actualización:</span>
                <span className="font-medium">{formatearFechaHora(estacion.ultimaActualizacion)}</span>
              </div>
            </div>

            <div className="rounded-md bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800">
              <h3 className="font-medium mb-1">Aviso Importante</h3>
              <p>
                Debido a la escasez actual de combustible, la información de disponibilidad puede cambiar rápidamente.
                Por favor, verifica frecuentemente para obtener actualizaciones.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
