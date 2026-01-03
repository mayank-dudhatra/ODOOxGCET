import User from "../models/User.js";
import bcryptjs from "bcryptjs";

/**
 * Helper: Generate unique Employee Login ID
 * Format: OIA + CurrentYear + 4-digit Sequence (e.g., OIA20260101)
 */
const generateEmployeeLoginId = async () => {
  const year = new Date().getFullYear();
  const prefix = "OIA";
  
  // Find the last user with a loginId starting with the current prefix/year
  const lastUser = await User.findOne({ 
    loginId: new RegExp(`^${prefix}${year}`) 
  }).sort({ loginId: -1 });

  let sequence = "0101"; // Default starting sequence for employees
  if (lastUser && lastUser.loginId) {
    const lastSequence = parseInt(lastUser.loginId.slice(-4));
    sequence = String(lastSequence + 1).padStart(4, '0');
  }

  return `${prefix}${year}${sequence}`;
};

/**
 * CREATE: Add New Employee
 * Matches the frontend form fields (name, email, phone, department, position, joinDate, salary)
 */
export const createEmployee = async (req, res) => {
  try {
    const { name, email, phone, department, position, joinDate, salary } = req.body;

    // 1. Validation
    if (!name || !email || !salary) {
      return res.status(400).json({ error: "Name, Email, and Salary are required" });
    }

    // 2. Check if employee already exists in this company
    const existingUser = await User.findOne({ 
      email, 
      companyId: req.user.companyId 
    });
    
    if (existingUser) {
      return res.status(400).json({ error: "Employee with this email already exists in your company" });
    }

    // 3. Generate Credentials
    const loginId = await generateEmployeeLoginId();
    const tempPassword = Math.random().toString(36).slice(-8); // Random 8-character string
    const hashedPassword = await bcryptjs.hash(tempPassword, 10);

    // 4. Create Employee Record using req.user.companyId from authMiddleware
    const newEmployee = await User.create({
      companyId: req.user.companyId, 
      name,
      email,
      phone,
      department,
      position,
      joinDate: joinDate || new Date().toISOString().split('T')[0],
      salary,
      loginId,
      password: hashedPassword,
      role: "employee",
      status: "Active",
      isFirstLogin: true
    });

    // 5. Respond with credentials so the Admin can provide them to the employee
    res.status(201).json({
      message: "Employee created successfully",
      credentials: {
        loginId: newEmployee.loginId,
        temporaryPassword: tempPassword
      },
      data: {
        id: newEmployee._id,
        name: newEmployee.name,
        email: newEmployee.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * READ: Fetch All Employees for the Admin Dashboard
 */
export const getAllEmployees = async (req, res) => {
  try {
    // Only fetch employees belonging to the logged-in admin's company
    const employees = await User.find({ 
      companyId: req.user.companyId,
      role: "employee" 
    }).select("-password"); // Never return passwords to the frontend

    res.status(200).json({ data: employees });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * READ: Get individual profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * UPDATE: Update individual profile
 */
export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, 
      req.body, 
      { new: true }
    ).select("-password");
    
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};