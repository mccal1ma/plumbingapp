import Message from "../models/Message.js";
import Job from "../models/Job.js";

// Get messages for a specific job
export const getJobMessages = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    const messages = await Message.find({ jobId })
      .populate("senderId", "firstName lastName email role phone")
      .populate("receiverId", "firstName lastName email role phone")
      .sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all messages for receptionist (messages sent to them)
export const getReceptionistMessages = async (req, res) => {
  try {
    console.log("Fetching messages for receptionist:", req.user.userId);
    const messages = await Message.find({ receiverId: req.user.userId })
      .populate("senderId", "firstName lastName email role phone")
      .populate("jobId", "customerName location date status customerPhone")
      .sort({ createdAt: -1 });

    console.log(`Found ${messages.length} messages for receptionist`);
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error in getReceptionistMessages:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all messages for contractor (messages they sent)
export const getContractorMessages = async (req, res) => {
  try {
    const messages = await Message.find({ senderId: req.user.userId })
      .populate("receiverId", "firstName lastName email role phone")
      .populate("jobId", "customerName location date status customerPhone")
      .sort({ createdAt: -1 });

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all direct messages for current user (not job-related)
export const getDirectMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user.userId, messageType: "direct" },
        { receiverId: req.user.userId, messageType: "direct" }
      ]
    })
      .populate("senderId", "firstName lastName email role phone")
      .populate("receiverId", "firstName lastName email role phone")
      .sort({ createdAt: -1 });

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error in getDirectMessages:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get conversation between current user and another user
export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: req.user.userId, receiverId: userId },
        { senderId: userId, receiverId: req.user.userId }
      ]
    })
      .populate("senderId", "firstName lastName email role phone")
      .populate("receiverId", "firstName lastName email role phone")
      .populate("jobId", "customerName location customerPhone")
      .sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (error) {
    console.error("Error in getConversation:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Send a message (employee to employee or job-related)
export const sendMessage = async (req, res) => {
  try {
    const { jobId, receiverId, content, messageType } = req.body;

    console.log("Sending message:", { jobId, receiverId, content, messageType, senderId: req.user.userId });

    if (!receiverId || !content) {
      return res.status(400).json({ msg: "Please provide receiver and message content" });
    }

    // Determine message type
    const type = messageType || (jobId ? "job_related" : "direct");

    // If job-related, validate job and access
    if (type === "job_related" && jobId) {
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ msg: "Job not found" });
      }

      // Contractors can only message about jobs they're assigned to
      if (
        req.user.role === "contractor" &&
        job.employeeAssigned?.toString() !== req.user.userId
      ) {
        return res.status(403).json({ msg: "You are not assigned to this job" });
      }
    }

    // Validate receiver exists
    const User = (await import("../models/User.js")).default;
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ msg: "Receiver not found" });
    }

    // Contractors can only message receptionists
    if (req.user.role === "contractor" && receiver.role !== "receptionist") {
      return res.status(403).json({ msg: "Contractors can only message receptionists" });
    }

    // Admins can only message receptionists
    if (req.user.role === "admin" && receiver.role !== "receptionist") {
      return res.status(403).json({ msg: "Admins can only message receptionists" });
    }

    // Receptionists can message admins and contractors only
    if (req.user.role === "receptionist" && !["admin", "contractor"].includes(receiver.role)) {
      return res.status(403).json({ msg: "Receptionists can only message admins and contractors" });
    }

    const message = await Message.create({
      jobId: jobId || null,
      senderId: req.user.userId,
      receiverId,
      content,
      messageType: type,
    });

    console.log("Message created:", message._id);

    const populatedMessage = await Message.findById(message._id)
      .populate("senderId", "firstName lastName email role phone")
      .populate("receiverId", "firstName lastName email role phone")
      .populate("jobId", "customerName location customerPhone");

    res.status(201).json({ message: populatedMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ msg: "Message not found" });
    }

    // Only sender or receiver can delete
    if (
      message.senderId.toString() !== req.user.userId &&
      message.receiverId.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ msg: "Not authorized to delete this message" });
    }

    await Message.findByIdAndDelete(id);
    res.status(200).json({ msg: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
