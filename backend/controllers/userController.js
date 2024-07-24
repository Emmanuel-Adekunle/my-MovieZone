// Import necessary modules

// Import User model for database operations
import User from "../models/User.js";  
// Import bcrypt for password hashing
import bcrypt from "bcryptjs";  
// Import asyncHandler for handling async routes       
import asyncHandler from "../middlewares/asyncHandler.js";  
// Import createToken utility for generating JWT tokens
import createToken from "../utils/createToken.js";  
// Handler to create a new user
const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if all required fields are provided
  if (!username || !email || !password) {
    throw new Error("Please fill all the fields");
  }

  // Check if a user with the provided email already exists
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).send("User already exists");

  // Hash the password using bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a new user with the hashed password
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    // Save the new user to the database
    await newUser.save();
    // Generate a JWT token for the new user
    createToken(res, newUser._id);

    // Respond with the new user details
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    // Handle errors during user creation
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Handler to log in a user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find a user by email
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (isPasswordValid) {
      // Generate a JWT token for the logged-in user
      createToken(res, existingUser._id);

      // Respond with user details
      res.status(201).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      });
    } else {
      // Respond with error if the password is incorrect
      res.status(401).json({ message: "Invalid Password" });
    }
  } else {
    // Respond with error if the user is not found
    res.status(401).json({ message: "User not found" });
  }
});

// Handler to log out the current user
const logoutCurrentUser = asyncHandler(async (req, res) => {
  // Clear the JWT cookie
  res.cookie("jwt", "", {
    httpOnly: true, // Ensure the cookie is not accessible via JavaScript
    expires: new Date(0), // Set the cookie to expire immediately
  });

  // Respond with a success message
  res.status(200).json({ message: "Logged out successfully" });
});

// Handler to get all users
const getAllUsers = asyncHandler(async (req, res) => {
  // Retrieve all users from the database
  const users = await User.find({});
  // Respond with the list of users
  res.json(users);
});

// Handler to get the current user's profile
const getCurrentUserProfile = asyncHandler(async (req, res) => {
  // Find the user by ID (from request user object)
  const user = await User.findById(req.user._id);

  if (user) {
    // Respond with the current user's details
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    // Respond with error if the user is not found
    res.status(404);
    throw new Error("User not found.");
  }
});

// Handler to update the current user's profile
const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  // Find the user by ID (from request user object)
  const user = await User.findById(req.user._id);

  if (user) {
    // Update user's details with provided data or keep existing data
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    // If a new password is provided, hash it and update
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    // Save the updated user data
    const updatedUser = await user.save();

    // Respond with the updated user details
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    // Respond with error if the user is not found
    res.status(404);
    throw new Error("User not found");
  }
});

// Export user-related handlers for use in routes
export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
};
