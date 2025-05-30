import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)

  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()
  let hour = date.getHours()
  const minute = date.getMinutes().toString().padStart(2, "0")
  const ampm = hour >= 12 ? "PM" : "AM"

  hour = hour % 12
  hour = hour ? hour : 12

  return `${day}/${month}/${year} ${hour}:${minute} ${ampm}`
}

// Versión en español de formatDateTime
export function formatearFechaHora(dateString: string): string {
  const date = new Date(dateString)

  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  let hour = date.getHours()
  const minute = date.getMinutes().toString().padStart(2, "0")
  const ampm = hour >= 12 ? "PM" : "AM"

  hour = hour % 12
  hour = hour ? hour : 12

  return `${day}/${month} ${hour}:${minute} ${ampm}`
}

export function obtenerColorEstado(estado: string): string {
  switch (estado) {
    case "vacio":
      return "text-red-600"
    case "vendiendo":
      return "text-green-600"
    case "proximo":
      return "text-yellow-600"
    default:
      return "text-gray-600"
  }
}

export function calcularCombustibleRestante(litrosTotales: number, vehiculosAdelante: number): number {
  const litrosPromedioVehiculo = 35
  const consumoEstimado = vehiculosAdelante * litrosPromedioVehiculo

  return Math.max(0, litrosTotales - consumoEstimado)
}
