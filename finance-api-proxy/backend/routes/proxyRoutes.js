import express from "express";
import transactionsRoutes from "./transactionsRoutes.js";
import usersRoutes from "./usersRoutes.js";
import assetsAndLiabilityRoutes from "./assetsAndLiabilityRoutes.js";
import userAuthRoutes from "./userAuthRoutes.js";
import reportRoutes from "./reportRoutes.js";

const router = express.Router();

router.use("/", transactionsRoutes);
router.use("/", usersRoutes);
router.use("/", assetsAndLiabilityRoutes);
router.use("/", userAuthRoutes);
router.use("/", reportRoutes);

export default router;
