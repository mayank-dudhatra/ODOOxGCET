export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    // TODO: Verify JWT token
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
