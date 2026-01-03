import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    checkIn: Date,
    checkOut: Date,
    checkInLocation: {
      lat: Number,
      lng: Number,
    },
    checkOutLocation: {
      lat: Number,
      lng: Number,
    },
    distanceFromOfficeMeters: Number,
    isWithinOfficeRadius: Boolean,
    status: {
      type: String,
      enum: ["present", "absent", "late", "half-day"],
      default: "absent",
    },
    workingHours: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
