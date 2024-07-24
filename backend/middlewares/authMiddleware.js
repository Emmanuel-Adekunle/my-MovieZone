// Import necessary modules
// Import jsonwebtoken for handling JWTs
import jwt from "jsonwebtoken";   
// Import the User model for database operations
import User from "../models/User.js";  
// Import asyncHandler to handle async route functions
import asyncHandler from "./asyncHandler.js";  

// Middleware to check if the user is authenticated
const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Read JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      // Verify the JWT using the secret key stored in environment variables
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find the user associated with the decoded userId from the token
      req.user = await User.findById(decoded.userId).select("-password");
      
      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      // If token verification fails or any other error occurs, respond with a 401 status
      res.status(401);
      throw new Error("Not authorized, token failed.");
    }
  } else {
    // If no token is provided, respond with a 401 status
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Middleware to check if the user is an admin
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    // If user exists and is an admin, proceed to the next middleware or route handler
    next();
  } else {
    // If user is not an admin, respond with a 401 status
    res.status(401).send("Not authorized as an admin");
  }
};

// Export the middleware functions for use in other parts of the application
export { authenticate, authorizeAdmin };
