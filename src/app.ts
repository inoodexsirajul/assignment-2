import express, { Request, Response } from "express";
import initDB from "./config/db";
import authRouter from "./modules/auth/auth.route";
import vehiclesRoute from "./modules/vehicles/vehicles.route";
import userRouter from "./modules/user/user.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded());

initDB();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vehicles", vehiclesRoute);
app.use("/api/v1/users", userRouter);

export default app;
