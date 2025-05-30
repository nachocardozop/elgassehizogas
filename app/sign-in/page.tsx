"use client"

import { useEffect } from "react"
import { Fuel } from "lucide-react"

export default function SignInPage() {
  useEffect(() => {
    // Redirect to the Clerk sign-in page with return URL
    const returnUrl = encodeURIComponent(`${window.location.origin}/admin`)
    window.location.href = `https://master-swift-65.accounts.dev/sign-in?redirect_url=${returnUrl}`
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Fuel className="h-8 w-8 text-red-600" />
          <h1 className="text-2xl font-bold">El gas se hizo gas</h1>
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirigiendo al inicio de sesión...</p>
      </div>
    </div>
  )
}
