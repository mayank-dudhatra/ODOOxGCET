import express from "express";
import { getMyPayroll, getAllPayroll, updatePayroll } from "../controllers/payroll.controller.js";

const router = express.Router();

router.get("/my", getMyPayroll);
router.get("/all", getAllPayroll);
router.put("/:empId", updatePayroll);

export default router;
