import passport from "passport";
import User from "../models/User.js";

const authMiddleware = (req, res, next) => {
  console.log("Authorization:", req.header("Authorization"));

  passport.authenticate("jwt", { session: false }, async (error, user) => {
    if (error) {
      console.error("Error:", error);
    }
    if (!user) {
      console.error("User is not found or invalid token");
      return res.status(401).json({
        status: "401",
        code: 401,
        message: "Not authorized",
      });
    }

    try {
      const authorizationHeader = req.header("Authorization");
      if (!authorizationHeader) {
        return res.status(401).json({
          status: "401 Unauthorized",
          code: 401,
          message: "Authorization header missing",
        });
      }

      const token = authorizationHeader.replace("Bearer ", "");
      console.log("Token:", token);

      const isUser = await User.findOne({ _id: user._id, token: token });
      if (!isUser) {
        console.error("Token mismatch or user not found");
        return res.status(401).json({
          status: "401 Unauthorized",
          code: 401,
          message: "Invalid token or user not found",
        });
      }

      req.user = isUser;
      next();
    } catch (error) {
      console.error("Server error: ", error);
      res.status(500).json({
        status: "500 Internat server error",
        code: 500,
        message: "Server error",
      });
    }
  })(req, res, next);
};

export default authMiddleware;
