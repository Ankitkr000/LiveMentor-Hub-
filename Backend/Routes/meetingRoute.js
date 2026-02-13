const express = require("express");
const router = express.Router();
const authenticate = require("../Middleware/authMiddleware");
const {
  createMeeting,
  getTeacherMeetings,
  getAvailableMeetings,
  joinMeeting,
  updateMeetingStatus,
  deleteMeeting,
  getMeetingByLink
} = require("../Controllers/meetingController");

// Create a new meeting (Teacher only)
router.post("/create", authenticate, createMeeting);

// Get all meetings for logged-in teacher
router.get("/teacher/meetings", authenticate, getTeacherMeetings);

// Get all available meetings for students
router.get("/available", authenticate, getAvailableMeetings);

// Join a meeting
router.post("/join/:meetingLink", authenticate, joinMeeting);

// Update meeting status (Teacher only)
router.put("/status/:meetingId", authenticate, updateMeetingStatus);

// Delete a meeting (Teacher only)
router.delete("/:meetingId", authenticate, deleteMeeting);

// Get meeting by link
router.get("/:meetingLink", authenticate, getMeetingByLink);

module.exports = router;
