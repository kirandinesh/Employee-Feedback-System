const User = require("../../models/user");
const Review = require("../../models/review");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Registered Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong on our end. Please try again later",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password! Please try again",
      });
    }

    const accessToken = jwt.sign(
      {
        _id: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
      },
      process.env.SECRET_KEY,
      { expiresIn: "120m" }
    );

    res.status(200).json({
      success: true,
      message: "Logged in Successfully",
      data: {
        accessToken,
        user: {
          _id: user._id,
          role: user.role,
          username: user.username,
          email: user.email,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong on our end. Please try again later",
    });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find(
      { role: "employee" },
      { _id: 1, email: 1, username: 1, role: 1 }
    );

    res.status(200).json({
      success: true,
      message: "Fetched all employees successfully!",
      data: employees,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong on our end. Please try again later",
    });
  }
};

const deleteEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    await Promise.all([
      Review.deleteMany({ recipient: id }),
      Review.deleteMany({ reviewer: id }),
      User.findByIdAndDelete(id),
    ]);

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong on our end. Please try again later",
    });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: "Fetch Employee successful",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong on our end. Please try again later",
    });
  }
};

const addEmployee = async (req, res) => {
  const { username, role, email, password } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.username === username
            ? "Username is already taken"
            : "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      role,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong on our end. Please try again later",
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const employeeExists = await User.findById(id);

    if (!employeeExists) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const hashedPassword = await bcrypt.hash(updateData.password, 10);
    const newlyUpdatedEmployee = { ...updateData, password: hashedPassword };
    const updatedEmployee = await User.findByIdAndUpdate(
      id,
      { $set: newlyUpdatedEmployee },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: updatedEmployee,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong on our end. Please try again later",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllEmployees,
  deleteEmployeeById,
  addEmployee,
  updateEmployee,
  getEmployeeById,
};
