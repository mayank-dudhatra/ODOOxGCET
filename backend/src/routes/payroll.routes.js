import express from "express";
import { getMyPayroll, getAllPayroll, updatePayroll } from "../controllers/payroll.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Secure all payroll routes
router.use(authMiddleware);

router.get("/my", getMyPayroll);
router.get("/all", getAllPayroll);
router.put("/:empId", updatePayroll);

export default router;
