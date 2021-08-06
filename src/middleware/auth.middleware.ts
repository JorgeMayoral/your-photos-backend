import { PrismaClient } from "@prisma/client";
import { NextFunction, Response } from "express";

import { AuthorizedRequest, DecodedToken } from "../types";
import { validateToken } from "../utils/jwt";

export const protect = async (
  req: AuthorizedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const prisma = new PrismaClient();
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = validateToken(token);

      const user = await prisma.user.findUnique({
        where: { id: (decoded as DecodedToken).id },
      });

      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }

      req.user = user;

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized - Token failed.");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized - No token.");
  }
};
