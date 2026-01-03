# Dayflow HRMS - API CONTRACT

## System Architecture

```
Company Registration
   ↓
Company Created + Admin User Created
   ↓
Admin Login (with Auto-Generated Login ID)
   ↓
Admin Dashboard
   ↓
Admin Creates HR & Employees
   ↓
Employees Login with System-Generated ID
```

---

## COMPANY & AUTHENTICATION

### POST /api/company/register
**Register a new company and create admin user**

**Request Body:**
```json
{
  "companyName": "Odoo India",
  "companyEmail": "info@odoo.com",
  "companyPhone": "9876543210",
  "logo": "https://logo.url",
  
  "adminName": "Ronak Patel",
  "adminEmail": "ronak@odoo.com",
  "adminPhone": "9999999999",
  
  "password": "Admin@123",
  "confirmPassword": "Admin@123"
}
```

**Response (201):**
```json
{
  "message": "Company registered successfully",
  "loginId": "OIA20250001",
  "companyName": "Odoo India",
  "adminName": "Ronak Patel"
}
```

**Error Responses:**
- 400: Validation failed (missing fields, password mismatch)
- 400: Company email already registered
- 400: Admin email already registered

---

### POST /api/company/login
**Login with LoginID and Password**

**Request Body:**
```json
{
  "loginId": "OIA20250001",
  "password": "Admin@123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "loginId": "OIA20250001",
    "name": "Ronak Patel",
    "email": "ronak@odoo.com",
    "role": "admin",
    "companyId": "company_id",
    "companyName": "Odoo India"
  }
}
```

**Error Responses:**
- 401: Invalid login ID or password
- 401: Account is inactive

---

## EMPLOYEE ENDPOINTS

### GET /api/employee/me
**Get current employee profile**
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ user data }`

### PUT /api/employee/me
**Update current employee profile**
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ name, phone, department, etc }`
- **Response:** `{ updated user data }`

---

## ATTENDANCE ENDPOINTS

### POST /api/attendance/checkin
**Employee check-in**
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ }`
- **Response:** `{ checkIn time, status }`

### POST /api/attendance/checkout
**Employee check-out**
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ }`
- **Response:** `{ checkOut time, workingHours }`

### GET /api/attendance/my
**Get current employee's attendance records**
- **Headers:** `Authorization: Bearer <token>`
- **Query:** `?month=01&year=2025`
- **Response:** `[ attendance records ]`

### GET /api/attendance/all
**Get all attendance records (Admin only)**
- **Headers:** `Authorization: Bearer <token>`
- **Query:** `?month=01&year=2025`
- **Response:** `[ all attendance records ]`

---

## LEAVE ENDPOINTS

### POST /api/leave/apply
**Apply for leave**
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ leaveType, startDate, endDate, reason }`
- **Response:** `{ leave request }`

### GET /api/leave/my
**Get employee's leave requests**
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `[ leave requests ]`

### GET /api/leave/all
**Get all leave requests (Admin only)**
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `[ all leave requests ]`

### PUT /api/leave/:id/approve
**Approve leave request**
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ }`
- **Response:** `{ updated leave request }`

### PUT /api/leave/:id/reject
**Reject leave request**
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ reason }`
- **Response:** `{ updated leave request }`

---

## PAYROLL ENDPOINTS

### GET /api/payroll/my
**Get employee's payroll information**
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `[ payroll records ]`

### GET /api/payroll/all
**Get all payroll records (Admin only)**
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `[ all payroll records ]`

### PUT /api/payroll/:empId
**Update payroll for employee (Admin only)**
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ baseSalary, allowances, deductions }`
- **Response:** `{ updated payroll }`

---

## COMPANY ENDPOINTS (FUTURE)

### GET /api/company/:id
**Get company details**
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ company data }`

### PUT /api/company/:id
**Update company details (Admin only)**
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ name, logo, phone }`
- **Response:** `{ updated company }`

---

## USER MANAGEMENT (FUTURE - Admin Only)

### POST /api/admin/employees/create
**Create new employee**
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ name, email, phone, department, position }`
- **Response:** `{ loginId, password (temporary) }`

### POST /api/admin/hr/create
**Create new HR**
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ name, email, phone, department }`
- **Response:** `{ loginId, password (temporary) }`

---

## AUTH MODELS

### Company Model
```javascript
{
  name: String,              // Company name
  email: String,             // Unique company email
  phone: String,             // Company phone
  logo: String,              // Logo URL
  isActive: Boolean,         // Active status
  createdAt: Date
}
```

### User Model
```javascript
{
  companyId: ObjectId,       // Reference to Company
  name: String,              // User name
  email: String,             // Email (unique per company)
  phone: String,             // User phone
  loginId: String,           // System-generated unique ID
  password: String,          // Hashed password
  role: "admin|hr|employee|manager",
  isFirstLogin: Boolean,     // First login flag
  isActive: Boolean,         // Account status
  createdAt: Date
}
```

---

## LOGIN ID GENERATION

**Format:** `OIA + Year + Sequence`

**Examples:**
- `OIA20250001` - First admin registered in 2025
- `OIA20250002` - Second admin registered in 2025
- `OIA20250101` - First employee of first admin

**Rules:**
- Auto-generated for all users
- Unique across the system
- Display to admin after company registration
- Used for login instead of email

---

## Common Status Codes
- **200:** Success
- **201:** Created
- **400:** Bad Request / Validation Error
- **401:** Unauthorized / Invalid Credentials
- **403:** Forbidden (Insufficient Permissions)
- **404:** Not Found
- **500:** Server Error

---

## Response Format (Standard)

**Success:**
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "error": "Error message"
}
```

