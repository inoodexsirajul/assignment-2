import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import config from "../../config";

type USER = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
};

const register = async (payload: USER) => {
  const { name, email, password, phone, role } = payload;
  const hashedPassword = await bcrypt.hash(password as string, 10);
  const result = await pool.query(
    `
        INSERT INTO users(name, email, password, phone, role) VALUES($1,$2,$3,$4, $5) RETURNING id, name, email, phone, role
      `,
    [name, email, hashedPassword, phone, role]
  );

  return result;
};

const login = async (email: string, password: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];
  // check is password match

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // generate token
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    config.jwt_secret as string,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user,
  };
};
const userService = {
  register,
  login,
};

export default userService;
