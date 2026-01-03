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

// ============ TIME OFF / LEAVE MANAGEMENT ============

export const getAllLeaveRequests = () => {
  return [
    {
      id: "LR001",
      employeeId: "EMP001",
      employeeName: "Arjun Sharma",
      department: "Engineering",
      leaveType: "Paid Leave",
      startDate: "2026-01-10",
      endDate: "2026-01-12",
      days: 3,
      reason: "Personal work",
      status: "Pending",
      appliedOn: "2026-01-03",
      approvedBy: null,
    },
    {
      id: "LR002",
      employeeId: "EMP002",
      employeeName: "Priya Verma",
      department: "HR",
      leaveType: "Sick Leave",
      startDate: "2026-01-08",
      endDate: "2026-01-08",
      days: 1,
      reason: "Medical appointment",
      status: "Approved",
      appliedOn: "2026-01-07",
      approvedBy: "John Doe",
    },
    {
      id: "LR003",
      employeeId: "EMP003",
      employeeName: "Rajesh Kumar",
      department: "Engineering",
      leaveType: "Paid Leave",
      startDate: "2026-01-15",
      endDate: "2026-01-20",
      days: 6,
      reason: "Vacation",
      status: "Approved",
      appliedOn: "2025-12-20",
      approvedBy: "John Doe",
    },
    {
      id: "LR004",
      employeeId: "EMP004",
      employeeName: "Anjali Singh",
      department: "Marketing",
      leaveType: "Paid Leave",
      startDate: "2026-01-05",
      endDate: "2026-01-07",
      days: 3,
      reason: "Family event",
      status: "Rejected",
      appliedOn: "2026-01-02",
      approvedBy: "John Doe",
    },
    {
      id: "LR005",
      employeeId: "EMP005",
      employeeName: "Vikram Patel",
      department: "Sales",
      leaveType: "Unpaid Leave",
      startDate: "2026-01-22",
      endDate: "2026-01-25",
      days: 4,
      reason: "Personal reasons",
      status: "Pending",
      appliedOn: "2025-12-28",
      approvedBy: null,
    },
    {
      id: "LR006",
      employeeId: "EMP001",
      employeeName: "Arjun Sharma",
      department: "Engineering",
      leaveType: "Sick Leave",
      startDate: "2025-12-30",
      endDate: "2025-12-31",
      days: 2,
      reason: "Fever",
      status: "Approved",
      appliedOn: "2025-12-29",
      approvedBy: "John Doe",
    },
  ];
};

export const getLeaveRequestsSummary = () => {
  const requests = getAllLeaveRequests();
  return {
    total: requests.length,
    pending: requests.filter((r) => r.status === "Pending").length,
    approved: requests.filter((r) => r.status === "Approved").length,
    rejected: requests.filter((r) => r.status === "Rejected").length,
  };
};

export const getEmployeeLeaveBalance = (employeeId) => {
  const leaveTypes = {
    "Paid Leave": 20,
    "Sick Leave": 10,
    "Casual Leave": 5,
    "Unpaid Leave": -1, // Unlimited
  };

  const allRequests = getAllLeaveRequests();
  const employeeRequests = allRequests.filter(
    (r) => r.employeeId === employeeId && r.status === "Approved"
  );

  const balance = {};
  Object.keys(leaveTypes).forEach((type) => {
    const usedDays = employeeRequests
      .filter((r) => r.leaveType === type)
      .reduce((sum, r) => sum + r.days, 0);
    balance[type] = leaveTypes[type] === -1 ? -1 : leaveTypes[type] - usedDays;
  });

  return balance;
};

export const updateLeaveRequestStatus = (requestId, status, approvedBy) => {
  // This would be called after API integration
  // For now, returns success
  return {
    success: true,
    message: `Leave request ${status.toLowerCase()} successfully`,
    updatedId: requestId,
  };
};

// ============ PAYROLL MANAGEMENT ============

export const getPayrollPeriods = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  return [
    { month: "January", year: 2025, startDate: "Jan 01, 2025", endDate: "Jan 31, 2025", payDate: "Feb 05, 2025" },
    { month: "February", year: 2025, startDate: "Feb 01, 2025", endDate: "Feb 28, 2025", payDate: "Mar 05, 2025" },
    { month: "October", year: 2025, startDate: "Oct 31, 2025", endDate: "Nov 29, 2025", payDate: "Dec 04, 2025" },
    { month: "November", year: 2025, startDate: "Nov 01, 2025", endDate: "Nov 30, 2025", payDate: "Dec 05, 2025" },
    { month: "December", year: 2025, startDate: "Dec 01, 2025", endDate: "Dec 31, 2025", payDate: "Jan 10, 2026" },
  ];
};

export const getPayrunDetails = (month, year) => {
  // Find the matching payroll period or create a generic one
  const periods = getPayrollPeriods();
  let period = periods.find((p) => p.month === month && p.year === year);
  
  if (!period) {
    // Generate period for any month/year combination
    const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    period = {
      month: month,
      year: year,
      startDate: `${month.slice(0, 3)} 01, ${year}`,
      endDate: `${month.slice(0, 3)} ${daysInMonth}, ${year}`,
      payDate: `${daysInMonth === 31 ? "Next" : "Same"} Month 05, ${year}`
    };
  }

  return {
    month,
    year,
    period: `${period.startDate} - ${period.endDate}`,
    payDate: period.payDate,
    totalEmployees: 5,
    employerCost: 5624000,
    grossSalary: 5624000,
    netSalary: 5195600,
    status: "draft",
    description: "The payslip of an individual employee is generated on the basis of attendance of that employee in a particular month. Done status show once any payrun/payslip has been validated."
  };
};

export const getPayslips = (month = "October", year = 2025) => {
  const employees = getAllEmployees();
  
  // Generate payslips for any month/year combination
  const payslips = employees.map((emp, idx) => {
    const baseSalaries = [50000, 45000, 41000, 43000, 28000];
    const grossSalaries = [95000, 85500, 77900, 82600, 56000];
    const netWages = [78900, 79000, 71960, 76840, 50000];
    const employerCosts = [95000, 85500, 77900, 82600, 56000];
    
    const monthShort = month.slice(0, 3);
    
    return {
      id: `PS${String(idx + 1).padStart(3, "0")}_${year}_${month}`,
      employeeId: emp.id,
      employeeName: emp.name,
      period: `${monthShort} 01, ${year} - ${monthShort} 28, ${year}`,
      payDate: `${monthShort} 04, ${year}`,
      employerCost: employerCosts[idx],
      basicWage: baseSalaries[idx],
      grossWage: grossSalaries[idx],
      netWage: netWages[idx],
      status: "draft",
    };
  });
  
  return payslips;
};

export const getPayrollSummary = (month = "October", year = 2025) => {
  const payslips = getPayslips(month, year);
  
  return {
    totalPayslips: payslips.length,
    totalEmployerCost: payslips.reduce((sum, p) => sum + p.employerCost, 0),
    totalGrossWage: payslips.reduce((sum, p) => sum + p.grossWage, 0),
    totalNetWage: payslips.reduce((sum, p) => sum + p.netWage, 0),
  };
};

export const getPayslipDetailsByEmployeeAndPeriod = (employeeId, month, year) => {
  // Capitalize month if it's lowercase (from URL parameters)
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
  
  const payslips = getPayslips(capitalizedMonth, year);
  const payslip = payslips.find((p) => p.employeeId === employeeId);
  const employee = getAllEmployees().find((e) => e.id === employeeId);
  const payrun = getPayrunDetails(capitalizedMonth, year);

  if (!payslip || !employee || !payrun) return null;

  return {
    ...payslip,
    employeeDetails: employee,
    payrunInfo: payrun,
    salaryStructure: "Updated Structure - " + employee.name.split(" ")[0],
    workedDays: [
      {
        type: "Attendance",
        days: 5.0,
        description: "Working days in period",
        amount: 11363.64,
      },
      {
        type: "Paid Time Off",
        days: 0.0,
        description: "Paid leaves in period",
        amount: 0.0,
      },
    ],
    salaryComponents: [
      { name: "Basic Salary", amount: 28000, percentage: 35 },
      { name: "HRA", amount: 10000, percentage: 12.5 },
      { name: "Dearness Allowance", amount: 8000, percentage: 10 },
      { name: "Conveyance Allowance", amount: 4000, percentage: 5 },
      { name: "Medical Allowance", amount: 3000, percentage: 3.75 },
      { name: "Other Allowances", amount: 5000, percentage: 6.25 },
      { name: "Performance Bonus", amount: 8000, percentage: 10 },
      { name: "Provident Fund Deduction", amount: -2800, percentage: -3.5 },
      { name: "Income Tax", amount: -6600, percentage: -8.25 },
      { name: "Professional Tax", amount: -600, percentage: -0.75 },
    ],
  };
};

export const updatePayslipDetails = (employeeId, month, year, updatedData) => {
  // This would be called after API integration
  return {
    success: true,
    message: "Payslip updated successfully",
    payslipId: `PS_${employeeId}_${month}_${year}`,
    data: updatedData,
  };
};

// ============ SALARY MANAGEMENT ============

export const getAllEmployeeSalaries = () => {
  return [
    {
      employeeId: "WORKRJA2025001",
      name: "krishnapal jadejaaa",
      email: "jadejakrishnapal04@gmail.com",
      department: "tech",
      position: "sde",
      monthWage: 1000010,
      yearlyWage: 12001200,
    },
    {
      employeeId: "WOJEMA2023008",
      name: "Jennifer Martinez",
      email: "jennifer@workzen.com",
      department: "Finance",
      position: "Financial Analyst",
      monthWage: 780000,
      yearlyWage: 9360000,
    },
    {
      employeeId: "WOROTA2023007",
      name: "Robert Taylor",
      email: "robert@workzen.com",
      department: "Sales",
      position: "Sales Executive",
      monthWage: 700000,
      yearlyWage: 8400000,
    },
    {
      employeeId: "WOLIAN2023006",
      name: "Lisa Anderson",
      email: "lisa@workzen.com",
      department: "Marketing",
      position: "Marketing Manager",
      monthWage: 800000,
      yearlyWage: 9600000,
    },
    {
      employeeId: "WODAWI2023005",
      name: "David Wilson",
      email: "david@workzen.com",
      department: "Engineering",
      position: "Senior Software Engineer",
      monthWage: 950000,
      yearlyWage: 11400000,
    },
    {
      employeeId: "WOEMDA2023004",
      name: "Emily Davis",
      email: "employee@workzen.com",
      department: "Engineering",
      position: "Software Engineer",
      monthWage: 750000,
      yearlyWage: 9000000,
    },
    {
      employeeId: "WOJEMI2023003",
      name: "Jessica Miller",
      email: "payroll@workzen.com",
      department: "Finance",
      position: "Payroll Officer",
      monthWage: 820000,
      yearlyWage: 9840000,
    },
  ];
};

export const getEmployeeSalaryDetails = (employeeId) => {
  const allSalaries = getAllEmployeeSalaries();
  const salary = allSalaries.find((s) => s.employeeId === employeeId);

  if (!salary) return null;

  return {
    ...salary,
    workingDaysPerWeek: 5,
    breakTime: "1 Hour",
    salaryComponents: [
      {
        name: "Basic Salary",
        amount: 500050,
        percentage: 50.0,
      },
      {
        name: "House Rent Allowance (HRA)",
        amount: 250025,
        percentage: 25.0,
      },
      {
        name: "Standard Allowance",
        amount: 166717,
        percentage: 16.67,
      },
      {
        name: "Performance Bonus",
        amount: 41654,
        percentage: 4.17,
      },
      {
        name: "Leave Travel Allowance (LTA)",
        amount: 41654,
        percentage: 4.16,
      },
      {
        name: "Fixed Allowance",
        amount: 0,
        percentage: 0.0,
      },
    ],
    pfContribution: {
      employee: 60006,
      percentage: 12.0,
    },
    taxDeductions: [
      {
        name: "Professional Tax",
        amount: 200,
      },
      {
        name: "Income Tax",
        amount: 60000,
      },
    ],
    grossSalary: 1000100,
    netSalary: 938094,
  };
};

export const updateEmployeeSalaryDetails = (employeeId, updatedData) => {
  return {
    success: true,
    message: "Salary information updated successfully",
    employeeId: employeeId,
    data: updatedData,
  };
};
