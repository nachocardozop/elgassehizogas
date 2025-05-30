import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function GET() {
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
              'created_at', f.created_at
            ) ORDER BY f.created_at DESC
          ) FILTER (WHERE f.id IS NOT NULL),
          '[]'
        ) as fuel_records
      FROM stations s
      LEFT JOIN fuel_records f ON s.id = f.station_id
      GROUP BY s.id
      ORDER BY s.name
    `

    return NextResponse.json(rows)
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch stations" }, { status: 500 })
  }
}