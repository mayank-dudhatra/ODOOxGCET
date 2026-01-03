# Dayflow HRMS - API CONTRACT

## Authentication Endpoints

### POST /api/auth/signup
Register a new user
- **Body:** `{ name, email, password, role }`
- **Response:** `{ token, user }`

### POST /api/auth/login
Login user
- **Body:** `{ email, password }`
- **Response:** `{ token, user }`

---

## Employee Endpoints

### GET /api/employee/me
Get current employee profile
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ user data }`

### PUT /api/employee/me
Update current employee profile
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ name, phone, department, etc }`
- **Response:** `{ updated user data }`

---

## Attendance Endpoints

### POST /api/attendance/checkin
Employee check-in
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ }`
- **Response:** `{ checkIn time, status }`

### POST /api/attendance/checkout
Employee check-out
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ }`
- **Response:** `{ checkOut time, workingHours }`

### GET /api/attendance/my
Get current employee's attendance records
- **Headers:** `Authorization: Bearer <token>`
- **Query:** `?month=01&year=2025`
- **Response:** `[ attendance records ]`

### GET /api/attendance/all
Get all attendance records (Admin only)
- **Headers:** `Authorization: Bearer <token>`
- **Query:** `?month=01&year=2025`
- **Response:** `[ all attendance records ]`

---

## Leave Endpoints

### POST /api/leave/apply
Apply for leave
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ leaveType, startDate, endDate, reason }`
- **Response:** `{ leave request }`

### GET /api/leave/my
Get employee's leave requests
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `[ leave requests ]`

### GET /api/leave/all
Get all leave requests (Admin only)
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `[ all leave requests ]`

### PUT /api/leave/:id/approve
Approve leave request
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ }`
- **Response:** `{ updated leave request }`

### PUT /api/leave/:id/reject
Reject leave request
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ reason }`
- **Response:** `{ updated leave request }`

---

## Payroll Endpoints

### GET /api/payroll/my
Get employee's payroll information
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `[ payroll records ]`

### GET /api/payroll/all
Get all payroll records (Admin only)
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `[ all payroll records ]`

### PUT /api/payroll/:empId
Update payroll for employee (Admin only)
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ baseSalary, allowances, deductions }`
- **Response:** `{ updated payroll }`

---

## Common Status Codes
- **200:** Success
- **201:** Created
- **400:** Bad Request
- **401:** Unauthorized
- **403:** Forbidden
- **404:** Not Found
- **500:** Server Error
