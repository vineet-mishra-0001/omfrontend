import React, { useState } from "react";
import { Star, ChevronRight, ChevronLeft, Heart } from "lucide-react";

const CarListingSection = () => {
  // Sample car data
  const [cars] = useState([
    {
      id: 1,
      name: "Swift 2023",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCYiIJJc1c6Y9AsfZaCsXx5ODfbjmHDolMdw&s",
      price: "₹197/hr",
      rating: 4.5,
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 5,
      distance: "4.3 km away"
    },
    {
      id: 2,
      name: "Vitara Brezza 2022",
      image: "https://i.ytimg.com/vi/FjiexDgg_2Q/sddefault.jpg",
      price: "₹218/hr",
      rating: 4.9,
      transmission: "Manual",
      fuelType: "Petrol",
      seats: 5,
      distance: "4.9 km away"
    },
    {
      id: 3,
      name: "Kushaq 2024",
      image: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Tesla_Model_Y_1X7A6211.jpg",
      price: "₹381/hr",
      rating: 5.0,
      transmission: "Manual",
      fuelType: "Petrol",
      seats: 5,
      distance: "5.2 km away"
    },
    {
      id: 4,
      name: "Swift 2024",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/2024_Tesla_Cybertruck_Foundation_Series%2C_front_left_%28Greenwich%29.jpg/1200px-2024_Tesla_Cybertruck_Foundation_Series%2C_front_left_%28Greenwich%29.jpg",
      price: "₹188/hr",
      rating: 5.0,
      transmission: "Manual",
      fuelType: "Petrol",
      seats: 5,
      distance: "25.6 km away"
    },
    {
      id: 5,
      name: "Alto 2023",
      image: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Tesla_Model_Y_1X7A6211.jpg",
      price: "₹165/hr",
      rating: 4.7,
      transmission: "Manual",
      fuelType: "Petrol",
      seats: 5,
      distance: "3.5 km away"
    },
    {
      id: 6,
      name: "Creta 2023",
      image: "https://media.assettype.com/evoindia/import/2019/06/Ford-Mustang-Shelby-GT500.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true",
      price: "₹325/hr",
      rating: 4.8,
      transmission: "Automatic",
      fuelType: "Diesel",
      seats: 5,
      distance: "7.2 km away"
    },
    {
      id: 7,
      name: "WagonR 2022",
      image: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Tesla_Model_Y_1X7A6211.jpg",
      price: "₹210/hr",
      rating: 4.4,
      transmission: "Automatic",
      fuelType: "CNG",
      seats: 5,
      distance: "6.1 km away"
    },
    {
      id: 8,
      name: "Baleno 2023",
      image: "https://media.assettype.com/evoindia/import/2019/06/Ford-Mustang-Shelby-GT500.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true",
      price: "₹235/hr",
      rating: 4.6,
      transmission: "Automatic",
      fuelType: "Petrol",
      seats: 5,
      distance: "8.3 km away"
    }
  ]);

  // Favorites state
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (carId) => {
    if (favorites.includes(carId)) {
      setFavorites(favorites.filter(id => id !== carId));
    } else {
      setFavorites([...favorites, carId]);
    }
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const carsPerPage = 4;
  const totalPages = Math.ceil(cars.length / carsPerPage);
  
  // Get current cars to display
  const currentCars = cars.slice(
    currentPage * carsPerPage,
    (currentPage + 1) * carsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Rating badge component
  const RatingBadge = ({ rating }) => {
    // Determine color based on rating
    let bgColor = "bg-green-600";
    if (rating < 4.0) bgColor = "bg-orange-500";
    else if (rating < 4.5) bgColor = "bg-green-500";
    
    return (
      <div className={`absolute top-4 left-4 ${bgColor} text-white text-sm font-medium rounded px-2 py-1 flex items-center shadow-md`}>
        {rating} <Star className="h-4 w-4 ml-1 fill-white" />
      </div>
    );
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {currentCars.map((car) => (
            <div 
              key={car.id} 
              className="bg-white rounded-lg overflow-hidden shadow-md relative"
            >
              {/* Car Image */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={car.image} 
                  alt={car.name} 
                  className="w-full h-full object-cover"
                />
                <RatingBadge rating={car.rating} />
                
                {/* Favorite button */}
                <button 
                  onClick={() => toggleFavorite(car.id)}
                  className="absolute top-4 right-4 bg-white/80 p-2 rounded-full"
                >
                  <Heart 
                    className={`h-5 w-5 ${favorites.includes(car.id) ? 'text-red-500 fill-red-500' : 'text-white stroke-white'}`} 
                  />
                </button>
              </div>

              {/* Car Details */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{car.name}</h3>
                <p className="text-lg font-bold text-gray-900 mb-2">{car.price}</p>
                
                <p className="text-sm text-gray-600 mb-3">
                  {car.transmission} · {car.fuelType} · {car.seats} Seats
                </p>
                
                <div className="flex items-center mt-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4m0 16v-4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m16 0h-4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                    </svg>
                    {car.distance}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentPage === index
                    ? "w-8 bg-green-600"
                    : "w-2 bg-gray-300"
                }`}
                aria-label={`Page ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Browse All Button */}
        <div className="flex justify-center mt-6">
          <button className="bg-black text-white font-medium py-3 px-8 rounded uppercase tracking-wide">
            Browse All Cars
          </button>
        </div>

        {/* Additional Navigation Controls (only shown on larger screens) */}
        <div className="hidden md:block">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="absolute top-1/2 left-4 bg-white p-2 rounded-full shadow-md transform -translate-y-1/2"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="absolute top-1/2 right-4 bg-white p-2 rounded-full shadow-md transform -translate-y-1/2"
            aria-label="Next page"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CarListingSection;