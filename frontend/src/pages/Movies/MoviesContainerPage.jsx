import { useState } from "react";
import {
  useGetNewMoviesQuery,
  useGetTopMoviesQuery,
  useGetRandomMoviesQuery,
} from "../../redux/api/movies";

import { useFetchGenresQuery } from "../../redux/api/genre";
import SliderUtil from "../../component/SliderUtil";

const MoviesContainerPage = () => {
  const { data } = useGetNewMoviesQuery();
  const { data: topMovies } = useGetTopMoviesQuery();
  const { data: genres } = useFetchGenresQuery();
  const { data: randomMovies } = useGetRandomMoviesQuery();

  const [selectedGenre, setSelectedGenre] = useState(null);

  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
  };

  const filteredMovies = data?.filter(
    (movie) => selectedGenre === null || movie.genre === selectedGenre
  );

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center px-4 lg:px-8">
      <nav className="w-full lg:w-1/4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible whitespace-nowrap lg:whitespace-normal">
        {genres?.map((g) => (
          <button
            key={g._id}
            className={`transition duration-300 ease-in-out hover:bg-gray-200 block p-2 rounded mb-2 lg:mb-4 text-lg ${
              selectedGenre === g._id ? "bg-gray-200" : ""
            }`}
            onClick={() => handleGenreClick(g._id)}
          >
            {g.name}
          </button>
        ))}
      </nav>

      <section className="w-full lg:w-3/4 flex flex-col items-center lg:items-start">
        <div className="w-full mb-8">
          <h1 className="mb-5 text-center lg:text-left">Choose For You</h1>
          <SliderUtil data={randomMovies} />
        </div>

        <div className="w-full mb-8">
          <h1 className="mb-5 text-center lg:text-left">Top Movies</h1>
          <SliderUtil data={topMovies} />
        </div>

        <div className="w-full mb-8">
          <h1 className="mb-5 text-center lg:text-left">Choose Movie</h1>
          <SliderUtil data={filteredMovies} />
        </div>
      </section>
    </div>
  );
};

export default MoviesContainerPage;
