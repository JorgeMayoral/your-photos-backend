import { Photo, PrismaClient } from "@prisma/client";
import { UploadedFile } from "express-fileupload";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

import { ErrorResponse } from "../types";

const prisma = new PrismaClient();

interface PhotoUploadData {
  description: string;
  authorId: number;
  photoFile: UploadedFile;
}

interface PhotoUpdateData {
  description: string;
}

export const findAllPhotos = async (): Promise<Photo[]> => {
  const allPhotos = await prisma.photo.findMany();

  return allPhotos;
};

export const findUserPhotos = async (id: number): Promise<Photo[]> => {
  const userPhotos = await prisma.photo.findMany({
    where: { authorId: id },
    orderBy: { createdAt: "desc" },
  });

  return userPhotos;
};

export const findPhotoById = async (
  id: number
): Promise<Photo | ErrorResponse> => {
  const photo = await prisma.photo.findUnique({ where: { id } });

  return photo ? photo : { code: 404, message: "Photo not found" };
};

export const createPhoto = async (
  photoData: PhotoUploadData
): Promise<Photo | ErrorResponse> => {
  const filename = uuid();
  const filepath = path.join(__dirname, "../../public/") + filename + ".jpg";
  const file = photoData.photoFile;

  file.mv(filepath, () => {
    return { code: 500, message: "Error saving the photo" };
  });

  const data = {
    description: photoData.description,
    filename,
    author: {
      connect: { id: Number(photoData.authorId) },
    },
  };
  const photo = await prisma.photo.create({ data });

  return photo;
};

export const updatePhoto = async (
  id: number,
  photoData: PhotoUpdateData,
  authorId: number
): Promise<Photo | ErrorResponse> => {
  const photoToUpdate = await prisma.photo.findUnique({ where: { id } });

  if (!photoToUpdate) {
    return { code: 404, message: "Photo not found" };
  }

  if (photoToUpdate.authorId !== authorId) {
    return { code: 401, message: "Unauthorized" };
  }

  const photo = await prisma.photo.update({ data: photoData, where: { id } });

  if (!photo) {
    return { code: 500, message: "Error updating the photo" };
  }

  return photo;
};

export const deletePhoto = async (
  id: number,
  authorId: number
): Promise<Photo | ErrorResponse> => {
  const photoToDelete = await prisma.photo.findUnique({ where: { id } });

  if (!photoToDelete) {
    return { code: 404, message: "Photo not found" };
  }

  if (photoToDelete.authorId !== authorId) {
    return { code: 401, message: "Unauthorized" };
  }

  const photo = await prisma.photo.delete({ where: { id } });

  if (!photo) {
    return { code: 500, message: "Error updating the photo" };
  }

  fs.unlinkSync(
    path.join(__dirname, "../../public/") + photo.filename + ".jpg"
  );

  return photo;
};
