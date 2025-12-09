import { Request, Response } from "express";
import { pool } from "../../config/db";
import config from "../../config";
import bookingService from "./booking.service";
const createBooking = async (req: Request, res: Response) => {
  try {
    const customerId = req?.user?.id;

    const { vehicle_id, rent_start_date, rent_end_date } = req.body;

    const booking = await bookingService.createBooking(
      customerId,
      vehicle_id,
      rent_start_date,
      rent_end_date
    );

    console.log(booking);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      details: error,
    });
  }
};

export const getAllBookingsHandler = async (req: Request, res: Response) => {
  try {
    const bookings = await bookingService.getAllBookings(
      req.user.id,
      req.user.role
    );

    const message =
      req.user.role === "admin"
        ? "Bookings retrieved successfully"
        : "Your bookings retrieved successfully";

    res.status(200).json({
      success: true,
      message,
      data: bookings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings",
      error: error.message,
    });
  }
};

export const updateBookingHandler = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!["cancelled", "returned"].includes(status)) {
      throw new Error("Invalid status. Must be 'cancelled' or 'returned'");
    }

    const updatedBooking = await bookingService.updateBookingStatus(
      bookingId,
      status,
      req.user.id,
      req.user.role
    );

    const message =
      status === "cancelled"
        ? "Booking cancelled successfully"
        : "Booking marked as returned. Vehicle is now available";

    res.status(200).json({
      success: true,
      message,
      data: updatedBooking,
    });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update booking",
    });
  }
};
const bookingController = {
  createBooking,
  getAllBookingsHandler,
  updateBookingHandler,
};

export default bookingController;
