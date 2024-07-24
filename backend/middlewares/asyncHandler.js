// Define an asyncHandler function to handle asynchronous route handlers
const asyncHandler = (fn) => (req, res, next) => {
  // Wrap the provided function (fn) in a Promise
  Promise.resolve(fn(req, res, next))
    // If the Promise resolves successfully, it means the function executed without errors
    .catch((error) => {
      // If an error is thrown, catch it and respond with a 500 Internal Server Error status
      res.status(500).json({ message: error.message });
    });
};
// Export the asyncHandler function for use in other parts of the application

export default asyncHandler;  