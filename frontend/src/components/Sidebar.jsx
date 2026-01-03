import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../config/permissions";
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
  const { user, logout, permissions } = useAuth();
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

  // Permission-based menu items (NOT role-based)
  const getMenuItems = () => {
    const baseItems = [{ icon: FiHome, label: "Dashboard", path: getHomePath() }];

    const menuItems = [];

    // Employees section - Admin and HR can see this
    if (hasPermission(user?.role, "viewEmployees")) {
      menuItems.push({
        icon: FiUsers,
        label: "Employees",
        path: user?.role === "admin" ? "/admin/employees" : "/hr/employees",
      });
    }

    // Attendance section - Admin, HR, and Manager can see this
    if (hasPermission(user?.role, "viewAttendance")) {
      menuItems.push({
        icon: FiCalendar,
        label: "Attendance",
        path: 
          user?.role === "admin" ? "/admin/attendance" :
          user?.role === "hr" ? "/hr/attendance" :
          user?.role === "manager" ? "/manager/attendance" :
          "/employee/attendance",
      });
    }

    // Leave/Time Off section - All roles can see this
    if (hasPermission(user?.role, "viewLeaves")) {
      menuItems.push({
        icon: FiClock,
        label: user?.role === "employee" ? "Time Off" : "Time Off",
        path: 
          user?.role === "admin" ? "/admin/time-off" :
          user?.role === "hr" ? "/hr/time-off" :
          user?.role === "manager" ? "/manager/approvals" :
          "/employee/leave",
      });
    }

    // Payroll section - Admin and HR can see this
    if (hasPermission(user?.role, "viewPayroll")) {
      menuItems.push({
        icon: FiDollarSign,
        label: user?.role === "employee" ? "Salary" : "Payroll",
        path: 
          user?.role === "admin" ? "/admin/payroll" :
          user?.role === "hr" ? "/hr/payroll" :
          user?.role === "employee" ? "/employee/salary" :
          "/manager/salary",
      });
    }

    // Salary Management - Admin only
    if (user?.role === "admin" && hasPermission(user?.role, "manageSalaryStructure")) {
      menuItems.push({
        icon: FiDollarSign,
        label: "Salary Management",
        path: "/admin/salary-management",
      });
    }

    // Reports - Admin, HR, and Manager can see this
    if (hasPermission(user?.role, "viewReports")) {
      menuItems.push({
        icon: FiFileText,
        label: "Reports",
        path: 
          user?.role === "admin" ? "/admin/reports" :
          user?.role === "hr" ? "/hr/reports" :
          "/manager/reports",
      });
    }

    // Employee Profile - Employee only
    if (user?.role === "employee") {
      menuItems.push({
        icon: FiUser,
        label: "Profile",
        path: "/employee/profile",
      });
    }

    // Settings - Show based on permissions
    // Employees see their own settings
    if (user?.role === "employee") {
      menuItems.push({
        icon: FiSettings,
        label: "Settings",
        path: "/employee/settings",
      });
    }
    // HR sees HR settings (not full admin settings)
    else if (user?.role === "hr") {
      menuItems.push({
        icon: FiSettings,
        label: "Settings",
        path: "/hr/settings",
      });
    }
    // Admin sees full admin settings
    else if (user?.role === "admin" && hasPermission(user?.role, "manageCompanySettings")) {
      menuItems.push({
        icon: FiSettings,
        label: "Settings",
        path: "/admin/settings",
      });
    }

    return [...baseItems, ...menuItems];
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
