import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import { FiClock, FiCheckCircle, FiCalendar, FiAlertCircle } from "react-icons/fi";
import {
  getTodayAttendance,
  getAttendanceSummary,
  getLeaveBalance,
  getCurrentEmployeeData,
} from "../../services/dummyData";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const employee = getCurrentEmployeeData();
  const todayAttendance = getTodayAttendance();
  const attendanceSummary = getAttendanceSummary();
  const leaveBalance = getLeaveBalance();

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-50 border-green-200 text-green-700";
      case "Absent":
        return "bg-red-50 border-red-200 text-red-700";
      case "Late":
        return "bg-orange-50 border-orange-200 text-orange-700";
      case "Half Day":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Welcome back, {employee.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                <p className="text-xs text-gray-500">{employee.position}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                {employee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Top Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Today's Attendance Status */}
            <div
              className={`rounded-xl border-2 p-6 transition hover:shadow-lg cursor-pointer ${getStatusColor(
                todayAttendance.status
              )}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium opacity-75">Today's Status</p>
                  <p className="text-3xl font-bold mt-2">{todayAttendance.status}</p>
                  <p className="text-xs opacity-75 mt-2">{todayAttendance.date}</p>
                </div>
                <FiCheckCircle className="w-8 h-8 opacity-50" />
              </div>
            </div>

            {/* Check-in Time */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Check-In Time</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {todayAttendance.checkInTime}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">On time</p>
                </div>
                <FiClock className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            {/* Check-out Time */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Check-Out Time</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {todayAttendance.checkOutTime || "Not yet"}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {todayAttendance.workingHours || "In progress"}
                  </p>
                </div>
                <FiClock className="w-8 h-8 text-orange-500" />
              </div>
            </div>

            {/* Monthly Attendance */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Attendance</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {attendanceSummary.attendancePercentage}%
                  </p>
                  <p className="text-xs text-gray-500 mt-2">{attendanceSummary.month}</p>
                </div>
                <FiCalendar className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Attendance Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Monthly Summary</h3>
                <FiCalendar className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Present</span>
                  <span className="font-semibold text-gray-900">{attendanceSummary.present}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Late</span>
                  <span className="font-semibold text-gray-900">{attendanceSummary.late}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Half Day</span>
                  <span className="font-semibold text-gray-900">{attendanceSummary.halfDay}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Absent</span>
                  <span className="font-semibold text-gray-900">{attendanceSummary.absent}</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 rounded-lg transition">
                View Details →
              </button>
            </div>

            {/* Leave Balance */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Leave Balance</h3>
                <FiAlertCircle className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Total Leaves</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {leaveBalance.totalLeaves} days
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(leaveBalance.usedLeaves / leaveBalance.totalLeaves) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {leaveBalance.usedLeaves} used, {leaveBalance.remainingLeaves} remaining
                  </p>
                </div>
              </div>
              <button className="w-full mt-4 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 rounded-lg transition">
                Apply Leave →
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 font-medium transition text-sm">
                  ✓ Check In
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 font-medium transition text-sm">
                  ✓ Check Out
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition text-sm">
                  → View Attendance
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium transition text-sm">
                  → Apply for Leave
                </button>
              </div>
            </div>
          </div>

          {/* Leave Types Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {leaveBalance.leaveTypes.map((leave, idx) => (
                <div key={idx} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">{leave.type}</p>
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Used</span>
                      <span className="font-semibold text-gray-900">{leave.used}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Remaining</span>
                      <span className="font-semibold text-blue-600">{leave.remaining}</span>
                    </div>
                    <div className="flex justify-between text-xs mt-2">
                      <span className="text-gray-600">Total</span>
                      <span className="font-semibold text-gray-900">{leave.total}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
