import express from "express";
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave,
} from "../controllers/leave.controller.js";

const router = express.Router();

router.post("/apply", applyLeave);
router.get("/my", getMyLeaves);
router.get("/all", getAllLeaves);
router.put("/:id/approve", approveLeave);
router.put("/:id/reject", rejectLeave);

export default router;
