import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import {
  createPhoto,
  deletePhoto,
  findAllPhotos,
  findPhotoById,
  findUserPhotos,
  updatePhoto,
} from "../services/photo.service";
import { AuthorizedRequest, ErrorResponse } from "../types";

export const getPhotos = (req: Request, res: Response): void => {
  findAllPhotos().then((data) => {
    res.status(200).json({ data });
  });
};

export const getUserPhotos = (req: Request, res: Response): void => {
  const userId = Number(req.params.id);

  if (!userId || isNaN(userId)) {
    res.status(400);
    res.json({ error: "Missing user id" });
  }

  findUserPhotos(userId).then((data) => {
    res.status(200).json({ data });
  });
};

export const getPhotoById = (req: Request, res: Response): void => {
  const photoId = Number(req.params.id);

  if (!photoId || isNaN(photoId)) {
    res.status(400);
    res.json({ error: "Missing photo id" });
  }

  findPhotoById(photoId).then((data) => {
    if ((data as ErrorResponse).code) {
      data = data as ErrorResponse;

      res.status(data.code);
      res.json({ error: data.message });
    }

    res.status(200);
    res.json(data);
  });
};

export const addPhoto = (req: AuthorizedRequest, res: Response): void => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400);
    res.json({ error: "No file uploaded" });
  } else {
    const photoFile = req.files!.photo as UploadedFile;

    const photoData = {
      description: req.body.description,
      authorId: req.user!.id,
      photoFile,
    };

    createPhoto(photoData).then((data) => {
      res.status(201).json({ data });
    });
  }
};

export const update = (req: AuthorizedRequest, res: Response): void => {
  const photoId = Number(req.params.id);
  const photoData = req.body;

  if (!photoId || isNaN(photoId)) {
    res.status(400);
    res.json({ error: "Missing photo id" });
  }

  updatePhoto(photoId, photoData, req.user!.id).then((data) => {
    if ((data as ErrorResponse).code) {
      data = data as ErrorResponse;

      res.status(data.code);
      res.json({ error: data.message });
    }

    res.status(200);
    res.json(data);
  });
};

export const removePhoto = (req: AuthorizedRequest, res: Response): void => {
  const photoId = Number(req.params.id);

  if (!photoId || isNaN(photoId)) {
    res.status(400);
    res.json({ error: "Missing photo id" });
  }

  deletePhoto(photoId, req.user!.id).then((data) => {
    if ((data as ErrorResponse).code) {
      data = data as ErrorResponse;

      res.status(data.code);
      res.json({ error: data.message });
    }

    res.status(200);
    res.json(data);
  });
};
