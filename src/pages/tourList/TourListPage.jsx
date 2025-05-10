import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { paginatedTours } from "../../redux/carSlice";
import CarRentalLoader from "../../components/loader/Loader";
import { Link } from "react-router-dom";

// Filter categories
const difficulties = ["All", "Easy", "Moderate", "Challenging", "Difficult"];
const durations = ["All", "1-5 Days", "6-10 Days", "11+ Days"];
const priceRanges = ["All", "Under $1000", "$1000-$2000", "Over $2000"];

const TourListPage = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const tours = useSelector((state) => state?.car?.paginateTours?.tours);
  const loading = useSelector((state) => state?.car?.status);
  const { totalPages } = useSelector((state) => state?.car?.paginateTours);
  const [filteredTours, setFilteredTours] = useState(tours);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("recommended");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  console.log("tours", tours);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(paginatedTours({ page: currentPage }));
  }, [dispatch, currentPage]);

  // Apply filters and search
  useEffect(() => {
    let result = tours;

    // Apply search
    if (searchQuery) {
      result = result.filter(
        (tour) =>
          tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tour.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply difficulty filter
    if (selectedDifficulty !== "All") {
      result = result.filter((tour) => tour.difficulty === selectedDifficulty);
    }

    // Apply duration filter
    if (selectedDuration !== "All") {
      if (selectedDuration === "1-5 Days") {
        result = result.filter((tour) => parseInt(tour.duration) <= 5);
      } else if (selectedDuration === "6-10 Days") {
        result = result.filter(
          (tour) =>
            parseInt(tour.duration) >= 6 && parseInt(tour.duration) <= 10
        );
      } else if (selectedDuration === "11+ Days") {
        result = result.filter((tour) => parseInt(tour.duration) >= 11);
      }
    }

    // Apply price filter
    if (selectedPrice !== "All") {
      if (selectedPrice === "Under $1000") {
        result = result.filter(
          (tour) =>
            parseInt(tour.price.replace("$", "").replace(",", "")) < 1000
        );
      } else if (selectedPrice === "$1000-$2000") {
        const price = parseInt(tour.price.replace("$", "").replace(",", ""));
        result = result.filter((tour) => price >= 1000 && price <= 2000);
      } else if (selectedPrice === "Over $2000") {
        result = result.filter(
          (tour) =>
            parseInt(tour.price.replace("$", "").replace(",", "")) > 2000
        );
      }
    }

    // Apply sorting
    if (sortOption === "price-asc") {
      result.sort(
        (a, b) =>
          parseInt(a.price.replace("$", "").replace(",", "")) -
          parseInt(b.price.replace("$", "").replace(",", ""))
      );
    } else if (sortOption === "price-desc") {
      result.sort(
        (a, b) =>
          parseInt(b.price.replace("$", "").replace(",", "")) -
          parseInt(a.price.replace("$", "").replace(",", ""))
      );
    } else if (sortOption === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === "duration") {
      result.sort((a, b) => parseInt(b.duration) - parseInt(a.duration));
    }

    setFilteredTours(result);
  }, [
    searchQuery,
    selectedDifficulty,
    selectedDuration,
    selectedPrice,
    sortOption,
    tours, // Add this
  ]);

  if (loading === "loading") {
    return <CarRentalLoader />;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <div className="relative  h-64 lg:h-80">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{
            backgroundImage: `url('https://media.istockphoto.com/id/1030238834/vector/india-famous-landmark-silhouette-style-with-row-design-on-sunset-time.jpg?s=612x612&w=0&k=20&c=c6oqMsZCYRdxteHG34RV_mddiNB2bXSRDKxrUnqIOBY=')`,
          }}
        ></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Amazing Tours
          </h1>
          <p className="text-xl max-w-xl">
            Find your perfect adventure with our handpicked selection of
            breathtaking destinations
          </p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search bar */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search tours by name or location..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-3 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Filter button (mobile) */}
            <button
              className="md:hidden bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center"
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters
            </button>

            {/* Desktop filters */}
            <div className="hidden md:flex space-x-2">
              {/* Difficulty filter */}
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === "All" ? "Difficulty" : difficulty}
                  </option>
                ))}
              </select>

              {/* Duration filter */}
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
              >
                {durations.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration === "All" ? "Duration" : duration}
                  </option>
                ))}
              </select>

              {/* Price filter */}
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
              >
                {priceRanges.map((price) => (
                  <option key={price} value={price}>
                    {price === "All" ? "Price" : price}
                  </option>
                ))}
              </select>

              {/* Sort options */}
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="duration">Longest Duration</option>
              </select>
            </div>
          </div>

          {/* Mobile filter menu */}
          {isFilterMenuOpen && (
            <div className="md:hidden mt-4 bg-white p-4 border-t border-gray-200">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                  >
                    {difficulties.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                  >
                    {durations.map((duration) => (
                      <option key={duration} value={duration}>
                        {duration}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Range
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                  >
                    {priceRanges.map((price) => (
                      <option key={price} value={price}>
                        {price}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="duration">Longest Duration</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Results info */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {filteredTours?.length}{" "}
            {filteredTours?.length === 1 ? "tour" : "tours"} found
          </h2>
        </div>

        {/* Tours grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTours?.map((tour) => (
            <div
              key={tour._id}
              className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Tour image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={tour.images[0]}
                  alt={tour.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-2 rounded-full text-sm font-medium">
                  {tour.difficulty}
                </div>
              </div>

              {/* Card content */}
              <div className="p-4">
                <div className="flex items-center text-gray-500 text-sm mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {tour.location}
                </div>
                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                  {tour.title}
                </h3>

                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-yellow-400 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-medium">{tour.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">
                      ({tour.reviews})
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {tour.duration}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-bold text-xl">
                    {tour.price}
                  </span>
                  <Link
                    to={`/tours/in/${tour.title}/${tour._id}?price=${tour?.price}&&duration=${tour?.duration}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {tours?.length === 0 && (
          <div className="text-center py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No tours found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => {
                setSearchQuery("");
                setSelectedDifficulty("All");
                setSelectedDuration("All");
                setSelectedPrice("All");
                setSortOption("recommended");
              }}
            >
              Reset all filters
            </button>
          </div>
        )}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-1">
              {/* Previous Button */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-md ${
                      page === currentPage
                        ? "bg-blue-600 text-white font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next Button */}
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="px-3 py-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourListPage;
