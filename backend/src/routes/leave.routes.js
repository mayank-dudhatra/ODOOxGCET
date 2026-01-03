import express from "express";
import multer from "multer";
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave,
} from "../controllers/leave.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Allow PDF and image files only
    const allowedMimes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and image files are allowed"));
    }
  },
});

router.post("/apply", authMiddleware, upload.single("document"), applyLeave);
router.get("/my", authMiddleware, getMyLeaves);
router.get("/all", authMiddleware, getAllLeaves);
router.put("/:id/approve", authMiddleware, approveLeave);
router.put("/:id/reject", authMiddleware, rejectLeave);

export default router;
