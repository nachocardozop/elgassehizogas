import { sql } from '@vercel/postgres';

export async function initializeDatabase() {
  try {
    // Create stations table
    await sql`
      CREATE TABLE IF NOT EXISTS stations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        department VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Create fuel_records table
    await sql`
      CREATE TABLE IF NOT EXISTS fuel_records (
        id SERIAL PRIMARY KEY,
        station_id INTEGER REFERENCES stations(id) ON DELETE CASCADE,
        fuel_type VARCHAR(50) NOT NULL,
        quantity INTEGER NOT NULL,
        start_time TIMESTAMP NOT NULL,
        status VARCHAR(20) DEFAULT 'upcoming',
        cars_served INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    console.log('Database tables created successfully');
    return { success: true };
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

// Station operations
export async function getStations() {
  const result = await sql`
    SELECT s.*, 
           COUNT(fr.id) as fuel_records_count,
           MAX(fr.created_at) as last_update
    FROM stations s 
    LEFT JOIN fuel_records fr ON s.id = fr.station_id
    WHERE s.deleted_at IS NULL
    GROUP BY s.id
    ORDER BY s.department, s.city, s.name;
  `;
  return result.rows;
}

export async function getStationsByLocation(department?: string, city?: string) {
  let query = sql`
    SELECT s.*, 
           fr.fuel_type,
           fr.quantity,
           fr.start_time,
           fr.status,
           fr.cars_served
    FROM stations s 
    LEFT JOIN fuel_records fr ON s.id = fr.station_id 
    WHERE s.deleted_at IS NULL
  `;
  
  if (department) {
    query = sql`${query} AND s.department = ${department}`;
  }
  
  if (city) {
    query = sql`${query} AND s.city = ${city}`;
  }
  
  query = sql`${query} ORDER BY s.department, s.city, s.name`;
  
  const result = await query;
  return result.rows;
}

export async function createStation(data: {
  name: string;
  address: string;
  city: string;
  department: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
}) {
  const result = await sql`
    INSERT INTO stations (name, address, city, department, phone, latitude, longitude)
    VALUES (${data.name}, ${data.address}, ${data.city}, ${data.department}, 
            ${data.phone || null}, ${data.latitude || null}, ${data.longitude || null})
    RETURNING *;
  `;
  return result.rows[0];
}

export async function updateStation(id: number, data: Partial<{
  name: string;
  address: string;
  city: string;
  department: string;
  phone: string;
  latitude: number;
  longitude: number;
}>) {
  const updates = Object.entries(data)
    .filter(([_, value]) => value !== undefined)
    .map(([key, _]) => `${key} = $${key}`)
    .join(', ');
    
  if (updates.length === 0) return null;
  
  const result = await sql`
    UPDATE stations 
    SET ${sql.unsafe(updates)}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *;
  `;
  return result.rows[0];
}

export async function deleteStation(id: number) {
  await sql`DELETE FROM stations WHERE id = ${id}`;
}

// Fuel record operations
export async function createFuelRecord(data: {
  station_id: number;
  fuel_type: string;
  quantity: number;
  start_time: string;
  status?: string;
}) {
  const result = await sql`
    INSERT INTO fuel_records (station_id, fuel_type, quantity, start_time, status)
    VALUES (${data.station_id}, ${data.fuel_type}, ${data.quantity}, 
            ${data.start_time}, ${data.status || 'upcoming'})
    RETURNING *;
  `;
  return result.rows[0];
}

export async function getFuelRecords(stationId?: number) {
  let query = sql`
    SELECT fr.*, s.name as station_name, s.city, s.department
    FROM fuel_records fr
    JOIN stations s ON fr.station_id = s.id
  `;
  
  if (stationId) {
    query = sql`${query} WHERE fr.station_id = ${stationId}`;
  }
  
  query = sql`${query} ORDER BY fr.created_at DESC`;
  
  const result = await query;
  return result.rows;
}

export async function updateFuelRecord(id: number, data: Partial<{
  fuel_type: string;
  quantity: number;
  start_time: string;
  status: string;
  cars_served: number;
}>) {
  const updates = Object.entries(data)
    .filter(([_, value]) => value !== undefined)
    .map(([key, _]) => `${key} = $${key}`)
    .join(', ');
    
  if (updates.length === 0) return null;
  
  const result = await sql`
    UPDATE fuel_records 
    SET ${sql.unsafe(updates)}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *;
  `;
  return result.rows[0];
}

export async function deleteFuelRecord(id: number) {
  await sql`DELETE FROM fuel_records WHERE id = ${id}`;
}

export { sql };