import { pool } from "../../config/db";

const getAllUser = async () => {
  const result = await pool.query(`SELECT id,name,email,phone,role FROM users`);

  if (result.rows.length === 0) {
    throw new Error("Not user found");
  }

  return result.rows;
};

const updateUser = async (
  name: string,
  email: string,
  phone: string,
  role: string,
  userId: any
) => {
  const result = await pool.query(
    `
      UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING name, email, phone, role
      `,
    [name, email, phone, role, userId]
  );

  return result.rows[0];
};

const deleteUser = async (userId: any) => {
  const result = await pool.query(`DELETE FROM users WHERE id=$1`, [userId]);

  return result;
};
const userServices = {
  getAllUser,
  updateUser,
  deleteUser,
};

export default userServices;
