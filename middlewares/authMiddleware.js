import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const autheticateToken = async (req, res, next) => {
  try {
    const token =
      req.headers["authorization"] &&
      req.headers["authorization"].split(" ")[1];

    if (!token) {
      return res.status(401).json({
        succeeded: false,
        err: "No token available",
      });
    }

    req.user = await User.findById(
      jwt.verify(token, process.env.JWT_SECRET).userId
    );

    next();
  } catch (err) {
    res.status(401).json({
      succeeded: false,
      err: "Not authorized",
    });
  }
};

export { autheticateToken };
