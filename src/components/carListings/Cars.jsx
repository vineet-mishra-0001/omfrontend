import React, { useState, useRef, useEffect } from "react";
import { Star, Users, Gauge, Cylinder, Calendar, ChevronLeft, ChevronRight, Shield, Heart, Zap, Award } from "lucide-react";
import { Link } from "react-router-dom";

const CarListingSection = ({ carsData }) => {
  // Use the carsData prop directly or initialize with an empty array if undefined
  const [cars, setCars] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef(null);
  
  // Carousel configuration
  const cardWidth = 320; // Width of each card
  const cardGap = 24; // Gap between cards
  const totalCards = cars?.length || 0;
  const visibleCards = Math.min(3, totalCards); // Show up to 3 cards at once
  const maxIndex = Math.max(0, totalCards - visibleCards);

  // Update local cars state when carsData prop changes
  useEffect(() => {
    if (carsData) {
      setCars(carsData);
    }
  }, [carsData]);

  // Auto-advance carousel
  useEffect(() => {
    if (totalCards <= visibleCards) return;
    
    const interval = setInterval(() => {
      if (!isAnimating) {
        handleNext();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, isAnimating, totalCards, visibleCards]);

  // Favorites state
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (carId) => {
    if (favorites.includes(carId)) {
      setFavorites(favorites.filter(id => id !== carId));
    } else {
      setFavorites([...favorites, carId]);
    }
  };

  const handlePrev = () => {
    if (isAnimating || currentIndex === 0) return;
    
    setIsAnimating(true);
    setCurrentIndex(prev => Math.max(0, prev - 1));
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const handleNext = () => {
    if (isAnimating || currentIndex >= maxIndex) return;
    
    setIsAnimating(true);
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const handleDotClick = (index) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex(index);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Calculate pagination dots
  const totalDots = Math.ceil(totalCards / visibleCards);
  const dots = Array.from({ length: totalDots }, (_, i) => i);

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 text-blue-500 fill-blue-500" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="h-4 w-4 text-gray-300" />
            <div className="absolute top-0 left-0 overflow-hidden w-1/2">
              <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    
    return stars;
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="mb-20 text-center">
          <span className="inline-block px-6 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4 shadow-sm">
            Premium Fleet
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Find the Perfect Car for Your Journey
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our wide range of well-maintained vehicles for any occasion.
            From luxury models to eco-friendly options, we have the ideal car for you.
          </p>
        </div>

        {/* Car Carousel */}
        <div className="relative max-w-7xl mx-auto">
          {/* Left navigation arrow */}
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0 || isAnimating}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 p-3 rounded-full bg-white shadow-lg transition-all duration-300 ${
              currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 hover:text-blue-600'
            }`}
            aria-label="Previous cars"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          {/* Car Cards */}
          <div 
            ref={carouselRef}
            className="overflow-hidden"
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(-${currentIndex * (cardWidth + cardGap)}px)`,
                width: `${totalCards * (cardWidth + cardGap)}px`
              }}
            >
              {cars.length > 0 ? cars.map((car) => {
                const CardContent = (
                  <div 
                    key={car._id} 
                    className="flex-none w-80 mx-4 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 relative group"
                  >
                    {/* Car Image with hover effect */}
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={car?.image || "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"} 
                        crossOrigin="anonymous"
                        alt={car.name} 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-medium shadow-md">
                          {car.category}
                        </span>
                        {car.discount && (
                          <span className="inline-block px-3 py-1 rounded-full bg-red-500 text-white text-xs font-medium shadow-md">
                            {car.discount}
                          </span>
                        )}
                      </div>
                      {!car.available && (
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center backdrop-blur-sm">
                          <span className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-md shadow-lg">
                            Currently Unavailable
                          </span>
                        </div>
                      )}
                      
                      {/* Favorite button */}
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(car._id);
                        }}
                        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300"
                      >
                        <Heart 
                          className={`h-5 w-5 ${favorites.includes(car._id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
                        />
                      </button>
                      
                      {/* Eco-friendly badge */}
                      {car.features?.fuelType === "Electric" && (
                        <div className="absolute bottom-4 left-4 bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium flex items-center shadow-md">
                          <Zap className="h-3 w-3 mr-1" />
                          Eco-friendly
                        </div>
                      )}
                    </div>

                    {/* Car Details */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{car.name}</h3>
                        <div className="flex items-center">
                          <div className="flex mr-1">
                            {renderStars(car.rating)}
                          </div>
                          <span className="text-sm text-gray-500">({car.reviews})</span>
                        </div>
                      </div>

                      {/* Car Features */}
                      <div className="grid grid-cols-2 gap-3 mt-4 mb-5">
                        <div className="flex items-center">
                          <div className="p-1.5 rounded-full bg-blue-50 text-blue-500 mr-2">
                            <Users className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-sm text-gray-600">{car.features?.seats} Seats</span>
                        </div>
                        <div className="flex items-center">
                          <div className="p-1.5 rounded-full bg-blue-50 text-blue-500 mr-2">
                            <Gauge className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-sm text-gray-600">{car.features?.mileage}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="p-1.5 rounded-full bg-blue-50 text-blue-500 mr-2">
                            <Cylinder className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-sm text-gray-600">{car.features?.fuelType}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="p-1.5 rounded-full bg-blue-50 text-blue-500 mr-2">
                            <Calendar className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-sm text-gray-600">{car.features?.year}</span>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-4 mt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-gray-500 text-sm">Price</span>
                            <div className="flex items-baseline">
                              <span className="text-2xl font-bold text-blue-600">${car.price}</span>
                              <span className="text-gray-500 text-sm ml-1">/day</span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              // Handle booking
                            }}
                            disabled={!car.available}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                              car.available
                                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            {car.available ? "Book Now" : "Unavailable"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );

                return car.available ? (
                  <Link to={`/details/${car._id}`} key={car._id}>
                    {CardContent}
                  </Link>
                ) : (
                  <div key={car._id} className="cursor-not-allowed">
                    {CardContent}
                  </div>
                );
              }) : (
                <div className="col-span-3 text-center py-10">No cars available</div>
              )}
            </div>
          </div>

          {/* Right navigation arrow */}
          <button 
            onClick={handleNext}
            disabled={currentIndex >= maxIndex || isAnimating}
            className={`absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 p-3 rounded-full bg-white shadow-lg transition-all duration-300 ${
              currentIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 hover:text-blue-600'
            }`}
            aria-label="Next cars"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Pagination dots */}
        {totalDots > 1 && (
          <div className="flex justify-center mt-10">
            <div className="flex space-x-2">
              {dots.map((dotIndex) => (
                <button
                  key={dotIndex}
                  onClick={() => handleDotClick(dotIndex * visibleCards)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    dotIndex === Math.floor(currentIndex / visibleCards)
                      ? 'w-6 bg-blue-600'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${dotIndex + 1}`}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Call to action button */}
        <div className="flex justify-center mt-12">
          <Link 
            to={'/cars/all'} 
            className="bg-blue-600 text-white uppercase font-bold py-3 px-8 text-sm tracking-wider rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
          >
            Browse All Cars
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CarListingSection;


