import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    loginId: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "hr", "employee", "manager"],
      default: "employee",
    },
    department: String,
    position: String,
    joinDate: {
      type: String, // Matching the "YYYY-MM-DD" format from your frontend
      default: () => new Date().toISOString().split("T")[0]
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active", // Matches your frontend status colors
    },
    salary: {
      type: Number,
      required: true,
    },
    isFirstLogin: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Compound unique index for email per company
userSchema.index({ companyId: 1, email: 1 }, { unique: true });

export default mongoose.model("User", userSchema);