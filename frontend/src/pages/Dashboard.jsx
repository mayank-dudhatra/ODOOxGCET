import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === "admin") return <Navigate to="/admin/attendance" replace />;
  if (user?.role === "hr") return <Navigate to="/hr/attendance" replace />;
  if (user?.role === "employee") return <Navigate to="/employee/dashboard" replace />;

  return <Navigate to="/login" replace />;
}
