import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

const OFFICE_LAT = process.env.OFFICE_LAT ? parseFloat(process.env.OFFICE_LAT) : null;
const OFFICE_LNG = process.env.OFFICE_LNG ? parseFloat(process.env.OFFICE_LNG) : null;
const OFFICE_RADIUS_METERS = process.env.OFFICE_RADIUS_METERS
  ? parseFloat(process.env.OFFICE_RADIUS_METERS)
  : 200; // default 200m radius if not set

const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371000; // Earth radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Check-In: Record employee check-in time
 */
export const checkin = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { lat, lng } = req.body || {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ error: "Location is required for check-in" });
    }

    let distanceFromOffice = null;
    let isWithinOfficeRadius = true;

    if (OFFICE_LAT !== null && OFFICE_LNG !== null) {
      distanceFromOffice = calculateDistanceMeters(lat, lng, OFFICE_LAT, OFFICE_LNG);
      isWithinOfficeRadius = distanceFromOffice <= OFFICE_RADIUS_METERS;
      if (!isWithinOfficeRadius) {
        return res.status(400).json({
          error: "You are outside the office geofence. Check-in denied.",
          distanceFromOffice,
          officeRadius: OFFICE_RADIUS_METERS,
        });
      }
    }

    // Check if already checked in today
    const existingRecord = await Attendance.findOne({
      userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existingRecord && existingRecord.checkIn) {
      return res.status(400).json({
        error: "Already checked in today",
        checkInTime: existingRecord.checkIn,
      });
    }

    // Determine if on time or late (assuming 9:00 AM is on time)
    const checkInTime = new Date();
    const officeHour = new Date();
    officeHour.setHours(9, 0, 0, 0);

    const isLate = checkInTime > officeHour;

    const attendanceRecord = await Attendance.findOneAndUpdate(
      {
        userId,
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      {
        userId,
        date: today,
        checkIn: checkInTime,
        status: isLate ? "late" : "present",
        checkInLocation: { lat, lng },
        distanceFromOfficeMeters: distanceFromOffice,
        isWithinOfficeRadius,
      },
      { upsert: true, new: true }
    );

    res.json({
      message: "Check-in successful",
      checkInTime: checkInTime.toLocaleTimeString(),
      status: isLate ? "late" : "present",
      attendance: attendanceRecord,
      distanceFromOffice,
      officeRadius: OFFICE_RADIUS_METERS,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Check-Out: Record employee check-out time and calculate working hours
 */
export const checkout = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { lat, lng } = req.body || {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceRecord = await Attendance.findOne({
      userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (!attendanceRecord) {
      return res.status(404).json({
        error: "No check-in found for today. Please check-in first.",
      });
    }

    if (attendanceRecord.checkOut) {
      return res.status(400).json({
        error: "Already checked out today",
        checkOutTime: attendanceRecord.checkOut,
      });
    }

    const checkOutTime = new Date();
    const workingHours = (
      (checkOutTime - attendanceRecord.checkIn) /
      (1000 * 60 * 60)
    ).toFixed(2);

    attendanceRecord.checkOut = checkOutTime;
    if (lat !== undefined && lng !== undefined) {
      attendanceRecord.checkOutLocation = { lat, lng };
    }
    attendanceRecord.workingHours = workingHours;

    if (!attendanceRecord.status || attendanceRecord.status === "absent") {
      attendanceRecord.status = "present";
    }

    await attendanceRecord.save();

    res.json({
      message: "Check-out successful",
      checkOutTime: checkOutTime.toLocaleTimeString(),
      workingHours,
      attendance: attendanceRecord,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get My Attendance: Employee's own attendance records
 */
export const getMyAttendance = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { month, year } = req.query;

    const currentDate = new Date();
    const queryYear = year || currentDate.getFullYear();
    const queryMonth = month || currentDate.getMonth() + 1;

    // Get all days in the month
    const startDate = new Date(queryYear, queryMonth - 1, 1);
    const endDate = new Date(queryYear, queryMonth, 0);

    const attendanceRecords = await Attendance.find({
      userId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ date: -1 });

    // Get today's record
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRecord = await Attendance.findOne({
      userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    // Calculate statistics
    const stats = {
      present: attendanceRecords.filter((r) => r.status === "present").length,
      late: attendanceRecords.filter((r) => r.status === "late").length,
      absent: attendanceRecords.filter((r) => r.status === "absent").length,
      halfDay: attendanceRecords.filter((r) => r.status === "half-day").length,
      totalWorkingHours: attendanceRecords.reduce(
        (sum, r) => sum + (r.workingHours || 0),
        0
      ),
    };

    const attendancePercentage = (
      (stats.present / attendanceRecords.length) *
      100
    ).toFixed(1);

    res.json({
      message: "Attendance records fetched successfully",
      today: todayRecord ? {
        status: todayRecord.status,
        date: todayRecord.date.toISOString().split("T")[0],
        checkInTime: todayRecord.checkIn
          ? todayRecord.checkIn.toLocaleTimeString()
          : null,
        checkOutTime: todayRecord.checkOut
          ? todayRecord.checkOut.toLocaleTimeString()
          : null,
        workingHours: todayRecord.workingHours || "—",
        checkInLocation: todayRecord.checkInLocation,
        checkOutLocation: todayRecord.checkOutLocation,
        distanceFromOfficeMeters: todayRecord.distanceFromOfficeMeters,
        isWithinOfficeRadius: todayRecord.isWithinOfficeRadius,
      } : null,
      records: attendanceRecords.map((r) => ({
        _id: r._id,
        date: r.date.toISOString().split("T")[0],
        status: r.status,
        checkIn: r.checkIn ? r.checkIn.toLocaleTimeString() : null,
        checkOut: r.checkOut ? r.checkOut.toLocaleTimeString() : null,
        workingHours: r.workingHours || 0,
          checkInLocation: r.checkInLocation,
          checkOutLocation: r.checkOutLocation,
          distanceFromOfficeMeters: r.distanceFromOfficeMeters,
          isWithinOfficeRadius: r.isWithinOfficeRadius,
      })),
      statistics: {
        ...stats,
        attendancePercentage,
        month: startDate.toLocaleString("default", { month: "long" }),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get All Attendance: Admin/HR view of all employees' attendance
 */
export const getAllAttendance = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    const { date, department, status } = req.query;

    let filterDate = new Date();
    if (date) {
      filterDate = new Date(date);
    }
    filterDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(filterDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Get all employees in the company
    const employees = await User.find({
      companyId,
      role: { $ne: "admin" },
    });

    // Get attendance for the date
    let attendanceRecords = await Attendance.find({
      userId: { $in: employees.map((e) => e._id) },
      date: {
        $gte: filterDate,
        $lt: nextDay,
      },
    }).populate("userId");

    // Apply filters
    if (department && department !== "all") {
      attendanceRecords = attendanceRecords.filter(
        (r) => r.userId.department === department
      );
    }

    if (status && status !== "all") {
      attendanceRecords = attendanceRecords.filter(
        (r) => r.status === status
      );
    }

    // For employees without attendance record, mark as absent
    const attendedEmployeeIds = attendanceRecords.map((r) => r.userId._id.toString());
    const absentEmployees = employees.filter(
      (e) => !attendedEmployeeIds.includes(e._id.toString())
    );

    const absentRecords = absentEmployees.map((e) => ({
      _id: null,
      userId: e,
      date: filterDate,
      checkIn: null,
      checkOut: null,
      status: "absent",
      workingHours: 0,
    }));

    const allRecords = [
      ...attendanceRecords.map((r) => ({
        _id: r._id,
        userId: r.userId,
        date: r.date,
        checkIn: r.checkIn,
        checkOut: r.checkOut,
        status: r.status,
        workingHours: r.workingHours,
      })),
      ...absentRecords,
    ];

    // Calculate summary
    const summary = {
      totalEmployees: employees.length,
      present: allRecords.filter((r) => r.status === "present").length,
      late: allRecords.filter((r) => r.status === "late").length,
      absent: allRecords.filter((r) => r.status === "absent").length,
      halfDay: allRecords.filter((r) => r.status === "half-day").length,
    };

    res.json({
      message: "All attendance records fetched successfully",
      summary,
      date: filterDate.toISOString().split("T")[0],
      count: allRecords.length,
      attendance: allRecords.map((r) => ({
        id: r._id,
        employeeId: r.userId._id,
        employeeName: r.userId.name,
        email: r.userId.email,
        department: r.userId.department,
        position: r.userId.position,
        date: r.date.toISOString().split("T")[0],
        status: r.status,
        checkIn: r.checkIn ? r.checkIn.toLocaleTimeString() : "—",
        checkOut: r.checkOut ? r.checkOut.toLocaleTimeString() : "—",
        workingHours: r.workingHours || 0,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Mark Attendance (Admin): Manually mark attendance for an employee
 */
export const markAttendance = async (req, res) => {
  try {
    const { userId, date, status } = req.body;
    const companyId = req.user?.companyId;

    // Validate input
    if (!userId || !date || !status) {
      return res.status(400).json({
        error: "userId, date, and status are required",
      });
    }

    if (!["present", "absent", "late", "half-day"].includes(status)) {
      return res.status(400).json({
        error: "Invalid status. Must be present, absent, late, or half-day",
      });
    }

    // Verify user belongs to company
    const user = await User.findOne({ _id: userId, companyId });
    if (!user) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOneAndUpdate(
      {
        userId,
        date: {
          $gte: attendanceDate,
          $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      {
        userId,
        date: attendanceDate,
        status,
      },
      { upsert: true, new: true }
    );

    res.json({
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get Attendance Report: Monthly/Annual report for an employee
 */
export const getAttendanceReport = async (req, res) => {
  try {
    const { userId } = req.params;
    const { month, year } = req.query;
    const companyId = req.user?.companyId;

    // Verify user belongs to company
    const user = await User.findOne({ _id: userId, companyId });
    if (!user) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const currentDate = new Date();
    const queryYear = year || currentDate.getFullYear();
    const queryMonth = month || currentDate.getMonth() + 1;

    const startDate = new Date(queryYear, queryMonth - 1, 1);
    const endDate = new Date(queryYear, queryMonth, 0);

    const records = await Attendance.find({
      userId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ date: 1 });

    const stats = {
      present: records.filter((r) => r.status === "present").length,
      late: records.filter((r) => r.status === "late").length,
      absent: records.filter((r) => r.status === "absent").length,
      halfDay: records.filter((r) => r.status === "half-day").length,
      totalWorkingHours: records.reduce(
        (sum, r) => sum + (r.workingHours || 0),
        0
      ),
    };

    const workingDays = records.filter((r) => r.status !== "absent").length;
    const attendancePercentage = (
      (stats.present / records.length) *
      100
    ).toFixed(1);

    res.json({
      message: "Attendance report generated successfully",
      employee: {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        position: user.position,
      },
      period: {
        month: startDate.toLocaleString("default", { month: "long" }),
        year: queryYear,
      },
      statistics: {
        ...stats,
        workingDays,
        attendancePercentage,
      },
      records: records.map((r) => ({
        date: r.date.toISOString().split("T")[0],
        status: r.status,
        checkIn: r.checkIn ? r.checkIn.toLocaleTimeString() : "—",
        checkOut: r.checkOut ? r.checkOut.toLocaleTimeString() : "—",
        workingHours: r.workingHours || 0,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
