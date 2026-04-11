import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// 🔐 Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// 🔥 VALIDATION HELPERS
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePassword = (password) => {
  // min 8, 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

const validateName = (name) => {
  const regex = /^[A-Za-z ]{2,}$/;
  return regex.test(name);
};

// ✅ Signup
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // 🔥 VALIDATIONS
  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  if (!validateName(name)) {
    throw new ApiError(400, "Name must contain only letters and be at least 2 characters");
  }

  if (!validateEmail(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  if (!validatePassword(password)) {
    throw new ApiError(
      400,
      "Password must be at least 8 characters long and include uppercase, lowercase, and a number"
    );
  }

  const userExists = await User.findOne({ email });
  if (userExists) throw new ApiError(400, "User already exists");

  const user = await User.create({ name, email, password });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      },
      "User registered successfully"
    )
  );
});

// ✅ Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 🔥 VALIDATIONS
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  if (!validateEmail(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  res.json(
    new ApiResponse(
      200,
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      },
      "Login successful"
    )
  );
});

export { registerUser, loginUser };