-- Create stations table
CREATE TABLE IF NOT EXISTS stations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create fuel_records table
CREATE TABLE IF NOT EXISTS fuel_records (
  id SERIAL PRIMARY KEY,
  station_id INTEGER REFERENCES stations(id) ON DELETE CASCADE,
  fuel_type VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL,
  start_time TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'upcoming',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fuel_records_station_id ON fuel_records(station_id);
CREATE INDEX IF NOT EXISTS idx_fuel_records_status ON fuel_records(status);
CREATE INDEX IF NOT EXISTS idx_fuel_records_start_time ON fuel_records(start_time);
