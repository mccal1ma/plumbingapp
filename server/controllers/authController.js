import jwt from "jsonwebtoken";
import User from "../models/User.js";

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

export const register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = createToken(user._id);

    res.status(201).json({
      user: { firstName: user.firstName, lastName: user.lastName, email: user.email, location: user.location, role: user.role, phone: user.phone },
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // More explicit password selection
    const user = await User.findOne({ email }).select('+password firstName lastName location role email');

    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Log to debug
    console.log('User found:', user.email);
    console.log('Password exists:', !!user.password);

    if (!user.password) {
      return res.status(500).json({ msg: "Password not found in database" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = createToken(user._id);

    res.json({
      user: { 
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
        role: user.role,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { email, name, lastName, location, phone } = req.body;
    
    if (!email || !name || !lastName || !location) {
      return res.status(400).json({ msg: 'Please provide all values' });
    }
    
    const user = await User.findOne({ _id: req.user.userId });

    user.email = email;
    user.firstName = name;
    user.lastName = lastName;
    user.location = location;
    user.phone = phone || '';

    await user.save();

    const token = createToken(user._id);

    res.status(200).json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
        role: user.role,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ msg: error.message });
  }
};
