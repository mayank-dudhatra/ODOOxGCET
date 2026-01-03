import { useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { hasPermission, canActOn } from "../config/permissions";
import api from "../services/api";

/**
 * Custom hook for permission checks and data operations
 * Provides permission-based access and automatically updates shared data
 */
export const usePermissions = () => {
  const { user, permissions, companyData, updateCompanyData, addCompanyData, removeCompanyData, updateCompanyItem } = useAuth();

  /**
   * Check if user has permission for an action
   */
  const canDo = (action) => {
    return hasPermission(user?.role, action);
  };

  /**
   * Check if user can act on a specific data item (for self/team restrictions)
   */
  const canActOnData = (action, targetUserId) => {
    return canActOn(user?.role, action, user?.id, targetUserId);
  };

  /**
   * Fetch employees and update shared company data
   */
  const fetchEmployees = useCallback(async () => {
    try {
      const response = await api.get("/employee/all");
      const employees = response.data.data || [];
      updateCompanyData("employees", employees);
      return employees;
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      return [];
    }
  }, [updateCompanyData]);

  /**
   * Fetch attendance and update shared company data
   */
  const fetchAttendance = useCallback(async (date = null) => {
    try {
      const query = date ? `?date=${date}` : "";
      const response = await api.get(`/attendance/all${query}`);
      const attendance = response.data.attendance || [];
      updateCompanyData("attendance", attendance);
      return attendance;
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
      return [];
    }
  }, [updateCompanyData]);

  /**
   * Fetch leaves and update shared company data
   */
  const fetchLeaves = useCallback(async () => {
    try {
      const response = await api.get("/leave/all");
      const leaves = response.data.leaves || [];
      updateCompanyData("leaves", leaves);
      return leaves;
    } catch (error) {
      console.error("Failed to fetch leaves:", error);
      return [];
    }
  }, [updateCompanyData]);

  /**
   * Create employee and add to shared data
   */
  const createEmployee = async (employeeData) => {
    try {
      const response = await api.post("/employee/create", employeeData);
      if (response.data.data) {
        addCompanyData("employees", response.data.data);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Update employee and update shared data
   */
  const updateEmployee = async (employeeId, updates) => {
    try {
      const response = await api.put(`/employee/${employeeId}`, updates);
      if (response.data) {
        updateCompanyItem("employees", employeeId, response.data);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Delete employee and remove from shared data
   */
  const deleteEmployee = async (employeeId) => {
    try {
      await api.delete(`/employee/${employeeId}`);
      removeCompanyData("employees", employeeId);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Approve leave and update shared data
   */
  const approveLeave = async (leaveId) => {
    try {
      const response = await api.put(`/leave/${leaveId}/approve`);
      if (response.data) {
        updateCompanyItem("leaves", leaveId, { status: "approved" });
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Reject leave and update shared data
   */
  const rejectLeave = async (leaveId) => {
    try {
      const response = await api.put(`/leave/${leaveId}/reject`);
      if (response.data) {
        updateCompanyItem("leaves", leaveId, { status: "rejected" });
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    permissions,
    companyData,
    
    // Permission checks
    canDo,
    canActOnData,
    
    // Data fetching (updates shared state)
    fetchEmployees,
    fetchAttendance,
    fetchLeaves,
    
    // Data operations (updates shared state)
    createEmployee,
    updateEmployee,
    deleteEmployee,
    approveLeave,
    rejectLeave,
  };
};

export default usePermissions;
