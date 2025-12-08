import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      console.log({ token }, "from auth guard");

      if (!token) {
        throw new Error("You are not authorized!");
      }

      // const verifiedUser = jwt.verify(token, config.jwt_secret) as JwtPayload;

      // req.user = verifiedUser;

      // if (roles.length && !roles.includes(verifiedUser.role)) {
      //   throw new Error("Forbidden!");
      // }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
