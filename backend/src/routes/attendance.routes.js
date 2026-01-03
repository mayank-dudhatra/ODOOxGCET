import express from "express";
import {
  checkin,
  checkout,
  getMyAttendance,
  getAllAttendance,
} from "../controllers/attendance.controller.js";

const router = express.Router();

router.post("/checkin", checkin);
router.post("/checkout", checkout);
router.get("/my", getMyAttendance);
router.get("/all", getAllAttendance);

export default router;
