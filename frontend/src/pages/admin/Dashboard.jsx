import { useState } from "react";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiClock,
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

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Dummy Data - Attendance Trend (Last 7 days)
  const attendanceTrendData = [
    { date: "Mon", present: 45, absent: 5, late: 3 },
    { date: "Tue", present: 48, absent: 2, late: 3 },
    { date: "Wed", present: 42, absent: 6, late: 5 },
    { date: "Thu", present: 50, absent: 2, late: 1 },
    { date: "Fri", present: 48, absent: 3, late: 2 },
    { date: "Sat", present: 15, absent: 38, late: 0 },
    { date: "Sun", present: 8, absent: 45, late: 0 },
  ];

  // Dummy Data - Department Distribution
  const departmentData = [
    { name: "Engineering", value: 45, fill: "#3B82F6" },
    { name: "HR", value: 12, fill: "#10B981" },
    { name: "Finance", value: 18, fill: "#F59E0B" },
    { name: "Marketing", value: 22, fill: "#EF4444" },
    { name: "IT", value: 28, fill: "#8B5CF6" },
    { name: "Sales", value: 35, fill: "#EC4899" },
  ];

  // Dummy Data - Monthly Attendance
  const monthlyAttendanceData = [
    { month: "Jan", percentage: 92 },
    { month: "Feb", percentage: 88 },
    { month: "Mar", percentage: 94 },
    { month: "Apr", percentage: 91 },
    { month: "May", percentage: 93 },
    { month: "Jun", percentage: 89 },
  ];

  // Dummy Data - Leave Statistics
  const leaveStatisticsData = [
    { name: "Approved", value: 125, fill: "#10B981" },
    { name: "Pending", value: 45, fill: "#F59E0B" },
    { name: "Rejected", value: 12, fill: "#EF4444" },
  ];

  // Navigation items
  const navItems = [
    { icon: FiHome, label: "Dashboard", active: true },
    { icon: FiUsers, label: "Employees", active: false },
    { icon: FiCalendar, label: "Attendance", active: false },
    { icon: FiClock, label: "Time Off", active: false },
    { icon: FiDollarSign, label: "Payroll", active: false },
    { icon: FiBarChart2, label: "Salary Management", active: false },
    { icon: FiBarChart2, label: "Reports", active: false },
    { icon: FiSettings, label: "Admin Settings", active: false },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen bg-white shadow-lg transition-all duration-300 z-40 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            D
          </div>
          {sidebarOpen && (
            <div>
              <p className="font-bold text-gray-900">Dayflow</p>
              <p className="text-xs text-gray-500">HRMS</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-8 space-y-2 px-3">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition ${
                item.active
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-6 left-3 right-3">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition">
            <FiLogOut className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

            {/* User Profile */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 1: Attendance Trend */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">Attendance Trend</h2>
                <p className="text-sm text-gray-500 mt-1">Last 7 days</p>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceTrendData}>
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
                  <Bar dataKey="late" fill="#F59E0B" name="Late" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Card 2: Department Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">Department Distribution</h2>
                <p className="text-sm text-gray-500 mt-1">Employee count by department</p>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
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

            {/* Card 3: Monthly Attendance */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">Monthly Attendance</h2>
                <p className="text-sm text-gray-500 mt-1">Last 6 months</p>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyAttendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="percentage"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6", r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Attendance %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Card 4: Leave Statistics */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">Leave Statistics</h2>
                <p className="text-sm text-gray-500 mt-1">Leave status distribution</p>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={leaveStatisticsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#6B7280" />
                  <YAxis dataKey="name" type="category" stroke="#6B7280" width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="value" fill="#8B5CF6" radius={[0, 8, 8, 0]} name="Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

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
