import { useState, useEffect } from "react";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";
import { usePermissions } from "../../hooks/usePermissions";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  
  // Use shared company data from permission system
  const { companyData, fetchEmployees, fetchAttendance, fetchLeaves, canDo } = usePermissions();
  
  // Determine if user is HR or Admin
  const isHR = user?.role === "hr";
  const isAdmin = user?.role === "admin";
  
  const [dashboardStats, setDashboardStats] = useState({
    totalEmployees: 0,
    todayPresent: 0,
    todayAbsent: 0,
    todayLate: 0,
    pendingLeaves: 0,
    attendanceTrendData: [],
    leaveStatisticsData: [
      { name: "Approved", value: 0, fill: "#10B981" },
      { name: "Pending", value: 0, fill: "#F59E0B" },
      { name: "Rejected", value: 0, fill: "#EF4444" },
    ],
    departmentStats: [],
    recentEmployees: [],
  });

  // Load all company data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchEmployees(),
          fetchAttendance(),
          fetchLeaves(),
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };
    loadData();
  }, [fetchEmployees, fetchAttendance, fetchLeaves]);

  // Update dashboard stats when company data changes
  useEffect(() => {
    const employees = companyData.employees || [];
    const todayAttendance = companyData.attendance || [];
    const allLeaves = companyData.leaves || [];

    // Calculate stats
    const todayPresent = todayAttendance.filter(a => a.status === \"present\").length;
    const todayAbsent = todayAttendance.filter(a => a.status === "absent").length;
    const todayLate = todayAttendance.filter(a => a.status === "late").length;

    const approvedLeaves = allLeaves.filter(l => l.status === "approved").length;
    const pendingLeaves = allLeaves.filter(l => l.status === "pending").length;
    const rejectedLeaves = allLeaves.filter(l => l.status === "rejected").length;

    // Calculate department-wise stats
    const deptMap = {};
    employees.forEach(emp => {
      const dept = emp.department || "Other";
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });
    const departmentStats = Object.entries(deptMap).map(([name, count]) => ({ name, count }));

    // Get recent employees (last 5)
    const recentEmployees = employees
      .sort((a, b) => new Date(b.joinDate || 0) - new Date(a.joinDate || 0))
      .slice(0, 5);

    setDashboardStats({
      totalEmployees: employees.length,
      todayPresent,
      todayAbsent,
      todayLate,
      pendingLeaves,
      attendanceTrendData: generateAttendanceTrend(todayAttendance),
      leaveStatisticsData: [
        { name: "Approved", value: approvedLeaves, fill: "#10B981" },
        { name: "Pending", value: pendingLeaves, fill: "#F59E0B" },
        { name: "Rejected", value: rejectedLeaves, fill: "#EF4444" },
      ],
      departmentStats,
      recentEmployees,
    });
    setLoading(false);
  }, [companyData]);

  // Manual refresh function
  const handleRefresh = async () => {
    setLoading(true);
    await Promise.all([
      fetchEmployees(),
      fetchAttendance(),
      fetchLeaves(),
    ]);
    setLoading(false);
  };

  const generateAttendanceTrend = (data) => {
    // Generate simple trend data - in real app, this would come from backend
    return [
      { date: "Mon", present: Math.floor(Math.random() * 50), absent: Math.floor(Math.random() * 10) },
      { date: "Tue", present: Math.floor(Math.random() * 50), absent: Math.floor(Math.random() * 10) },
      { date: "Wed", present: Math.floor(Math.random() * 50), absent: Math.floor(Math.random() * 10) },
      { date: "Thu", present: Math.floor(Math.random() * 50), absent: Math.floor(Math.random() * 10) },
      { date: "Fri", present: Math.floor(Math.random() * 50), absent: Math.floor(Math.random() * 10) },
    ];
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"} overflow-y-auto`}>
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isHR ? "HR Dashboard" : "Admin Dashboard"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {isHR 
                  ? "People Operations - Attendance, Leave & Employee Management" 
                  : "Real-time company statistics and analytics"
                }
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading dashboard data...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Top Stats - HR Shows: Total Employees, Present Today, Absent Today, Pending Leaves */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Employees</p>
                      <p className="text-3xl font-bold text-blue-600 mt-2">{dashboardStats.totalEmployees}</p>
                    </div>
                    <FiUsers className="w-8 h-8 text-blue-600 opacity-20" />
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Present Today</p>
                      <p className="text-3xl font-bold text-green-600 mt-2">{dashboardStats.todayPresent}</p>
                    </div>
                    <FiCheckCircle className="w-8 h-8 text-green-600 opacity-20" />
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Absent Today</p>
                      <p className="text-3xl font-bold text-red-600 mt-2">{dashboardStats.todayAbsent}</p>
                    </div>
                    <FiXCircle className="w-8 h-8 text-red-600 opacity-20" />
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Leave Requests</p>
                      <p className="text-3xl font-bold text-orange-600 mt-2">{dashboardStats.pendingLeaves}</p>
                    </div>
                    <FiClock className="w-8 h-8 text-orange-600 opacity-20" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Attendance Trend */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Attendance Trend</h2>
                    <p className="text-sm text-gray-500 mt-1">Last 5 days</p>
                  </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardStats.attendanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="present" fill="#10B981" name="Present" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="absent" fill="#EF4444" name="Absent" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Card 2: Leave Statistics */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">Leave Statistics</h2>
                <p className="text-sm text-gray-500 mt-1">Leave status distribution</p>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardStats.leaveStatisticsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dashboardStats.leaveStatisticsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
            </>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm text-gray-500 font-medium">Total Employees</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">205</p>
              <p className="text-xs text-green-600 mt-2">↑ 5 this month</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm text-gray-500 font-medium">Present Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">178</p>
              <p className="text-xs text-green-600 mt-2">86.8% attendance</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm text-gray-500 font-medium">On Leave</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
              <p className="text-xs text-yellow-600 mt-2">Approved leaves</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm text-gray-500 font-medium">Pending Approvals</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
              <p className="text-xs text-orange-600 mt-2">Awaiting action</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
