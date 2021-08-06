import { User } from "@prisma/client";
import { Request, Response } from "express";

import {
  createUser,
  deleteUser,
  findAllUsers,
  findUserById,
  loginUser,
  updateUser,
} from "../services/user.service";
import { AuthorizedRequest, ErrorResponse } from "../types";
import { generateToken } from "../utils/jwt";

export const getUsers = (req: Request, res: Response): void => {
  findAllUsers().then((data) => {
    res.status(200).json({ data });
  });
};

export const getUserById = (req: Request, res: Response): void => {
  const userId = Number(req.params.id);

  if (!userId || isNaN(userId)) {
    res.status(400);
    res.json({ error: "Missing user id" });
  }

  findUserById(userId).then((data) => {
    if ((data as ErrorResponse).code) {
      data = data as ErrorResponse;

      res.status(data.code);
      res.json({ error: data.message });
    }

    res.status(200);
    res.json(data);
  });
};

export const addUser = (req: Request, res: Response): void => {
  const userData = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  createUser(userData).then((data) => {
    const token = generateToken(data.id);
    res.status(201).json({ data, token });
  });
};

export const authenticateUser = (req: Request, res: Response): void => {
  const userData = {
    username: req.body.username,
    password: req.body.password,
  };

  loginUser(userData).then((data) => {
    if ((data as ErrorResponse).code) {
      data = data as ErrorResponse;

      res.status(data.code);
      res.json({ error: data.message });
    } else {
      const token = generateToken((data as User).id);
      res.status(200);
      res.json({ data, token });
    }
  });
};

export const update = (req: AuthorizedRequest, res: Response): void => {
  const userId = Number(req.user!.id);
  const userData = req.body;

  if (!userId || isNaN(userId)) {
    res.status(400);
    res.json({ error: "Missing user id" });
  }

  updateUser(userId, userData).then((data) => {
    if ((data as ErrorResponse).code) {
      data = data as ErrorResponse;

      res.status(data.code);
      res.json({ error: data.message });
    }

    res.status(200);
    res.json(data);
  });
};

export const removeUser = (req: AuthorizedRequest, res: Response): void => {
  const userId = Number(req.user!.id);

  if (!userId || isNaN(userId)) {
    res.status(400);
    res.json({ error: "Missing user id" });
  }

  deleteUser(userId).then((data) => {
    if ((data as ErrorResponse).code) {
      data = data as ErrorResponse;

      res.status(data.code);
      res.json({ error: data.message });
    }

    res.status(200);
    res.json(data);
  });
};
