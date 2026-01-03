import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import CompanyRegister from "./pages/auth/CompanyRegister";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

// Employee Routes
import EmployeeDashboard from "./pages/employee/Dashboard";
import EmployeeAttendance from "./pages/employee/Attendance";
import EmployeeLeave from "./pages/employee/Leave";
import EmployeeProfile from "./pages/employee/Profile";

// Admin Routes
import AdminEmployees from "./pages/admin/Employees";
import AdminAttendance from "./pages/admin/Attendance";
import AdminTimeOff from "./pages/admin/TimeOff";
import AdminPayroll from "./pages/admin/Payroll";
import AdminPayslipDetails from "./pages/admin/PayslipDetails";
import AdminSalaryManagement from "./pages/admin/SalaryManagement";
import AdminSalaryDetails from "./pages/admin/SalaryDetails";

import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register-company" element={<CompanyRegister />} />

          {/* Shared Dashboard - Role-Based Access */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/employees"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminEmployees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/time-off"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminTimeOff />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payroll"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPayroll />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payroll/:employeeId/:month/:year"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPayslipDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/salary-management"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminSalaryManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/salary-management/:employeeId"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminSalaryDetails />
              </ProtectedRoute>
            }
          />

          {/* Employee Routes */}
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute requiredRole="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/attendance"
            element={
              <ProtectedRoute requiredRole="employee">
                <EmployeeAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/leave"
            element={
              <ProtectedRoute requiredRole="employee">
                <EmployeeLeave />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/profile"
            element={
              <ProtectedRoute requiredRole="employee">
                <EmployeeProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

