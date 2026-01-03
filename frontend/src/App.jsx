import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import CompanyRegister from "./pages/auth/CompanyRegister";
import EmployeeDashboard from "./pages/employee/Dashboard";
import Profile from "./pages/employee/Profile";
import Attendance from "./pages/employee/Attendance";
import Leave from "./pages/employee/Leave";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminEmployees from "./pages/admin/Employees";
import AdminAttendance from "./pages/admin/Attendance";
import LeaveApproval from "./pages/admin/LeaveApproval";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-company" element={<CompanyRegister />} />

        {/* Protected Employee Routes */}
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/attendance"
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/leave"
          element={
            <ProtectedRoute>
              <Leave />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees"
          element={
            <ProtectedRoute>
              <AdminEmployees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/attendance"
          element={
            <ProtectedRoute>
              <AdminAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leave-approval"
          element={
            <ProtectedRoute>
              <LeaveApproval />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
