import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
console.log("REGISTER HIT");
// ✅ Signup
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) throw new ApiError(400, "User already exists");

  const user = await User.create({ name, email, password });

  res.status(201).json(
    new ApiResponse(201, {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    }, "User registered")
  );
});

// ✅ Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json(
      new ApiResponse(200, {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      }, "Login successful")
    );
  } else {
    throw new ApiError(401, "Invalid credentials");
  }
});

export { registerUser, loginUser };