import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

// Define which routes require authentication
const isProtectedRoute = createRouteMatcher(["/admin(.*)"])

const unauthenticatedUrl = "https://master-swift-65.accounts.dev/sign-in"

export default clerkMiddleware(async (auth, req) => {
  const path = req.nextUrl.pathname

  // Allow public pages to proceed normally
  if (
    path === "/" ||
    path === "/sign-in" ||
    path.startsWith("/estaciones") ||
    path.startsWith("/mapa") ||
    path.startsWith("/unauthorized") ||
    path.startsWith("/_next") ||
    path.startsWith("/public") ||
    path.includes("favicon.ico") ||
    // Allow specific API endpoints needed for public functionality
    (path.startsWith("/api") && path.includes("/public"))
  ) {
    console.log(`Allowing public access: ${path}`)
  }
  // Protect admin routes
  else if (isProtectedRoute(req)) {
    console.log(`Protecting admin route: ${path}`)
    const returnUrl = `${req.nextUrl.origin}/admin`
    await auth.protect(undefined, {
      unauthenticatedUrl: `${unauthenticatedUrl}?redirect_url=${encodeURIComponent(returnUrl)}`,
    })
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
