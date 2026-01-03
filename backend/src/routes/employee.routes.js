import express from "express";
import { createEmployee, getAllEmployees, getProfile, updateProfile } from "../controllers/employee.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(authMiddleware);

router.post("/create", createEmployee);        // POST /api/employee/create
router.get("/all", getAllEmployees);           // GET /api/employee/all
router.get("/profile", getProfile);            // GET /api/employee/profile (get logged-in user's profile)
router.put("/profile", updateProfile);         // PUT /api/employee/profile (update logged-in user's profile)

export default router;