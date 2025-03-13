import express from "express";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.get("/transactions", getTransactions);
router.post("/transactions/create", createTransaction);
router.patch("/transactions/update/:transaction_id", updateTransaction);
router.delete("/transactions/remove/:transaction_id", deleteTransaction);

export default router;
