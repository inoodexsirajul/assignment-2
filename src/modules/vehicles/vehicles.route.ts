import { Router } from "express";
import vehiclesController from "./vehicles.controller";
import auth from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", auth("admin"), vehiclesController.createVehicle);
router.get("/", vehiclesController.getAllVihicles);
router.get("/:vehicleId", vehiclesController.getVehicleById);
router.put("/:vehicleId", auth("admin"), vehiclesController.vehicleUpdate);
router.delete("/:vehicleId", auth("admin"), vehiclesController.deleteVehicle);

const vehiclesRoute = router;
export default vehiclesRoute;
