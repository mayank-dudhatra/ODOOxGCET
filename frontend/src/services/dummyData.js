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
      phone: "+91 98765 43210",
      department: "Engineering",
      position: "Senior Developer",
      joinDate: "2022-01-15",
      status: "Active",
      salary: 85000,
    },
    {
      id: "EMP002",
      name: "Priya Verma",
      email: "priya.verma@company.com",
      phone: "+91 98765 43211",
      department: "HR",
      position: "HR Manager",
      joinDate: "2021-06-10",
      status: "Active",
      salary: 65000,
    },
    {
      id: "EMP003",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@company.com",
      phone: "+91 98765 43212",
      department: "Engineering",
      position: "Lead Developer",
      joinDate: "2020-03-20",
      status: "Active",
      salary: 95000,
    },
    {
      id: "EMP004",
      name: "Anjali Singh",
      email: "anjali.singh@company.com",
      phone: "+91 98765 43213",
      department: "Marketing",
      position: "Marketing Executive",
      joinDate: "2022-09-05",
      status: "Active",
      salary: 50000,
    },
    {
      id: "EMP005",
      name: "Vikram Patel",
      email: "vikram.patel@company.com",
      phone: "+91 98765 43214",
      department: "Finance",
      position: "Finance Analyst",
      joinDate: "2021-11-12",
      status: "Active",
      salary: 55000,
    },
  ];
};

// Get Single Employee Details
export const getEmployeeDetails = (employeeId) => {
  const allEmployees = getAllEmployees();
  const employee = allEmployees.find((e) => e.id === employeeId);

  if (!employee) return null;

  return {
    ...employee,
    firstName: employee.name.split(" ")[0],
    lastName: employee.name.split(" ")[1] || "",
  };
};

// Get Employee Salary Information
export const getEmployeeSalaryInfo = (employeeId) => {
  const salaryMap = {
    EMP001: {
      monthWage: 100000,
      yearlyWage: 1200000,
      workingDaysPerWeek: 5,
      breakTime: "1 Hour",
      basicSalary: 50000,
      hra: 25000,
      standardAllowance: 16670,
      performanceBonus: 4165,
      lta: 4165,
      fixedAllowance: 11670,
      grossSalary: 111670,
    },
    EMP002: {
      monthWage: 65000,
      yearlyWage: 780000,
      workingDaysPerWeek: 5,
      breakTime: "45 Minutes",
      basicSalary: 35000,
      hra: 12500,
      standardAllowance: 10000,
      performanceBonus: 2500,
      lta: 2500,
      fixedAllowance: 8500,
      grossSalary: 71000,
    },
    EMP003: {
      monthWage: 120000,
      yearlyWage: 1440000,
      workingDaysPerWeek: 5,
      breakTime: "1 Hour",
      basicSalary: 60000,
      hra: 30000,
      standardAllowance: 20000,
      performanceBonus: 5000,
      lta: 5000,
      fixedAllowance: 15000,
      grossSalary: 135000,
    },
    EMP004: {
      monthWage: 50000,
      yearlyWage: 600000,
      workingDaysPerWeek: 5,
      breakTime: "45 Minutes",
      basicSalary: 28000,
      hra: 10000,
      standardAllowance: 8000,
      performanceBonus: 2000,
      lta: 2000,
      fixedAllowance: 6000,
      grossSalary: 56000,
    },
    EMP005: {
      monthWage: 55000,
      yearlyWage: 660000,
      workingDaysPerWeek: 5,
      breakTime: "45 Minutes",
      basicSalary: 30000,
      hra: 12000,
      standardAllowance: 8670,
      performanceBonus: 2165,
      lta: 2165,
      fixedAllowance: 6500,
      grossSalary: 61500,
    },
  };

  return salaryMap[employeeId] || null;
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
