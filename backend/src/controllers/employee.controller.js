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

/**
 * UPDATE: Admin Update Employee Details
 */
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, department, position, joinDate, salary, status } = req.body;

    // 1. Verify employee belongs to the admin's company
    const employee = await User.findOne({
      _id: id,
      companyId: req.user.companyId,
      role: "employee"
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found in your company" });
    }

    // 2. Check if email is being changed to an existing email
    if (email && email !== employee.email) {
      const emailExists = await User.findOne({ 
        email, 
        companyId: req.user.companyId,
        _id: { $ne: id } 
      });
      
      if (emailExists) {
        return res.status(400).json({ error: "Email already exists for another employee" });
      }
    }

    // 3. Update employee data
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (department) updateData.department = department;
    if (position) updateData.position = position;
    if (joinDate) updateData.joinDate = joinDate;
    if (salary !== undefined) updateData.salary = salary;
    if (status) updateData.status = status;

    const updatedEmployee = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Employee updated successfully",
      data: updatedEmployee
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * DELETE: Remove Employee
 */
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Verify employee belongs to the admin's company
    const employee = await User.findOne({
      _id: id,
      companyId: req.user.companyId,
      role: "employee"
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found in your company" });
    }

    // 2. Delete the employee
    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: "Employee deleted successfully",
      data: { id }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};