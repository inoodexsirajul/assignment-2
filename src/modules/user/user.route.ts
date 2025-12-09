import { Router } from "express";
import userController from "./user.controller";
import auth from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", auth("admin"), userController.getAllUser);
router.put("/:userId", auth("admin", "customer"), userController.updateUser);
router.delete("/:userId", auth("admin"), userController.deleteUser);

const userRouter = router;
export default userRouter;
