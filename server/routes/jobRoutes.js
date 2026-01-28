import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/jobsController.js";

const router = express.Router();

router
  .route("/")
  .get(authMiddleware, getAllJobs)
  .post(authMiddleware, createJob);

router
  .route("/:id")
  .patch(authMiddleware, updateJob)
  .delete(authMiddleware, deleteJob);

export default router;
