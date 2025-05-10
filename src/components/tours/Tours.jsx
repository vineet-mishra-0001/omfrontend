import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTours } from '../../redux/carSlice';
import { Link } from 'react-router-dom';

const TravelDestinationsCarousel = ({tours, place}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef(null);
  const cardWidth = 288; // w-72 = 18rem = 288px
  const cardGap = 16; // space-x-4 = 1rem = 16px
  const totalCards = tours?.length || 0;
  const visibleCards = Math.min(4, totalCards); // Show up to 4 cards at once
  const maxIndex = Math.max(0, totalCards - visibleCards);

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

  return (
    <div className="w-full mx-auto px-4 py-12 bg-gradient-to-b from-gray-50 to-white">
      {/* Header with decorative lines */}
      <div className="flex items-center justify-center mb-12">
        <div className="h-px w-12 bg-gray-300"></div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 px-6 text-center">
          Top Travel Destinations In {place}
        </h2>
        <div className="h-px w-12 bg-gray-300"></div>
      </div>

      {/* Cards container with navigation arrows */}
      <div className="relative max-w-7xl mx-auto">
        {/* Left navigation arrow */}
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0 || isAnimating}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 p-2 rounded-full bg-white shadow-lg transition-all duration-300 ${
            currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
          }`}
          aria-label="Previous destinations"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>

        {/* Cards */}
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
            {tours && tours?.map((destination) => (
              <Link 
                to={`/tours/in/${destination.title}/${destination._id}?price=${destination?.price}&&duration=${destination?.duration}`} 
                key={destination._id} 
                className="flex-none w-72 mx-4 relative group"
              >
                {/* Card Image */}
                <div className="rounded-xl overflow-hidden mb-4 shadow-md group-hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-48">
                    <img 
                      src={destination.images[0]} 
                      alt={destination.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                    />
                    
                    {/* Rating badge */}
                    {destination.rating && (
                      <div className="absolute top-3 left-3 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center text-xs font-medium">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
                        <span>{destination.rating}</span>
                      </div>
                    )}
                    
                    {/* Circular arrow button */}
                    <div className="absolute bottom-3 right-3">
                      <div className="bg-white rounded-full p-2 shadow-md group-hover:bg-blue-50 transition-colors duration-300">
                        <ArrowUpRight className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="px-2">
                  <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {destination.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {destination.description}
                  </p>
                  
                  {/* Price and duration */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-blue-600">
                      ${destination.price}
                    </span>
                    <span className="text-gray-500">
                      {destination.duration} days
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right navigation arrow */}
        <button 
          onClick={handleNext}
          disabled={currentIndex >= maxIndex || isAnimating}
          className={`absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 p-2 rounded-full bg-white shadow-lg transition-all duration-300 ${
            currentIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
          }`}
          aria-label="Next destinations"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Pagination dots */}
      {totalDots > 1 && (
        <div className="flex justify-center mt-8">
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
      <div className="flex justify-center mt-10">
        <Link 
          to='/tours/all' 
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white uppercase font-bold py-3 px-8 text-sm tracking-wider rounded-full shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
        >
          Discover More
        </Link>
      </div>
    </div>
  );
};

export default TravelDestinationsCarousel;