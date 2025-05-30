import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { rows: stationRows } = await sql`
      SELECT * FROM stations WHERE id = ${params.id}
    `

    if (stationRows.length === 0) {
      return NextResponse.json({ error: "Station not found" }, { status: 404 })
    }

    const { rows: fuelRows } = await sql`
      SELECT * FROM fuel_records 
      WHERE station_id = ${params.id}
      ORDER BY created_at DESC
    `

    const station = {
      ...stationRows[0],
      fuel_records: fuelRows,
    }

    return NextResponse.json(station)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch station" }, { status: 500 })
  }
}
