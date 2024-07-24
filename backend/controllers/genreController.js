// Import the Genre model for database interactions and asyncHandler for handling asynchronous middleware
import Genre from "../models/Genre.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// Handler to create a new genre
const createGenre = asyncHandler(async (req, res) => {
  try {
    // Extract the 'name' from the request body
    const { name } = req.body;

    // Check if 'name' is provided
    if (!name) {
      return res.json({ error: "Name is required" });
    }

    // Check if a genre with the same name already exists
    const existingGenre = await Genre.findOne({ name });

    if (existingGenre) {
      return res.json({ error: "Already exists" });
    }

    // Create and save the new genre
    const genre = await new Genre({ name }).save();
    // Respond with the newly created genre
    res.json(genre);
  } catch (error) {
    // Log the error and respond with a 400 status code
    console.log(error);
    return res.status(400).json(error);
  }
});

// Handler to update an existing genre
const updateGenre = asyncHandler(async (req, res) => {
  try {
    // Extract 'name' from the request body and 'id' from the request parameters
    const { name } = req.body;
    const { id } = req.params;

    // Find the genre by its ID
    const genre = await Genre.findOne({ _id: id });

    // Check if the genre exists
    if (!genre) {
      return res.status(404).json({ error: "Genre not found" });
    }

    // Update the genre's name
    genre.name = name;

    // Save the updated genre
    const updatedGenre = await genre.save();
    // Respond with the updated genre
    res.json(updatedGenre);
  } catch (error) {
    // Log the error and respond with a 500 status code
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Handler to delete a genre
const removeGenre = asyncHandler(async (req, res) => {
  try {
    // Extract 'id' from the request parameters
    const { id } = req.params;

    // Find and delete the genre by its ID
    const removed = await Genre.findByIdAndDelete(id);

    // Check if the genre was found and deleted
    if (!removed) {
      return res.status(404).json({ error: "Genre not found" });
    }

    // Respond with the deleted genre
    res.json(removed);
  } catch (error) {
    // Log the error and respond with a 500 status code
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Handler to list all genres
const listGenres = asyncHandler(async (req, res) => {
  try {
    // Find all genres in the database
    const all = await Genre.find({});
    // Respond with the list of all genres
    res.json(all);
  } catch (error) {
    // Log the error and respond with a 400 status code
    console.log(error);
    return res.status(400).json(error.message);
  }
});

// Handler to read a specific genre by its ID
const readGenre = asyncHandler(async (req, res) => {
  try {
    // Find a genre by its ID
    const genre = await Genre.findOne({ _id: req.params.id });
    // Respond with the found genre
    res.json(genre);
  } catch (error) {
    // Log the error and respond with a 400 status code
    console.log(error);
    return res.status(400).json(error.message);
  }
});

// Export the genre handlers for use in other parts of the application
export { createGenre, updateGenre, removeGenre, listGenres, readGenre };
