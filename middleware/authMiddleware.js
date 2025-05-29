import jwt from 'jsonwebtoken';

export const requireSignin = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Jwt token missing"
    });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {   
    return res.status(401).send({
      success: false,
      message: "Unauthorized Access."
  });
  }
};
export const isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).send({
        success: false,
        message: "Access denied.Only admin has access.",
      });
    }
    next();
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};