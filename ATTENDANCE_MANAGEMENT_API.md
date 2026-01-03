# Attendance Management API Documentation

## Overview
Complete backend implementation for tracking and managing employee attendance with check-in/check-out, monthly reports, and admin controls.

---

## 1. CHECK-IN (Employee)

### Endpoint
```
POST /api/attendance/checkin
```

### Headers
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Request Body
```
No body required - uses logged-in user's ID
```

### Response (Success - 200)
```json
{
  "message": "Check-in successful",
  "checkInTime": "09:15:30 AM",
  "status": "late",
  "attendance": {
    "_id": "67a1234567890abcdef12345",
    "userId": "67a0987654321fedcba98765",
    "date": "2024-01-03T00:00:00.000Z",
    "checkIn": "2024-01-03T09:15:30.000Z",
    "checkOut": null,
    "status": "late",
    "workingHours": null,
    "createdAt": "2024-01-03T09:15:30.000Z",
    "updatedAt": "2024-01-03T09:15:30.000Z"
  }
}
```

### Response (Error - 400)
```json
{
  "error": "Already checked in today",
  "checkInTime": "2024-01-03T09:15:30.000Z"
}
```

### Logic
- Automatically determines if late (after 9:00 AM)
- Creates new attendance record if not exists
- Returns error if already checked in

---

## 2. CHECK-OUT (Employee)

### Endpoint
```
POST /api/attendance/checkout
```

### Headers
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Request Body
```
No body required
```

### Response (Success - 200)
```json
{
  "message": "Check-out successful",
  "checkOutTime": "06:30:15 PM",
  "workingHours": "9.25",
  "attendance": {
    "_id": "67a1234567890abcdef12345",
    "userId": "67a0987654321fedcba98765",
    "date": "2024-01-03T00:00:00.000Z",
    "checkIn": "2024-01-03T09:15:30.000Z",
    "checkOut": "2024-01-03T18:30:15.000Z",
    "status": "present",
    "workingHours": 9.25,
    "createdAt": "2024-01-03T09:15:30.000Z",
    "updatedAt": "2024-01-03T18:30:15.000Z"
  }
}
```

### Response (Error - 404)
```json
{
  "error": "No check-in found for today. Please check-in first."
}
```

### Logic
- Calculates working hours automatically
- Updates status if not already marked
- Prevents duplicate check-outs

---

## 3. GET MY ATTENDANCE (Employee)

### Endpoint
```
GET /api/attendance/my?month=1&year=2024
```

### Headers
```
Authorization: Bearer <JWT_TOKEN>
```

### Query Parameters
- `month` (optional): 1-12, defaults to current month
- `year` (optional): Year, defaults to current year

### Response (Success - 200)
```json
{
  "message": "Attendance records fetched successfully",
  "today": {
    "status": "present",
    "date": "2024-01-03",
    "checkInTime": "09:15:30 AM",
    "checkOutTime": "06:30:15 PM",
    "workingHours": 9.25
  },
  "records": [
    {
      "_id": "67a1234567890abcdef12345",
      "date": "2024-01-03",
      "status": "present",
      "checkIn": "09:15:30 AM",
      "checkOut": "06:30:15 PM",
      "workingHours": 9.25
    },
    {
      "_id": "67a1234567890abcdef12346",
      "date": "2024-01-02",
      "status": "late",
      "checkIn": "09:45:00 AM",
      "checkOut": "06:15:00 PM",
      "workingHours": 8.5
    }
  ],
  "statistics": {
    "present": 18,
    "late": 5,
    "absent": 2,
    "halfDay": 1,
    "totalWorkingHours": 150.75,
    "attendancePercentage": "85.7",
    "month": "January"
  }
}
```

---

## 4. GET ALL ATTENDANCE (Admin/HR)

### Endpoint
```
GET /api/attendance/all?date=2024-01-03&department=Sales&status=present
```

### Headers
```
Authorization: Bearer <JWT_TOKEN>
```

### Query Parameters
- `date` (optional): YYYY-MM-DD format, defaults to today
- `department` (optional): Department name or "all", defaults to all
- `status` (optional): "present", "absent", "late", "half-day", or "all"

### Response (Success - 200)
```json
{
  "message": "All attendance records fetched successfully",
  "summary": {
    "totalEmployees": 50,
    "present": 42,
    "late": 5,
    "absent": 3,
    "halfDay": 0
  },
  "date": "2024-01-03",
  "count": 50,
  "attendance": [
    {
      "id": "67a1234567890abcdef12345",
      "employeeId": "67a0987654321fedcba98765",
      "employeeName": "John Doe",
      "email": "john@example.com",
      "department": "Sales",
      "position": "Sales Executive",
      "date": "2024-01-03",
      "status": "present",
      "checkIn": "09:15:30 AM",
      "checkOut": "06:30:15 PM",
      "workingHours": 9.25
    },
    {
      "id": "67a1234567890abcdef12346",
      "employeeId": "67a0987654321fedcba98766",
      "employeeName": "Jane Smith",
      "email": "jane@example.com",
      "department": "HR",
      "position": "HR Manager",
      "date": "2024-01-03",
      "status": "absent",
      "checkIn": "—",
      "checkOut": "—",
      "workingHours": 0
    }
  ]
}
```

### Features
- Shows all employees (even those not checked in as absent)
- Includes department and position info
- Summary stats for the day
- Filterable by department and status

---

## 5. MARK ATTENDANCE (Admin/HR)

### Endpoint
```
POST /api/attendance/mark
```

### Headers
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Request Body
```json
{
  "userId": "67a0987654321fedcba98765",
  "date": "2024-01-03",
  "status": "present"
}
```

### Status Options
- `present` - Present
- `absent` - Absent
- `late` - Late
- `half-day` - Half Day

### Response (Success - 200)
```json
{
  "message": "Attendance marked successfully",
  "attendance": {
    "_id": "67a1234567890abcdef12345",
    "userId": "67a0987654321fedcba98765",
    "date": "2024-01-03T00:00:00.000Z",
    "checkIn": null,
    "checkOut": null,
    "status": "present",
    "workingHours": null,
    "createdAt": "2024-01-03T10:00:00.000Z",
    "updatedAt": "2024-01-03T10:00:00.000Z"
  }
}
```

### Response (Error - 404)
```json
{
  "error": "Employee not found"
}
```

---

## 6. GET ATTENDANCE REPORT (Admin/HR)

### Endpoint
```
GET /api/attendance/report/:userId?month=1&year=2024
```

### Headers
```
Authorization: Bearer <JWT_TOKEN>
```

### URL Parameters
- `userId` - Employee MongoDB ID

### Query Parameters
- `month` (optional): 1-12, defaults to current month
- `year` (optional): Year, defaults to current year

### Response (Success - 200)
```json
{
  "message": "Attendance report generated successfully",
  "employee": {
    "id": "67a0987654321fedcba98765",
    "name": "John Doe",
    "email": "john@example.com",
    "department": "Sales",
    "position": "Sales Executive"
  },
  "period": {
    "month": "January",
    "year": 2024
  },
  "statistics": {
    "present": 18,
    "late": 5,
    "absent": 2,
    "halfDay": 1,
    "totalWorkingHours": 150.75,
    "workingDays": 24,
    "attendancePercentage": "85.7"
  },
  "records": [
    {
      "date": "2024-01-03",
      "status": "present",
      "checkIn": "09:15:30 AM",
      "checkOut": "06:30:15 PM",
      "workingHours": 9.25
    }
  ]
}
```

---

## ATTENDANCE STATUS CODES

| Status | Description | Auto-Marked |
|--------|-------------|-------------|
| `present` | Checked in before 9:00 AM | Yes, on check-in |
| `late` | Checked in after 9:00 AM | Yes, on check-in |
| `absent` | No check-in recorded | Yes, in admin view |
| `half-day` | Partial working day | Manual only |

---

## AUTO-CALCULATION FEATURES

1. **Status Determination**
   - Before 9:00 AM → "Present"
   - After 9:00 AM → "Late"
   - No check-in → "Absent"

2. **Working Hours**
   - Calculated as: (check-out time - check-in time) in hours
   - Accurate to 2 decimal places

3. **Monthly Attendance %**
   - Calculated as: (Present days / Total days) × 100
   - Shows overall attendance percentage

4. **Missing Records**
   - Employees without check-in marked as absent automatically
   - Ensures complete daily reports

---

## FRONTEND INTEGRATION EXAMPLES

### Check-In Button
```javascript
async function handleCheckIn() {
  const response = await api.post('/attendance/checkin');
  const { checkInTime, status } = await response.json();
  console.log(`Checked in at ${checkInTime} - Status: ${status}`);
}
```

### Check-Out Button
```javascript
async function handleCheckOut() {
  const response = await api.post('/attendance/checkout');
  const { checkOutTime, workingHours } = await response.json();
  console.log(`Checked out at ${checkOutTime} - Worked: ${workingHours}hrs`);
}
```

### Get Today's Status
```javascript
async function getTodayStatus() {
  const response = await api.get('/attendance/my');
  const { today, statistics } = await response.json();
  console.log('Today:', today);
  console.log('This month:', statistics);
}
```

### Admin: View All Attendance
```javascript
async function getAttendanceForDate(date, department = 'all') {
  const response = await api.get(
    `/attendance/all?date=${date}&department=${department}`
  );
  const { summary, attendance } = await response.json();
  return { summary, attendance };
}
```

### Admin: Mark Attendance
```javascript
async function markEmployeeAttendance(employeeId, date, status) {
  const response = await api.post('/attendance/mark', {
    userId: employeeId,
    date: date,
    status: status
  });
  return response.json();
}
```

---

## TESTING WITH CURL

### Check-In
```bash
curl -X POST http://localhost:5000/api/attendance/checkin \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Get My Attendance
```bash
curl -X GET "http://localhost:5000/api/attendance/my?month=1&year=2024" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get All Attendance (Admin)
```bash
curl -X GET "http://localhost:5000/api/attendance/all?date=2024-01-03&department=Sales" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Mark Attendance (Admin)
```bash
curl -X POST http://localhost:5000/api/attendance/mark \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "67a0987654321fedcba98765",
    "date": "2024-01-03",
    "status": "present"
  }'
```

### Get Attendance Report (Admin)
```bash
curl -X GET "http://localhost:5000/api/attendance/report/67a0987654321fedcba98765?month=1&year=2024" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## DATABASE SCHEMA

### Attendance Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  date: Date,
  checkIn: Date,
  checkOut: Date,
  status: String (enum: present, absent, late, half-day),
  workingHours: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## ERROR CODES

| Code | Error | Solution |
|------|-------|----------|
| 400 | Already checked in today | Use checkout endpoint |
| 400 | Already checked out today | Record already exists |
| 404 | No check-in found | Check in first before checking out |
| 404 | Employee not found | Verify employee ID |
| 401 | Invalid or expired token | Re-login to get new token |

---

## NOTES

1. **Office Hours**: Currently set to 9:00 AM (can be configured per company)
2. **Auto-Absent**: Employees without check-in are marked absent in admin view
3. **Data Isolation**: All attendance filtered by company (multi-tenancy)
4. **Real-time Calculation**: Statistics calculated on each request
5. **No Overlaps**: Only one attendance record per employee per day

---

## Ready to Use!

All attendance endpoints are fully functional and integrated with the frontend UI.
