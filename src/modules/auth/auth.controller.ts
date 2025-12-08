import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import userService from "./auth.service";
import jwt from "jsonwebtoken";
import config from "../../config";

const register = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const existsUser = await pool.query(`SELECT * FROM users WHERE email=$1`, [
      email,
    ]);

    if (existsUser.rows.length) {
      throw new Error("User Already Exists");
    }

    const user = await userService.register(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      details: error,
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { token, user } = await userService.login(email, password);

    res.status(201).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      details: error,
    });
  }
};

const authController = {
  register,
  login,
};

export default authController;
