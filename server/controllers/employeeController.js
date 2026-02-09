import User from "../models/User.js";


// Get all employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find().select("-password");
    res.status(200).json({ employees, total: employees.length });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Create new employee (admin only)
export const createEmployee = async (req, res) => {
  try {
    const { name, email, password, role, lastName, location, phone } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ msg: "Please provide all required fields" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    // Validate role
    if (!["admin", "receptionist", "contractor"].includes(role)) {
      return res.status(400).json({ msg: "Invalid role" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      lastName: lastName || "",
      location: location || "",
      phone: phone || "",
    });

    const userWithoutPassword = await User.findById(user._id).select("-password");
    res.status(201).json({ employee: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Update employee
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, email, role, lastName, location, phone } = req.body;

    const employee = await User.findById(id);
    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    // Update fields
    if (firstName) employee.firstName = firstName;
    if (email) employee.email = email;
    if (role) {
      if (!["admin", "receptionist", "contractor"].includes(role)) {
        return res.status(400).json({ msg: "Invalid role" });
      }
      employee.role = role;
    }
    if (lastName !== undefined) employee.lastName = lastName;
    if (location !== undefined) employee.location = location;
    if (phone !== undefined) employee.phone = phone;

    await employee.save();

    const updatedEmployee = await User.findById(id).select("-password");
    res.status(200).json({ employee: updatedEmployee });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await User.findById(id);
    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    // Prevent deleting self
    if (employee._id.toString() === req.user.userId) {
      return res.status(400).json({ msg: "Cannot delete your own account" });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ msg: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all employees for messaging (excludes current user)
export const getEmployeesForMessaging = async (req, res) => {
  try {
    let query = { _id: { $ne: req.user.userId } };
    
    // Contractors can only message receptionists
    if (req.user.role === "contractor") {
      query.role = "receptionist";
    }
    // Admins can only message receptionists
    else if (req.user.role === "admin") {
      query.role = "receptionist";
    }
    // Receptionists can message admins and contractors
    else if (req.user.role === "receptionist") {
      query.role = { $in: ["admin", "contractor"] };
    }
    
    const employees = await User.find(query).select("firstName lastName email role phone");
    
    res.status(200).json({ employees });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
