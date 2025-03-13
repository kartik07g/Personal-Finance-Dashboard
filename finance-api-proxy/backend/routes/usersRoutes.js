import express from "express";
import {
  getUsers,
  updateUser,
  deleteUser
} from "../controllers/usersController.js";

const router = express.Router();

router.get("/user/users/:id", getUsers);
router.patch("/user/update/:id", updateUser);
router.delete("/user/remove/:id", deleteUser);

export default router;
