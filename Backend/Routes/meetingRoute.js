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

router.post("/create", authenticate, createMeeting);

router.get("/teacher/meetings", authenticate, getTeacherMeetings);

router.get("/available", authenticate, getAvailableMeetings);

router.post("/join/:meetingLink", authenticate, joinMeeting);

router.put("/status/:meetingId", authenticate, updateMeetingStatus);

router.delete("/:meetingId", authenticate, deleteMeeting);

router.get("/:meetingLink", authenticate, getMeetingByLink);

module.exports = router;
