export const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    // TODO: Check user role from token
    if (allowedRoles.includes(req.user?.role)) {
      next();
    } else {
      res.status(403).json({ error: "Insufficient permissions" });
    }
  };
};
