# RBAC Implementation Checklist

## Phase 1: Architecture Setup ✅ COMPLETED

### Core Files Created
- [x] `/frontend/src/config/permissions.js` - PERMISSIONS object with 4 roles (admin, hr, employee, manager)
- [x] `/frontend/src/context/AuthContext.jsx` - Updated with permissions state + global companyData store
- [x] `/frontend/src/hooks/usePermissions.js` - Hook for permission checks and data operations

### Backend Routes Added
- [x] `GET /api/employee/profile` - Fetch user profile
- [x] `PUT /api/employee/profile` - Update user profile

### Key Architecture Decisions Implemented
- [x] Permissions separated from roles (roles determine permissions)
- [x] Single global `companyData` store (not role-specific data isolation)
- [x] All role updates target same data object
- [x] Permission checks use constants, not string comparisons

---

## Phase 2: Component Migration (IN PROGRESS)

### Sidebar Component
- [x] Update to use `hasPermission()` instead of role checks
- [ ] Test menu visibility for each role

**Next Steps**:
1. Verify Sidebar correctly shows/hides menu items based on permissions
2. Test Admin sees "Admin Settings", HR doesn't
3. Test HR sees "Employees", Employee doesn't

### Dashboard Pages

#### Admin Dashboard
**Status**: ⏳ Needs Migration
**Current**: Uses local state with API calls
**Required Changes**:
```javascript
// Replace this:
const [employees, setEmployees] = useState([]);
useEffect(() => api.get('/employee/all').then(res => setEmployees(res.data.data)), []);

// With this:
const { companyData, fetchEmployees } = usePermissions();
useEffect(() => { fetchEmployees(); }, [fetchEmployees]);
const employees = companyData.employees;
```

**Affected Components**:
- `admin/Dashboard.jsx` - Employee stats, attendance, leaves
- `admin/Employees.jsx` - Employee list and management
- `admin/Attendance.jsx` - Attendance records
- `admin/LeaveApproval.jsx` - Leave approvals
- `admin/Payroll.jsx` - Payroll data

#### Employee Dashboard
**Status**: ⏳ Needs Migration
**Current**: Uses local state with API calls
**Required Changes**: Same as Admin Dashboard

**Affected Components**:
- `employee/Dashboard.jsx` - Personal attendance and leaves
- `employee/Attendance.jsx` - Mark attendance
- `employee/Leave.jsx` - Leave management
- `employee/Salary.jsx` - Payroll view
- `employee/Profile.jsx` - Profile management
- `employee/Settings.jsx` - User settings

### Profile & Settings Pages
**Status**: ✅ Already API-driven
**Note**: Should migrate to use `updateCompanyItem()` for consistency

---

## Phase 3: Data Operation Integration

### Create Operations
- [ ] Employees creation updates shared `companyData.employees`
- [ ] All roles see new employee instantly

### Update Operations
- [ ] Employee update updates shared `companyData.employees`
- [ ] Attendance update updates shared `companyData.attendance`
- [ ] Leave update updates shared `companyData.leaves`

### Delete Operations
- [ ] Employee delete removes from shared `companyData.employees`
- [ ] Verify HR cannot delete (permission denied)

### Approval Operations
- [ ] Leave approval updates shared `companyData.leaves`
- [ ] HR approval visible to Admin instantly
- [ ] Admin approval visible to HR instantly

---

## Phase 4: Permission Guards

### Component-Level Guards
- [ ] Hide delete button if `!canDo('deleteEmployee')`
- [ ] Hide admin settings if `!canDo('manageCompanySettings')`
- [ ] Hide salary management if `!canDo('manageSalaryStructure')`

### Feature-Level Guards
- [ ] Attendance marking limited by `canDo('markAttendance')`
- [ ] Leave approval limited by `canDo('approveLeave')`
- [ ] Employee creation limited by `canDo('createEmployee')`

---

## Phase 5: Testing & Validation

### Scenario 1: Admin Creates Employee
- [ ] Admin clicks "Add Employee"
- [ ] Form submission calls API and updates `companyData.employees`
- [ ] HR dashboard immediately shows new employee
- [ ] Employee dashboard shows new employee in their department

### Scenario 2: HR Approves Leave
- [ ] HR views leave approval page
- [ ] HR clicks "Approve"
- [ ] API updates leave status
- [ ] Hook updates `companyData.leaves`
- [ ] Employee dashboard immediately shows "Approved"
- [ ] Admin dashboard immediately shows "Approved"

### Scenario 3: Employee Marks Attendance
- [ ] Employee marks attendance (if permission allowed)
- [ ] API records attendance
- [ ] Hook updates `companyData.attendance`
- [ ] Admin dashboard immediately shows marked attendance
- [ ] HR dashboard immediately shows marked attendance

### Scenario 4: HR Cannot Delete Employee
- [ ] HR tries to delete employee
- [ ] Permission check: `canDo('deleteEmployee')` returns false
- [ ] Delete button disabled or hidden
- [ ] If somehow API called, backend rejects (double-check)

### Scenario 5: Employee Cannot View All Employees
- [ ] Employee login
- [ ] "Employees" menu item hidden (no permission)
- [ ] If somehow navigates to `/employees`, access denied
- [ ] Dashboard only shows personal data

---

## Migration Pattern Template

Use this template when converting any component:

```javascript
import { usePermissions } from '../hooks/usePermissions';

export const MyComponent = () => {
  // 1. Get permissions and data methods
  const { 
    companyData, 
    canDo, 
    fetchEmployees,
    updateEmployee,
    deleteEmployee,
  } = usePermissions();

  // 2. Load data on mount
  useEffect(() => {
    if (canDo('viewEmployees')) {
      fetchEmployees();
    }
  }, [canDo, fetchEmployees]);

  // 3. Use shared data
  const employees = companyData.employees || [];

  // 4. Check permissions before showing features
  const canEdit = canDo('updateEmployee');
  const canDelete = canDo('deleteEmployee');

  // 5. Use hook methods for data operations
  const handleUpdate = async (id, data) => {
    await updateEmployee(id, data);
    // companyData automatically updates, re-render happens
  };

  return (
    <div>
      {employees.map(emp => (
        <div key={emp._id}>
          <h3>{emp.name}</h3>
          {canEdit && <EditButton />}
          {canDelete && <DeleteButton />}
        </div>
      ))}
    </div>
  );
};
```

---

## File Changes Summary

### Modified Files
- `/frontend/src/context/AuthContext.jsx` - Added permissions + companyData
- `/frontend/src/components/Sidebar.jsx` - Permission-based menu visibility

### New Files
- `/frontend/src/config/permissions.js` - RBAC definitions
- `/frontend/src/hooks/usePermissions.js` - Permission and data hook

### To Be Modified (Next Phase)
- `/frontend/src/pages/admin/Dashboard.jsx`
- `/frontend/src/pages/admin/Employees.jsx`
- `/frontend/src/pages/admin/Attendance.jsx`
- `/frontend/src/pages/admin/LeaveApproval.jsx`
- `/frontend/src/pages/employee/Dashboard.jsx`
- `/frontend/src/pages/employee/Attendance.jsx`
- `/frontend/src/pages/employee/Leave.jsx`
- `/frontend/src/pages/employee/Profile.jsx`
- `/frontend/src/pages/employee/Settings.jsx`
- `/frontend/src/pages/employee/Salary.jsx`

---

## Validation Tests

### Permission Tests
```bash
# Test 1: Admin sees all menu items
# Test 2: HR sees employee management but not admin settings
# Test 3: Employee sees only personal menu items
# Test 4: Permission denied on unauthorized API calls
```

### Data Flow Tests
```bash
# Test 1: Admin creates employee → HR sees it instantly
# Test 2: HR approves leave → Employee sees it instantly
# Test 3: Employee marks attendance → Admin sees it instantly
# Test 4: Updates reflected without page reload
# Test 5: No duplicate data between roles
```

### Error Handling Tests
```bash
# Test 1: API error handling (network error)
# Test 2: Permission denied handling
# Test 3: Invalid data handling
# Test 4: Concurrent updates handling
```

---

## Quick Reference: Permission Actions

### Employee Management
- `viewEmployees` - See employee list
- `createEmployee` - Add new employee
- `updateEmployee` - Edit employee data
- `deleteEmployee` - Remove employee

### Attendance
- `viewAttendance` - See attendance records
- `markAttendance` - Mark own/others attendance
- `updateAttendance` - Edit attendance records

### Leave Management
- `viewLeaves` - See leave records
- `approveLeave` - Approve/reject leaves
- `rejectLeave` - Reject leaves (sometimes separate)

### Payroll
- `viewPayroll` - See payroll data
- `updatePayroll` - Edit payroll
- `generatePayslip` - Create payslips

### Admin
- `manageCompanySettings` - Edit company settings
- `manageRoles` - Manage user roles
- `managePermissions` - Edit permissions
- `manageSalaryStructure` - Edit salary structure

### Analytics
- `viewReports` - Generate reports
- `viewDashboard` - View dashboard

---

## Expected Outcomes After Implementation

✅ **HR can log in and see HR dashboard**
✅ **HR can view and manage employees (but not delete)**
✅ **HR can approve/reject leaves**
✅ **HR updates appear on Admin dashboard instantly**
✅ **Admin updates appear on HR dashboard instantly**
✅ **No page reload needed for data sync**
✅ **Employee can only see personal data**
✅ **All data reads from single `companyData` store**
✅ **Menu items shown based on permissions, not roles**
✅ **Permission system easily extensible for new roles**

---

## Current Status Summary

**Phase 1 (Architecture)**: ✅ 100% Complete
- Permissions config created
- AuthContext updated with permissions + companyData
- usePermissions hook created
- Backend routes in place

**Phase 2 (Component Migration)**: 🔄 5% Complete
- Sidebar updated
- Remaining: Admin/Employee dashboard pages

**Phase 3 (Data Operations)**: ⏳ 0% Complete
- Hook methods created but need component integration

**Phase 4 (Permission Guards)**: ⏳ 0% Complete
- Structure ready, need component implementation

**Phase 5 (Testing)**: ⏳ 0% Complete
- Ready for manual testing once phases 1-4 complete

**OVERALL PROGRESS**: 🔄 ~15-20% Complete
**NEXT IMMEDIATE ACTION**: Migrate Admin and Employee Dashboard pages to use shared companyData

