import { currentUser } from "@clerk/nextjs/server"
import { sql } from "@vercel/postgres"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const text = await file.text()
    const lines = text.split("\n").filter((line) => line.trim())

    if (lines.length < 2) {
      return NextResponse.json({ error: "CSV file must have header and at least one data row" }, { status: 400 })
    }

    const header = lines[0].split(",").map((h) => h.trim())
    const expectedHeaders = ["name", "address", "city", "department", "phone"]

    if (!expectedHeaders.every((h) => header.includes(h))) {
      return NextResponse.json(
        {
          error: `CSV must have headers: ${expectedHeaders.join(", ")}`,
        },
        { status: 400 },
      )
    }

    const errors = []
    let processed = 0

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))

      if (values.length !== header.length) {
        errors.push(`Line ${i + 1}: Invalid number of columns`)
        continue
      }

      const record: Record<string, string> = {}
      header.forEach((h, index) => {
        record[h] = values[index]
      })

      try {
        // Check for required fields
        if (!record.name || !record.address || !record.city || !record.department) {
          errors.push(`Line ${i + 1}: Missing required fields (name, address, city, department)`)
          continue
        }

        await sql`
          INSERT INTO stations (name, address, city, department, phone)
          VALUES (${record.name}, ${record.address}, ${record.city}, ${record.department}, ${record.phone || null})
        `
        processed++
      } catch (error: any) {
        errors.push(`Line ${i + 1}: ${error.message}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${processed} stations successfully`,
      processed,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error("Batch stations upload error:", error)
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 })
  }
}