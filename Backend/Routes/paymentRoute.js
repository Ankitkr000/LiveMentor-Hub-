const express = require("express");
const router = express.Router();
const authenticate = require("../Middleware/authMiddleware");
const {
  createOrder,
  verifyPayment,
  getPaymentDetails,
} = require("../Controllers/paymentController");

router.post("/create-order", createOrder);

router.post("/verify", verifyPayment);

router.get("/details/:paymentId", authenticate, getPaymentDetails);

module.exports = router;
