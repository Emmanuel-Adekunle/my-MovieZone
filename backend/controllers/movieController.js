// Import the Movie model for database interactions
import Movie from "../models/Movie.js";

// Handler to create a new movie
const createMovie = async (req, res) => {
  try {
    // Create a new movie instance with data from the request body
    const newMovie = new Movie(req.body);
    // Save the new movie to the database
    const savedMovie = await newMovie.save();
    // Respond with the saved movie
    res.json(savedMovie);
  } catch (error) {
    // Handle any errors that occur during the save process
    res.status(500).json({ error: error.message });
  }
};

// Handler to get all movies
const getAllMovies = async (req, res) => {
  try {
    // Retrieve all movies from the database
    const movies = await Movie.find();
    // Respond with the list of movies
    res.json(movies);
  } catch (error) {
    // Handle any errors that occur during retrieval
    res.status(500).json({ error: error.message });
  }
};

// Handler to get a specific movie by its ID
const getSpecificMovie = async (req, res) => {
  try {
    // Extract the movie ID from the request parameters
    const { id } = req.params;
    // Find the movie by ID
    const specificMovie = await Movie.findById(id);
    // Check if the movie exists
    if (!specificMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    // Respond with the found movie
    res.json(specificMovie);
  } catch (error) {
    // Handle any errors that occur during retrieval
    res.status(500).json({ error: error.message });
  }
};

// Handler to update an existing movie by its ID
const updateMovie = async (req, res) => {
  try {
    // Extract the movie ID from the request parameters and update data from the request body
    const { id } = req.params;
    const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
    });
    // Check if the movie was found and updated
    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    // Respond with the updated movie
    res.json(updatedMovie);
  } catch (error) {
    // Handle any errors that occur during the update process
    res.status(500).json({ error: error.message });
  }
};

// Handler to add a review to a movie
const movieReview = async (req, res) => {
  try {
    // Extract review details and movie ID from the request
    const { rating, comment } = req.body;
    const movie = await Movie.findById(req.params.id);

    // Check if the movie exists
    if (movie) {
      // Check if the user has already reviewed the movie
      const alreadyReviewed = movie.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Movie already reviewed");
      }

      // Create a new review object
      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      // Add the review to the movie's reviews array
      movie.reviews.push(review);
      movie.numReviews = movie.reviews.length;
      // Update the movie's rating based on the reviews
      movie.rating =
        movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
        movie.reviews.length;

      // Save the updated movie
      await movie.save();
      res.status(201).json({ message: "Review Added" });
    } else {
      res.status(404);
      throw new Error("Movie not found");
    }
  } catch (error) {
    // Handle any errors that occur during the review process
    console.error(error);
    res.status(400).json(error.message);
  }
};

// Handler to delete a movie by its ID
const deleteMovie = async (req, res) => {
  try {
    // Extract the movie ID from the request parameters
    const { id } = req.params;
    // Find and delete the movie by ID
    const deleteMovie = await Movie.findByIdAndDelete(id);
    // Check if the movie was found and deleted
    if (!deleteMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    // Respond with a success message
    res.json({ message: "Movie Deleted Successfully" });
  } catch (error) {
    // Handle any errors that occur during the delete process
    res.status(500).json({ error: error.message });
  }
};

// Handler to delete a specific comment (review) from a movie
const deleteComment = async (req, res) => {
  try {
    // Extract movie ID and review ID from the request body
    const { movieId, reviewId } = req.body;
    // Find the movie by its ID
    const movie = await Movie.findById(movieId);

    // Check if the movie exists
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Find the index of the review to delete
    const reviewIndex = movie.reviews.findIndex(
      (r) => r._id.toString() === reviewId
    );

    // Check if the review exists
    if (reviewIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Remove the review from the movie's reviews array
    movie.reviews.splice(reviewIndex, 1);
    movie.numReviews = movie.reviews.length;
    // Update the movie's rating based on remaining reviews
    movie.rating =
      movie.reviews.length > 0
        ? movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
          movie.reviews.length
        : 0;

    // Save the updated movie
    await movie.save();
    res.json({ message: "Comment Deleted Successfully" });
  } catch (error) {
    // Handle any errors that occur during the delete comment process
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Handler to get the most recent movies
const getNewMovies = async (req, res) => {
  try {
    // Retrieve the most recent 10 movies, sorted by creation date in descending order
    const newMovies = await Movie.find().sort({ createdAt: -1 }).limit(10);
    // Respond with the list of new movies
    res.json(newMovies);
  } catch (error) {
    // Handle any errors that occur during retrieval
    res.status(500).json({ error: error.message });
  }
};

// Handler to get the top-rated movies
const getTopMovies = async (req, res) => {
  try {
    // Retrieve the top 10 movies sorted by the number of reviews in descending order
    const topRatedMovies = await Movie.find()
      .sort({ numReviews: -1 })
      .limit(10);
    // Respond with the list of top-rated movies
    res.json(topRatedMovies);
  } catch (error) {
    // Handle any errors that occur during retrieval
    res.status(500).json({ error: error.message });
  }
};

// Handler to get a random selection of movies
const getRandomMovies = async (req, res) => {
  try {
    // Retrieve a random sample of 10 movies using aggregation
    const randomMovies = await Movie.aggregate([{ $sample: { size: 10 } }]);
    // Respond with the list of random movies
    res.json(randomMovies);
  } catch (error) {
    // Handle any errors that occur during retrieval
    res.status(500).json({ error: error.message });
  }
};

// Export all movie-related handlers for use in other parts of the application
export {
  createMovie,
  getAllMovies,
  getSpecificMovie,
  updateMovie,
  movieReview,
  deleteMovie,
  deleteComment,
  getNewMovies,
  getTopMovies,
  getRandomMovies,
};
