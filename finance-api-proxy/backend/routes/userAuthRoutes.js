import express from "express";
import {
    signupUser,
    signinUser,
    signinOauthUser
} from "../controllers/userAuthController.js";

const router = express.Router();

router.post("/auth/signup", signupUser);
router.post("/auth/signin", signinUser);
router.post("/auth/google/callback", signinOauthUser);

export default router;
