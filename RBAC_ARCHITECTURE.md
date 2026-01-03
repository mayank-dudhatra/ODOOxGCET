# RBAC Architecture Implementation Guide

## Overview

This document explains the new Role-Based Access Control (RBAC) architecture implemented in the HRMS system.

## Architecture Components

### 1. Permission System (`/src/config/permissions.js`)

**Purpose**: Single source of truth for all role-based permissions

**Key Features**:
- Defines permissions for each role (admin, hr, employee, manager)
- Permission types:
  - `true`: Full access
  - `false`: No access
  - `"self"`: Access only to own data
  - `"team"`: Access only to team data

**Usage**:
```javascript
import { hasPermission } from '../config/permissions';

// Check if user can view employees
if (hasPermission(userRole, 'viewEmployees')) {
  // Show employees list
}
```

### 2. Enhanced AuthContext (`/src/context/AuthContext.jsx`)

**Key Changes**:
- Added `permissions` state: Automatically set based on user role
- Added `companyData` state: **SINGLE SOURCE OF TRUTH** for all data
  - `employees`: All employee records
  - `attendance`: All attendance records
  - `leaves`: All leave records
  - `payroll`: All payroll data
  - `departments`: Department information

- New methods for data operations (automatically update shared state):
  - `updateCompanyData(dataType, newData)`: Replace entire data set
  - `addCompanyData(dataType, item)`: Add single item
  - `removeCompanyData(dataType, itemId)`: Remove single item
  - `updateCompanyItem(dataType, itemId, updates)`: Update single item

**Why This Matters**:
- ✅ Admin and HR read/write to the SAME data
- ✅ HR changes appear instantly on Admin dashboard
- ✅ No data duplication or isolation
- ✅ Single source of truth for all roles

### 3. usePermissions Hook (`/src/hooks/usePermissions.js`)

**Purpose**: Centralized access to permissions and data operations

**Key Methods**:
```javascript
const { 
  user,
  permissions,
  companyData,
  
  // Permission checks
  canDo,           // Check if user can perform action
  canActOnData,    // Check if user can act on specific item
  
  // Data operations (auto-update shared state)
  fetchEmployees,
  fetchAttendance,
  fetchLeaves,
  createEmployee,
  updateEmployee,
  approveLeave,
  rejectLeave,
} = usePermissions();
```

**Example Usage**:
```javascript
const { canDo, fetchEmployees, companyData } = usePermissions();

// Use shared company data
const employees = companyData.employees;

// Check permissions
if (canDo('updateEmployee')) {
  // Show edit button
}

// Update data (auto-updates shared state)
await updateEmployee(empId, { name: 'John' });
// All components reading companyData.employees see the change instantly
```

### 4. Permission-Based Sidebar (`/src/components/Sidebar.jsx`)

**Changes**:
- Sidebar items now determined by `hasPermission()` checks, NOT raw role comparisons
- HR doesn't see "Admin Settings"
- Employee doesn't see "Employees" menu
- Menu visibility scales automatically with permissions

**Example**:
```javascript
// Before (raw role check - BAD):
if (user?.role === "admin") {
  return [...admin_items];
}

// After (permission-based - GOOD):
if (hasPermission(user?.role, "viewEmployees")) {
  menuItems.push({ /* Employees menu */ });
}
```

## Data Flow Pattern

### Create Operation
```
1. User clicks "Add Employee"
2. Component calls usePermissions().createEmployee(data)
3. Hook calls API: POST /employee/create
4. On success, hook calls addCompanyData('employees', newEmployee)
5. companyData.employees updates
6. All components reading companyData re-render
7. Both Admin AND HR dashboards see the new employee instantly
```

### Update Operation
```
1. User clicks "Approve Leave"
2. Component calls usePermissions().approveLeave(leaveId)
3. Hook calls API: PUT /leave/:id/approve
4. On success, hook calls updateCompanyItem('leaves', leaveId, { status: 'approved' })
5. companyData.leaves updates
6. All components reading companyData re-render
7. HR and Admin both see the approval instantly
```

### Read Operation
```
1. Component mounts or needs data
2. Component calls usePermissions().fetchEmployees()
3. Hook calls API: GET /employee/all
4. On success, hook calls updateCompanyData('employees', employees)
5. companyData.employees updates
6. Component reads from companyData (not local state)
7. Multiple components can read the same data
```

## Migration Guide for Components

### Old Pattern (DO NOT USE):
```javascript
const [employees, setEmployees] = useState([]);

useEffect(() => {
  api.get('/employee/all').then(res => {
    setEmployees(res.data.data);  // Isolated local state
  });
}, []);
```

### New Pattern (USE THIS):
```javascript
const { companyData, fetchEmployees, canDo } = usePermissions();

useEffect(() => {
  fetchEmployees();  // Updates shared state
}, [fetchEmployees]);

// Read from shared state
const employees = companyData.employees;
```

## Permission Levels

### Admin
- ✅ View/Create/Update/Delete Employees
- ✅ View/Update Attendance
- ✅ View/Approve/Reject Leaves
- ✅ View/Update Payroll
- ✅ Generate Payslips
- ✅ View Reports
- ✅ Manage Company Settings
- ✅ Manage Roles & Permissions
- ✅ Manage Salary Structure

### HR
- ✅ View/Create/Update Employees (❌ Cannot Delete)
- ✅ View/Update Attendance (❌ Cannot Mark)
- ✅ View/Approve/Reject Leaves
- ✅ View Payroll (❌ Cannot Update)
- ✅ Generate Payslips
- ✅ View Reports
- ❌ Manage Company Settings
- ❌ Manage Roles & Permissions
- ❌ Manage Salary Structure

### Employee
- ❌ View Other Employees
- ✅ View Own Attendance (❌ Mark own)
- ✅ View/Apply Own Leaves
- ✅ View Own Payroll
- ❌ Approve Leaves
- ❌ View Company Reports
- ✅ View Personal Dashboard
- ✅ Update Own Profile
- ✅ Update Own Settings

### Manager
- ✅ View/Update Team Employees (❌ Cannot Create/Delete)
- ✅ View/Update Team Attendance
- ✅ View/Approve/Reject Team Leaves
- ✅ View Team Payroll (❌ Cannot Update)
- ❌ Generate Payslips
- ✅ View Team Reports
- ❌ Manage Company Settings

## Key Benefits

✅ **Single Source of Truth**: All roles read/write to same `companyData`
✅ **Instant Updates**: No reload needed, all dashboards update automatically
✅ **Clear Separation**: Permissions clearly separate Admin from HR from Employee
✅ **Scalable**: Easy to add new roles or permissions
✅ **Type-Safe**: All permission checks use constants, not string comparisons
✅ **Maintainable**: No scattered role checks throughout codebase

## Converting Existing Components

### Step 1: Import hook
```javascript
import usePermissions from '../hooks/usePermissions';
```

### Step 2: Use in component
```javascript
const { companyData, canDo, fetchEmployees } = usePermissions();
```

### Step 3: Use shared data
```javascript
useEffect(() => {
  fetchEmployees();
}, [fetchEmployees]);

// Use shared data instead of local state
const employees = companyData.employees;
```

### Step 4: Check permissions
```javascript
{canDo('updateEmployee') && <EditButton />}
{canDo('deleteEmployee') && <DeleteButton />}
```

## Testing Permissions

To test permissions:

1. **Admin Login**: Should see all menu items
2. **HR Login**: Should NOT see "Admin Settings"
3. **Employee Login**: Should only see personal data
4. **HR Creates Employee**: Should appear on Admin dashboard instantly
5. **Admin Approves Leave**: Should appear on HR dashboard instantly

## Troubleshooting

### Permission Denied Error
```javascript
// Check if permission exists
if (!canDo('updateEmployee')) {
  // Handle permission denied
  return <AccessDenied />;
}
```

### Data Not Updating
```javascript
// Make sure you're using the hook's methods
// DO THIS:
await updateEmployee(id, data);  // Updates companyData

// NOT THIS:
await api.put(`/employee/${id}`, data);  // Only calls API, doesn't update state
```

### Stale Data
```javascript
// Always call fetch on component mount
useEffect(() => {
  fetchEmployees();
}, [fetchEmployees]);

// Don't mix local state with shared state
// Use: companyData.employees
// Not: [employees, setEmployees] = useState([])
```
