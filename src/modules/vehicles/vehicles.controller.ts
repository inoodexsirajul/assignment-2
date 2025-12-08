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

    res.status(200).json({
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

const getAllVihicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getAllVehicles();
    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      details: error,
    });
  }
};
const getVehicleById = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getVehicleById(
      req.params.vehicleId as unknown as number
    );
    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      details: error,
    });
  }
};

const vehicleUpdate = async (req: Request, res: Response) => {
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
      availability_status,
      req.params.vehicleId
    );

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      details: error,
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    // const result = await vehicleService.deleteVehicle(
    //   req.params.vehicleId as unknown as number
    // );

    const result = await pool.query(`DELETE FROM vehicles WHERE id=$1`, [
      req.params.vehicleId,
    ]);
    console.log(result);

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
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
  getAllVihicles,
  getVehicleById,
  vehicleUpdate,
  deleteVehicle,
};

export default vehiclesController;
