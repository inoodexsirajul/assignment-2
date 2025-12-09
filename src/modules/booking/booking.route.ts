import { Router, Request, Response } from "express";
import bookingController from "./booking.controller";
import auth from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", auth("customer", "admin"), bookingController.createBooking);
router.get(
  "/",
  auth("customer", "admin"),
  bookingController.getAllBookingsHandler
);
router.put(
  "/:bookingId",
  auth("customer", "admin"),
  bookingController.updateBookingHandler
);

const bookingRouter = router;
export default bookingRouter;
