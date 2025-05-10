import React, { useState, useEffect, useRef } from "react";
import { 
  Star, Users, Gauge, Cylinder, Calendar, ChevronLeft, ChevronRight, 
  Heart, Zap, Award, Search, Sliders, ChevronDown, X, Filter, Shield
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCars } from "../../redux/carSlice";
import CarRentalLoader from "../../components/loader/Loader";

const CarListingPage = () => {

  const [filteredCars, setFilteredCars] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch();
  const { cars,  status } = useSelector((state) => state?.car);
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchCars());
  }, [dispatch]);
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // Available filter options (would be dynamically generated from data in a real app)
  const categoryOptions = ["Electric", "Luxury", "SUV", "Sedan", "Sports"];
  const fuelTypeOptions = ["Electric", "Hybrid", "Gasoline", "Diesel"];
  const transmissionOptions = ["Automatic", "Manual"];
  const seatsOptions = [2, 4, 5, 7, 8];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const carsPerPage = 6; // 6 cars per page
  
  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef(null);
  
  // Carousel dimensions
  const cardWidth = 320; // Width of each car card
  const cardGap = 24; // Gap between cards
  const visibleCards = 3; // Number of cards visible at once
  
  // Calculate total cards and max index
  const totalCards = filteredCars.length;
  const maxIndex = Math.max(0, totalCards - visibleCards);
  const totalDots = Math.ceil(totalCards / visibleCards);
  const dots = Array.from({ length: totalDots }, (_, i) => i);
  
  // Carousel navigation handlers
  const handlePrev = () => {
    if (currentIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentIndex(prev => Math.max(0, prev - 1));
      setTimeout(() => setIsAnimating(false), 500);
    }
  };
  
  const handleNext = () => {
    if (currentIndex < maxIndex && !isAnimating) {
      setIsAnimating(true);
      setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
      setTimeout(() => setIsAnimating(false), 500);
    }
  };
  
  const handleDotClick = (index) => {
    if (index !== currentIndex && !isAnimating) {
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };
  
  // Auto-advance carousel
  useEffect(() => {
    if (totalCards > visibleCards) {
      const interval = setInterval(() => {
        if (!isAnimating) {
          setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [totalCards, visibleCards, maxIndex, isAnimating]);
  
  // Initialize with sample data or incoming data
// This effect runs when component mounts
useEffect(() => {
    if (cars && cars.length > 0) {
      setFilteredCars(cars);
    } else {
      setFilteredCars([]);
    }
  }, [cars]);

  // Apply filters when any filter changes
  useEffect(() => {
    let results = [...cars];
  
    // Search filter
    if (searchTerm) {
      results = results.filter(car =>
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  
    // Category filter
    if (selectedCategories.length > 0) {
      console.log('selectedCategories',selectedCategories);
      results = results.filter(car => selectedCategories.includes(car.category));
    }
  
    // Fuel type filter
    if (selectedFuelTypes.length > 0) {
      console.log('selectedFuelTypes',selectedFuelTypes);
      results = results.filter(car => selectedFuelTypes.includes(car.features.fuelType));
    }
  
    // Transmission filter
    if (selectedTransmissions.length > 0) {
      console.log('selectedTransmissions',selectedTransmissions);
      results = results.filter(car => selectedTransmissions.includes(car.features.transmission));
    }
  
    // Seats filter
      if (selectedSeats.length > 0) {
      console.log('selectedSeats',selectedSeats);
      results = results.filter(car => selectedSeats.includes(car.features.seats));
    }
  
    console.log('results>><<<>>>?', results);
    // Price range filter
   

    setFilteredCars(results);
    setCurrentPage(0);
    console.log('Filtered results:', results);
  }, [
    cars,
    searchTerm,
    selectedCategories,
    selectedFuelTypes,
    selectedTransmissions,
    selectedSeats,
    priceRange
  ]);
  
  // Optional: log filteredCars when it updates
  useEffect(() => {
    console.log('Updated filteredCars state:', filteredCars);
  }, [filteredCars]);
  
  
  // Pagination calculations
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  const currentCars = filteredCars.slice(
    currentPage * carsPerPage,
    (currentPage + 1) * carsPerPage
  );
  console.log(filteredCars);
  console.log(currentCars);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      // Scroll to top of listing
      window.scrollTo({ top: document.getElementById('car-listings').offsetTop - 100, behavior: 'smooth' });
    }
  };

  // Toggle favorite
  const toggleFavorite = (carId) => {
    if (favorites.includes(carId)) {
      setFavorites(favorites.filter(id => id !== carId));
    } else {
      setFavorites([...favorites, carId]);
    }
  };

  // Handle booking
  const handleBookNow = (carId) => {
    console.log(`Car with ID ${carId} booked!`);
    // Implement booking functionality here
  };

  // Toggle category selection
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Toggle fuel type selection
  const toggleFuelType = (fuelType) => {
    if (selectedFuelTypes.includes(fuelType)) {
      setSelectedFuelTypes(selectedFuelTypes.filter(f => f !== fuelType));
    } else {
      setSelectedFuelTypes([...selectedFuelTypes, fuelType]);
    }
  };

  // Toggle transmission selection
  const toggleTransmission = (transmission) => {
    if (selectedTransmissions.includes(transmission)) {
      setSelectedTransmissions(selectedTransmissions.filter(t => t !== transmission));
    } else {
      setSelectedTransmissions([...selectedTransmissions, transmission]);
    }
  };

  // Toggle seats selection
  const toggleSeats = (seats) => {
    if (selectedSeats.includes(seats)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seats));
    } else {
      setSelectedSeats([...selectedSeats, seats]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedFuelTypes([]);
    setSelectedTransmissions([]);
    setSelectedSeats([]);
    setPriceRange([0, 500]);
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="h-4 w-4 text-gray-300" />
            <div className="absolute top-0 left-0 overflow-hidden w-1/2">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    
    return stars;
  };

  // Count active filters
  const activeFilterCount = 
    selectedCategories.length + 
    selectedFuelTypes.length + 
    selectedTransmissions.length + 
    selectedSeats.length + 
    (priceRange[0] > 0 || priceRange[1] < 500 ? 1 : 0);


    if(status === 'loading') {

        return <CarRentalLoader />
    }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-[600px] bg-gradient-to-r from-blue-900 to-indigo-800 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/50 opacity-60"></div>
          <img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
            alt="Luxury cars" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="max-w-3xl text-white">
            <span className="inline-block px-6 py-2 rounded-full bg-blue-600 bg-opacity-30 border border-blue-300 text-blue-50 text-sm font-medium mb-4 backdrop-blur-sm">
              Premium Car Rental
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Drive Your Dreams
              <span className="text-blue-400 block">Anywhere, Anytime</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl">
              Experience luxury, comfort, and performance with our premium fleet of vehicles. From city drives to cross-country adventures, we have the perfect car for your journey.
            </p>
          
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="absolute bottom-20 left-0 right-0 transform translate-y-1/2">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by car name, type, features..."
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-colors duration-300"
              >
                <Sliders className="h-5 w-5" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-blue-600 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-32 pb-20">
        {/* Filters Drawer */}
        <div className={`bg-white rounded-2xl shadow-lg mb-12 overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                <Filter className="h-5 w-5 inline mr-2" />
                Filters
              </h3>
              <div className="flex space-x-4">
                <button 
                  onClick={clearFilters}
                  className="flex items-center text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </button>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Close
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Categories */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Car Type</h4>
                <div className="space-y-2">
                  {categoryOptions.map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`category-${category}`} className="ml-2 text-gray-600">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Fuel Type */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Fuel Type</h4>
                <div className="space-y-2">
                  {fuelTypeOptions.map((fuelType) => (
                    <div key={fuelType} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`fuel-${fuelType}`}
                        checked={selectedFuelTypes.includes(fuelType)}
                        onChange={() => toggleFuelType(fuelType)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`fuel-${fuelType}`} className="ml-2 text-gray-600">
                        {fuelType}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Transmission */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Transmission</h4>
                <div className="space-y-2">
                  {transmissionOptions.map((transmission) => (
                    <div key={transmission} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`transmission-${transmission}`}
                        checked={selectedTransmissions.includes(transmission)}
                        onChange={() => toggleTransmission(transmission)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`transmission-${transmission}`} className="ml-2 text-gray-600">
                        {transmission}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Seats */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Seats</h4>
                <div className="space-y-2">
                  {seatsOptions.map((seats) => (
                    <div key={seats} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`seats-${seats}`}
                        checked={selectedSeats.includes(seats)}
                        onChange={() => toggleSeats(seats)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`seats-${seats}`} className="ml-2 text-gray-600">
                        {seats} Seats
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Price Range */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-3">Price Range ($ per day)</h4>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-gray-600 w-12 text-center">{priceRange[0]}</span>
                <span className="text-gray-400">-</span>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-gray-600 w-12 text-center">{priceRange[1]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div id="car-listings" className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Available Cars
              </h2>
              <p className="text-gray-600 mt-1">
                {filteredCars.length} cars found
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Sort by:</span>
                <div className="relative">
                  <select className="appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Best Rating</option>
                    <option>Newest</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Applied Filters Tags */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategories.map(category => (
                <div key={`tag-${category}`} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  {category}
                  <button onClick={() => toggleCategory(category)} className="ml-1 p-0.5 hover:bg-blue-100 rounded-full">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              
              {selectedFuelTypes.map(fuelType => (
                <div key={`tag-${fuelType}`} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  {fuelType}
                  <button onClick={() => toggleFuelType(fuelType)} className="ml-1 p-0.5 hover:bg-blue-100 rounded-full">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              
              {selectedTransmissions.map(transmission => (
                <div key={`tag-${transmission}`} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  {transmission}
                  <button onClick={() => toggleTransmission(transmission)} className="ml-1 p-0.5 hover:bg-blue-100 rounded-full">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              
              {selectedSeats.map(seats => (
                <div key={`tag-seats-${seats}`} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  {seats} Seats
                  <button onClick={() => toggleSeats(seats)} className="ml-1 p-0.5 hover:bg-blue-100 rounded-full">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              
              {(priceRange[0] > 0 || priceRange[1] < 500) && (
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  ${priceRange[0]} - ${priceRange[1]}
                  <button 
                    onClick={() => setPriceRange([0, 500])} 
                    className="ml-1 p-0.5 hover:bg-blue-100 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Car Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentCars.length > 0 ? (
              currentCars.map((car) => (
                <Link 
                  to={`/details/${car._id}`}
                  key={car._id} 
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative group transform hover:-translate-y-1"
                >
                  {/* Car Image with hover effect */}
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={car?.image || "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"}
                      crossOrigin="anonymous"
                      alt={car.name} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-medium shadow-md">
                        {car.category}
                      </span>
                      {car.discount && (
                        <span className="inline-block px-3 py-1 rounded-full bg-red-500 text-white text-xs font-medium shadow-md animate-pulse">
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
                    
                    {/* Popular tag */}
                    {car.popular && (
                      <div className="absolute bottom-4 right-4 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium flex items-center shadow-md">
                       <Award className="h-3 w-3 mr-1" />
                        Popular Choice
                      </div>
                    )}
                    
                    {/* Promoted ribbon */}
                    {car.promoted && (
                      <div className="absolute top-0 right-0">
                        <div className="bg-blue-600 text-white text-xs font-bold py-1 px-4 transform rotate-45 translate-x-7 translate-y-5 shadow-lg">
                          Featured
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Car Details */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{car.name}</h3>
                      <div className="flex items-center">
                        <div className="flex mr-1">
                          {renderStars(car.rating)}
                        </div>
                        <span className="text-sm text-gray-500">({car.reviews})</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{car.description}</p>

                    {/* Car Features */}
                    <div className="grid grid-cols-2 gap-3 mt-4 mb-5">
                      <div className="flex items-center group">
                        <div className="p-1.5 rounded-full bg-blue-50 text-blue-500 group-hover:bg-blue-100 transition-colors duration-300 mr-2">
                          <Users className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm text-gray-600">{car.features.seats} Seats</span>
                      </div>
                      <div className="flex items-center group">
                        <div className="p-1.5 rounded-full bg-blue-50 text-blue-500 group-hover:bg-blue-100 transition-colors duration-300 mr-2">
                          <Gauge className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm text-gray-600">{car.features.mileage}</span>
                      </div>
                      <div className="flex items-center group">
                        <div className="p-1.5 rounded-full bg-blue-50 text-blue-500 group-hover:bg-blue-100 transition-colors duration-300 mr-2">
                          <Cylinder className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm text-gray-600">{car.features.fuelType}</span>
                      </div>
                      <div className="flex items-center group">
                        <div className="p-1.5 rounded-full bg-blue-50 text-blue-500 group-hover:bg-blue-100 transition-colors duration-300 mr-2">
                          <Calendar className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm text-gray-600">{car.features.year}</span>
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
                            handleBookNow(car._id);
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

                  {/* Badge for special features */}
                  {car.features.fuelType === "Electric" && (
                    <div className="absolute top-4 right-16 bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium flex items-center shadow-md">
                      <Zap className="h-3 w-3 mr-1" />
                      Eco-friendly
                    </div>
                  )}
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-20 bg-white rounded-2xl shadow">
                <div className="flex flex-col items-center">
                  <Search className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No cars found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters to find more options</p>
                  <button 
                    onClick={clearFilters}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-300"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {filteredCars.length > carsPerPage && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className={`p-2 rounded-full transition-colors duration-300 ${
                    currentPage === 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index)}
                    className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentPage === index
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className={`p-2 rounded-full transition-colors duration-300 ${
                    currentPage === totalPages - 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Why Choose Us Section */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50 rounded-3xl shadow-sm mb-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block px-6 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4 shadow-sm">
                Our Services
              </span>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Why Choose Our Car Rental Service
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We provide premium car rental services with a focus on quality, reliability, and customer satisfaction.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Secure Booking</h3>
                <p className="text-gray-600 text-center">
                  Our booking process is secure and straightforward, ensuring a hassle-free experience.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Premium Fleet</h3>
                <p className="text-gray-600 text-center">
                  We maintain a diverse fleet of well-maintained vehicles to meet all your needs.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">Flexible Rentals</h3>
                <p className="text-gray-600 text-center">
                  Choose from daily, weekly, or monthly rental options with flexible pickup and return times.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">24/7 Support</h3>
                <p className="text-gray-600 text-center">
                  Our customer support team is available around the clock to assist you with any queries.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20 bg-gradient-to-r from-blue-900 to-indigo-800 rounded-3xl shadow-lg mb-20 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <img 
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
              alt="Background" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block px-6 py-2 rounded-full bg-blue-600 bg-opacity-30 border border-blue-300 text-blue-50 text-sm font-medium mb-4 backdrop-blur-sm">
                Testimonials
              </span>
              <h2 className="text-4xl font-bold mb-4">
                What Our Customers Say
              </h2>
              <p className="text-blue-100 max-w-2xl mx-auto">
                Don't just take our word for it. Here's what our satisfied customers have to say about their experience with us.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                  ))}
                </div>
                <p className="text-blue-50 mb-6">
                  "The car was immaculate and exactly as described. The pickup and return process was smooth and efficient. Will definitely rent again!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-4">
                    <span className="text-white font-bold">RK</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Rajesh Kumar</h4>
                    <p className="text-blue-200 text-sm">Business Traveler</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                  ))}
                </div>
                <p className="text-blue-50 mb-6">
                  "Exceptional service! The staff was friendly and helpful. The car was clean and well-maintained. Highly recommend for anyone looking for a reliable car rental service."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-4">
                    <span className="text-white font-bold">SP</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Sneha Patel</h4>
                    <p className="text-blue-200 text-sm">Family Vacation</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                  ))}
                </div>
                <p className="text-blue-50 mb-6">
                  "I've rented cars from many places, but this service stands out for its professionalism and attention to detail. The online booking was easy, and the car was ready when I arrived."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-4">
                    <span className="text-white font-bold">AM</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Amit Mishra</h4>
                    <p className="text-blue-200 text-sm">Weekend Getaway</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-20 bg-white rounded-3xl shadow-sm mb-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block px-6 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4 shadow-sm">
                FAQ
              </span>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions about our car rental services.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">What documents do I need to rent a car?</h3>
                  <p className="text-gray-600">
                    You'll need a valid driver's license, proof of insurance, and a credit card in your name. International renters may need additional documentation.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">What is your cancellation policy?</h3>
                  <p className="text-gray-600">
                    You can cancel your reservation up to 24 hours before your scheduled pickup time for a full refund. Cancellations made within 24 hours may incur a fee.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Do you offer airport pickup and drop-off?</h3>
                  <p className="text-gray-600">
                    Yes, we offer convenient airport pickup and drop-off services at major airports. You can select this option during the booking process.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">What happens if I return the car late?</h3>
                  <p className="text-gray-600">
                    Late returns may incur additional charges. We recommend contacting us if you anticipate being late to discuss options and avoid extra fees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl shadow-lg text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Book your perfect car today and enjoy a seamless rental experience with our premium service.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/cars/all" 
                className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Browse All Cars
              </Link>
              <Link 
                to="/contact" 
                className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white/10 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CarListingPage;