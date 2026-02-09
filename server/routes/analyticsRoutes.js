import express from "express";
import {
  getJobStatusBreakdown,
  getContractorWorkload,
  getJobsByDate,
  getAssignmentStatusBreakdown,
  getJobsForDate,
} from "../controllers/analyticsController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/job-status", authenticateUser, getJobStatusBreakdown);
router.get("/contractor-workload", authenticateUser, getContractorWorkload);
router.get("/jobs-by-date", authenticateUser, getJobsByDate);
router.get("/assignment-status", authenticateUser, getAssignmentStatusBreakdown);
router.get("/jobs-for-date", authenticateUser, getJobsForDate);

export default router;
