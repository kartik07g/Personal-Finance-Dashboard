import express from "express";
import {
  getLiabilities,
  createLiability,
  updateLiability,
  deleteLiability
} from "../controllers/liabilitiesController.js";

const router = express.Router();

router.get("/liabilities", getLiabilities);
router.post("/liabilities/create", createLiability);
router.patch("/liabilities/update/:id", updateLiability);
router.delete("/liabilities/remove/:id", deleteLiability);

export default router;
