const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a payment order
const createOrder = async (req, res) => {
  try {
    const { amount, planName } = req.body;

    if (!amount || !planName) {
      return res.status(400).json({
        success: false,
        message: "Amount and plan name are required",
      });
    }

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        planName,
        userId: req.user?._id || "guest",
        userName: req.user?.name || "Guest User",
      },
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// Verify payment signature
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details",
      });
    }

    // Create signature string
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    
    // Generate expected signature
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    // Verify signature
    if (razorpay_signature === expectedSign) {
      // Payment verified successfully
      // Here you can update user's premium status in database
      
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

// Get payment details
const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await razorpay.payments.fetch(paymentId);

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Get payment details error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment details",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentDetails,
};
