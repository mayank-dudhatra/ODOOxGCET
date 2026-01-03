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

// All Employees for Admin Dashboard
export const getAllEmployees = () => {
  return [
    {
      id: "EMP001",
      name: "Arjun Sharma",
      email: "arjun.sharma@company.com",
      department: "Engineering",
      position: "Senior Developer",
    },
    {
      id: "EMP002",
      name: "Priya Verma",
      email: "priya.verma@company.com",
      department: "HR",
      position: "HR Manager",
    },
    {
      id: "EMP003",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@company.com",
      department: "Engineering",
      position: "Lead Developer",
    },
    {
      id: "EMP004",
      name: "Anjali Singh",
      email: "anjali.singh@company.com",
      department: "Marketing",
      position: "Marketing Executive",
    },
    {
      id: "EMP005",
      name: "Vikram Patel",
      email: "vikram.patel@company.com",
      department: "Finance",
      position: "Finance Analyst",
    },
  ];
};

// All Employees Attendance Records for Admin
export const getAllEmployeesAttendance = () => {
  const employees = getAllEmployees();
  const today = new Date();
  const last7Days = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();

    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Skip weekends
      last7Days.push(date.toISOString().split("T")[0]);
    }
  }

  const statuses = ["Present", "Absent", "Late", "Half Day"];
  const attendance = [];

  employees.forEach((emp) => {
    last7Days.forEach((date) => {
      const rand = Math.random();
      const statusDistribution = [0.7, 0.05, 0.15, 0.1];
      let status = "Present";
      let cumulative = 0;

      for (let i = 0; i < statuses.length; i++) {
        cumulative += statusDistribution[i];
        if (rand < cumulative) {
          status = statuses[i];
          break;
        }
      }

      const checkInHour = 9 + Math.floor(Math.random() * 2);
      const checkInMinute = Math.floor(Math.random() * 60);
      const checkOutHour = 17 + Math.floor(Math.random() * 2);
      const checkOutMinute = Math.floor(Math.random() * 60);

      attendance.push({
        employeeId: emp.id,
        employeeName: emp.name,
        department: emp.department,
        position: emp.position,
        date,
        status,
        checkInTime:
          status !== "Absent"
            ? `${String(checkInHour).padStart(2, "0")}:${String(checkInMinute).padStart(2, "0")}`
            : null,
        checkOutTime:
          status !== "Absent" && status !== "Half Day"
            ? `${String(checkOutHour).padStart(2, "0")}:${String(checkOutMinute).padStart(2, "0")}`
            : null,
        workingHours:
          status === "Present"
            ? `${Math.floor(Math.random() * 2) + 7}h ${Math.floor(Math.random() * 60)}m`
            : status === "Half Day"
            ? `${Math.floor(Math.random() * 2) + 3}h ${Math.floor(Math.random() * 60)}m`
            : null,
      });
    });
  });

  return attendance;
};

// Daily Attendance Summary for Admin
export const getDailyAttendanceSummary = () => {
  const today = new Date().toISOString().split("T")[0];
  const attendance = getAllEmployeesAttendance();
  const todayRecords = attendance.filter((a) => a.date === today);

  return {
    date: today,
    totalEmployees: 5,
    present: todayRecords.filter((a) => a.status === "Present").length,
    absent: todayRecords.filter((a) => a.status === "Absent").length,
    late: todayRecords.filter((a) => a.status === "Late").length,
    halfDay: todayRecords.filter((a) => a.status === "Half Day").length,
  };
};
