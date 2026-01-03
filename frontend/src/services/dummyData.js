// Dummy data service for employee section
export const getCurrentEmployeeData = () => {
  return {
    id: "EMP001",
    name: "Arjun Sharma",
    email: "arjun.sharma@company.com",
    phone: "+91 98765 43210",
    department: "Engineering",
    position: "Senior Developer",
    joinDate: "2022-01-15",
    reportingManager: "Rajesh Kumar",
  };
};

export const getTodayAttendance = () => {
  return {
    date: new Date().toISOString().split("T")[0],
    status: "Present", // Present, Absent, Late, Half Day
    checkInTime: "09:15 AM",
    checkOutTime: null, // Will be marked at end of day
    workingHours: "7h 45m",
    remarks: "On time",
  };
};

export const getMonthlyAttendance = () => {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const daysInMonth = lastDay.getDate();
  const attendance = [];
  
  const statuses = ["Present", "Absent", "Late", "Half Day"];
  const statusDistribution = [0.7, 0.05, 0.15, 0.1]; // 70% present, 5% absent, 15% late, 10% half day
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    
    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      attendance.push({
        date: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        day,
        dayName: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayOfWeek],
        status: "Weekend",
        checkInTime: null,
        checkOutTime: null,
      });
      continue;
    }
    
    // Distribute statuses
    const rand = Math.random();
    let status = "Present";
    let cumulative = 0;
    
    for (let i = 0; i < statuses.length; i++) {
      cumulative += statusDistribution[i];
      if (rand < cumulative) {
        status = statuses[i];
        break;
      }
    }
    
    const checkInHour = 9 + Math.floor(Math.random() * 2); // 9-11 AM
    const checkInMinute = Math.floor(Math.random() * 60);
    const checkOutHour = 17 + Math.floor(Math.random() * 2); // 5-7 PM
    const checkOutMinute = Math.floor(Math.random() * 60);
    
    attendance.push({
      date: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      day,
      dayName: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayOfWeek],
      status,
      checkInTime: `${String(checkInHour).padStart(2, "0")}:${String(checkInMinute).padStart(2, "0")}`,
      checkOutTime: `${String(checkOutHour).padStart(2, "0")}:${String(checkOutMinute).padStart(2, "0")}`,
    });
  }
  
  return attendance;
};

export const getAttendanceSummary = () => {
  return {
    month: new Date().toLocaleString("default", { month: "long", year: "numeric" }),
    present: 18,
    absent: 1,
    late: 3,
    halfDay: 2,
    attendancePercentage: 88.5,
  };
};

export const getLeaveBalance = () => {
  return {
    totalLeaves: 20,
    usedLeaves: 7,
    remainingLeaves: 13,
    leaveTypes: [
      { type: "Casual Leave", total: 12, used: 4, remaining: 8 },
      { type: "Sick Leave", total: 5, used: 2, remaining: 3 },
      { type: "Earned Leave", total: 3, used: 1, remaining: 2 },
    ],
  };
};

export const getLeaveRequests = () => {
  return [
    {
      id: "LR001",
      type: "Casual Leave",
      fromDate: "2025-12-20",
      toDate: "2025-12-22",
      days: 3,
      reason: "Family vacation",
      status: "Approved",
      appliedOn: "2025-12-01",
      approvedBy: "Rajesh Kumar",
    },
    {
      id: "LR002",
      type: "Sick Leave",
      fromDate: "2025-12-15",
      toDate: "2025-12-15",
      days: 1,
      reason: "Medical appointment",
      status: "Approved",
      appliedOn: "2025-12-14",
      approvedBy: "Rajesh Kumar",
    },
    {
      id: "LR003",
      type: "Casual Leave",
      fromDate: "2025-12-25",
      toDate: "2025-12-27",
      days: 3,
      reason: "Personal work",
      status: "Pending",
      appliedOn: "2025-12-10",
      approvedBy: null,
    },
    {
      id: "LR004",
      type: "Sick Leave",
      fromDate: "2025-12-05",
      toDate: "2025-12-05",
      days: 1,
      reason: "Not feeling well",
      status: "Rejected",
      appliedOn: "2025-12-04",
      approvedBy: "Rajesh Kumar",
      rejectionReason: "Insufficient documentation",
    },
  ];
};
