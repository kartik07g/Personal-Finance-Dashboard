import express from "express";
import {
  getAssetsAndLiability,
  createAssetAndLiability,
  updateAssetAndLiability,
  deleteAssetAndLiability
} from "../controllers/assetsAndLiabilityController.js";

const router = express.Router();

router.get("/assetsliabs", getAssetsAndLiability);
router.post("/assetsliabs/create", createAssetAndLiability);
router.patch("/assetsliabs/update/:id", updateAssetAndLiability);
router.delete("/assetsliabs/remove/:id", deleteAssetAndLiability);

export default router;
