const express = require("express");
const router = express.Router();
const authenticate = require("../Middleware/authMiddleware");
const {
  createOrder,
  verifyPayment,
  getPaymentDetails,
} = require("../Controllers/paymentController");

// Create payment order
router.post("/create-order", createOrder);

// Verify payment
router.post("/verify", verifyPayment);

// Get payment details
router.get("/details/:paymentId", authenticate, getPaymentDetails);

module.exports = router;
