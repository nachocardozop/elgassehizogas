import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { rows } = await sql`
      SELECT 
        s.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', f.id,
              'fuel_type', f.fuel_type,
              'quantity', f.quantity,
              'start_time', f.start_time,
              'status', f.status,
              'cars_served', f.cars_served,
              'created_at', f.created_at
            ) ORDER BY f.created_at DESC
          ) FILTER (WHERE f.id IS NOT NULL),
          '[]'
        ) as fuel_records
      FROM stations s
      LEFT JOIN fuel_records f ON s.id = f.station_id
      WHERE s.id = ${params.id}
      GROUP BY s.id
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