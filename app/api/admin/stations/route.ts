import { currentUser } from "@clerk/nextjs/server"
import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { rows } = await sql`
      SELECT * FROM stations ORDER BY name
    `
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch stations" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, address, city, department, phone } = await request.json()

    const { rows } = await sql`
      INSERT INTO stations (name, address, city, department, phone)
      VALUES (${name}, ${address}, ${city}, ${department}, ${phone || null})
      RETURNING *
    `

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to create station" }, { status: 500 })
  }
}