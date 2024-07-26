// Importing necessary hooks and modules
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetSpecificMovieQuery,
  useAddMovieReviewMutation,
} from "../../redux/api/movies";
import MovieTabs from "./MovieTabs";

// MovieDetails component
const MovieDetails = () => {
  const { id: movieId } = useParams(); // Get the movie ID from the URL parameters
  const [rating, setRating] = useState(0); // State for rating
  const [comment, setComment] = useState(""); // State for comment
  const { data: movie, refetch } = useGetSpecificMovieQuery(movieId); // Query to get specific movie details
  const { userInfo } = useSelector((state) => state.auth); // Selector for user info from state
  const [createReview, { isLoading: loadingMovieReview }] =
    useAddMovieReviewMutation(); // Mutation hook for adding a movie review

  // Handle form submission for adding a review
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        id: movieId,
        rating,
        comment,
      }).unwrap();

      refetch(); // Refetch movie details to update reviews

      toast.success("Review created successfully"); // Show success toast
    } catch (error) {
      toast.error(error.data || error.message); // Show error toast
    }
  };

  return (
    <>
      <div>
        <Link
          to="/"
          className="text-white font-semibold hover:underline ml-[20rem]"
        >
          Go Back
        </Link>
      </div>

      <div className="mt-[2rem]">
        <div className="flex justify-center items-center">
          <img
            src={movie?.image}
            alt={movie?.name}
            className="w-[70%] rounded"
          />
        </div>
        {/* Container One */}
        <div className="container flex justify-between ml-[20rem] mt-[3rem]">
          <section>
            <h2 className="text-5xl my-4 font-extrabold">{movie?.name}</h2>
            <p className="my-4 xl:w-[35rem] lg:w-[35rem] md:w-[30rem] text-[#B0B0B0]">
              {movie?.detail}
            </p>
          </section>

          <div className="mr-[5rem]">
            <p className="text-2xl font-semibold">
              Releasing Date: {movie?.year}
            </p>

            <div>
              {movie?.cast.map((c, index) => (
                <ul key={index}>
                  <li className="mt-[1rem]">{c}</li>
                </ul>
              ))}
            </div>
          </div>
        </div>

        <div className="container ml-[20rem]">
          <MovieTabs
            loadingMovieReview={loadingMovieReview}
            userInfo={userInfo}
            submitHandler={submitHandler}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            movie={movie}
          />
        </div>
      </div>
    </>
  );
};

export default MovieDetails;
