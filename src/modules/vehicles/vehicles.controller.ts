import { Request, Response } from "express";
import { pool } from "../../config/db";
import vehicleService from "./vehicles.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;

    const result = await vehicleService.createVehicle(
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status
    );

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      details: error,
    });
  }
};

const vehiclesController = {
  createVehicle,
};

export default vehiclesController;
