import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { apiClient } from '../../api/ApiRequest';
import { formatDate } from '../../validators';
import CarRentalLoader from '../../components/loader/Loader';
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Car,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock4,
  Star,
  Fuel,
  Settings,
  Calendar as CalendarIcon,
  MapPin as MapPinIcon,
  Users as UsersIcon,
  DollarSign as DollarSignIcon,
  Clock as ClockIcon,
  Car as CarIcon,
  ChevronRight as ChevronRightIcon,
  AlertCircle as AlertCircleIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as XCircleIcon,
  Clock4 as Clock4Icon,
  Star as StarIcon,
  Fuel as FuelIcon,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Download,
  X,
  HelpCircle,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Calendar as CalendarIcon2,
  MapPin as MapPinIcon2,
  Users as UsersIcon2,
  DollarSign as DollarSignIcon2,
  Clock as ClockIcon2,
  Car as CarIcon2,
  ChevronRight as ChevronRightIcon2,
  AlertCircle as AlertCircleIcon2,
  CheckCircle as CheckCircleIcon2,
  XCircle as XCircleIcon2,
  Clock4 as Clock4Icon2,
  Star as StarIcon2,
  Fuel as FuelIcon2,
  Settings as SettingsIcon2,
  ChevronLeft as ChevronLeftIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  Download as DownloadIcon,
  X as XIcon,
  HelpCircle as HelpCircleIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  SortAsc as SortAscIcon,
  SortDesc as SortDescIcon,
} from 'lucide-react';

import { Link } from 'react-router-dom';

const MyCarBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('startDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  console.log(currentUser._id);
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(
          `/carBookings/user/${currentUser._id}`
        );

        if (response.data.success) {
          setBookings(response.data.data);
        } else {
          setError('Failed to fetch bookings');
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('An error occurred while fetching your bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser, navigate]);

  const getFilteredBookings = () => {
    let filtered = [...bookings];

    // Filter by tab
    if (activeTab === 'upcoming') {
      filtered = filtered.filter(
        (booking) => new Date(booking.startDate) > new Date()
      );
    } else if (activeTab === 'past') {
      filtered = filtered.filter(
        (booking) => new Date(booking.endDate) < new Date()
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.car.name.toLowerCase().includes(term) ||
          booking.startLocation.toLowerCase().includes(term) ||
          booking.endLocation.toLowerCase().includes(term)
      );
    }

    // Sort bookings
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'startDate') {
        comparison = new Date(a.startDate) - new Date(b.startDate);
      } else if (sortBy === 'price') {
        comparison = a.price - b.price;
      } else if (sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <Clock4Icon size={14} className="mr-1" />
            Pending
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon size={14} className="mr-1" />
            Confirmed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon size={14} className="mr-1" />
            Cancelled
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircleIcon size={14} className="mr-1" />
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getDaysUntilTour = (startDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = start - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? (
      <SortAscIcon size={16} />
    ) : (
      <SortDescIcon size={16} />
    );
  };

  const filteredBookings = getFilteredBookings();

  if (loading) {
    return <CarRentalLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <AlertCircleIcon size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Bookings
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Car Bookings</h1>
          <p className="mt-2 text-gray-600">
            Manage and view all your car rental bookings in one place
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              All Bookings
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`${
                activeTab === 'upcoming'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`${
                activeTab === 'past'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Past
            </button>
          </nav>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by car name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FilterIcon size={16} className="mr-1" />
                Filters
                {showFilters ? (
                  <ChevronUpIcon size={16} className="ml-1" />
                ) : (
                  <ChevronDownIcon size={16} className="ml-1" />
                )}
              </button>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSort('startDate')}
                      className={`inline-flex items-center px-3 py-1.5 border ${
                        sortBy === 'startDate'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700'
                      } rounded-md text-sm font-medium`}
                    >
                      Date {getSortIcon('startDate')}
                    </button>
                    <button
                      onClick={() => handleSort('price')}
                      className={`inline-flex items-center px-3 py-1.5 border ${
                        sortBy === 'price'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700'
                      } rounded-md text-sm font-medium`}
                    >
                      Price {getSortIcon('price')}
                    </button>
                    <button
                      onClick={() => handleSort('status')}
                      className={`inline-flex items-center px-3 py-1.5 border ${
                        sortBy === 'status'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700'
                      } rounded-md text-sm font-medium`}
                    >
                      Status {getSortIcon('status')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="max-w-md mx-auto">
              <CarIcon size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bookings found
              </h3>
              <p className="text-gray-500 mb-6">
                {activeTab === 'all'
                  ? "You haven't made any car bookings yet."
                  : activeTab === 'upcoming'
                  ? "You don't have any upcoming car bookings."
                  : "You don't have any past car bookings."}
              </p>
              <button
                onClick={() => navigate('/cars')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Browse Cars
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Car Image */}
                  <div className="md:w-1/3 lg:w-1/4">
                    <div className="h-48 md:h-full relative">
                      <img
                        src={
                          booking?.car?.image ||
                          'https://via.placeholder.com/400x300?text=Car+Image'
                        }
                        alt={booking?.car?.name}
                        className="w-full h-full object-cover"
                      />
                      {getDaysUntilTour(booking.startDate) > 0 &&
                        getDaysUntilTour(booking.startDate) <= 7 && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            {getDaysUntilTour(booking.startDate)} days left
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="p-6 flex-grow">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {booking.car.name}
                          </h3>
                          <span className="ml-2 text-sm text-gray-500">
                            ({booking.car.category})
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          <StarIcon
                            size={16}
                            className="text-yellow-400 mr-1"
                          />
                          <span className="text-sm font-medium">
                            {booking.car.rating}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">
                            ({booking.car.reviews} reviews)
                          </span>
                        </div>
                        <div className="mt-2">
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <div className="text-2xl font-bold text-gray-900">
                          ₹{booking.price}
                        </div>
                        <div className="text-sm text-gray-500">Total price</div>
                      </div>
                    </div>

                    {/* Booking Info */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <CalendarIcon
                          size={18}
                          className="text-gray-400 mt-0.5 mr-2 flex-shrink-0"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Rental Period
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(booking.startDate)} -{' '}
                            {formatDate(booking.endDate)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPinIcon
                          size={18}
                          className="text-gray-400 mt-0.5 mr-2 flex-shrink-0"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Pickup Location
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.startLocation}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPinIcon
                          size={18}
                          className="text-gray-400 mt-0.5 mr-2 flex-shrink-0"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Drop-off Location
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.endLocation}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <UsersIcon
                          size={18}
                          className="text-gray-400 mt-0.5 mr-2 flex-shrink-0"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Guests
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.guests} people
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Car Features */}
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Car Features
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <UsersIcon size={14} className="mr-1" />
                          {booking.car.features.seats} Seats
                        </div>
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <FuelIcon size={14} className="mr-1" />
                          {booking.car.features.mileage}
                        </div>
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <SettingsIcon size={14} className="mr-1" />
                          {booking.car.features.transmission}
                        </div>
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <CarIcon size={14} className="mr-1" />
                          {booking.car.features.year}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <Link to={'/contact'} className="mt-6 flex flex-wrap gap-2">
                      <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <HelpCircleIcon size={16} className="mr-1" />
                        Get Help
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900">
                How do I cancel my booking?
              </h3>
              <p className="mt-2 text-gray-600">
                You can cancel your booking by clicking the "Cancel Booking"
                button on your booking details. Please note that cancellation
                policies vary depending on how close to the rental date you
                cancel.
              </p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900">
                What happens if I need to modify my booking?
              </h3>
              <p className="mt-2 text-gray-600">
                If you need to modify your booking, please contact our customer
                support team. They will assist you with any changes to your
                rental dates, location, or other details.
              </p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900">
                How do I get my car at the pickup location?
              </h3>
              <p className="mt-2 text-gray-600">
                Upon arrival at the pickup location, you'll need to present your
                booking confirmation and a valid driver's license. The car
                provider will assist you with the handover process and any
                necessary paperwork.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                What should I do if I encounter issues with my rental?
              </h3>
              <p className="mt-2 text-gray-600">
                If you encounter any issues during your rental, please contact
                our 24/7 customer support team immediately. They will assist you
                with any problems and ensure your rental experience is as smooth
                as possible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCarBookings;
