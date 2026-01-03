import express from "express";
import { getProfile, updateProfile } from "../controllers/employee.controller.js";

const router = express.Router();

router.get("/me", getProfile);
router.put("/me", updateProfile);

export default router;
