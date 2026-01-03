import express from "express";
import {
  checkin,
  checkout,
  getMyAttendance,
  getAllAttendance,
  markAttendance,
  getAttendanceReport,
} from "../controllers/attendance.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Employee routes
router.post("/checkin", checkin);
router.post("/checkout", checkout);
router.get("/my", getMyAttendance);

// Admin/HR routes
router.get("/all", getAllAttendance);
router.post("/mark", markAttendance);
router.get("/report/:userId", getAttendanceReport);

export default router;
