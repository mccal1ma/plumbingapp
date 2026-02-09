import Notification from "../models/Notification.js";

// Get notifications for current user (or all for admins)
export const getMyNotifications = async (req, res) => {
  try {
    let notifications;
    
    // Admins see ALL notifications
    if (req.user.role === "admin") {
      notifications = await Notification.find({})
        .populate("jobId", "customerName location date description status assignmentStatus _id")
        .populate("userId", "firstName lastName email role")
        .sort({ createdAt: -1 });
    } else {
      // Regular users see only their own
      notifications = await Notification.find({ userId: req.user.userId })
        .populate("jobId", "customerName location date description status assignmentStatus _id")
        .sort({ createdAt: -1 });
    }

    console.log(`Fetched ${notifications.length} notifications for user ${req.user.userId}`);
    res.status(200).json({ notifications, total: notifications.length });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get unread notifications count
export const getUnreadCount = async (req, res) => {
  try {
    // Get all unread notifications with job details
    const notifications = await Notification.find({
      userId: req.user.userId,
      isRead: false,
    }).populate("jobId", "assignmentStatus");

    let count;
    
    // For contractors, only count pending job assignments
    if (req.user.role === "contractor") {
      count = notifications.filter(
        (notif) => notif.type === "job_assigned" && notif.jobId?.assignmentStatus === "pending"
      ).length;
    } else {
      // For receptionists and admins, only count notifications with valid jobId references
      count = notifications.filter(notif => notif.jobId != null).length;
    }

    console.log(`Unread count for user ${req.user.userId} (${req.user.role}): ${count} (total unread: ${notifications.length})`);
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ msg: "Notification not found" });
    }

    // Ensure user owns this notification
    if (notification.userId.toString() !== req.user.userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ notification });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ msg: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete notification (admins can delete any, users can delete their own)
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ msg: "Notification not found" });
    }

    // Admins can delete any notification, users can only delete their own
    if (req.user.role !== "admin" && notification.userId.toString() !== req.user.userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await Notification.findByIdAndDelete(id);
    res.status(200).json({ msg: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
