import SecondaryCard from "./SecondaryCard";
import VideoCard from "./VideoCard";
import RealTimeCard from "./RealTimeCard"; // Corrected import statement

import {
  useGetTopMoviesQuery,
  useGetAllMoviesQuery,
} from "../../../../redux/api/movies";
import { useGetUsersQuery } from "../../../../redux/api/users";

const Main = () => {
  // Fetching data using hooks
  const { data: topMovies } = useGetTopMoviesQuery();
  const { data: visitors } = useGetUsersQuery();
  const { data: allMovies } = useGetAllMoviesQuery();

  // Calculating the total number of comments
  const totalCommentsLength = allMovies?.map((m) => m.numReviews);
  const sumOfCommentsLength = totalCommentsLength?.reduce(
    (acc, length) => acc + length,
    0
  );

  return (
    <div>
      <section className="flex justify-around">
        {/* Main content area */}
        <div className="ml-[14rem] mt-10">
          {/* Displaying summary cards */}
          <div className="-translate-x-4 flex">
            <SecondaryCard
              pill="Users"
              content={visitors?.length}
              gradient="from-blue-500 to-purple-400"
            />
            <SecondaryCard
              pill="Comments"
              content={sumOfCommentsLength}
              gradient="from-green-500 to-teal-400"
            />
            <SecondaryCard
              pill="Movies"
              content={allMovies?.length}
              gradient="from-blue-500 to-purple-400"
            />
          </div>

          {/* Top content header */}
          <div className="flex justify-between w-[90%] text-white mt-10 font-bold">
            <p>Top Content</p>
            <p>Comments</p>
          </div>

          {/* Displaying top movies */}
          {topMovies?.map((movie) => (
            <VideoCard
              key={movie._id}
              image={movie.image}
              title={movie.name}
              date={movie.year}
              comments={movie.numReviews}
            />
          ))}
        </div>

        {/* Real-time updates section */}
        <div>
          <RealTimeCard />
        </div>
      </section>
    </div>
  );
};

export default Main;
