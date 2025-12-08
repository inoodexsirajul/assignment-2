import { Request, Response } from "express";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import config from "../../config";
import userServices from "./user.service";

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUser();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      details: error,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, role } = req.body;

    const result = await userServices.updateUser(
      name,
      email,
      phone,
      role,
      req.params.userId
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      details: error,
    });
  }
};
const deleteUser = async (req: Request, res: Response) => {
  try {
    await userServices.deleteUser(req.params.userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      details: error,
    });
  }
};
const userController = {
  getAllUser,
  updateUser,
  deleteUser,
};

export default userController;
