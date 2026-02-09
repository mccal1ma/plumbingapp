import express from "express";
import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/").get(getMyNotifications);
router.route("/unread-count").get(getUnreadCount);
router.route("/mark-all-read").patch(markAllAsRead);
router.route("/:id").patch(markAsRead).delete(deleteNotification);

export default router;
