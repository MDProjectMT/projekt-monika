import passport from "passport";
import User from "../models/User";

const authMiddleware = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, async (error, user) => {
    if (error) {
      console.error("error");
    }

    if (!user) {
      console.error("error");
    }

    try {
      const token = req.header("Authorization").replace("Bearer ", "");
      const isUser = await User.findOne({ _id: user_id, token: token });

      req.user = isUser;
      next();
    } catch (error) {
      console.error("error");
    }
  })(req, res, next);
};

export default authMiddleware;
