import bcryptjs from "bcryptjs";
import Company from "../models/Company.js";
import User from "../models/User.js";

// Generate unique login ID: OIA + Year + 0001
const generateLoginId = () => {
  const year = new Date().getFullYear();
  const prefix = "OIA";
  const sequence = "0001"; // In production, you'd check last admin and increment
  return `${prefix}${year}${sequence}`;
};

/**
 * POST /api/company/register
 * Register a new company and create admin user
 */
export const registerCompany = async (req, res) => {
  try {
    const {
      companyName,
      companyEmail,
      companyPhone,
      logo,
      adminName,
      adminEmail,
      adminPhone,
      password,
      confirmPassword,
    } = req.body;

    // ✅ Validation
    if (!companyName || !companyEmail || !companyPhone) {
      return res.status(400).json({ error: "Company details are required" });
    }

    if (!adminName || !adminEmail || !adminPhone) {
      return res.status(400).json({ error: "Admin details are required" });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({ error: "Password is required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Check if company email already exists
    const existingCompany = await Company.findOne({ email: companyEmail });
    if (existingCompany) {
      return res.status(400).json({ error: "Company email already registered" });
    }

    // Check if admin email already exists globally
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin email already registered" });
    }

    // 🏢 Create Company
    const company = await Company.create({
      name: companyName,
      email: companyEmail,
      phone: companyPhone,
      logo: logo || null,
    });

    // 🔐 Generate Login ID and Hash Password
    const loginId = generateLoginId();
    const hashedPassword = await bcryptjs.hash(password, 10);

    // 👤 Create Admin User
    const adminUser = await User.create({
      companyId: company._id,
      name: adminName,
      email: adminEmail,
      phone: adminPhone,
      loginId,
      password: hashedPassword,
      role: "admin",
      isFirstLogin: false,
    });

    // ✅ Success Response
    res.status(201).json({
      message: "Company registered successfully",
      loginId: loginId,
      companyName: company.name,
      adminName: adminUser.name,
    });
  } catch (error) {
    console.error("Company registration error:", error);
    res.status(500).json({ error: error.message || "Company registration failed" });
  }
};

/**
 * POST /api/company/login
 * Admin/HR/Employee login with loginId and password
 */
export const login = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({ error: "Login ID and password are required" });
    }

    // Find user by loginId
    const user = await User.findOne({ loginId }).populate("companyId");

    if (!user) {
      return res.status(401).json({ error: "Invalid login ID or password" });
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid login ID or password" });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: "Account is inactive" });
    }

    // ✅ Login successful
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        loginId: user.loginId,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId._id,
        companyName: user.companyId.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};
