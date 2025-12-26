import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../generated/prisma";
import AppError from "../errors/AppError";
import config from "../config";

// Extend the Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers?.authorization;
    if (!token) {
      throw new AppError(403, "Unauthorized access");
    }
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;

    if (!decoded) {
      throw new AppError(403, "Unauthorized access");
    }
    if (roles.length > 0 && !roles.includes(decoded?.role as UserRole)) {
      throw new AppError(403, "Forbidden access");
    } else {
      req.user = decoded;
      next();
    }
  };
};

export default auth;
