import { Router } from "express";
import authController from "./auth.controller";

const router = Router();

router.post("/signup", authController.register);
router.post("/signin", authController.login);

const authRouter = router;
export default authRouter;
