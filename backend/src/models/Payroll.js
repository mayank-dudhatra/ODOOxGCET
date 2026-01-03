import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
    baseSalary: {
      type: Number,
      required: true,
    },
    allowances: Number,
    deductions: Number,
    netSalary: Number,
    status: {
      type: String,
      enum: ["pending", "approved", "paid"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payroll", payrollSchema);
