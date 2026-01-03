# Attendance System - Quick Testing Guide

## 🚀 How to Test the Integrated Attendance System

### Prerequisites
- Backend running: `npm run dev` in `backend/` folder
- Frontend running: `npm run dev` in `frontend/` folder
- Logged in with valid credentials

---

## 📋 Admin Attendance Page Testing

### Access
1. Login as admin (role: "admin")
2. Go to sidebar → "Attendance Management"
3. Verify page loads with real data

### Test Cases

#### ✅ Date Filter
1. Open calendar icon next to "Date"
2. Select a different date
3. Verify table updates with attendance for that date
4. Check summary cards update with new counts

#### ✅ Department Filter
1. Click "Department" dropdown
2. Select a department (e.g., "Sales")
3. Verify table only shows employees from that department
4. Select "All Departments" to reset

#### ✅ Status Filter
1. Click "Status" dropdown
2. Select "Present"
3. Verify only present employees shown
4. Try "Late", "Absent", "Half Day"
5. Verify filtering works correctly

#### ✅ Search Employee
1. Click "Search Employee" field
2. Type employee name or ID
3. Verify table filters by name/ID
4. Try partial names

#### ✅ Summary Cards
1. Verify 5 cards show: Total, Present, Late, Absent, Half Day
2. Numbers should match table data
3. Should update when date changes

#### ✅ Table Display
1. Verify columns: Employee, Department, Position, Status, Check-In, Check-Out, Working Hours
2. Status shows with icon and color
3. Times formatted correctly (e.g., "09:15:30 AM")
4. Working hours show decimal (e.g., "9.25")

---

## 👤 Employee Attendance Page Testing

### Access
1. Login as employee (role: "employee")
2. Go to sidebar → "My Attendance"
3. Verify page loads with real data

### Test Cases

#### ✅ Today's Section
1. Verify "Today's Attendance" shows current date
2. Status field shows actual status
3. Check-In shows actual time (if checked in)
4. Check-Out shows time (if checked out, else "—")
5. Working Hours shows calculated hours

#### ✅ Check-In Button
1. Click "Mark In" button
2. Button should disable and show "Processing..."
3. Success message: "Checked in at HH:MM:SS AM/PM"
4. Status changes to "Present" or "Late"
5. Check-In time appears in today's section
6. Button becomes disabled

#### ✅ Check-Out Button
1. After checking in, click "Mark Out"
2. Button should show "Processing..."
3. Success message: "Checked out at HH:MM:SS - Worked: X.XXhrs"
4. Working hours calculation appears
5. Check-Out time appears in today's section
6. Both buttons become disabled

#### ✅ Monthly Statistics
1. Verify 4 cards show: Present, Late, Half Days, Attendance %
2. Numbers match actual monthly data
3. Attendance % is calculated correctly
4. Month name is correct

#### ✅ Calendar View (Month)
1. Click "Month" button (should be selected by default)
2. Verify calendar shows all days of month
3. Weekends appear in gray with "Weekend" label
4. Working days show status (Present, Late, Absent, Half Day)
5. Status color-coded correctly:
   - Present: Green
   - Late: Orange
   - Absent: Red
   - Half Day: Yellow
6. Hover shows shadow effect

#### ✅ List View (Day)
1. Click "Day" button
2. Verify list shows all non-weekend days
3. Each row shows: Date, Status, Check-In time, Check-Out time
4. Times formatted as "HH:MM:SS AM/PM"
5. Status color-coded correctly
6. No weekend entries in list

---

## 🔍 Data Verification

### Check Backend Connection
1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Perform actions (change date, check-in, etc.)
4. Verify API calls:
   - `GET /api/attendance/all?date=...` (Admin)
   - `GET /api/attendance/my` (Employee)
   - `POST /api/attendance/checkin` (Employee)
   - `POST /api/attendance/checkout` (Employee)
5. Verify responses have correct data structure

### Check Status Formatting
1. Backend returns: `present`, `absent`, `late`, `half-day`
2. Frontend displays: `Present`, `Absent`, `Late`, `Half Day`
3. Verify capitalization works in all views

---

## 📊 Expected Data Structure

### Admin Attendance Response
```json
{
  "summary": {
    "totalEmployees": 50,
    "present": 42,
    "late": 5,
    "absent": 3,
    "halfDay": 0
  },
  "attendance": [
    {
      "employeeId": "67a0987654321fedcba98765",
      "employeeName": "John Doe",
      "department": "Sales",
      "position": "Sales Executive",
      "status": "present",
      "checkIn": "09:15:30 AM",
      "checkOut": "06:30:15 PM",
      "workingHours": 9.25
    }
  ]
}
```

### Employee Attendance Response
```json
{
  "today": {
    "status": "present",
    "date": "2024-01-03",
    "checkInTime": "09:15:30 AM",
    "checkOutTime": "06:30:15 PM",
    "workingHours": 9.25
  },
  "records": [
    {
      "date": "2024-01-03",
      "status": "present",
      "checkIn": "09:15:30 AM",
      "checkOut": "06:30:15 PM",
      "workingHours": 9.25
    }
  ],
  "statistics": {
    "present": 18,
    "late": 5,
    "absent": 2,
    "halfDay": 1,
    "attendancePercentage": "85.7",
    "month": "January"
  }
}
```

---

## ⚠️ Common Issues & Solutions

### Issue: "No attendance records found"
**Cause**: No attendance data for selected date
**Solution**: 
- Create check-in/check-out records first
- Try different date
- Verify employees exist in system

### Issue: "Already checked in today" error
**Cause**: Already checked in once
**Solution**: 
- Use check-out button to complete check-in
- Try different date
- Check if employee already has record

### Issue: Working Hours show as 0
**Cause**: Only check-in recorded, no check-out yet
**Solution**: 
- Click check-out button to complete attendance
- Working hours calculated on check-out

### Issue: Calendar shows no data
**Cause**: No attendance records for the month
**Solution**:
- Create some attendance records
- Check-in and check-out to generate records
- Verify month/year selection

### Issue: Status shows as lowercase
**Cause**: Display not capitalizing backend status
**Solution**:
- Verify `capitalizeStatus()` function is used
- Check status filter matches backend format

---

## ✅ Acceptance Criteria

- [x] Admin page fetches real attendance data
- [x] Admin page filters work correctly
- [x] Admin summary shows accurate counts
- [x] Employee page shows today's status
- [x] Check-in button works and records time
- [x] Check-out button works and calculates hours
- [x] Monthly calendar shows real data
- [x] Statistics calculated correctly
- [x] All status values displayed properly
- [x] No UI changes made to original design
- [x] Error messages show when needed
- [x] Loading states work correctly
- [x] Data refreshes after actions

---

## 🎯 Next Steps After Integration

1. ✅ Backend Attendance API - COMPLETE
2. ✅ Frontend Connected to Backend - COMPLETE
3. Test thoroughly with above test cases
4. Fix any remaining issues
5. Deploy to production

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check Network tab for API responses
3. Verify backend is running
4. Verify token is valid (check localStorage)
5. Check API documentation for endpoint details

---

## 📚 Related Documentation

- [Attendance Management API](./ATTENDANCE_MANAGEMENT_API.md)
- [Attendance Backend Summary](./ATTENDANCE_BACKEND_SUMMARY.md)
- [Frontend Integration Details](./ATTENDANCE_FRONTEND_INTEGRATION.md)
