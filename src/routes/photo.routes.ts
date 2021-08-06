import { Router } from "express";

import {
  addPhoto,
  getPhotoById,
  getPhotos,
  getUserPhotos,
  removePhoto,
  update,
} from "../controllers/photo.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.route("/user/:id").get(getUserPhotos);
router
  .route("/:id")
  .get(getPhotoById)
  .put(protect, update)
  .delete(protect, removePhoto);
router.route("/").get(getPhotos).post(protect, addPhoto);

export default router;
