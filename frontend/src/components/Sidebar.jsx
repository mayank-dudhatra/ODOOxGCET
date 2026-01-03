import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiClock,
  FiUser,
  FiFileText,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ sidebarOpen: propSidebarOpen, setSidebarOpen: propSetSidebarOpen }) {
  const [internalSidebarOpen, setInternalSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Use props if provided, otherwise use internal state
  const sidebarOpen = propSidebarOpen !== undefined ? propSidebarOpen : internalSidebarOpen;
  const setSidebarOpen = propSetSidebarOpen || setInternalSidebarOpen;

  const getHomePath = () => {
    if (user?.role === "admin") return "/admin/attendance";
    if (user?.role === "hr") return "/hr/attendance";
    if (user?.role === "employee") return "/employee/dashboard";
    if (user?.role === "manager") return "/manager/team";
    return "/dashboard";
  };

  // Role-based menu items
  const getMenuItems = () => {
    const baseItems = [{ icon: FiHome, label: "Dashboard", path: getHomePath() }];

    if (user?.role === "admin") {
      return [
        ...baseItems,
        { icon: FiUsers, label: "Employees", path: "/admin/employees" },
        { icon: FiCalendar, label: "Attendance", path: "/admin/attendance" },
        { icon: FiClock, label: "Time Off", path: "/admin/time-off" },
        { icon: FiDollarSign, label: "Payroll", path: "/admin/payroll" },
        { icon: FiBarChart2, label: "Salary Management", path: "/admin/salary-management" },
        { icon: FiFileText, label: "Reports", path: "/admin/reports" },
        { icon: FiSettings, label: "Settings", path: "/admin/settings" },
      ];
    }

    if (user?.role === "hr") {
      return [
        ...baseItems,
        { icon: FiUsers, label: "Employees", path: "/hr/employees" },
        { icon: FiCalendar, label: "Attendance", path: "/hr/attendance" },
        { icon: FiClock, label: "Time Off", path: "/hr/time-off" },
        { icon: FiDollarSign, label: "Payroll", path: "/hr/payroll" },
        { icon: FiFileText, label: "Reports", path: "/hr/reports" },
        { icon: FiSettings, label: "Settings", path: "/admin/settings" },
      ];
    }

    if (user?.role === "employee") {
      return [
        ...baseItems,
        { icon: FiCalendar, label: "Attendance", path: "/employee/attendance" },
        { icon: FiClock, label: "Time Off", path: "/employee/leave" },
        { icon: FiDollarSign, label: "Salary", path: "/employee/salary" },
        { icon: FiUser, label: "Profile", path: "/employee/profile" },
        { icon: FiSettings, label: "Settings", path: "/employee/settings" },
      ];
    }

    if (user?.role === "manager") {
      return [
        ...baseItems,
        { icon: FiUsers, label: "My Team", path: "/manager/team" },
        { icon: FiCalendar, label: "Team Attendance", path: "/manager/attendance" },
        { icon: FiClock, label: "Approve Leave", path: "/manager/approvals" },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
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

      {/* User Role Badge */}
      {sidebarOpen && (
        <div className="px-4 py-2 mx-2 bg-blue-50 rounded-lg border border-blue-200 mt-3">
          <p className="text-xs text-gray-600">Role</p>
          <p className="text-sm font-semibold text-blue-600 capitalize">{user?.role}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="mt-6 space-y-2 px-3">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition ${
              isActive(item.path)
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
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
        >
          <FiLogOut className="w-5 h-5" />
          {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute right-0 top-32 -right-3 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700 transition"
      >
        {sidebarOpen ? "◀" : "▶"}
      </button>
    </div>
  );
}
