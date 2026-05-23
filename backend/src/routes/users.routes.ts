import express from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  updateProfile,
} from "../controllers/users.controller";

const router = express.Router();

router.get("/:id", getUserById);

router.post("/create-profile", createUser);

router.patch("/update-profile", updateProfile);

router.delete("/delete-profile/:id", deleteUser);

export default router;
