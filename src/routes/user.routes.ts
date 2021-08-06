import { Router } from "express";

import { protect } from "../middleware/auth.middleware";
// Controllers
import {
  addUser,
  authenticateUser,
  getUserById,
  getUsers,
  removeUser,
  update,
} from "./../controllers/user.controller";

const router = Router();

router.route("/").get(getUsers).post(addUser);
router.route("/auth/login").post(authenticateUser);
router
  .route("/:id")
  .get(getUserById)
  .put(protect, update)
  .delete(protect, removeUser);

export default router;
