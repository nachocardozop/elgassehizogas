import { currentUser } from "@clerk/nextjs/server"
import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const stationId = searchParams.get('stationId')
    
    let query
    if (stationId) {
      query = sql`
        SELECT fr.*, s.name as station_name, s.city, s.department
        FROM fuel_records fr
        JOIN stations s ON fr.station_id = s.id
        WHERE fr.station_id = ${stationId}
        ORDER BY fr.created_at DESC
      `
    } else {
      query = sql`
        SELECT fr.*, s.name as station_name, s.city, s.department
        FROM fuel_records fr
        JOIN stations s ON fr.station_id = s.id
        ORDER BY fr.created_at DESC
      `
    }

    const { rows } = await query
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch fuel records" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { station_id, fuel_type, quantity, start_time, status } = await request.json()

    // Validate required fields
    if (!station_id || !fuel_type || !quantity || !start_time) {
      return NextResponse.json({ 
        error: "Missing required fields: station_id, fuel_type, quantity, start_time" 
      }, { status: 400 })
    }

    // Determine status if not provided
    let finalStatus = status
    if (!finalStatus) {
      const startTime = new Date(start_time)
      const now = new Date()
      finalStatus = startTime > now ? "upcoming" : "selling"
    }

    const { rows } = await sql`
      INSERT INTO fuel_records (station_id, fuel_type, quantity, start_time, status)
      VALUES (${station_id}, ${fuel_type}, ${quantity}, ${start_time}, ${finalStatus})
      RETURNING *
    `

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to create fuel record" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: "Fuel record ID is required" }, { status: 400 })
    }

    await sql`DELETE FROM fuel_records WHERE id = ${id}`
    
    return NextResponse.json({ message: "Fuel record deleted successfully" })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to delete fuel record" }, { status: 500 })
  }
}