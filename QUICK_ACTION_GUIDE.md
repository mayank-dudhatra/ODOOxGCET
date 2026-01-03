# Quick Action Guide - Complete RBAC Migration

## 🎯 Your Next 5 Steps

### Step 1: Update Employee Dashboard (5 mins)
**File**: `/frontend/src/pages/employee/Dashboard.jsx`

**Find**:
```javascript
import api from "../../services/api";
const [employees, setEmployees] = useState([]);
const [leaves, setLeaves] = useState([]);
const [attendance, setAttendance] = useState([]);

useEffect(() => {
  api.get("/attendance/my").then(...)
  api.get("/leave/my").then(...)
}, []);
```

**Replace With**:
```javascript
import { usePermissions } from "../../hooks/usePermissions";
const { companyData, fetchAttendance, fetchLeaves } = usePermissions();

useEffect(() => {
  fetchAttendance();
  fetchLeaves();
}, [fetchAttendance, fetchLeaves]);

const attendance = companyData.attendance || [];
const leaves = companyData.leaves || [];
```

### Step 2: Update Employees List Page (5 mins)
**File**: `/frontend/src/pages/admin/Employees.jsx`

**Pattern**: Same as above
- Import `usePermissions` instead of `api`
- Use `fetchEmployees()` instead of `api.get()`
- Read from `companyData.employees` instead of local state

### Step 3: Update Attendance Page (5 mins)
**File**: `/frontend/src/pages/admin/Attendance.jsx`

**Pattern**: Same as above

### Step 4: Update Leave Approval Page (5 mins)
**File**: `/frontend/src/pages/admin/LeaveApproval.jsx`

**Pattern**: Same as above

### Step 5: Add Permission Checks (10 mins)
**Files**: Any page with action buttons

**Pattern**:
```javascript
const { canDo } = usePermissions();

// Add permission check before showing buttons
{canDo('deleteEmployee') && (
  <button onClick={handleDelete}>Delete</button>
)}

{canDo('approveLeave') && (
  <button onClick={handleApprove}>Approve</button>
)}
```

---

## 📋 Copy-Paste Templates

### Template 1: Basic Page Update
```javascript
import { usePermissions } from "../../hooks/usePermissions";

export default function MyPage() {
  const { 
    companyData, 
    canDo,
    fetchEmployees,
    updateEmployee,
    deleteEmployee,
  } = usePermissions();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const employees = companyData.employees || [];

  return (
    <div>
      {employees.map(emp => (
        <div key={emp._id}>
          <h3>{emp.name}</h3>
          {canDo('updateEmployee') && <EditBtn />}
          {canDo('deleteEmployee') && <DeleteBtn />}
        </div>
      ))}
    </div>
  );
}
```

### Template 2: Action Button with Permission
```javascript
<button 
  onClick={handleDelete}
  disabled={!canDo('deleteEmployee')}
  className={canDo('deleteEmployee') ? '' : 'opacity-50 cursor-not-allowed'}
>
  Delete
</button>
```

### Template 3: Data Operation
```javascript
const { updateEmployee } = usePermissions();

const handleSave = async (empId, updates) => {
  if (!canDo('updateEmployee')) {
    alert('You do not have permission to update employees');
    return;
  }
  
  try {
    await updateEmployee(empId, updates);
    // Data automatically updates in companyData
  } catch (error) {
    console.error('Failed to update:', error);
  }
};
```

---

## ✅ Testing After Each Change

### Quick Test (30 seconds)
1. Login as Admin
2. Create/update something
3. Switch tab/browser to HR
4. Check if change appears instantly (no refresh)

### Complete Test Scenario
```
1. Open Firefox: HR Login
2. Open Chrome: Admin Login
3. In Admin: Create new employee "Test User"
4. In HR: Check if "Test User" appears instantly
5. In HR: Approve a leave request
6. In Admin: Check if approval shows instantly
7. In Employee: Check if approval shows instantly
```

---

## 🐛 Common Issues & Fixes

### Issue: Permission denied but should have access
**Solution**: Check `PERMISSIONS` config
```javascript
import { PERMISSIONS } from '../config/permissions';
console.log(PERMISSIONS.hr); // Check HR permissions
```

### Issue: Data not updating after operation
**Solution**: Make sure using hook method, not direct API call
```javascript
// WRONG:
await api.put(`/employee/${id}`, data);

// RIGHT:
await updateEmployee(id, data);
```

### Issue: Component not re-rendering after data change
**Solution**: Make sure reading from `companyData`, not local state
```javascript
// WRONG:
const [employees, setEmployees] = useState([]);

// RIGHT:
const { companyData } = usePermissions();
const employees = companyData.employees;
```

### Issue: "Cannot read property of undefined"
**Solution**: Add safety check
```javascript
const employees = companyData.employees || [];
```

### Issue: Import error on usePermissions
**Solution**: Check file path
```javascript
// Correct path from any page:
import { usePermissions } from "../../hooks/usePermissions";
```

---

## 📊 Files Modified So Far

### ✅ COMPLETED
- `/frontend/src/config/permissions.js` - Created PERMISSIONS config
- `/frontend/src/context/AuthContext.jsx` - Updated with permissions + companyData
- `/frontend/src/hooks/usePermissions.js` - Created hook
- `/frontend/src/components/Sidebar.jsx` - Updated to use permissions
- `/frontend/src/pages/admin/Dashboard.jsx` - Partially updated

### ⏳ NEED UPDATE
- `/frontend/src/pages/employee/Dashboard.jsx`
- `/frontend/src/pages/employee/Attendance.jsx`
- `/frontend/src/pages/employee/Leave.jsx`
- `/frontend/src/pages/employee/Salary.jsx`
- `/frontend/src/pages/employee/Profile.jsx`
- `/frontend/src/pages/employee/Settings.jsx`
- `/frontend/src/pages/admin/Employees.jsx`
- `/frontend/src/pages/admin/Attendance.jsx`
- `/frontend/src/pages/admin/LeaveApproval.jsx`
- `/frontend/src/pages/admin/Payroll.jsx`
- `/frontend/src/pages/admin/Reports.jsx`
- `/frontend/src/pages/admin/TimeOff.jsx`

---

## ⏱️ Time Estimate

| Task | Time |
|------|------|
| Update 1 dashboard page | 5 min |
| Update 5 admin pages | 25 min |
| Update 5 employee pages | 25 min |
| Add permission guards | 15 min |
| Full testing | 30 min |
| **Total** | **~1.5-2 hours** |

---

## 🚀 Recommended Completion Order

### Priority 1 (Most Critical)
1. Employee Dashboard - employees rely on this
2. Admin Employees page - HR relies on this
3. Leave Approval page - immediate visibility needed

### Priority 2 (Important)
4. Attendance pages (employee + admin)
5. Salary pages
6. Payroll pages

### Priority 3 (Nice to Have)
7. Reports pages
8. Settings updates
9. Profile updates

---

## 💡 Pro Tips

### Tip 1: Use Find & Replace
Instead of manually editing each file, use VS Code Find & Replace:
1. `Ctrl+H` to open Find & Replace
2. Find: `import api from "../../services/api"`
3. Replace with: `import { usePermissions } from "../../hooks/usePermissions"`

### Tip 2: One Change at a Time
Don't change entire file at once. Change:
1. Import (1 line)
2. useEffect (3-5 lines)
3. State references (a few lines)
4. Test after each change

### Tip 3: Keep Old Code Nearby
Comment out old code first, add new code, test, then delete old code:
```javascript
// OLD CODE (COMMENTED OUT TEMPORARILY)
// const [employees, setEmployees] = useState([]);
// useEffect(() => { api.get(...) }, []);

// NEW CODE
const { companyData, fetchEmployees } = usePermissions();
useEffect(() => { fetchEmployees(); }, [fetchEmployees]);
```

### Tip 4: Test Permission Matrix
Create a test file to verify permissions:
```javascript
import { PERMISSIONS, hasPermission } from './config/permissions';

// Verify permission setup
console.table({
  'Admin Delete': hasPermission('admin', 'deleteEmployee'),
  'HR Delete': hasPermission('hr', 'deleteEmployee'),
  'Employee Create': hasPermission('employee', 'createEmployee'),
});
```

---

## 📞 Troubleshooting Commands

### Verify Permissions Loaded
```javascript
// In browser console
import { PERMISSIONS } from './config/permissions.js';
console.log(PERMISSIONS);
```

### Check Shared Data
```javascript
// In component, use:
const { companyData } = usePermissions();
console.log('Shared employees:', companyData.employees);
console.log('Shared leaves:', companyData.leaves);
```

### Verify Hook Working
```javascript
// In component
const { canDo } = usePermissions();
console.log('Can create employee:', canDo('createEmployee'));
console.log('Can delete employee:', canDo('deleteEmployee'));
```

---

## 🎯 Success Criteria

### When to call it DONE

✅ **All dashboard pages migrated**
- All pages use `usePermissions()` hook
- All pages read from `companyData`
- No more local state for shared data

✅ **Permission checks implemented**
- Buttons show/hide based on `canDo()`
- HR sees different menu than Admin
- Employee can't see admin features

✅ **Instant sync working**
- Admin creates employee → HR sees instantly
- HR approves leave → Employee sees instantly
- No page refresh needed

✅ **All tests passing**
- Each scenario tested manually
- Cross-role data sync verified
- Permission denials working correctly

---

## 📚 Documentation Files Created

1. **RBAC_ARCHITECTURE.md** - Detailed explanation of the system
2. **RBAC_IMPLEMENTATION_CHECKLIST.md** - Step-by-step guide
3. **RBAC_STATUS_REPORT.md** - Current status and next steps
4. **This file** - Quick action guide

---

## 🎬 Ready to Start?

You have everything you need:
- ✅ Permissions system configured
- ✅ Shared data store created
- ✅ Hooks ready to use
- ✅ Template code provided
- ✅ Testing guide included

**Next Action**: Open `/frontend/src/pages/employee/Dashboard.jsx` and follow Template 1 from this guide.

Good luck! 🚀

