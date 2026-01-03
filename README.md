# Dayflow HRMS Project

A complete Human Resource Management System built with:
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express + MongoDB

## Project Structure

```
dayflow-hrms/
├── frontend/          # React frontend application
├── backend/           # Express backend API
├── api-contract.md    # API endpoints documentation
└── README.md          # This file
```

## Setup Instructions

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account or local MongoDB
- Git

### Backend Setup

```bash
cd backend
npm install
npm run dev  # Starts on port 5000
```

Update `.env` with MongoDB connection URI:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev  # Starts on port 5173
```

## Git Workflow

- `master` - Main production branch
- `frontend-dev` - Frontend development branch
- `backend-dev` - Backend development branch

**Rule:** Only ONE person merges to main to prevent conflicts.

## API Documentation

See [api-contract.md](api-contract.md) for all API endpoints.

## Team Structure

- **Frontend Developer:** Working on `frontend-dev` branch
- **Backend Developer:** Working on `backend-dev` branch

## Features

### Authentication
- User signup & login
- JWT token-based authentication
- Role-based access control (Employee, Manager, Admin)

### Employee Management
- Profile management
- Attendance tracking (check-in/check-out)
- Leave management & approval workflow
- Payroll information

### Admin Dashboard
- Employee management
- Attendance monitoring
- Leave approval system
- Payroll management

---

**Last Updated:** January 3, 2026
