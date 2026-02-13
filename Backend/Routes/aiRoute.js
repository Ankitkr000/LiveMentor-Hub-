const express = require("express");
const router = express.Router();
const authenticate = require("../Middleware/authMiddleware");
const {
  chatWithAI,
  getSuggestedQuestions,
  explainConcept,
  reviewCode
} = require("../Controllers/aiController");

// Chat with AI assistant
router.post("/chat", authenticate, chatWithAI);

// Get suggested questions for a subject
router.get("/suggestions", authenticate, getSuggestedQuestions);

// Explain a concept
router.post("/explain", authenticate, explainConcept);

// Review code
router.post("/review-code", authenticate, reviewCode);

module.exports = router;
