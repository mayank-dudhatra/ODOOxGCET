/**
 * RBAC Permission System
 * Single source of truth for role-based permissions
 * All permission checks should use this, NOT raw role comparisons
 */

export const PERMISSIONS = {
  admin: {
    // Employee Management
    viewEmployees: true,
    createEmployee: true,
    updateEmployee: true,
    deleteEmployee: true,
    
    // Attendance Management
    viewAttendance: true,
    markAttendance: true,
    updateAttendance: true,
    
    // Leave Management
    viewLeaves: true,
    approveLeave: true,
    rejectLeave: true,
    
    // Payroll Management
    viewPayroll: true,
    updatePayroll: true,
    generatePayslip: true,
    
    // Reports & Analytics
    viewReports: true,
    viewDashboard: true,
    
    // Company Settings
    manageCompanySettings: true,
    manageRoles: true,
    managePermissions: true,
    manageSalaryStructure: true,
  },

  hr: {
    // Employee Management
    viewEmployees: true,
    createEmployee: true,
    updateEmployee: true,
    deleteEmployee: false,
    
    // Attendance Management
    viewAttendance: true,
    markAttendance: false,
    updateAttendance: true,
    
    // Leave Management
    viewLeaves: true,
    approveLeave: true,
    rejectLeave: true,
    
    // Payroll Management
    viewPayroll: true,
    updatePayroll: false,
    generatePayslip: true,
    
    // Reports & Analytics
    viewReports: true,
    viewDashboard: true,
    
    // Company Settings
    manageCompanySettings: false,
    manageRoles: false,
    managePermissions: false,
    manageSalaryStructure: false,
  },

  employee: {
    // Employee Management
    viewEmployees: false,
    createEmployee: false,
    updateEmployee: false,
    deleteEmployee: false,
    
    // Attendance Management
    viewAttendance: "self",
    markAttendance: "self",
    updateAttendance: false,
    
    // Leave Management
    viewLeaves: "self",
    approveLeave: false,
    rejectLeave: false,
    
    // Payroll Management
    viewPayroll: "self",
    updatePayroll: false,
    generatePayslip: false,
    
    // Reports & Analytics
    viewReports: false,
    viewDashboard: true,
    
    // Company Settings
    manageCompanySettings: false,
    manageRoles: false,
    managePermissions: false,
    manageSalaryStructure: false,
  },

  manager: {
    // Employee Management
    viewEmployees: "team",
    createEmployee: false,
    updateEmployee: "team",
    deleteEmployee: false,
    
    // Attendance Management
    viewAttendance: "team",
    markAttendance: false,
    updateAttendance: "team",
    
    // Leave Management
    viewLeaves: "team",
    approveLeave: "team",
    rejectLeave: "team",
    
    // Payroll Management
    viewPayroll: "team",
    updatePayroll: false,
    generatePayslip: false,
    
    // Reports & Analytics
    viewReports: "team",
    viewDashboard: true,
    
    // Company Settings
    manageCompanySettings: false,
    manageRoles: false,
    managePermissions: false,
    manageSalaryStructure: false,
  },
};

/**
 * Get permissions for a specific role
 * @param {string} role - User role (admin, hr, employee, manager)
 * @returns {object} Permission object for the role
 */
export const getPermissions = (role) => {
  return PERMISSIONS[role] || PERMISSIONS.employee;
};

/**
 * Check if user has permission for an action
 * @param {string} role - User role
 * @param {string} action - Permission action
 * @param {string} context - Optional context (self, team, all)
 * @returns {boolean}
 */
export const hasPermission = (role, action, context = null) => {
  const permissions = getPermissions(role);
  const permission = permissions[action];

  if (typeof permission === "boolean") {
    return permission;
  }

  // "self" or "team" permissions require context matching
  if (typeof permission === "string") {
    return permission === context;
  }

  return false;
};

/**
 * Check if user can perform action on data
 * @param {string} role - User role
 * @param {string} action - Permission action
 * @param {string} userId - Current user ID
 * @param {string} targetUserId - Target user ID
 * @returns {boolean}
 */
export const canActOn = (role, action, userId, targetUserId) => {
  const permissions = getPermissions(role);
  const permission = permissions[action];

  if (permission === true) return true;
  if (permission === false) return false;
  
  // "self" - only own data
  if (permission === "self") {
    return userId === targetUserId;
  }

  return false;
};
