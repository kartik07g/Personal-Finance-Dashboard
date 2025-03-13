import express from "express";
import {
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset
} from "../controllers/assetsController.js";

const router = express.Router();

router.get("/assets", getAssets);
router.post("/assets/create", createAsset);
router.patch("/assets/update/:id", updateAsset);
router.delete("/assets/remove/:id", deleteAsset);

export default router;
