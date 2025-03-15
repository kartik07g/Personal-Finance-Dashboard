import express from "express";
import {
    generateDashboardReport,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.post("/generate-report", generateDashboardReport);

export default router;
