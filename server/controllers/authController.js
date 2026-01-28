import jwt from "jsonwebtoken";
import User from "../models/User.js";

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

export const register = async (req, res) => {
  const user = await User.create(req.body);
  const token = createToken(user._id);

  res.status(201).json({
    user: { name: user.name, email: user.email },
    token,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ msg: "Invalid credentials" });
  }

  const token = createToken(user._id);

  res.json({
    user: { name: user.name, email: user.email },
    token,
  });
};
