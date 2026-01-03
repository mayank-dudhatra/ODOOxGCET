import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePermissions } from "../../hooks/usePermissions";
import Sidebar from "../../components/Sidebar";
import { FiClock, FiCheckCircle, FiCalendar, FiAlertCircle, FiTrendingUp, FiXCircle } from "react-icons/fi";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { companyData, fetchAttendance, fetchLeaves } = usePermissions();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    todayAttendance: {
      status: "—",
      date: new Date().toISOString().split("T")[0],
      checkInTime: null,
      checkOutTime: null,
      workingHours: "—",
    },
    attendanceStats: {
      present: 0,
      late: 0,
      absent: 0,
      halfDay: 0,
      attendancePercentage: 0,
      month: new Date().toLocaleString("default", { month: "long" }),
    },
    leaveBalance: {
      pending: 0,
      totalTaken: 0,
      sick: { total: 10, taken: 0, remaining: 10 },
      casual: { total: 12, taken: 0, remaining: 12 },
      earned: { total: 15, taken: 0, remaining: 15 },
    },
    recentAttendance: [],
    recentLeaves: [],
  });

  // Fetch data using shared store
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchAttendance(),
        fetchLeaves()
      ]);
      setLoading(false);
    };
    loadData();
  }, [fetchAttendance, fetchLeaves]);

  // Calculate dashboard data from shared companyData
  useEffect(() => {
    // Always calculate, even with empty data
    const myAttendance = companyData.attendance.filter(a => a.userId === user?._id || a.user?._id === user?._id);
    const myLeaves = companyData.leaves.filter(l => l.userId === user?._id || l.user?._id === user?._id);
    
    // Process today's attendance
    const today = new Date().toISOString().split("T")[0];
    const todayRecord = myAttendance.find(a => a.date?.split("T")[0] === today);
    
    // Calculate attendance statistics
    const present = myAttendance.filter(a => a.status === "present").length;
    const late = myAttendance.filter(a => a.status === "late").length;
    const absent = myAttendance.filter(a => a.status === "absent").length;
    const halfDay = myAttendance.filter(a => a.status === "half-day").length;
    const attendancePercentage = myAttendance.length > 0 ? ((present + late) / myAttendance.length * 100).toFixed(1) : 0;
    
    // Calculate leave balance
    const approvedLeaves = myLeaves.filter(l => l.status === "approved");
    const pendingLeaves = myLeaves.filter(l => l.status === "pending");
    const totalTaken = approvedLeaves.reduce((sum, l) => sum + (l.days || 1), 0);
    
    setDashboardData({
      todayAttendance: todayRecord || {
        status: "Not Marked",
        date: today,
        checkInTime: null,
        checkOutTime: null,
        workingHours: "—",
      },
      attendanceStats: {
        present,
        late,
        absent,
        halfDay,
        attendancePercentage,
        month: new Date().toLocaleString("default", { month: "long" }),
      },
      leaveBalance: {
        totalLeaves: 18,
        usedLeaves: totalTaken,
        remainingLeaves: 18 - totalTaken,
        pending: pendingLeaves.length,
        leaveTypes: [
          { type: "Sick Leave", total: 5, used: Math.min(totalTaken, 5), remaining: Math.max(5 - totalTaken, 0) },
          { type: "Casual Leave", total: 8, used: Math.min(Math.max(totalTaken - 5, 0), 8), remaining: Math.max(8 - Math.max(totalTaken - 5, 0), 0) },
          { type: "Earned Leave", total: 5, used: Math.max(totalTaken - 13, 0), remaining: Math.max(5 - Math.max(totalTaken - 13, 0), 0) },
        ],
      },
      recentAttendance: myAttendance.slice(0, 7),
      recentLeaves: myLeaves.slice(0, 5),
    });
  }, [companyData, user]);

  // Refresh function for manual data reload
  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all([
      fetchAttendance(),
      fetchLeaves()
    ]);
    setLoading(false);
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    switch (statusLower) {
      case "present":
        return "bg-green-50 border-green-200 text-green-700";
      case "absent":
        return "bg-red-50 border-red-200 text-red-700";
      case "late":
        return "bg-orange-50 border-orange-200 text-orange-700";
      case "half-day":
      case "half day":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getLeaveStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"} overflow-y-auto`}>
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-30">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
              </div>
              <button
                onClick={handleRefresh}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Top Stats Row - 4 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* My Attendance Rate */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">My Attendance Rate</p>
                  <p className="text-4xl font-bold text-blue-600 mt-2">
                    {dashboardData.attendanceStats.attendancePercentage}%
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    <span className="text-green-600">↑ +5%</span> from last month
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Last 7 days</p>
                </div>
                <FiTrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            {/* Present Today */}
            <div
              className={`rounded-xl border-2 p-6 transition hover:shadow-lg ${getStatusColor(
                dashboardData.todayAttendance.status
              )}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium opacity-75">Present Today</p>
                  <p className="text-4xl font-bold mt-2">
                    {dashboardData.todayAttendance.checkInTime ? "1" : "0"}
                  </p>
                  <p className="text-xs opacity-75 mt-2">
                    {dashboardData.todayAttendance.checkInTime 
                      ? `+5% from last month` 
                      : "Not checked in"}
                  </p>
                  <p className="text-xs opacity-60 mt-1">
                    {dashboardData.todayAttendance.status}
                  </p>
                </div>
                {dashboardData.todayAttendance.checkInTime ? (
                  <FiCheckCircle className="w-8 h-8 opacity-50" />
                ) : (
                  <FiXCircle className="w-8 h-8 opacity-50" />
                )}
              </div>
            </div>

            {/* Pending Leaves */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Leaves</p>
                  <p className="text-4xl font-bold text-orange-600 mt-2">
                    {dashboardData.recentLeaves.filter(l => l.status === "Pending").length}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    <span className="text-orange-600">Awaiting</span> approval
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Requests pending</p>
                </div>
                <FiAlertCircle className="w-8 h-8 text-orange-500" />
              </div>
            </div>

            {/* Remaining Leaves */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Remaining Leaves</p>
                  <p className="text-4xl font-bold text-purple-600 mt-2">
                    {dashboardData.leaveBalance.remainingLeaves || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Out of {dashboardData.leaveBalance.totalLeaves || 18}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Available to use</p>
                </div>
                <FiCalendar className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* My Attendance Trend - Bar Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">My Attendance Trend</h2>
              <p className="text-sm text-gray-500 mb-4">Last 7 days</p>
              
              <div className="h-64 flex items-end justify-between gap-2">
                {dashboardData.recentAttendance && dashboardData.recentAttendance.length > 0 ? (
                  dashboardData.recentAttendance.slice(0, 7).map((record, idx) => {
                    const height = record.status === "present" || record.status === "late" ? 100 : 40;
                    const color = record.status === "present" 
                      ? "bg-green-500" 
                      : record.status === "late" 
                      ? "bg-orange-500" 
                      : record.status === "absent"
                      ? "bg-red-500"
                      : "bg-yellow-500";
                    
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center">
                        <div 
                          className={`w-full ${color} rounded-t-lg transition-all hover:opacity-80`}
                          style={{ height: `${height}%` }}
                          title={`${record.status} - ${record.date}`}
                        ></div>
                        <p className="text-xs text-gray-500 mt-2">{new Date(record.date).getDate()}</p>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full flex items-center justify-center text-gray-400">
                    <p>No attendance data available</p>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-center gap-4 mt-6 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-600">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-gray-600">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span className="text-gray-600">Late</span>
                </div>
              </div>
            </div>

            {/* Attendance Rate - Pie Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance Rate</h2>
              <p className="text-sm text-gray-500 mb-4">Last 7 days performance</p>
              
              <div className="flex items-center justify-center h-64">
                <div className="relative">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#fee2e2"
                      strokeWidth="32"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#ef4444"
                      strokeWidth="32"
                      fill="none"
                      strokeDasharray={`${(dashboardData.attendanceStats.attendancePercentage / 100) * 502.4} 502.4`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-4xl font-bold text-gray-900">
                      {dashboardData.attendanceStats.attendancePercentage}%
                    </p>
                    <p className="text-sm text-gray-500">Attendance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Monthly Attendance & Leave Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* My Monthly Attendance */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">My Monthly Attendance</h2>
              
              <div className="space-y-3">
                {dashboardData.recentAttendance && dashboardData.recentAttendance.length > 0 ? (
                  dashboardData.recentAttendance.slice(0, 10).map((record, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            {new Date(record.date).getDate()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(record.date).toLocaleDateString("en-US", { weekday: "short" })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 capitalize">{record.status}</p>
                          <p className="text-xs text-gray-500">
                            {record.checkIn ? `${record.checkIn} - ${record.checkOut || "—"}` : "No record"}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>No attendance records found</p>
                  </div>
                )}
              </div>
            </div>

            {/* My Leave Status */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">My Leave Status</h2>
              
              {/* Leave Balance Summary */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {dashboardData.leaveBalance.leaveTypes && dashboardData.leaveBalance.leaveTypes.map((leaveType, idx) => (
                  <div key={idx} className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600 mb-1">{leaveType.type}</p>
                    <p className="text-xl font-bold text-blue-600">
                      {leaveType.remaining}
                    </p>
                    <p className="text-xs text-gray-500">remaining</p>
                  </div>
                ))}
              </div>

              {/* Recent Leave Requests */}
              <div className="space-y-3">
                {dashboardData.recentLeaves.length > 0 ? (
                  dashboardData.recentLeaves.map((leave) => (
                    <div
                      key={leave._id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">{leave.leaveType} Leave</p>
                        <p className="text-xs text-gray-500">
                          {leave.startDate} to {leave.endDate} ({leave.days} days)
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getLeaveStatusColor(
                          leave.status
                        )}`}
                      >
                        {leave.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 text-sm py-8">No leave requests yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Login Success Message */}
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
            <FiCheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-700 font-medium">Login successful!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
