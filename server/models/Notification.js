import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Types.ObjectId,
      ref: "Job",
      required: [true, "Please provide job reference"],
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user reference"],
    },
    type: {
      type: String,
      enum: ["job_assigned", "job_rejected"],
      required: [true, "Please provide notification type"],
    },
    message: {
      type: String,
      required: [true, "Please provide notification message"],
    },
    rejectionReason: {
      type: String,
      maxlength: 500,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);
