import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { FiClock, FiCheck, FiX, FiCalendar } from "react-icons/fi";
import {
  getTodayAttendance,
  getMonthlyAttendance,
  getAttendanceSummary,
} from "../../services/dummyData";

export default function Attendance() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState("month"); // month or day
  const [currentDate] = useState(new Date());

  const todayAttendance = getTodayAttendance();
  const monthlyAttendance = getMonthlyAttendance();
  const attendanceSummary = getAttendanceSummary();

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800";
      case "Absent":
        return "bg-red-100 text-red-800";
      case "Late":
        return "bg-orange-100 text-orange-800";
      case "Half Day":
        return "bg-yellow-100 text-yellow-800";
      case "Weekend":
        return "bg-gray-100 text-gray-500";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Present":
        return <FiCheck className="w-4 h-4" />;
      case "Absent":
        return <FiX className="w-4 h-4" />;
      case "Late":
        return <FiClock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getDayNumber = (dateString) => {
    return new Date(dateString).getDate();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-30">
          <div className="px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
            <p className="text-sm text-gray-500 mt-1">Track your attendance records</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Today's Attendance Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Attendance</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-medium text-gray-600 mb-1">Status</p>
                <p className="text-2xl font-bold text-blue-600">{todayAttendance.status}</p>
                <p className="text-xs text-gray-500 mt-2">{todayAttendance.date}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-xs font-medium text-gray-600 mb-1">Check-In</p>
                <p className="text-2xl font-bold text-green-600">{todayAttendance.checkInTime}</p>
                <p className="text-xs text-gray-500 mt-2">On time</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <p className="text-xs font-medium text-gray-600 mb-1">Check-Out</p>
                <p className="text-2xl font-bold text-orange-600">
                  {todayAttendance.checkOutTime || "—"}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {todayAttendance.checkOutTime ? "Completed" : "In progress"}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <p className="text-xs font-medium text-gray-600 mb-1">Working Hours</p>
                <p className="text-2xl font-bold text-purple-600">
                  {todayAttendance.workingHours}
                </p>
                <p className="text-xs text-gray-500 mt-2">For today</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-3">
              <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2">
                <FiCheck className="w-5 h-5" />
                Mark In
              </button>
              <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2">
                <FiX className="w-5 h-5" />
                Mark Out
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-gray-600 text-sm font-medium">{attendanceSummary.month}</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {attendanceSummary.present}
              </p>
              <p className="text-xs text-gray-500 mt-1">Present</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-gray-600 text-sm font-medium">This Month</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {attendanceSummary.late}
              </p>
              <p className="text-xs text-gray-500 mt-1">Late</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-gray-600 text-sm font-medium">This Month</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {attendanceSummary.halfDay}
              </p>
              <p className="text-xs text-gray-500 mt-1">Half Days</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-gray-600 text-sm font-medium">Attendance %</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {attendanceSummary.attendancePercentage}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Overall</p>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">My Attendance Records</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("month")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    viewMode === "month"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setViewMode("day")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    viewMode === "day"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Day
                </button>
              </div>
            </div>

            {/* Month Calendar View */}
            {viewMode === "month" && (
              <div className="overflow-x-auto">
                <div className="grid grid-cols-7 gap-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center font-semibold text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                  {monthlyAttendance.map((record, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border-2 text-center transition hover:shadow-md ${
                        record.status === "Weekend"
                          ? "bg-gray-50 border-gray-100"
                          : `${getStatusBadgeColor(record.status)} border-transparent`
                      }`}
                    >
                      <p className="text-sm font-semibold">{record.day}</p>
                      {record.status !== "Weekend" && (
                        <p className="text-xs mt-1 flex items-center justify-center gap-1">
                          {getStatusIcon(record.status)} {record.status}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Day List View */}
            {viewMode === "day" && (
              <div className="space-y-2">
                {monthlyAttendance
                  .filter((r) => r.status !== "Weekend")
                  .map((record, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-4 rounded-lg border ${getStatusBadgeColor(
                        record.status
                      )}`}
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-semibold text-sm">
                            {record.dayName}, {record.day}{" "}
                            {currentDate.toLocaleString("default", { month: "short" })}
                          </p>
                          <p className="text-xs opacity-75 mt-1">
                            {record.checkInTime && record.checkOutTime
                              ? `${record.checkInTime} - ${record.checkOutTime}`
                              : "No check times"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <span className="text-sm font-semibold">{record.status}</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Legend</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Present</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Absent</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Late</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Half Day</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
