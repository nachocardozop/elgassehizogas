import { currentUser } from "@clerk/nextjs/server"
import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { rows } = await sql`
      SELECT * FROM stations WHERE id = ${params.id}
    `

    if (rows.length === 0) {
      return NextResponse.json({ error: "Station not found" }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch station" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, address, city, department, phone } = await request.json()

    const { rows } = await sql`
      UPDATE stations 
      SET name = ${name}, address = ${address}, city = ${city}, 
          department = ${department}, phone = ${phone || null}, 
          updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `

    if (rows.length === 0) {
      return NextResponse.json({ error: "Station not found" }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to update station" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete the station (this will cascade delete fuel_records due to foreign key)
    await sql`DELETE FROM stations WHERE id = ${params.id}`
    
    return NextResponse.json({ message: "Station deleted successfully" })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to delete station" }, { status: 500 })
  }
}