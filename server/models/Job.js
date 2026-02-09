import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, "Please provide customer phone number"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "in progress", "completed", "payment pending"],
      default: "active",
    },
    jobType: {
      type: String,
      enum: ["emergency", "standard", "preventive"],
      default: "standard",
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: String, // keep as string since frontend sends it this way
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    employeeAssigned: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
    assignmentStatus: {
      type: String,
      enum: ["unassigned", "pending", "accepted", "rejected"],
      default: "unassigned",
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    rejectedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", JobSchema);
