import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Shield,
  Zap,
  Truck,
  Heart,
  Share,
  Calendar,
  Users,
  MapPin,
  Clock,
  Car,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Search,
  Map,
  Navigation,
  Calendar as CalendarIcon,
  User,
  DollarSign,
  Check,
  X,
  HelpCircle,
  ChevronUp,
  ChevronDown as ChevronDownIcon,
  AlertTriangle,
} from 'lucide-react';
import Button from '../../components/button/Button';
import ReviewForm from '../../components/review/ReviewForm';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCars, fetchReviewsByCarId } from '../../redux/carSlice';
import { AuthContext } from '../../context/AuthContext';
import { apiClient } from '../../api/ApiRequest';
import { formatDate } from '../../validators';
import CarRentalLoader from '../../components/loader/Loader';
import Faq from '../../components/faqs/Faq';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import confetti from 'canvas-confetti';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom date picker component
const CustomDatePicker = ({ label, value, onChange, minDate, error, icon }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const calendarRef = useRef(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get days in month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  // Handle day click
  const handleDayClick = (day) => {
    if (!day) return;

    const selectedDate = new Date(currentYear, currentMonth, day);

    // Check if date is in the past
    if (minDate && selectedDate < new Date(minDate)) {
      return;
    }

    // Format date as YYYY-MM-DD
    const formattedDate = selectedDate.toISOString().split('T')[0];
    onChange(formattedDate);
    setShowCalendar(false);
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Navigate to next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Get month name
  const getMonthName = (month) => {
    return new Date(0, month).toLocaleString('en-US', { month: 'long' });
  };

  // Check if a date is today
  const isToday = (day) => {
    if (!day) return false;

    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  // Check if a date is selected
  const isSelected = (day) => {
    if (!day || !value) return false;

    const selectedDate = new Date(value);
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    );
  };

  // Check if a date is in the past
  const isPastDate = (day) => {
    if (!day) return false;

    const date = new Date(currentYear, currentMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date < today;
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          type="text"
          value={formatDisplayDate(value)}
          onClick={() => setShowCalendar(!showCalendar)}
          readOnly
          placeholder="Select date"
          className={`block w-full pl-10 pr-3 py-2 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 cursor-pointer`}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDownIcon size={16} className="text-gray-400" />
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* Calendar dropdown */}
      {showCalendar && (
        <div
          ref={calendarRef}
          className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 p-3"
        >
          {/* Calendar header */}
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={goToPreviousMonth}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="font-medium">
              {getMonthName(currentMonth)} {currentYear}
            </div>
            <button
              onClick={goToNextMonth}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-1">
            <div>Su</div>
            <div>Mo</div>
            <div>Tu</div>
            <div>We</div>
            <div>Th</div>
            <div>Fr</div>
            <div>Sa</div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((day, index) => (
              <div
                key={index}
                className={`
                  h-8 flex items-center justify-center rounded-full text-sm
                  ${!day ? 'invisible' : ''}
                  ${isSelected(day) ? 'bg-blue-600 text-white' : ''}
                  ${
                    isToday(day) && !isSelected(day)
                      ? 'bg-blue-100 text-blue-600 font-medium'
                      : ''
                  }
                  ${
                    isPastDate(day) && !isSelected(day)
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'hover:bg-gray-100 cursor-pointer'
                  }
                `}
                onClick={() => handleDayClick(day)}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CarDetailsPage = () => {
  const [activeTab, setActiveTab] = useState('features');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    startLocation: '',
    endLocation: '',
    guests: 1,
  });
  const [bookingErrors, setBookingErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [activeLocationField, setActiveLocationField] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default to India
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(3);
  const locationInputRef = useRef(null);
  const [hasAlreadyBooked, setHasAlreadyBooked] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentUser } = useContext(AuthContext);
  const cars = useSelector((state) => state?.car?.cars);
  const engagements = useSelector((state) => state.car.reviews);
  const status = useSelector((state) => state?.car?.status);
  const car = cars && cars?.find((car) => car?._id === id);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [showRoute, setShowRoute] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  // Check if user has already booked this car
  useEffect(() => {
    if (currentUser && car) {
      const bookedCars = JSON.parse(
        localStorage.getItem(`bookedCars_${currentUser._id}`) || '[]'
      );
      if (bookedCars.includes(car._id)) {
        setHasAlreadyBooked(true);
      }
    }
  }, [currentUser, car]);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchCars());
    dispatch(fetchReviewsByCarId(id));
  }, [dispatch, id]);

  // Images for carousel - use the images array from car data
  const images = car?.images || [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCYiIJJc1c6Y9AsfZaCsXx5ODfbjmHDolMdw&s',
  ];

  // Features list
  const features = [
    { name: 'Spare Tyre', icon: <Truck size={18} /> },
    { name: 'Toolkit', icon: <Truck size={18} /> },
    { name: 'Anti-lock Braking System (ABS)', icon: <Shield size={18} /> },
    { name: '2 Front Airbags', icon: <Shield size={18} /> },
    { name: '2 Side Airbags', icon: <Shield size={18} /> },
    { name: '2 Rear Airbags', icon: <Shield size={18} /> },
    { name: 'Power Windows', icon: <Zap size={18} /> },
    { name: 'Power steering', icon: <Zap size={18} /> },
    { name: 'Air Conditioning', icon: <Zap size={18} /> },
    { name: 'Bluetooth Connectivity', icon: <Zap size={18} /> },
    { name: 'USB Port', icon: <Zap size={18} /> },
    { name: 'Child Seat Anchor', icon: <Shield size={18} /> },
  ];

  // FAQs data
  const faqs = [
    {
      id: 1,
      question: 'What is the mileage of the car?',
      answer:
        'The Tesla Model 3 is an electric car with an estimated range of 358 miles on a full charge. The actual range may vary based on driving conditions, speed, and weather.',
    },
    {
      id: 2,
      question: 'Is there a security deposit?',
      answer:
        'Yes, a refundable security deposit of ₹2000 is required at the time of pickup. This deposit will be returned to you upon the safe return of the vehicle, minus any charges for damages or additional fees.',
    },
    {
      id: 3,
      question: 'What happens if I return the car late?',
      answer:
        'Late returns will incur a fee of ₹200 per hour beyond the scheduled return time. If you anticipate being late, please contact our customer service as soon as possible to avoid additional charges.',
    },
    {
      id: 4,
      question: 'Do I need to clean the car before returning?',
      answer:
        'The car should be returned in the same condition as it was received. While a basic cleaning is appreciated, excessive dirt or damage will result in additional cleaning fees. We recommend returning the car with at least a quarter tank of fuel.',
    },
    {
      id: 5,
      question: 'What documents do I need to rent the car?',
      answer:
        "You'll need a valid driver's license, proof of insurance, and a credit card in your name. International renters may need additional documentation such as a passport and international driver's permit.",
    },
    {
      id: 6,
      question: 'Is insurance included in the rental price?',
      answer:
        'Basic insurance is included in the rental price, but it has a high deductible. We offer additional insurance options at the time of pickup to reduce your liability in case of an accident.',
    },
    {
      id: 7,
      question: 'Can I take the car out of the country?',
      answer:
        'Most of our vehicles can be taken across state borders within the country. International travel is not permitted unless specifically arranged in advance with additional documentation and fees.',
    },
    {
      id: 8,
      question: 'What happens if the car breaks down during my rental?',
      answer:
        "All our vehicles are regularly maintained, but if you experience any issues, our 24/7 roadside assistance is available. Simply call our emergency number provided in your rental agreement, and we'll assist you promptly.",
    },
  ];

  const handleSubmit = async (reviewData) => {
    try {
      const response = await apiClient.post('/reviews', reviewData);
      console.log('Review submitted successfully:', response.data);

      // Instantly refetch updated reviews
      dispatch(fetchReviewsByCarId(id));
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  // Image carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) =>
          prev === images.length - 1 ? 0 : prev + 1
        );
        setIsAnimating(false);
      }, 5000);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Handle next image
  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Handle previous image
  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleAddReview = () => {
    setShowReviewForm(!showReviewForm);
  };

  // Handle location search
  const handleLocationSearch = async (value, field) => {
    if (!value || value.length < 3) {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
      return;
    }

    setActiveLocationField(field);
    setShowLocationSuggestions(true);

    try {
      // Using Nominatim API for geocoding (free and no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          value
        )}&countrycodes=in&limit=5`
      );
      const data = await response.json();

      setLocationSuggestions(data);
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setLocationSuggestions([]);
    }
  };

  // Handle location selection
  const handleLocationSelect = (location) => {
    const { display_name, lat, lon } = location;

    setBookingData({
      ...bookingData,
      [activeLocationField]: display_name,
    });

    const locationData = { lat: parseFloat(lat), lng: parseFloat(lon) };

    if (activeLocationField === 'startLocation') {
      setStartLocation(locationData);
      setMapCenter([parseFloat(lat), parseFloat(lon)]);
    } else if (activeLocationField === 'endLocation') {
      setEndLocation(locationData);
      setMapCenter([parseFloat(lat), parseFloat(lon)]);
    }

    setSelectedLocation(locationData);
    setShowLocationSuggestions(false);
    setShowMap(true);

    // If both locations are selected, show route
    if (activeLocationField === 'startLocation' && endLocation) {
      setShowRoute(true);
      fetchRoute(startLocation, locationData);
    } else if (activeLocationField === 'endLocation' && startLocation) {
      setShowRoute(true);
      fetchRoute(startLocation, locationData);
    }
  };

  // Fetch route between two points
  const fetchRoute = (start, end) => {
    // Using OSRM API to get route between two points
    fetch(
      `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.routes && data.routes.length > 0) {
          setRouteCoordinates(data.routes[0].geometry.coordinates);
        }
      })
      .catch((error) => {
        console.error('Error fetching route:', error);
      });
  };

  // Map click handler component
  const MapClickHandler = () => {
    const map = useMap();

    map.on('click', handleLocationSelect);

    return null;
  };

  // Handle next step
  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Validate current step
  const validateCurrentStep = () => {
    const errors = {};

    if (currentStep === 1) {
      if (!bookingData.startDate) {
        errors.startDate = 'Start date is required';
      }

      if (!bookingData.endDate) {
        errors.endDate = 'End date is required';
      } else if (
        bookingData.startDate &&
        new Date(bookingData.endDate) <= new Date(bookingData.startDate)
      ) {
        errors.endDate = 'End date must be after start date';
      }
    }

    if (currentStep === 2) {
      if (!bookingData.startLocation) {
        errors.startLocation = 'Start location is required';
      }

      if (!bookingData.endLocation) {
        errors.endLocation = 'End location is required';
      }
    }

    if (currentStep === 3) {
      if (!bookingData.guests) {
        errors.guests = 'Number of guests is required';
      } else if (parseInt(bookingData.guests) > car?.features.seats) {
        errors.guests = `Maximum ${car?.features.seats} guests allowed for this vehicle`;
      } else if (parseInt(bookingData.guests) < 1) {
        errors.guests = 'At least 1 guest is required';
      }
    }

    setBookingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle booking form input changes
  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (bookingErrors[name]) {
      setBookingErrors({
        ...bookingErrors,
        [name]: '',
      });
    }

    // Handle location search
    if (name === 'startLocation' || name === 'endLocation') {
      handleLocationSearch(value, name);
    }
  };

  // Validate booking form
  const validateBookingForm = () => {
    const errors = {};

    if (!bookingData.startDate) {
      errors.startDate = 'Start date is required';
    }

    if (!bookingData.endDate) {
      errors.endDate = 'End date is required';
    } else if (
      bookingData.startDate &&
      new Date(bookingData.endDate) <= new Date(bookingData.startDate)
    ) {
      errors.endDate = 'End date must be after start date';
    }

    if (!bookingData.startLocation) {
      errors.startLocation = 'Start location is required';
    }

    if (!bookingData.endLocation) {
      errors.endLocation = 'End location is required';
    }

    if (!bookingData.guests) {
      errors.guests = 'Number of guests is required';
    } else if (parseInt(bookingData.guests) > car?.features.seats) {
      errors.guests = `Maximum ${car?.features.seats} guests allowed for this vehicle`;
    } else if (parseInt(bookingData.guests) < 1) {
      errors.guests = 'At least 1 guest is required';
    }

    setBookingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle booking form submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!validateBookingForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate number of days
      const startDate = new Date(bookingData.startDate);
      const endDate = new Date(bookingData.endDate);
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days

      // Calculate total price
      const basePrice = car?.price * diffDays;
      const protectionFee = 279;
      const totalPrice = basePrice + protectionFee;

      // Prepare booking data
      const bookingPayload = {
        carId: car?._id,
        userId: currentUser?._id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        startLocation: bookingData.startLocation,
        endLocation: bookingData.endLocation,
        guests: parseInt(bookingData.guests),
        price: totalPrice,
        status: 'pending',
      };

      // Submit booking to API
      const response = await apiClient.post(
        '/carBookings/book',
        bookingPayload
      );

      if (response.data.success) {
        setBookingSuccess(true);

        // Save to localStorage as backup
        const bookedCars = JSON.parse(
          localStorage.getItem(`bookedCars_${currentUser._id}`) || '[]'
        );
        if (!bookedCars.includes(car._id)) {
          bookedCars.push(car._id);
          localStorage.setItem(
            `bookedCars_${currentUser._id}`,
            JSON.stringify(bookedCars)
          );
        }

        // Save booking details
        const bookingDetails = JSON.parse(
          localStorage.getItem(`bookingDetails_${currentUser._id}`) || '{}'
        );
        bookingDetails[car._id] = {
          startDate: bookingData.startDate,
          endDate: bookingData.endDate,
          guests: bookingData.guests,
          price: totalPrice,
        };
        localStorage.setItem(
          `bookingDetails_${currentUser._id}`,
          JSON.stringify(bookingDetails)
        );

        // Set hasAlreadyBooked to true
        setHasAlreadyBooked(true);

        // Trigger confetti animation
        triggerConfetti();

        // Reset form after 3 seconds
        setTimeout(() => {
          setShowBookingForm(false);
          setBookingSuccess(false);
          setBookingData({
            startDate: '',
            endDate: '',
            startLocation: '',
            endLocation: '',
            guests: 1,
          });
          setCurrentStep(1);
        }, 3000);
      }
    } catch (error) {
      console.error('Error booking car:', error);
      setBookingErrors({
        submit: 'Failed to book the car. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trigger confetti animation
  const triggerConfetti = () => {
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  // Calculate total price based on selected dates
  const calculateTotalPrice = () => {
    if (!bookingData.startDate || !bookingData.endDate) {
      return car?.price + 279; // Base price + protection fee
    }

    const startDate = new Date(bookingData.startDate);
    const endDate = new Date(bookingData.endDate);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days

    const basePrice = car?.price * diffDays;
    const protectionFee = 279;

    return basePrice + protectionFee;
  };

  if (status === 'loading') {
    return <CarRentalLoader />;
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto p-4">
        {/* Back button */}
        <Link
          to="/cars"
          className="flex items-center text-blue-600 font-medium my-4 transition-transform hover:translate-x-1 hover:scale-105"
        >
          <ChevronLeft size={20} />
          Back to Cars
        </Link>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content */}
          <div className="flex-grow">
            {/* Image carousel */}
            <div className="relative rounded-xl overflow-hidden bg-gray-100 h-96 group">
              <img
                src={`${images[currentImageIndex]}`}
                alt={car?.name}
                className={`w-full h-full object-cover ${
                  isAnimating ? 'opacity-50 scale-105' : 'opacity-100 scale-100'
                } transition-all duration-500`}
              />

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/40 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md">
                {currentImageIndex + 1} / {images.length}
              </div>

              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <ChevronRight size={20} />
              </button>

              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2 rounded-full ${
                    isLiked
                      ? 'bg-red-500 text-white'
                      : 'bg-white/80 text-gray-700'
                  } shadow-lg hover:scale-105 transition-all duration-300`}
                >
                  <Heart size={20} fill={isLiked ? '#fff' : 'none'} />
                </button>
                <button className="p-2 rounded-full bg-white/80 text-gray-700 shadow-lg hover:scale-105 transition-all duration-300">
                  <Share size={20} />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'ring-2 ring-blue-500 ring-offset-2'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={`${image}`}
                    alt={`${car?.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {images.length > 5 && (
                <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 relative bg-gray-800 flex justify-center items-center text-white font-bold">
                  +{images.length - 5}
                </div>
              )}
            </div>

            {/* Car name and specs */}
            <div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
              <h1 className="text-2xl font-bold flex items-center">
                {car?.name} {car?.features.year}
                <span className="ml-2 text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {car?.discount}
                </span>
              </h1>

              <div className="flex flex-wrap gap-4 text-gray-500 text-sm mt-2">
                <div className="flex items-center">
                  <Car size={16} className="mr-1 text-blue-500" />
                  <span>{car?.features.fuelType}</span>
                </div>
                <div className="flex items-center">
                  <Zap size={16} className="mr-1 text-blue-500" />
                  <span>{car?.features.transmission}</span>
                </div>
                <div className="flex items-center">
                  <Users size={16} className="mr-1 text-blue-500" />
                  <span>{car?.features.seats} Seats</span>
                </div>
                <div className="flex items-center">
                  <Shield size={16} className="mr-1 text-blue-500" />
                  <span>Airbags</span>
                </div>
              </div>

              {/* Rating */}
              <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded font-medium mt-4">
                <Star size={16} fill="white" className="mr-1" />
                {car?.rating} ({car?.reviews} Reviews)
              </div>

              {/* Quick info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                    <Car size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Vehicle Type</p>
                    <p className="font-medium">{car?.features.fuelType}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Seating Capacity</p>
                    <p className="font-medium">{car?.features.seats} Persons</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Transmission</p>
                    <p className="font-medium">{car?.features.transmission}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  {['Features', 'Reviews', 'FAQs'].map((tab) => (
                    <button
                      key={tab}
                      className={`py-4 px-6 font-medium text-sm whitespace-nowrap ${
                        activeTab === tab.toLowerCase()
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => setActiveTab(tab.toLowerCase())}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab content */}
              <div className="p-6">
                {activeTab === 'features' && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4">
                      Vehicle Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 group hover:bg-blue-50 rounded-lg transition-colors duration-300"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors duration-300">
                            {feature.icon}
                          </div>
                          <span className="text-gray-700">{feature.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-semibold">
                        Customer Reviews ({engagements?.reviews?.length || 0})
                      </h2>
                      {currentUser && (
                        <button
                          onClick={handleAddReview}
                          className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
                        >
                          <svg
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          Add Review
                        </button>
                      )}
                    </div>

                    {showReviewForm && (
                      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                        <ReviewForm
                          onCancel={() => setShowReviewForm(false)}
                          onSubmit={handleSubmit}
                          userId={currentUser._id}
                          carId={id}
                        />
                      </div>
                    )}

                    {!engagements?.reviews?.length ? (
                      <div className="text-center py-8">
                        <svg
                          className="h-16 w-16 text-gray-400 mx-auto mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          No Reviews Yet
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Be the first to review this vehicle and share your
                          experience!
                        </p>
                        {currentUser ? (
                          <button
                            onClick={handleAddReview}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            Write a Review
                          </button>
                        ) : (
                          <Link
                            to="/login"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Login to Review
                          </Link>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {engagements &&
                          engagements?.reviews?.map((review) => (
                            <div
                              key={review._id}
                              className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow duration-300"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                  <img
                                    src={`https://api.ombannatours.com${review?.userId?.avatar}`}
                                    alt=""
                                    className="w-10 h-10 rounded-full mr-5 object-cover"
                                  />
                                  <div>
                                    <div className="font-medium">
                                      {review?.userId?.username}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      on {formatDate(review?.createdAt)}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-center gap-1 w-12 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded font-bold">
                                  <Star
                                    size={16}
                                    fill="white"
                                    className="mr-1"
                                  />
                                  <span>{review?.ratingCount}</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-700">
                                {review?.comment}
                              </p>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'faqs' && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4">
                      Frequently Asked Questions
                    </h2>

                    <div className="space-y-4">
                      {faqs.map((faq) => (
                        <div
                          key={faq.id}
                          className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                        >
                          <h3 className="text-lg font-medium text-gray-800 mb-2">
                            {faq.question}
                          </h3>
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <Info size={20} className="text-blue-600 mr-3 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-blue-800">
                            Still have questions?
                          </h3>
                          <p className="text-blue-600 mt-1">
                            Our customer support team is available 24/7 to
                            assist you with any queries about this vehicle or
                            the booking process.
                          </p>
                          <button className="mt-3 inline-flex items-center text-blue-700 font-medium hover:text-blue-900">
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                              />
                            </svg>
                            Contact Support
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Make it wider */}
          <div className="w-full lg:w-[500px] flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-4">
              {!showBookingForm ? (
                <>
                  {/* Price with discount */}
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold">₹{car?.price}</span>
                    <span className="text-gray-500 ml-1">/day</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2 font-medium">
                      {car?.discount}
                    </span>
                  </div>

                  {/* Trip protection */}
                  <div className="flex justify-between items-center mt-4 py-3 border-b border-gray-200">
                    <div className="flex items-center">
                      <Shield size={18} className="text-blue-600 mr-2" />
                      <div>
                        <div className="font-medium">Trip Protection Fee</div>
                        <div className="text-xs text-gray-500">
                          Covers accidental damage
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold">₹279</span>
                    </div>
                  </div>

                  {/* Total price */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center py-3">
                      <div>
                        <div className="font-bold text-lg">Total Price</div>
                        <div className="text-xs text-gray-500">
                          Inclusive of taxes
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold text-xl">
                          ₹{car?.price + 279}
                        </span>
                      </div>
                    </div>

                    {/* CTA button */}
                    <div className="mt-4">
                      {!currentUser ? (
                        <Link
                          to="/login"
                          className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          Login to Book
                        </Link>
                      ) : hasAlreadyBooked ? (
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                          <div className="flex items-start">
                            <AlertTriangle
                              size={20}
                              className="text-amber-500 mr-2 mt-0.5 flex-shrink-0"
                            />
                            <div>
                              <h4 className="font-medium text-amber-800">
                                Already Booked
                              </h4>
                              <p className="text-amber-600 text-sm mt-1">
                                You have already booked this vehicle. Check your
                                booked cars to view details.
                              </p>
                              <Link
                                to="/myCarBookings/all"
                                className="inline-flex items-center mt-2 text-amber-700 font-medium hover:text-amber-900"
                              >
                                View My Bookings
                                <ChevronRight size={16} className="ml-1" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowBookingForm(true)}
                          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          Book Now
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Book This Vehicle</h3>
                    <button
                      onClick={() => setShowBookingForm(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {bookingSuccess ? (
                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                      <div className="flex items-center">
                        <CheckCircle
                          size={20}
                          className="text-green-600 mr-2"
                        />
                        <h4 className="font-medium text-green-800">
                          Booking Successful!
                        </h4>
                      </div>
                      <p className="text-green-600 mt-2">
                        Your booking has been confirmed. You will receive a
                        confirmation email shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleBookingSubmit} className="space-y-4">
                      {bookingErrors.submit && (
                        <div className="bg-red-50 p-3 rounded-lg text-red-600 text-sm">
                          {bookingErrors.submit}
                        </div>
                      )}

                      {/* Progress bar */}
                      <div className="mb-6">
                        <div className="flex justify-between mb-2">
                          {[1, 2, 3].map((step) => (
                            <div
                              key={step}
                              className={`flex flex-col items-center ${
                                step === currentStep
                                  ? 'text-blue-600'
                                  : step < currentStep
                                  ? 'text-green-600'
                                  : 'text-gray-400'
                              }`}
                            >
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                                  step === currentStep
                                    ? 'bg-blue-100 text-blue-600'
                                    : step < currentStep
                                    ? 'bg-green-100 text-green-600'
                                    : 'bg-gray-100 text-gray-400'
                                }`}
                              >
                                {step < currentStep ? (
                                  <Check size={16} />
                                ) : (
                                  step
                                )}
                              </div>
                              <span className="text-xs font-medium">
                                {step === 1
                                  ? 'Dates'
                                  : step === 2
                                  ? 'Locations'
                                  : 'Guests'}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="h-1 bg-gray-200 rounded-full">
                          <div
                            className="h-1 bg-blue-600 rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                ((currentStep - 1) / (totalSteps - 1)) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Step 1: Dates */}
                      {currentStep === 1 && (
                        <div className="space-y-4">
                          <CustomDatePicker
                            label="Start Date"
                            value={bookingData.startDate}
                            onChange={(date) =>
                              setBookingData({
                                ...bookingData,
                                startDate: date,
                              })
                            }
                            minDate={new Date().toISOString().split('T')[0]}
                            error={bookingErrors.startDate}
                            icon={
                              <CalendarIcon
                                size={18}
                                className="text-gray-400"
                              />
                            }
                          />

                          <CustomDatePicker
                            label="End Date"
                            value={bookingData.endDate}
                            onChange={(date) =>
                              setBookingData({ ...bookingData, endDate: date })
                            }
                            minDate={
                              bookingData.startDate ||
                              new Date().toISOString().split('T')[0]
                            }
                            error={bookingErrors.endDate}
                            icon={
                              <CalendarIcon
                                size={18}
                                className="text-gray-400"
                              />
                            }
                          />

                          <div className="pt-4">
                            <button
                              type="button"
                              onClick={() => {
                                if (validateCurrentStep()) {
                                  handleNextStep();
                                }
                              }}
                              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                              Next: Select Locations
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Step 2: Locations */}
                      {currentStep === 2 && (
                        <div className="space-y-4">
                          <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Location
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPin size={18} className="text-gray-400" />
                              </div>
                              <input
                                type="text"
                                name="startLocation"
                                value={bookingData.startLocation}
                                onChange={handleBookingInputChange}
                                placeholder="Pickup location"
                                className={`block w-full pl-10 pr-3 py-2 border ${
                                  bookingErrors.startLocation
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                ref={
                                  activeLocationField === 'startLocation'
                                    ? locationInputRef
                                    : null
                                }
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <Search size={16} className="text-gray-400" />
                              </div>
                            </div>
                            {bookingErrors.startLocation && (
                              <p className="mt-1 text-sm text-red-600">
                                {bookingErrors.startLocation}
                              </p>
                            )}

                            {/* Location suggestions dropdown */}
                            {showLocationSuggestions &&
                              activeLocationField === 'startLocation' && (
                                <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                                  {locationSuggestions.length > 0 ? (
                                    <ul className="py-1">
                                      {locationSuggestions.map(
                                        (location, index) => (
                                          <li
                                            key={index}
                                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-start"
                                            onClick={() =>
                                              handleLocationSelect(location)
                                            }
                                          >
                                            <MapPin
                                              size={16}
                                              className="text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                                            />
                                            <div>
                                              <div className="font-medium text-sm">
                                                {
                                                  location.display_name.split(
                                                    ','
                                                  )[0]
                                                }
                                              </div>
                                              <div className="text-xs text-gray-500">
                                                {location.display_name}
                                              </div>
                                            </div>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  ) : (
                                    <div className="px-4 py-2 text-sm text-gray-500">
                                      No locations found
                                    </div>
                                  )}
                                </div>
                              )}
                          </div>

                          <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Location
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPin size={18} className="text-gray-400" />
                              </div>
                              <input
                                type="text"
                                name="endLocation"
                                value={bookingData.endLocation}
                                onChange={handleBookingInputChange}
                                placeholder="Drop-off location"
                                className={`block w-full pl-10 pr-3 py-2 border ${
                                  bookingErrors.endLocation
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                ref={
                                  activeLocationField === 'endLocation'
                                    ? locationInputRef
                                    : null
                                }
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <Search size={16} className="text-gray-400" />
                              </div>
                            </div>
                            {bookingErrors.endLocation && (
                              <p className="mt-1 text-sm text-red-600">
                                {bookingErrors.endLocation}
                              </p>
                            )}

                            {/* Location suggestions dropdown */}
                            {showLocationSuggestions &&
                              activeLocationField === 'endLocation' && (
                                <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                                  {locationSuggestions.length > 0 ? (
                                    <ul className="py-1">
                                      {locationSuggestions.map(
                                        (location, index) => (
                                          <li
                                            key={index}
                                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-start"
                                            onClick={() =>
                                              handleLocationSelect(location)
                                            }
                                          >
                                            <MapPin
                                              size={16}
                                              className="text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                                            />
                                            <div>
                                              <div className="font-medium text-sm">
                                                {
                                                  location.display_name.split(
                                                    ','
                                                  )[0]
                                                }
                                              </div>
                                              <div className="text-xs text-gray-500">
                                                {location.display_name}
                                              </div>
                                            </div>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  ) : (
                                    <div className="px-4 py-2 text-sm text-gray-500">
                                      No locations found
                                    </div>
                                  )}
                                </div>
                              )}
                          </div>

                          {/* Map display - only show when both locations are selected */}
                          {startLocation && endLocation && (
                            <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden h-64">
                              <div className="bg-gray-50 p-2 border-b border-gray-200 flex justify-between items-center">
                                <div className="flex items-center">
                                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                  <span className="text-sm font-medium">
                                    Pickup Location
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                  <span className="text-sm font-medium">
                                    Drop-off Location
                                  </span>
                                </div>
                              </div>
                              <MapContainer
                                center={mapCenter}
                                zoom={13}
                                style={{
                                  height: 'calc(100% - 40px)',
                                  width: '100%',
                                }}
                              >
                                <TileLayer
                                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {/* Start location marker */}
                                <Marker
                                  position={[
                                    startLocation.lat,
                                    startLocation.lng,
                                  ]}
                                >
                                  <Popup>
                                    <div className="flex items-center">
                                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                      <span>Pickup Location</span>
                                    </div>
                                  </Popup>
                                </Marker>

                                {/* End location marker */}
                                <Marker
                                  position={[endLocation.lat, endLocation.lng]}
                                >
                                  <Popup>
                                    <div className="flex items-center">
                                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                      <span>Drop-off Location</span>
                                    </div>
                                  </Popup>
                                </Marker>

                                {/* Route line */}
                                {showRoute && routeCoordinates.length > 0 && (
                                  <Polyline
                                    positions={routeCoordinates.map((coord) => [
                                      coord[1],
                                      coord[0],
                                    ])}
                                    color="#3B82F6"
                                    weight={4}
                                    opacity={0.7}
                                  />
                                )}
                              </MapContainer>
                            </div>
                          )}

                          <div className="flex gap-2 pt-4">
                            <button
                              type="button"
                              onClick={handlePrevStep}
                              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                              Back
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (validateCurrentStep()) {
                                  handleNextStep();
                                }
                              }}
                              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                              Next: Select Guests
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Guests */}
                      {currentStep === 3 && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Number of Guests
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Users size={18} className="text-gray-400" />
                              </div>
                              <input
                                type="number"
                                name="guests"
                                value={bookingData.guests}
                                onChange={handleBookingInputChange}
                                min="1"
                                max={car?.features.seats}
                                className={`block w-full pl-10 pr-3 py-2 border ${
                                  bookingErrors.guests
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                              />
                            </div>
                            {bookingErrors.guests ? (
                              <p className="mt-1 text-sm text-red-600">
                                {bookingErrors.guests}
                              </p>
                            ) : (
                              <p className="mt-1 text-xs text-gray-500">
                                Maximum {car?.features.seats} guests allowed
                              </p>
                            )}
                          </div>

                          <div className="pt-2">
                            <div className="flex justify-between items-center py-3 border-t border-gray-200">
                              <div>
                                <div className="font-medium">Total Price</div>
                                <div className="text-xs text-gray-500">
                                  {bookingData.startDate &&
                                  bookingData.endDate ? (
                                    <>
                                      {Math.ceil(
                                        (new Date(bookingData.endDate) -
                                          new Date(bookingData.startDate)) /
                                          (1000 * 60 * 60 * 24)
                                      ) + 1}{' '}
                                      days
                                    </>
                                  ) : (
                                    '1 day'
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center">
                                <span className="font-bold text-xl">
                                  ₹{calculateTotalPrice()}
                                </span>
                              </div>
                            </div>

                            <div className="flex gap-2 pt-4">
                              <button
                                type="button"
                                onClick={handlePrevStep}
                                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                              >
                                Back
                              </button>
                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                              >
                                {isSubmitting ? (
                                  <span className="flex items-center justify-center">
                                    <svg
                                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                    Processing...
                                  </span>
                                ) : (
                                  'Confirm Booking'
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;
