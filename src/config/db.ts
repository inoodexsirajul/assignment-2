import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
  connectionString: config.db_url,
});
const initDb = async () => {
  await pool.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
              CREATE TYPE user_role AS ENUM ('admin', 'customer');
          END IF;

          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vehicle_type') THEN
              CREATE TYPE vehicle_type AS ENUM ('car', 'bike', 'van', 'SUV');
          END IF;

          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'availability_status') THEN
              CREATE TYPE availability_status AS ENUM ('available', 'booked');
          END IF;

          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
              CREATE TYPE booking_status AS ENUM ('active', 'cancelled', 'returned');
          END IF;
      END $$;
    `);

  await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        role user_role DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type vehicle_type NOT NULL,
        registration_number VARCHAR(50) UNIQUE NOT NULL,
        daily_rent_price DECIMAL(10,2) NOT NULL CHECK (daily_rent_price > 0),
        availability_status availability_status DEFAULT 'available',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
        total_price DECIMAL(12,2) NOT NULL CHECK (total_price > 0),
        status booking_status DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT valid_date_range CHECK (rent_end_date > rent_start_date)
      );
    `);
};

export default initDb;
