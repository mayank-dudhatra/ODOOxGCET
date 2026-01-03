import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify JWT token and attach user data (id, companyId, role) to the request
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    
    next();
  } catch (error) {
    // If token is invalid or expired
    res.status(401).json({ error: "Invalid or expired token" });
  }
};