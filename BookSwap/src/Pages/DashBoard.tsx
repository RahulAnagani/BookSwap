import Book from "../components/Book";
import Genre from "../components/Genre";
import Inbox from "../components/Inbox";
import NavBar from "../components/NavBar";
import { FaMoneyBillTrendUp } from "react-icons/fa6";

const DashBoard = () => {
  const genres = [
    { value: "Fantasy", bg: "bg-purple-500" },
    { value: "Sci-Fi", bg: "bg-indigo-600" },
    { value: "Romance", bg: "bg-pink-500" },
    { value: "Thriller", bg: "bg-red-500" },
    { value: "Mystery", bg: "bg-gray-700" },
    { value: "Non-fiction", bg: "bg-green-600" },
  ];

  return (
    <div className="w-screen h-screen bg-white overflow-x-hidden">
      <div className="h-[10%] w-full">
        <NavBar />
      </div>

      <div className="h-[90%] w-full flex gap-4 p-5 overflow-hidden">
        <div className="w-[75%] h-full flex flex-col overflow-hidden">
          <h1 className="text-3xl font-bold">Welcome back, Rahul!</h1>

          <div className="flex-1 overflow-y-auto mt-4 pr-2">
            <div className="w-full p-2">
              <h1 className="flex gap-2 items-center text-xl font-bold">
                Top Genres <FaMoneyBillTrendUp />
              </h1>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
                {genres.map((e, i) => (
                  <Genre value={e.value} bg={e.bg} key={i} />
                ))}
              </div>
            </div>

            <div className="w-full mt-6 p-2">
              <h1 className="text-xl font-bold flex items-center gap-2">
                Trending Books <img className="w-10" src="trend.svg" alt="trend" />
              </h1>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mt-4">
                {Array.from({ length: 25 }).map((_, i) => (
                  <Book
                    key={i}
                    title="The Great Gatsby"
                    author="F. Scott Fitzgerald"
                    rating={5}
                    genre="classic"
                    badge=""
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-[25%] h-full flex justify-center items-center  overflow-y-auto">
                <Inbox></Inbox>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
