import { Router } from "express";
import vehiclesController from "./vehicles.controller";

const router = Router();

router.post("/", vehiclesController.createVehicle);

const vehiclesRoute = router;
export default vehiclesRoute;
