import express from "express";
import { registerCompany, login } from "../controllers/company.controller.js";

const router = express.Router();

// Company registration (no auth needed)
router.post("/register", registerCompany);

// Login endpoint
router.post("/login", login);

export default router;
