// Import the isValidObjectId function from mongoose to validate MongoDB ObjectIds
import { isValidObjectId } from "mongoose";

// Middleware function to check if the provided ID is a valid MongoDB ObjectId
function checkId(req, res, next) {
  // Validate the ID from the route parameters
  if (!isValidObjectId(req.params.id)) {
    // If the ID is not valid, set response status to 404 and throw an error
    res.status(404);
    throw new Error(`Invalid Object Id: ${req.params.id}`);
  }
  // If the ID is valid, proceed to the next middleware or route handler
  next();
}

// Export the middleware function for use in other parts of the application
export default checkId;
