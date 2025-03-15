import express from "express";
import {
  generateReport,
} from "../controllers/reportControllers.js";

const router = express.Router();

router.post("/generate-report-test", generateReport);

export default router;
