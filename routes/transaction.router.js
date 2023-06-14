const express = require("express");
const { webProtection } = require("../helper/auth");
const {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionDet,
} = require("../controllers/transaction.controller");

const router = express.Router();

router.post("/createtransaction", createTransaction);
router.put("/updatetransaction/:id", webProtection, updateTransaction);
router.delete("/deletetransaction/:id", webProtection, deleteTransaction);
router.get("/transactiondet/:id", webProtection, getTransactionDet);

module.exports = router;
