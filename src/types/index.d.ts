import { User } from "@prisma/client";
import { Request } from "express";

export type ErrorResponse = {
  code: number;
  message: string;
};

export interface AuthorizedRequest extends Request {
  user?: User;
}

export type DecodedToken = {
  id: number;
  exp: number;
  iat: number;
};
