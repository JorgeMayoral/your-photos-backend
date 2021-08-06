import jsonwebtoken from "jsonwebtoken";

import { DecodedToken } from "../types";

export const generateToken = (id: number): string => {
  const secret = process.env.JWT_SECRET_KEY || "development_key";
  const expirationDate = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365; // Token expires in 1 year
  const payload = {
    id: id,
    exp: expirationDate,
  };
  const token = jsonwebtoken.sign(payload, secret);

  return token;
};

export const validateToken = (token: string): string | DecodedToken => {
  const secret = process.env.JWT_SECRET_KEY || "development_key";
  const data = jsonwebtoken.verify(token, secret) as DecodedToken;

  return data;
};
