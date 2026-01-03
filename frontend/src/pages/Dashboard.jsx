import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
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

export default function Dashboard() {
  const { user } = useAuth();

  // Dummy Data
  const attendanceTrendData = [
    { date: "Mon", present: 45, absent: 5, late: 3 },
    { date: "Tue", present: 48, absent: 2, late: 3 },
    { date: "Wed", present: 42, absent: 6, late: 5 },
    { date: "Thu", present: 50, absent: 2, late: 1 },
    { date: "Fri", present: 48, absent: 3, late: 2 },
    { date: "Sat", present: 15, absent: 38, late: 0 },
    { date: "Sun", present: 8, absent: 45, late: 0 },
  ];

  const departmentData = [
    { name: "Engineering", value: 45, fill: "#3B82F6" },
    { name: "HR", value: 12, fill: "#10B981" },
    { name: "Finance", value: 18, fill: "#F59E0B" },
    { name: "Marketing", value: 22, fill: "#EF4444" },
    { name: "IT", value: 28, fill: "#8B5CF6" },
    { name: "Sales", value: 35, fill: "#EC4899" },
  ];

  const monthlyAttendanceData = [
    { month: "Jan", percentage: 92 },
    { month: "Feb", percentage: 88 },
    { month: "Mar", percentage: 94 },
    { month: "Apr", percentage: 91 },
    { month: "May", percentage: 93 },
    { month: "Jun", percentage: 89 },
  ];

  const leaveStatisticsData = [
    { name: "Approved", value: 125, fill: "#10B981" },
    { name: "Pending", value: 45, fill: "#F59E0B" },
    { name: "Rejected", value: 12, fill: "#EF4444" },
  ];

  // ADMIN DASHBOARD
  const AdminDashboard = () => (
    <>
      {/* Stats Cards - Company Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend (All Employees) */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Attendance Trend (All)</h2>
            <p className="text-sm text-gray-500 mt-1">Last 7 days - Company-wide</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff" }} />
              <Legend />
              <Bar dataKey="present" fill="#10B981" name="Present" radius={[8, 8, 0, 0]} />
              <Bar dataKey="absent" fill="#EF4444" name="Absent" radius={[8, 8, 0, 0]} />
              <Bar dataKey="late" fill="#F59E0B" name="Late" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Department Distribution</h2>
            <p className="text-sm text-gray-500 mt-1">Employee count by department</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={departmentData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} dataKey="value">
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Attendance */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Monthly Attendance</h2>
            <p className="text-sm text-gray-500 mt-1">Last 6 months - All employees</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyAttendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff" }} />
              <Line type="monotone" dataKey="percentage" stroke="#3B82F6" strokeWidth={3} dot={{ fill: "#3B82F6", r: 5 }} activeDot={{ r: 7 }} name="Attendance %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Leave Statistics (All Employees) */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Leave Statistics (All)</h2>
            <p className="text-sm text-gray-500 mt-1">Company-wide leave status</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leaveStatisticsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke="#6B7280" />
              <YAxis dataKey="name" type="category" stroke="#6B7280" width={100} />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff" }} />
              <Bar dataKey="value" fill="#8B5CF6" radius={[0, 8, 8, 0]} name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );

  // HR DASHBOARD
  const HRDashboard = () => (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Total Employees</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">205</p>
          <p className="text-xs text-green-600 mt-2">Active workforce</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Present Today</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">178</p>
          <p className="text-xs text-green-600 mt-2">86.8% attendance</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Pending Leave Requests</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
          <p className="text-xs text-orange-600 mt-2">Awaiting action</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trends (All) */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Attendance Trends (All)</h2>
            <p className="text-sm text-gray-500 mt-1">Last 7 days - All employees</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff" }} />
              <Bar dataKey="present" fill="#10B981" name="Present" radius={[8, 8, 0, 0]} />
              <Bar dataKey="absent" fill="#EF4444" name="Absent" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leave Statistics (All) */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Leave Statistics (All)</h2>
            <p className="text-sm text-gray-500 mt-1">Company-wide leave requests</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leaveStatisticsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff" }} />
              <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Attendance Percentage */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Monthly Attendance</h2>
            <p className="text-sm text-gray-500 mt-1">Last 6 months - All employees</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyAttendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff" }} />
              <Line type="monotone" dataKey="percentage" stroke="#3B82F6" strokeWidth={3} dot={{ fill: "#3B82F6", r: 5 }} name="Attendance %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Department Distribution</h2>
            <p className="text-sm text-gray-500 mt-1">Employee count by department</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={departmentData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} dataKey="value">
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );

  // EMPLOYEE DASHBOARD
  const EmployeeDashboard = () => (
    <>
      {/* Employee Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Total Working Days</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">22</p>
          <p className="text-xs text-gray-600 mt-2">This month</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Days Present</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">20</p>
          <p className="text-xs text-green-600 mt-2">Good attendance</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Attendance Rate</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">91%</p>
          <p className="text-xs text-green-600 mt-2">Above average</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Attendance */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">My Personal Attendance</h2>
            <p className="text-sm text-gray-500 mt-1">Last 6 months</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyAttendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff" }} />
              <Line type="monotone" dataKey="percentage" stroke="#10B981" strokeWidth={3} dot={{ fill: "#10B981", r: 5 }} name="Attendance %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Personal Leave Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">My Personal Leave Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <span className="font-medium text-gray-700 text-sm">Casual Leave</span>
                <p className="text-xs text-gray-500 mt-1">Available / Total</p>
              </div>
              <span className="text-2xl font-bold text-blue-600">8 / 12</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div>
                <span className="font-medium text-gray-700 text-sm">Sick Leave</span>
                <p className="text-xs text-gray-500 mt-1">Available / Total</p>
              </div>
              <span className="text-2xl font-bold text-green-600">4 / 6</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div>
                <span className="font-medium text-gray-700 text-sm">Earned Leave</span>
                <p className="text-xs text-gray-500 mt-1">Available / Total</p>
              </div>
              <span className="text-2xl font-bold text-purple-600">12 / 20</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div>
                <span className="font-medium text-gray-700 text-sm">Pending Requests</span>
                <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
              </div>
              <span className="text-2xl font-bold text-orange-600">2</span>
            </div>
          </div>
        </div>

        {/* Weekly Attendance Pattern */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">My Weekly Pattern</h2>
            <p className="text-sm text-gray-500 mt-1">Last 7 days attendance</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { day: "Mon", hours: 8 },
              { day: "Tue", hours: 9 },
              { day: "Wed", hours: 8 },
              { day: "Thu", hours: 7.5 },
              { day: "Fri", hours: 8 },
              { day: "Sat", hours: 0 },
              { day: "Sun", hours: 0 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff" }} />
              <Bar dataKey="hours" fill="#10B981" radius={[8, 8, 0, 0]} name="Hours Worked" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leave History */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Leave History</h2>
            <p className="text-sm text-gray-500 mt-1">Last 3 months</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Casual Leave</p>
                <p className="text-xs text-gray-500">Dec 20-22, 2025</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Approved
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Sick Leave</p>
                <p className="text-xs text-gray-500">Nov 15, 2025</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Approved
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Earned Leave</p>
                <p className="text-xs text-gray-500">Oct 10-12, 2025</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                Approved
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // MANAGER DASHBOARD
  const ManagerDashboard = () => (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">My Team Attendance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceTrendData.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff" }} />
              <Bar dataKey="present" fill="#10B981" name="Present" radius={[8, 8, 0, 0]} />
              <Bar dataKey="absent" fill="#EF4444" name="Absent" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Team Leave Requests</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leaveStatisticsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff" }} />
              <Bar dataKey="value" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Manager Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Team Members</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Leave Pending</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Team Attendance</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">87%</p>
        </div>
      </div>
    </>
  );

  // Render based on role
  const getDashboardContent = () => {
    switch (user?.role) {
      case "admin":
        return <AdminDashboard />;
      case "hr":
        return <HRDashboard />;
      case "employee":
        return <EmployeeDashboard />;
      case "manager":
        return <ManagerDashboard />;
      default:
        return <EmployeeDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

            {/* User Profile */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-gray-900">{user?.name || "User"}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-8">{getDashboardContent()}</main>
      </div>
    </div>
  );
}
