import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Types.ObjectId,
      ref: "Job",
      required: false, // Optional - allows direct employee messages
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide sender"],
    },
    receiverId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide receiver"],
    },
    content: {
      type: String,
      required: [true, "Please provide message content"],
      maxlength: 100,
    },
    messageType: {
      type: String,
      enum: ["job_related", "direct"],
      default: "job_related",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
