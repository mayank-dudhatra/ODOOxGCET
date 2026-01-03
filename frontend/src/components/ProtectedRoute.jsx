import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  // Not authenticated - redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if specific role is required
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
