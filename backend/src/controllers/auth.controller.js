import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "../models/User.js";

export const login = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    // Validation
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

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        companyId: user.companyId._id,
        role: user.role,
        loginId: user.loginId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        loginId: user.loginId,
        role: user.role,
        department: user.department,
        position: user.position,
        companyId: user.companyId._id,
        companyName: user.companyId.name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const signup = async (req, res) => {
  try {
    // TODO: Implement signup logic
    res.json({ message: "Signup endpoint" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
