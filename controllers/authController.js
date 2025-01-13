import Joi from "joi";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const schemaLogin = Joi.object({
  username: Joi.string(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["pl", "com", "net"] } })
    .required(),
  password: Joi.string().required(),
  token: Joi.string().default(null),
});

export const register = async (req, res, next) => {
  const body = schemaLogin.validate(req.body);
  const { username, email, password } = req.body;

  if (body.error) {
    return res.status(409).json({
      message: "error",
    });
  }
  const userExist = await User.findOne({ email }).lean();

  if (userExist) {
    return res.status(400).json({
      message: "User existing",
    });
  }

  try {
    const newUser = new User({ username, email });
    await newUser.setPassword(password);

    await newUser.save();

    return res.status(200).json({
      message: "Ok",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const body = schemaLogin.validate(req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (body.error) {
      return res.status(409).json({
        message: "error",
      });
    }

    if (!user) {
      return res.status(409).json({
        message: "error",
      });
    }

    const passwordIsCorrect = await user.validatePassword(password);

    if (passwordIsCorrect) {
      const payload = { _id: user._id };
      const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" });

      await user.setToken(token);
      await user.save();
      return res.status(200).json({
        message: "ok",
      });
    } else {
      return res.status(401).json({
        status: "401 Unauthorized",
        code: 401,
        message: "Email or password is wrong",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    user.token = null;
    await user.save();

    return res.status(200).json({
      message: "wylogowany",
    });
  } catch (error) {
    next(error);
  }
};
