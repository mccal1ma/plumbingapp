import express from "express";
import authMiddleware, { requireRole } from "../middleware/authMiddleware.js";
import {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
  showStats,
  getContractorsList,
  acceptJob,
  rejectJob,
} from "../controllers/jobsController.js";

const router = express.Router();

router.route("/stats").get(authMiddleware, showStats);
router.route("/contractors").get(authMiddleware, getContractorsList);
router
  .route("/:id/accept")
  .patch(authMiddleware, requireRole(["contractor"]), acceptJob);
router
  .route("/:id/reject")
  .patch(authMiddleware, requireRole(["contractor"]), rejectJob);

router
  .route("/")
  .get(authMiddleware, getAllJobs)
  .post(authMiddleware, createJob);

router
  .route("/:id")
  .patch(authMiddleware, updateJob)
  .delete(authMiddleware, deleteJob);

export default router;
