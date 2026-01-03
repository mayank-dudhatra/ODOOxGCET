import bcryptjs from "bcryptjs";
import Company from "../models/Company.js";
import User from "../models/User.js";
import { sendWelcomeEmail } from "../services/mail.service.js";

// Generates a unique Login ID by checking the last sequence in the database
const generateLoginId = async () => {
  const year = new Date().getFullYear();
  const prefix = "OIA";
  
  // Find the last user created in the current year to get the highest sequence
  const lastUser = await User.findOne({ 
    loginId: new RegExp(`^${prefix}${year}`) 
  }).sort({ loginId: -1 });

  let sequence = "0001";
  if (lastUser && lastUser.loginId) {
    // Extract the last 4 digits, increment them, and pad with zeros
    const lastSequence = parseInt(lastUser.loginId.slice(-4));
    sequence = String(lastSequence + 1).padStart(4, '0');
  }

  return `${prefix}${year}${sequence}`;
};

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

    // Validation
    if (!companyName || !companyEmail || !companyPhone || !adminName || !adminEmail || !password) {
      return res.status(400).json({ error: "Missing required details" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Duplicate Check
    const existingCompany = await Company.findOne({ email: companyEmail });
    if (existingCompany) {
      return res.status(400).json({ error: "Company email already registered" });
    }

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin email already registered" });
    }

    // 1. Create Company
    const company = await Company.create({
      name: companyName,
      email: companyEmail,
      phone: companyPhone,
      logo: logo || null,
    });

    // 2. Dynamic Login ID and Password Hashing
    const loginId = await generateLoginId();
    const hashedPassword = await bcryptjs.hash(password, 10);

    // 3. Create Admin User
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

    // 4. Send Welcome Email
    try {
      await sendWelcomeEmail(adminEmail, adminName, loginId, companyName);
    } catch (mailError) {
      console.error("Email failed to send, but registration succeeded:", mailError.message);
    }

    // Success Response
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

export const login = async (req, res) => {
  try {
    const { loginId, password } = req.body;
    if (!loginId || !password) {
      return res.status(400).json({ error: "Login ID and password are required" });
    }

    const user = await User.findOne({ loginId }).populate("companyId");
    if (!user || !(await bcryptjs.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid login ID or password" });
    }

    if (!user.isActive) return res.status(401).json({ error: "Account inactive" });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        loginId: user.loginId,
        name: user.name,
        role: user.role,
        companyName: user.companyId.name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};