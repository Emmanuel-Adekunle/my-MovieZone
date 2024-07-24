// Importing the mongoose library for MongoDB interactions
import mongoose from "mongoose";

// Define an asynchronous function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI stored in environment variables
    await mongoose.connect(process.env.MONGO_URI);
    // Log a success message if the connection is established
    console.log(`Successfully connected to MongoDB 👍`);
  } catch (error) {
    // Log any error that occurs during the connection attempt
    console.error(`Error: ${error.message}`);
    // Exit the process with a status code of 1 to indicate an error
    process.exit(1);
  }
};

// Export the connectDB function as the default export of this module
export default connectDB;
