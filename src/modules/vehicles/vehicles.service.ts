import { pool } from "../../config/db";

const createVehicle = async (
  vehicle_name: string,
  type: string,
  registration_number: number,
  daily_rent_price: number,
  availability_status: string,
  vehicleId: string | undefined
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

const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);

  if (result.rows.length === 0) {
    throw new Error("Not Vehicle Found");
  }
  return result.rows;
};
const getVehicleById = async (payload: number) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1 `, [
    payload,
  ]);

  if (result.rowCount === 0) {
    throw new Error("Not Vehicle Found");
  }

  delete result.rows[0].created_at;
  delete result.rows[0].updated_at;

  return result.rows[0];
};

const updateVehicle = async (
  vehicle_name: string,
  type: string,
  registration_number: number,
  daily_rent_price: number,
  availability_status: string,
  id: number
) => {
  const result = await pool.query(
    `UPDATE vehicles SET
      type=$1,
      registration_number=$2,
      daily_rent_price=$3,
      availability_status=$4 WHERE id=$5 RETURNING id, vehicle_name,
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
      id,
    ]
  );

  return result.rows[0];
};

const deleteVehicle = async (payload: number) => {
  const result = await pool.query(`DELETE FROM vehicles WHERE id=$1 `, [
    payload,
  ]);

  if (result.rowCount === 0) {
    throw new Error("Not Vehicle Found");
  }
  console.log(result);
  return result.rows[0];
};
const vehicleService = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};

export default vehicleService;
