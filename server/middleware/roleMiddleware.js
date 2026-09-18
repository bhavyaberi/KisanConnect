/**
 * Middleware factory: restricts access to users with specific roles.
 * Usage: authorizeRoles("admin")  or  authorizeRoles("farmer", "buyer")
 *
 * Must be used AFTER the protect middleware so req.user is available.
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires one of the following roles: ${allowedRoles.join(", ")}.`,
      });
    }
    next();
  };
};

module.exports = { authorizeRoles };
