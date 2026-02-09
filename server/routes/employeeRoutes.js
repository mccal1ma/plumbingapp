import express from "express";
import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesForMessaging,
} from "../controllers/employeeController.js";
import authMiddleware, { requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Employee list for messaging - available to all authenticated users
router.route("/messaging").get(authMiddleware, getEmployeesForMessaging);

// All other routes require admin role
router.use(authMiddleware);
router.use(requireRole(["admin"]));

router.route("/").get(getAllEmployees).post(createEmployee);
router.route("/:id").patch(updateEmployee).delete(deleteEmployee);

export default router;
