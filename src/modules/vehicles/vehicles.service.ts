import { pool } from "../../config/db";

const createVehicle = async (
  vehicle_name: string,
  type: string,
  registration_number: number,
  daily_rent_price: number,
  availability_status: string
) => {
  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status) VALUES($1,$2,$3,$4,$5) RETURNING id, vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result.rows[0];
};

const vehicleService = {
  createVehicle,
};

export default vehicleService;
