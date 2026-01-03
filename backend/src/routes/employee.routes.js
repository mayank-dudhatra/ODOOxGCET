import express from "express";
import { createEmployee, getAllEmployees, updateEmployee, deleteEmployee, getProfile, updateProfile } from "../controllers/employee.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(authMiddleware);

router.post("/create", createEmployee);   // POST /api/employee/create
router.get("/all", getAllEmployees);      // GET /api/employee/all
router.get("/profile", getProfile);       // GET /api/employee/profile (get logged-in user's profile)
router.put("/profile", updateProfile);    // PUT /api/employee/profile (update logged-in user's profile)
router.put("/:id", updateEmployee);       // PUT /api/employee/:id
router.delete("/:id", deleteEmployee);    // DELETE /api/employee/:id

export default router;