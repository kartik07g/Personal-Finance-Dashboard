import express from "express";
import {
    signupUser,
    signinUser,
} from "../controllers/userAuthController.js";

const router = express.Router();

router.post("/auth/signup", signupUser);
router.post("/auth/signin", signinUser);

export default router;
