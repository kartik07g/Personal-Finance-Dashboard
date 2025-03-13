import express from "express";
import transactionsRoutes from "./transactionsRoutes.js";
import usersRoutes from "./usersRoutes.js";
import assetsRoutes from "./assetsRoutes.js";
import liabilitiesRoutes from "./liabilitiesRoutes.js";
import userAuthRoutes from "./userAuthRoutes.js"

const router = express.Router();

router.use("/", transactionsRoutes);
router.use("/", usersRoutes);
router.use("/", assetsRoutes);
router.use("/", liabilitiesRoutes);
router.use("/", userAuthRoutes);

export default router;
