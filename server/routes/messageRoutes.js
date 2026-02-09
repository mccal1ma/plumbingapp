import express from "express";
import {
  getJobMessages,
  getReceptionistMessages,
  getContractorMessages,
  getDirectMessages,
  getConversation,
  sendMessage,
  deleteMessage,
} from "../controllers/messageController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/job/:jobId").get(getJobMessages);
router.route("/receptionist").get(getReceptionistMessages);
router.route("/contractor").get(getContractorMessages);
router.route("/direct").get(getDirectMessages);
router.route("/conversation/:userId").get(getConversation);
router.route("/").post(sendMessage);
router.route("/:id").delete(deleteMessage);

export default router;
