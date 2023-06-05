const express = require("express");
const { webProtection } = require("../helper/auth");
const {
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transaction.controller");

const router = express.Router();

router.post("/createtransaction", createTransaction);
router.put("/updatetransaction/:id", webProtection, updateTransaction);
router.delete("/deletetransaction/:id", webProtection, deleteTransaction);

module.exports = router;
