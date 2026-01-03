// INTEGRATION EXAMPLES
// How to convert dummy data to real API calls

// ============================================
// BEFORE: Using Dummy Data
// ============================================

import { getCurrentEmployeeData, getLeaveBalance } from "../../services/dummyData";

export default function Dashboard() {
  const employee = getCurrentEmployeeData(); // ← Dummy data
  const leaveBalance = getLeaveBalance();     // ← Dummy data
  
  return (
    <div>
      <h1>{employee.name}</h1>
      <p>Remaining Leaves: {leaveBalance.remainingLeaves}</p>
    </div>
  );
}

// ============================================
// AFTER: Using Real API
// ============================================

import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Dashboard() {
  const [employee, setEmployee] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch employee profile
        const empResponse = await api.get("/api/employee/profile");
        setEmployee(empResponse.data);

        // Fetch leave balance
        const leaveResponse = await api.get("/api/employee/leave/balance");
        setLeaveBalance(leaveResponse.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{employee?.name}</h1>
      <p>Remaining Leaves: {leaveBalance?.remainingLeaves}</p>
    </div>
  );
}

// ============================================
// CREATING A CUSTOM HOOK
// ============================================

import { useEffect, useState } from "react";
import api from "../../services/api";

export const useEmployeeData = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await api.get("/api/employee/profile");
        setEmployee(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, []);

  return { employee, loading, error };
};

// Usage in component:
// const { employee, loading } = useEmployeeData();

// ============================================
// ATTENDANCE PAGE API INTEGRATION
// ============================================

import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Attendance() {
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [monthlyAttendance, setMonthlyAttendance] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        // Get today's attendance
        const today = await api.get("/api/attendance/today");
        setTodayAttendance(today.data);

        // Get monthly attendance
        const month = await api.get("/api/attendance/month");
        setMonthlyAttendance(month.data);

        // Get summary
        const summ = await api.get("/api/attendance/summary");
        setSummary(summ.data);
      } catch (err) {
        console.error("Error fetching attendance:", err);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <div>
      <p>Status: {todayAttendance?.status}</p>
      <p>Check-in: {todayAttendance?.checkInTime}</p>
      <p>Attendance: {summary?.attendancePercentage}%</p>
    </div>
  );
}

// ============================================
// LEAVE PAGE API INTEGRATION
// ============================================

import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Leave() {
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const balance = await api.get("/api/employee/leave/balance");
        setLeaveBalance(balance.data);

        const requests = await api.get("/api/employee/leave/requests");
        setLeaveRequests(requests.data);
      } catch (err) {
        console.error("Error fetching leave data:", err);
      }
    };

    fetchLeaveData();
  }, []);

  const handleApplyLeave = async (formData) => {
    try {
      const response = await api.post("/api/employee/leave/apply", formData);
      console.log("Leave applied:", response.data);
      // Refresh the leave requests
      const requests = await api.get("/api/employee/leave/requests");
      setLeaveRequests(requests.data);
    } catch (err) {
      console.error("Error applying leave:", err);
    }
  };

  return (
    <div>
      <p>Remaining: {leaveBalance?.remainingLeaves}</p>
      <button onClick={() => handleApplyLeave({...})}>Apply Leave</button>
      {leaveRequests.map(req => (
        <div key={req.id}>{req.type} - {req.status}</div>
      ))}
    </div>
  );
}

// ============================================
// ATTENDANCE CHECK-IN/OUT
// ============================================

const handleCheckIn = async () => {
  try {
    const response = await api.post("/api/attendance/checkin", {
      timestamp: new Date().toISOString(),
    });
    console.log("Checked in:", response.data);
    // Update UI
  } catch (err) {
    console.error("Error checking in:", err);
  }
};

const handleCheckOut = async () => {
  try {
    const response = await api.post("/api/attendance/checkout", {
      timestamp: new Date().toISOString(),
    });
    console.log("Checked out:", response.data);
    // Update UI
  } catch (err) {
    console.error("Error checking out:", err);
  }
};

// ============================================
// PROFILE EDIT API INTEGRATION
// ============================================

const handleSaveProfile = async (formData) => {
  try {
    const response = await api.put("/api/employee/profile", formData);
    console.log("Profile updated:", response.data);
    setEmployee(response.data);
  } catch (err) {
    console.error("Error updating profile:", err);
  }
};

// ============================================
// EXPECTED API RESPONSES
// ============================================

/*
GET /api/employee/profile
Response:
{
  id: "EMP001",
  name: "Arjun Sharma",
  email: "arjun@company.com",
  phone: "+91 98765 43210",
  department: "Engineering",
  position: "Senior Developer",
  joinDate: "2022-01-15",
  reportingManager: "Rajesh Kumar"
}

GET /api/attendance/today
Response:
{
  date: "2024-01-10",
  status: "Present",
  checkInTime: "09:15 AM",
  checkOutTime: null,
  workingHours: "7h 45m"
}

GET /api/attendance/month
Response:
[
  { date: "2024-01-01", status: "Weekend", ... },
  { date: "2024-01-02", status: "Present", checkInTime: "09:10", ... },
  ...
]

GET /api/attendance/summary
Response:
{
  month: "January 2024",
  present: 18,
  absent: 1,
  late: 3,
  halfDay: 2,
  attendancePercentage: 88.5
}

GET /api/employee/leave/balance
Response:
{
  totalLeaves: 20,
  usedLeaves: 7,
  remainingLeaves: 13,
  leaveTypes: [
    { type: "Casual Leave", total: 12, used: 4, remaining: 8 },
    ...
  ]
}

GET /api/employee/leave/requests
Response:
[
  {
    id: "LR001",
    type: "Casual Leave",
    fromDate: "2024-01-20",
    toDate: "2024-01-22",
    days: 3,
    reason: "Family vacation",
    status: "Approved",
    appliedOn: "2024-01-01"
  },
  ...
]

POST /api/employee/leave/apply
Request:
{
  type: "Casual Leave",
  fromDate: "2024-01-25",
  toDate: "2024-01-27",
  reason: "Personal work",
  manager: "manager-id"
}

Response:
{
  success: true,
  message: "Leave request submitted",
  requestId: "LR003"
}

POST /api/attendance/checkin
Request:
{
  timestamp: "2024-01-10T09:15:00Z"
}

Response:
{
  success: true,
  checkInTime: "09:15 AM",
  message: "Checked in successfully"
}

PUT /api/employee/profile
Request:
{
  name: "Arjun Sharma",
  email: "newemail@company.com",
  phone: "+91 98765 43210"
}

Response:
{
  success: true,
  data: { id, name, email, phone, ... }
}
*/

// ============================================
// ERROR HANDLING PATTERN
// ============================================

export default function Component() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/api/endpoint");
        setData(response.data);
      } catch (err) {
        const message = err.response?.data?.message || err.message;
        setError(message);
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return <div>{/* Render data */}</div>;
}
