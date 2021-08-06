import { PrismaClient, User } from "@prisma/client";

import { ErrorResponse } from "../types";
import { checkPassword, hashPassword } from "../utils/password";

const prisma = new PrismaClient();

interface UserRegistrationData {
  username: string;
  email: string;
  password: string;
}

interface UserAuthenticationData {
  username: string;
  password: string;
}

interface UserUpdateData {
  username?: string;
  email?: string;
  password?: string;
}

interface UserResponse {
  id: number;
  username: string;
}

export const findAllUsers = async (): Promise<UserResponse[]> => {
  const allUsers = await prisma.user.findMany({
    select: { id: true, username: true },
  });

  return allUsers;
};

export const findUserById = async (
  id: number
): Promise<UserResponse | ErrorResponse> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true },
  });

  return user ? user : { code: 404, message: "User not found" };
};

export const createUser = async (
  userData: UserRegistrationData
): Promise<User> => {
  userData.password = hashPassword(userData.password);
  const user = await prisma.user.create({ data: userData });

  return user;
};

export const loginUser = async (
  userData: UserAuthenticationData
): Promise<User | ErrorResponse> => {
  const { username } = userData;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (user && checkPassword(userData.password, user.password)) {
    return user;
  }

  return { code: 401, message: "Wrong username or password" };
};

export const updateUser = async (
  id: number,
  userData: UserUpdateData
): Promise<User | ErrorResponse> => {
  const userToUpdate = await prisma.user.findUnique({ where: { id } });

  if (!userToUpdate) {
    return { code: 404, message: "User not found" };
  }

  const user = await prisma.user.update({ data: userData, where: { id } });

  if (!user) {
    return { code: 500, message: "Error updating the user" };
  }

  return user;
};

export const deleteUser = async (id: number): Promise<User | ErrorResponse> => {
  const userToDelete = await prisma.user.findUnique({ where: { id } });

  if (!userToDelete) {
    return { code: 404, message: "User not found" };
  }

  const user = await prisma.user.delete({ where: { id } });

  if (!user) {
    return { code: 500, message: "Error updating the user" };
  }

  return user;
};
