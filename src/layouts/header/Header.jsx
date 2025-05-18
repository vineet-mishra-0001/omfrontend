import React, { useState, useContext, useEffect } from 'react';
import { Search, User, Menu, X, LogOut, Star, Car, MapPin } from 'lucide-react';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { apiClient } from '../../api/ApiRequest';

const CarRentalHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      setLoading(true);
      try {
        const response = await apiClient.get(`/tours/search?search=${query}`);
        const { tours, cars } = response.data;

        const results = [
          ...cars.map((car) => ({
            ...car,
            type: 'car',
            icon: <Car className="w-5 h-5 text-blue-500" />,
          })),
          ...tours.map((tour) => ({
            ...tour,
            type: 'tour',
            icon: <MapPin className="w-5 h-5 text-green-500" />,
          })),
        ];

        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (result) => {
    if (result.type === 'car') {
      navigate(`/details/${result._id}`);
    } else {
      navigate(`/tours/in/${result.title}/${result._id}`);
    }
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    updateUser(null);
  };

  return (
    <>
      <header className="w-full border-b border-b-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          {/* Desktop view */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center">
              <img
                className="h-20 w-20 mr-5 object-cover"
                src="/omt.png"
                alt=""
              />
              <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
                Ombanna Tours
              </h1>
            </div>

            <div className="w-2/5 relative">
              <div className="relative">
                <Input
                  name="search"
                  type="text"
                  placeholder="Search for cars, tours, or locations..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() =>
                    setTimeout(() => setIsSearchFocused(false), 200)
                  }
                  isExpanded={
                    isSearchFocused && (searchResults.length > 0 || loading)
                  }
                  className="py-3 pl-12 pr-4 rounded-full shadow-sm border-gray-200 hover:border-blue-300 focus:border-blue-500"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500">
                  <Search size={20} />
                </div>
              </div>

              {/* Search Results Dropdown */}
              {isSearchFocused && (searchResults.length > 0 || loading) && (
                <div className="absolute w-full bg-white rounded-b-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-[100] transform transition-all duration-300">
                  {loading ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      { searchResults && searchResults.map((result) => (
                        <div
                          key={result._id}
                          onClick={() => handleResultClick(result)}
                          className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors duration-200"
                        >
                          {result.type === 'car' ? (
                            <Car className="w-5 h-5 text-blue-500" />
                          ) : (
                            <MapPin className="w-5 h-5 text-green-500" />
                          )}
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {result.title || result.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {result.type === 'car'
                                ? `${result?.category} • 🚀 • ${result?.features?.year}`
                                : `${result?.duration} • ${result?.difficulty}`}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              result.type === 'car'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {result.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex space-x-4 w-[250px] justify-end items-center">
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <Link
                    className="flex items-center gap-3"
                    to="/myBookings/all"
                  >
                    <img
                      crossOrigin="anonymous"
                      src={
                        `https://avatar.iran.liara.run/public` 
                      }
                      alt="User Avatar"
                      
                      className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow"
                    />
                    <div className="flex flex-col items-start">
                      <p className="text-gray-500 text-xs">User</p>
                      <p className="text-gray-600 text-sm font-bold">
                        {currentUser?.username}
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm border border-red-300 rounded-full px-3 py-1 ml-4 text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              ) : (
                <>
                  <Button>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button>
                    <Link to="/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile view */}
          <div className="md:hidden flex items-center justify-between">
            <div className="flex items-center">
              <img
                className="h-10 w-10 mr-5 object-contain"
                src="/racing.png"
                alt=""
              />
              <h1 className="text-xl font-bold text-blue-600">RentWheels</h1>
            </div>

            <div className="flex items-center space-x-3">
              {currentUser ? (
                <Link className="flex items-center gap-2" to="/profile">
                  <img
                    crossOrigin="anonymous"
                    src={
                      currentUser?.avatar ? `https://api.ombannatours.com${currentUser.avatar}`  : 'https://avatar.iran.liara.run/public'
                    }
                    alt="User Avatar"
                    className="h-10 w-10 rounded-full object-cover border border-gray-200 shadow"
                  />
                </Link>
              ) : (
                <button className="p-2 text-blue-600 hover:text-blue-800">
                  <User size={20} />
                </button>
              )}
              <button
                className="p-2 text-blue-600 hover:text-blue-800"
                onClick={toggleMobileMenu}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="md:hidden mt-4 relative">
            <div className="relative">
              <Input
                name="search"
                type="text"
                placeholder="Search cars and tours..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                isExpanded={
                  isSearchFocused && (searchResults.length > 0 || loading)
                }
                className="py-2 pl-10 pr-4 rounded-full shadow-sm"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                <Search size={18} />
              </div>
            </div>

            {/* Mobile Search Results Dropdown */}
            {isSearchFocused && (searchResults.length > 0 || loading) && (
              <div className="absolute w-full bg-white rounded-b-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-[100] transform transition-all duration-300">
                {loading ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {searchResults.map((result) => (
                      <div
                        key={result._id}
                        onClick={() => handleResultClick(result)}
                        className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors duration-200"
                      >
                        {result.type === 'car' ? (
                          <Car className="w-5 h-5 text-blue-500" />
                        ) : (
                          <MapPin className="w-5 h-5 text-green-500" />
                        )}
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {result.title || result.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {result.type === 'car'
                              ? `${result.brand} • ${result.model} • ${result.year}`
                              : `${result.duration} • ${result.difficulty}`}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            result.type === 'car'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {result.type}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Subheader */}
      <div className="w-full border-b bg-white border-b-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="hidden md:block">
            <ul className="flex justify-center space-x-8 py-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-blue-600 font-medium transition py-2 border-b-2 border-transparent hover:border-blue-600"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/cars/all"
                  className="text-gray-700 hover:text-blue-600 font-medium transition py-2 border-b-2 border-transparent hover:border-blue-600"
                >
                  Cars
                </Link>
              </li>
              <li>
                <Link
                  to="/tours/all"
                  className="text-gray-700 hover:text-blue-600 font-medium transition py-2 border-b-2 border-transparent hover:border-blue-600"
                >
                  Tours
                </Link>
              </li>
              {currentUser && (
                <>
                  <li>
                    <Link
                      to="/myBookings/all"
                      className="text-gray-700 hover:text-blue-600 font-medium transition py-2 border-b-2 border-transparent hover:border-blue-600"
                    >
                      My Tour Bookings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/myCarBookings/all"
                      className="text-gray-700 hover:text-blue-600 font-medium transition py-2 border-b-2 border-transparent hover:border-blue-600"
                    >
                      My Car Bookings
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link
                  to="/blog"
                  className="text-gray-700 hover:text-blue-600 font-medium transition py-2 border-b-2 border-transparent hover:border-blue-600"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-blue-600 font-medium transition py-2 border-b-2 border-transparent hover:border-blue-600"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-700 hover:text-blue-600 font-medium transition py-2 border-b-2 border-transparent hover:border-blue-600"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/feedback"
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Star className="w-4 h-4" />
                  <span>Feedback</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white py-3 shadow-inner">
              <div className="flex flex-col items-center px-4 py-2">
                {currentUser ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 mb-2"
                    >
                      <img
                        src={
                          `https://api.ombannatours.com${currentUser.avatar}`
                        }
                        alt="User Avatar"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col items-start">
                        <p className="text-gray-500 text-xs">User</p>
                        <p className="text-gray-600 text-sm font-bold">
                          {currentUser?.username}
                        </p>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                ) : (
                  <div className="flex justify-between w-full gap-2">
                    <Button className="w-full">
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button className="w-full">
                      <Link to="/register">Sign Up</Link>
                    </Button>
                  </div>
                )}
              </div>

              <nav className="mt-2">
                <ul className="flex flex-col space-y-2">
                  <li>
                    <Link
                      to="/"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cars"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Cars
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/tours"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Tours
                    </Link>
                  </li>
                  {currentUser && (
                    <>
                      <li>
                        <Link
                          to="/myBookings/tours"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          My Tour Bookings
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/myBookings/cars"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          My Car Bookings
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <Link
                      to="/blog"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/feedback"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Feedback
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CarRentalHeader;
