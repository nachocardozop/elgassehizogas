"use client"

import { Fuel, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function UnauthorizedPage() {
  const handleSignIn = () => {
    const returnUrl = encodeURIComponent(`${window.location.origin}/admin`)
    window.location.href = `https://master-swift-65.accounts.dev/sign-in?redirect_url=${returnUrl}`
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Fuel className="h-8 w-8 text-red-600" />
            <h1 className="text-2xl font-bold">El gas se hizo gas</h1>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle>Acceso No Autorizado</CardTitle>
            <CardDescription>Necesitas iniciar sesión como administrador para acceder a esta página</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleSignIn} className="w-full">
              <Shield className="mr-2 h-4 w-4" />
              Iniciar Sesión como Admin
            </Button>

            <div className="text-center">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center">
                <ArrowLeft className="mr-1 h-3 w-3" />
                Volver al sitio público
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
