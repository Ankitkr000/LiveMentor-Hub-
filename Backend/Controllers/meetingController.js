const meetingModel = require("../Models/meetingSchema");
const userModel = require("../Models/userSchema");
const { v4: uuidv4 } = require('uuid');

// Create a new group meeting
const createMeeting = async (req, res) => {
  try {
    const { title, description, subject, scheduledTime, duration, maxParticipants } = req.body;
    const teacherId = req.user._id;
    const teacherName = req.user.name;

    if (!title || !subject || !scheduledTime) {
      return res.status(400).json({ 
        success: false,
        message: "Title, subject, and scheduled time are required" 
      });
    }

    // Generate unique meeting link
    const meetingLink = uuidv4();

    const newMeeting = new meetingModel({
      title,
      description,
      teacherId,
      teacherName,
      subject,
      scheduledTime: new Date(scheduledTime),
      duration: duration || 60,
      maxParticipants: maxParticipants || 50,
      meetingLink
    });

    await newMeeting.save();

    res.status(201).json({
      success: true,
      message: "Meeting created successfully",
      meeting: newMeeting
    });
  } catch (error) {
    console.error("Create meeting error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to create meeting",
      error: error.message 
    });
  }
};

// Get all meetings for a teacher
const getTeacherMeetings = async (req, res) => {
  try {
    const teacherId = req.user._id;

    const meetings = await meetingModel.find({ teacherId })
      .sort({ scheduledTime: -1 });

    res.status(200).json({
      success: true,
      meetings
    });
  } catch (error) {
    console.error("Get teacher meetings error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch meetings",
      error: error.message 
    });
  }
};

// Get all available meetings for students
const getAvailableMeetings = async (req, res) => {
  try {
    const { subject } = req.query;
    
    let query = { 
      status: { $in: ["scheduled", "ongoing"] },
      scheduledTime: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // meetings from last 24 hours
    };

    if (subject) {
      query.subject = subject;
    }

    const meetings = await meetingModel.find(query)
      .sort({ scheduledTime: 1 })
      .populate("teacherId", "name subjects");

    res.status(200).json({
      success: true,
      meetings
    });
  } catch (error) {
    console.error("Get available meetings error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch meetings",
      error: error.message 
    });
  }
};

// Join a meeting
const joinMeeting = async (req, res) => {
  try {
    const { meetingLink } = req.params;
    const userId = req.user._id;
    const userName = req.user.name;

    const meeting = await meetingModel.findOne({ meetingLink });

    if (!meeting) {
      return res.status(404).json({ 
        success: false,
        message: "Meeting not found" 
      });
    }

    if (meeting.status === "completed" || meeting.status === "cancelled") {
      return res.status(400).json({ 
        success: false,
        message: "Meeting is no longer available" 
      });
    }

    if (meeting.participants.length >= meeting.maxParticipants) {
      return res.status(400).json({ 
        success: false,
        message: "Meeting is full" 
      });
    }

    // Check if user already joined
    const alreadyJoined = meeting.participants.some(
      p => p.userId.toString() === userId.toString()
    );

    if (!alreadyJoined) {
      meeting.participants.push({
        userId,
        name: userName,
        joinedAt: new Date()
      });
      await meeting.save();
    }

    res.status(200).json({
      success: true,
      message: "Joined meeting successfully",
      meeting
    });
  } catch (error) {
    console.error("Join meeting error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to join meeting",
      error: error.message 
    });
  }
};

// Update meeting status
const updateMeetingStatus = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { status } = req.body;
    const teacherId = req.user._id;

    const meeting = await meetingModel.findOne({ 
      _id: meetingId,
      teacherId 
    });

    if (!meeting) {
      return res.status(404).json({ 
        success: false,
        message: "Meeting not found or unauthorized" 
      });
    }

    meeting.status = status;
    await meeting.save();

    res.status(200).json({
      success: true,
      message: "Meeting status updated",
      meeting
    });
  } catch (error) {
    console.error("Update meeting status error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to update meeting",
      error: error.message 
    });
  }
};

// Delete a meeting
const deleteMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const teacherId = req.user._id;

    const meeting = await meetingModel.findOneAndDelete({ 
      _id: meetingId,
      teacherId 
    });

    if (!meeting) {
      return res.status(404).json({ 
        success: false,
        message: "Meeting not found or unauthorized" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Meeting deleted successfully"
    });
  } catch (error) {
    console.error("Delete meeting error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete meeting",
      error: error.message 
    });
  }
};

// Get meeting by link
const getMeetingByLink = async (req, res) => {
  try {
    const { meetingLink } = req.params;

    const meeting = await meetingModel.findOne({ meetingLink })
      .populate("teacherId", "name subjects");

    if (!meeting) {
      return res.status(404).json({ 
        success: false,
        message: "Meeting not found" 
      });
    }

    res.status(200).json({
      success: true,
      meeting
    });
  } catch (error) {
    console.error("Get meeting by link error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch meeting",
      error: error.message 
    });
  }
};

module.exports = {
  createMeeting,
  getTeacherMeetings,
  getAvailableMeetings,
  joinMeeting,
  updateMeetingStatus,
  deleteMeeting,
  getMeetingByLink
};
