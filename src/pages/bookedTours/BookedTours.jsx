import React, { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { apiClient } from "../../api/ApiRequest";

const BookedTours = () => {
  const { currentUser } = useContext(AuthContext);
  const tours = useSelector((state) => state?.car?.tours);
  const [bookedTours, setBookedTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    const fetchBookedTours = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        
        // Fetch booked tours from API
        const response = await apiClient.get(`/bookings/user/${currentUser._id}`);
        
        if (response.data.success) {
          // If the API returns a single booking object, convert it to an array
          const bookingsData = Array.isArray(response.data.data) 
            ? response.data.data 
            : [response.data.data];
            
          setBookedTours(bookingsData);
        } else {
          // Fallback to localStorage if API fails
          const bookedTourIds = JSON.parse(localStorage.getItem(`bookedTours_${currentUser._id}`) || '[]');
          const userBookedTours = tours?.filter(tour => bookedTourIds.includes(tour._id)) || [];
          
          const bookingDetails = JSON.parse(localStorage.getItem(`bookingDetails_${currentUser._id}`) || '{}');
          
          const toursWithDetails = userBookedTours.map(tour => {
            const details = bookingDetails[tour._id] || {};
            return {
              tour: tour,
              startDate: details.startDate || 'Not specified',
              guests: details.guests || 1,
              bookingStatus: 'confirmed',
              paymentStatus: 'unpaid'
            };
          });
          
          setBookedTours(toursWithDetails);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching booked tours:", err);
        
        // Fallback to localStorage if API fails
        try {
          const bookedTourIds = JSON.parse(localStorage.getItem(`bookedTours_${currentUser._id}`) || '[]');
          const userBookedTours = tours?.filter(tour => bookedTourIds.includes(tour._id)) || [];
          
          const bookingDetails = JSON.parse(localStorage.getItem(`bookingDetails_${currentUser._id}`) || '{}');
          
          const toursWithDetails = userBookedTours.map(tour => {
            const details = bookingDetails[tour._id] || {};
            return {
              tour: tour,
              startDate: details.startDate || 'Not specified',
              guests: details.guests || 1,
              bookingStatus: 'confirmed',
              paymentStatus: 'unpaid'
            };
          });
          
          setBookedTours(toursWithDetails);
          setLoading(false);
        } catch (localStorageErr) {
          console.error("Error with localStorage fallback:", localStorageErr);
          setError("Failed to load your booked tours. Please try again later.");
          setLoading(false);
        }
      }
    };

    fetchBookedTours();
  }, [currentUser, tours]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'Not specified') return 'Not specified';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get payment status badge color
  const getPaymentStatusColor = (status) => {
    switch(status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter tours by status
  const getFilteredTours = () => {
    const now = new Date();
    
    return bookedTours.filter(booking => {
      const startDate = new Date(booking.startDate);
      
      if (activeTab === "upcoming") {
        return startDate >= now;
      } else if (activeTab === "past") {
        return startDate < now;
      } else {
        return true;
      }
    });
  };

  // Calculate days until tour
  const getDaysUntilTour = (startDate) => {
    if (!startDate || startDate === 'Not specified') return null;
    
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = start - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // FAQs data
  const faqs = [
    {
      question: "What happens if I need to cancel my booking?",
      answer: "You can cancel your booking up to 7 days before the start date for a full refund. Cancellations made within 7 days of the start date will incur a cancellation fee of 50% of the total booking amount. For cancellations within 24 hours of the start date, no refund will be provided."
    },
    {
      question: "How do I modify my booking details?",
      answer: "You can modify your booking details such as the number of guests or start date by contacting our customer support team at least 48 hours before your tour start date. Changes are subject to availability and may incur additional charges."
    },
    {
      question: "What should I bring on the tour?",
      answer: "We recommend bringing comfortable walking shoes, weather-appropriate clothing, a water bottle, sunscreen, and any personal medications. Specific requirements will be detailed in your tour confirmation email."
    },
    {
      question: "Are meals included in the tour price?",
      answer: "Most of our tours include breakfast and dinner. Lunch is typically not included unless specified in the tour details. Special dietary requirements can be accommodated with prior notice."
    },
    {
      question: "What is your policy on children?",
      answer: "Children under 5 years of age can join most tours free of charge. Children between 5-12 years are charged at 50% of the adult rate. Children over 12 are charged the full adult rate."
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center mb-4">
            <svg className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold text-red-700">Error</h2>
          </div>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center mb-4">
            <svg className="h-6 w-6 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold text-yellow-700">Not Logged In</h2>
          </div>
          <p className="text-yellow-600">Please log in to view your booked tours.</p>
          <Link 
            to="/login"
            className="mt-4 inline-block bg-yellow-100 text-yellow-700 px-4 py-2 rounded-md hover:bg-yellow-200 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (bookedTours.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto text-center">
            <div className="mb-6">
              <svg className="h-16 w-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Booked Tours Yet</h2>
            <p className="text-gray-600 mb-6">You haven't booked any tours yet. Explore our amazing destinations and start your adventure!</p>
            <Link 
              to="/tours"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Tours
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredTours = getFilteredTours();
 
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Booked Tours</h1>
          <p className="text-gray-600 mt-2">View all your upcoming and past tour bookings</p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-800">{currentUser.username || 'User'}</h2>
                  <p className="text-gray-600">{currentUser.email}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === "all" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Tours
                </button>
                <button 
                  onClick={() => setActiveTab("upcoming")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === "upcoming" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Upcoming
                </button>
                <button 
                  onClick={() => setActiveTab("past")}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === "past" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Past
                </button>
              </div>
            </div>
          </div>

          {filteredTours.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {activeTab === "upcoming" 
                  ? "No Upcoming Tours" 
                  : activeTab === "past" 
                    ? "No Past Tours" 
                    : "No Tours Found"}
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === "upcoming" 
                  ? "You don't have any upcoming tours booked. Explore our destinations and plan your next adventure!" 
                  : activeTab === "past" 
                    ? "You haven't completed any tours yet. Your completed tours will appear here." 
                    : "No tours match your current filter. Try changing the filter or browse our available tours."}
              </p>
              <Link 
                to="/tours"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Browse Tours
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTours.map((booking) => {
                const tour = booking.tour || booking;
                const daysUntilTour = getDaysUntilTour(booking.startDate);
                const isUpcoming = daysUntilTour !== null && daysUntilTour > 0;
                
                return (
                  <div key={booking._id || tour._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/4">
                        <div className="relative">
                          <img 
                            src={tour.images && tour.images[0]} 
                            alt={tour.title} 
                            className="w-full h-40 object-cover rounded-lg shadow"
                          />
                          {isUpcoming && (
                            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                              {daysUntilTour} {daysUntilTour === 1 ? 'day' : 'days'} left
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="md:w-3/4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-800">{tour.title}</h3>
                          <div className="flex space-x-2 mt-2 md:mt-0">
                            <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(booking.bookingStatus)}`}>
                              {booking.bookingStatus || 'Confirmed'}
                            </span>
                            <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                              {booking.paymentStatus || 'Unpaid'}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">{tour.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center">
                            <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div>
                              <p className="text-sm text-gray-500">Start Date</p>
                              <p className="font-medium">{formatDate(booking.startDate)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <div>
                              <p className="text-sm text-gray-500">Guests</p>
                              <p className="font-medium">{booking.guests} {booking.guests === 1 ? 'Person' : 'People'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                              <p className="text-sm text-gray-500">Price</p>
                              <p className="font-medium">₹ {tour.price}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="mb-4 md:mb-0">
                            <Link 
                              to={`/tours/in/${tour.title}/${tour._id}?price=${tour?.price}&&duration=${tour?.duration}`}
                              className="inline-flex items-center text-blue-600 hover:text-blue-800"
                            >
                              <span>View Tour Details</span>
                              <svg className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                          
                          {isUpcoming && (
                            <div className="flex space-x-2">
                              <button className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors">
                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Download Itinerary</span>
                              </button>
                              <button className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors">
                                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span>Cancel Booking</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h2>
            <p className="text-gray-600 mt-1">Find answers to common questions about your bookings</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Still have questions?</p>
              <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span>Contact Support</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookedTours;