import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchTours } from '../../redux/carSlice';
import { AuthContext } from '../../context/AuthContext';
import { apiClient } from '../../api/ApiRequest';
import { MapPin, Calendar, Star, Users, Clock } from 'lucide-react';
import TourImageSlider from '../../components/tours/TourImageSlider';
import TestimonialSlider from '../../components/testimonials/TestimonialSlider';

// Custom components
const TourBanner = ({ tour }) => (
  <div className="relative h-96 overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: `url(${tour?.images[0]})`,
        clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
      }}
    >
      <div className="absolute inset-0 bg-gray-600/50 bg-opacity-40">
        <div className="container mx-auto px-4 h-full flex items-end pb-16">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {tour?.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-lg">
              <TourInfoItem icon="clock" text={tour?.duration} />
              <TourInfoItem icon="difficulty" text={tour?.difficulty} />
              <TourInfoItem icon="price" text={tour?.price} />
              <TourInfoItem
                icon="star"
                text={`${tour?.rating} (${tour?.reviews} reviews)`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TourInfoItem = ({ icon, text }) => {
  const icons = {
    clock: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-1"
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
    ),
    difficulty: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
    price: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    star: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-1 text-yellow-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
  };

  return (
    <span className="flex items-center">
      {icons[icon]}
      {text}
    </span>
  );
};

const TourOverview = ({ tour }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
    <h2 className="text-2xl font-bold mb-4">Tour Overview</h2>
    <p className="text-gray-700 mb-6">{tour?.description}</p>

    <h3 className="text-xl font-semibold mb-3">Tour Highlights</h3>
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
      {tour?.highlights.map((highlight, index) => (
        <li key={index} className="flex items-start">
          <svg
            className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{highlight}</span>
        </li>
      ))}
    </ul>
  </div>
);

const Itinerary = ({ tour, activeDay, handleDayClick }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
    <h2 className="text-2xl font-bold mb-6">Tour Itinerary</h2>

    <div className="flex overflow-x-auto mb-6 pb-2">
      {tour?.itinerary.map((day) => (
        <button
          key={day.day}
          onClick={() => handleDayClick(day.day)}
          className={`flex-shrink-0 px-4 py-2 rounded-full mr-2 focus:outline-none transition-colors ${
            activeDay === day.day
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Day {day.day}
        </button>
      ))}
    </div>

    {tour?.itinerary.map((day) => (
      <div
        key={day?.day}
        className={`transition-opacity duration-300 ${
          activeDay === day.day ? 'block opacity-100' : 'hidden opacity-0'
        }`}
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <img
              src={day?.image}
              alt={`Day ${day.day}: ${day.title}`}
              className="w-full h-64 object-cover rounded-lg shadow"
            />
          </div>
          <div className="md:w-2/3">
            <h3 className="text-xl font-bold mb-2">
              Day {day.day}: {day.title}
            </h3>
            <p className="text-gray-700">{day.description}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Enhanced Confetti animation component with greater density and visibility
const Confetti = ({ isActive }) => {
  const [confettiItems, setConfettiItems] = useState([]);

  useEffect(() => {
    if (isActive) {
      // Increased number of particles for greater density
      const newConfetti = Array.from({ length: 250 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -20 - Math.random() * 100, // Spread starting positions more
        size: 7 + Math.random() * 12, // Larger confetti pieces
        rotation: Math.random() * 360,
        // Brighter, more vibrant colors
        color: [
          '#FF1A1A', // Bright red
          '#33FF33', // Bright green
          '#3333FF', // Bright blue
          '#FFFF00', // Bright yellow
          '#FF00FF', // Bright magenta
          '#00FFFF', // Bright cyan
          '#FF9900', // Bright orange
          '#9900FF', // Bright purple
        ][Math.floor(Math.random() * 8)],
        speed: 0.8 + Math.random() * 2.5,
        horizontalMovement: -3 + Math.random() * 6,
        // Add shape variety
        shape: Math.random() > 0.3 ? 'rect' : 'circle',
      }));

      setConfettiItems(newConfetti);

      // Extended animation duration
      const timer = setTimeout(() => {
        setConfettiItems([]);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!isActive || confettiItems.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confettiItems.map((confetti) => (
        <div
          key={confetti.id}
          className={`absolute ${
            confetti.shape === 'circle' ? 'rounded-full' : ''
          }`}
          style={{
            left: `${confetti.x}%`,
            top: `${confetti.y}%`,
            width: `${confetti.size}px`,
            height:
              confetti.shape === 'circle'
                ? `${confetti.size}px`
                : `${confetti.size * 1.5}px`,
            backgroundColor: confetti.color,
            transform: `rotate(${confetti.rotation}deg)`,
            opacity: Math.random() * 0.5 + 0.5, // Higher minimum opacity for better visibility
            boxShadow: '0 0 2px rgba(255,255,255,0.7)', // Slight glow effect
            animation: `fall ${4 / confetti.speed}s linear forwards, sway ${
              2 / confetti.speed
            }s ease-in-out infinite alternate`,
            zIndex: Math.floor(Math.random() * 20 + 50), // Vary z-index for layered effect
          }}
        />
      ))}
      <style>
        {`
        @keyframes fall {
          to { top: 110%; }
        }
        @keyframes sway {
          from { margin-left: -30px; }
          to { margin-left: 30px; }
        }
        `}
      </style>
    </div>
  );
};

// New component for booking confirmation popup
const BookingConfirmation = ({ isOpen, onClose, bookingDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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

        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h3>
          <p className="text-gray-600 mb-6">
            Your tour has been successfully booked. We've sent a confirmation
            email with all the details.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-semibold mb-2">Booking Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Start Date:</span>
                <span className="font-medium">
                  {new Date(bookingDetails?.startDate).toLocaleDateString(
                    'en-US',
                    {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    }
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Guests:</span>
                <span className="font-medium">{bookingDetails?.guests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Price:</span>
                <span className="font-medium">₹ {bookingDetails?.price}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

const BookingCTA = ({ tour, onBookNow }) => {
  const [startDate, setStartDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Generate dates for the next 6 months
  const today = new Date();
  const availableDates = Array.from({ length: 180 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return date;
  });

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Handle booking submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate) {
      setError('Please select a start date');
      return;
    }
    setError('');
    setIsLoading(true);
    onBookNow({ startDate, guests, price: tour?.price }, () => {
      // Callback to stop loading when booking is confirmed
      setIsLoading(false);
    });
  };

  return (
    <div className="mt-8 bg-blue-50 rounded-lg p-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Select Start Date
          </label>
          <div className="relative">
            <input
              type="text"
              value={startDate ? formatDate(new Date(startDate)) : ''}
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              readOnly
              placeholder="Choose your start date"
              className={`w-full px-4 py-3 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
            <div className="absolute right-3 top-3 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            {isCalendarOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Available Dates</h3>
                  <button
                    onClick={() => setIsCalendarOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
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
                <div className="max-h-60 overflow-y-auto">
                  {availableDates.map((date, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setStartDate(date.toISOString());
                        setIsCalendarOpen(false);
                      }}
                      className={`p-2 rounded-md cursor-pointer hover:bg-blue-50 ${
                        startDate === date.toISOString() ? 'bg-blue-100' : ''
                      }`}
                    >
                      {formatDate(date)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Number of Guests
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setGuests(Math.max(1, guests - 1))}
              className="px-4 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>
            <input
              type="number"
              min="1"
              max="10"
              value={guests}
              onChange={(e) =>
                setGuests(
                  Math.max(1, Math.min(10, parseInt(e.target.value) || 1))
                )
              }
              className="w-full px-4 py-3 text-center focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setGuests(Math.min(10, guests + 1))}
              className="px-4 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-semibold">Total Package Price</span>
          <span className="text-2xl font-bold text-blue-600">
            ₹ {tour?.price}
          </span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-bold transition-colors ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
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
            'Book This Tour'
          )}
        </button>

        <p className="text-center text-sm text-gray-600 mt-3">
          No payment required today — Reserve your spot now
        </p>
      </form>
    </div>
  );
};

// New component for company information
const CompanyInfo = () => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
    <h2 className="text-2xl font-bold mb-4">About Our Company</h2>
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/3">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
          alt="Our Company"
          className="w-full h-64 object-cover rounded-lg shadow"
        />
      </div>
      <div className="md:w-2/3">
        <h3 className="text-xl font-bold mb-2">Adventure Tours & Travels</h3>
        <p className="text-gray-700 mb-4">
          Om Banna Tours and Travel is a dedicated travel company offering
          reliable and well-planned tour services across Rajasthan and other
          parts of India. With a deep understanding of local culture, routes,
          and travel needs, we ensure a smooth and comfortable journey for our
          customers. We offer a range of services including Rajasthan heritage
          tours, All India travel packages, car rentals, and customized
          itineraries to suit your preferences. Whether it’s exploring the forts
          of Jaipur, the deserts of Jaisalmer, or planning a family trip across
          India, we’re here to make your travel easy and enjoyable. Our team
          focuses on genuine service, clear communication, and attention to
          detail—because we believe travel should be simple, safe, and
          memorable. Let Om Banna Tours and Travel be your trusted travel
          companion, wherever the road takes you.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-blue-500 mr-2 mt-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>4+ years of experience</span>
          </div>
          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-blue-500 mr-2 mt-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>50,000+ satisfied customers</span>
          </div>
          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-blue-500 mr-2 mt-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>60+ destinations Covered</span>
          </div>
          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-blue-500 mr-2 mt-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>4.8/5 customer rating</span>
          </div>
        </div>
        <div className="flex space-x-4">
          <a href="#" className="text-blue-600 hover:text-blue-800">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a href="#" className="text-blue-400 hover:text-blue-600">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
          </a>
          <a href="#" className="text-blue-700 hover:text-blue-900">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
);

// New component for FAQ section
const FAQ = () => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
    <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
    <div className="space-y-4">
      {[
        {
          question: 'What is included in the tour price?',
          answer:
            "Our tour prices include accommodation, transportation, guided activities, and most meals. Specific inclusions are listed in each tour's details.",
        },
        {
          question: 'How do I book a tour?',
          answer:
            "You can book a tour by clicking the 'Book This Tour' button on any tour page. You'll be guided through a simple booking process with secure payment options.",
        },
        {
          question: 'What is your cancellation policy?',
          answer:
            'We offer free cancellation up to 30 days before the tour start date. Cancellations made within 30 days may be subject to a fee based on our terms and conditions.',
        },
        {
          question: 'Are the tours suitable for all fitness levels?',
          answer:
            'We offer tours for various fitness levels, from easy to challenging. Each tour page indicates the difficulty level to help you choose the right experience.',
        },
      ].map((faq, index) => (
        <div key={index} className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
          <p className="text-gray-700">{faq.answer}</p>
        </div>
      ))}
    </div>
  </div>
);

const TourDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const tours = useSelector((state) => state?.car?.tours);
  const { currentUser } = useContext(AuthContext);
  const tour = tours && tours?.find((tour) => tour?._id === id);
  const [activeDay, setActiveDay] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchTours());
  }, [dispatch]);

  const handleDayClick = (day) => {
    setActiveDay(day);
  };

  const handleBookNow = async (details, onComplete) => {
    try {
      // Calculate end date based on tour duration
      const startDate = new Date(details.startDate);
      const endDate = new Date(startDate);

      // Extract duration in days from the tour duration string (e.g., "5 days" -> 5)
      const durationMatch = tour?.duration.match(/(\d+)/);
      const durationDays = durationMatch ? parseInt(durationMatch[1]) : 1;

      endDate.setDate(startDate.getDate() + durationDays - 1); // -1 because the first day counts

      const bookingData = {
        tourId: id,
        userId: currentUser?._id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        price: details.price,
        guests: details.guests,
      };

      const response = await apiClient.post('/bookings', bookingData, {
        withCredentials: true,
      });
      console.log(response);

      if (response?.data?.success) {
        setBookingDetails(details);
        setShowConfetti(true);
        setShowConfirmation(true);

        // Hide confetti after animation
        setTimeout(() => setShowConfetti(false), 4000);

        // Call the onComplete callback to stop loading
        if (onComplete) onComplete();
      } else {
        console.error('Booking failed:', response);
        alert('Booking failed. Please try again later.');
        // Stop loading on failure too
        if (onComplete) onComplete();
      }
    } catch (error) {
      console.error('Error booking tour:', error);
      alert('An error occurred while booking. Please try again later.');
      // Stop loading on error too
      if (onComplete) onComplete();
    }
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
  };

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading tour details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Confetti isActive={showConfetti} />
      <TourBanner tour={tour} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TourOverview tour={tour} />
              <Itinerary
                tour={tour}
                activeDay={activeDay}
                handleDayClick={handleDayClick}
              />
              <CompanyInfo />
              <TestimonialSlider />
              <FAQ />
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-2xl font-bold mb-4">Book This Tour</h2>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Tour Details</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Duration: {tour?.duration}
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Difficulty: {tour?.difficulty}
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Rating: {tour?.rating} ({tour?.reviews} reviews)
                    </li>
                  </ul>
                </div>
                <BookingCTA tour={tour} onBookNow={handleBookNow} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingConfirmation
        isOpen={showConfirmation}
        onClose={closeConfirmation}
        bookingDetails={bookingDetails}
      />
    </div>
  );
};

export default TourDetailsPage;
