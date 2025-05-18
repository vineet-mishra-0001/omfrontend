import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '../../api/ApiRequest';

const ClientFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await apiClient.get('/feedback');
      if (response.status === 200) {
        setFeedbacks(response.data);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 3 >= feedbacks.length ? 0 : prevIndex + 3
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 3 < 0 ? Math.max(0, feedbacks.length - 3) : prevIndex - 3
    );
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Read genuine feedback from our valued customers who have experienced
            our services
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-white shadow-md hover:bg-blue-50 transition-colors"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-6 h-6 text-blue-600" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-white shadow-md hover:bg-blue-50 transition-colors"
              disabled={currentIndex + 3 >= feedbacks.length}
            >
              <ChevronRight className="w-6 h-6 text-blue-600" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.slice(currentIndex, currentIndex + 3).map((feedback) => (
              <motion.div
                key={feedback._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6 transition-transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={`https://api.ombannatours.com${feedback.userId.avatar}`}
                    alt={feedback.userId.username}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">
                      {feedback.userId.username}
                    </h3>
                    <div className="flex mt-1">
                      {renderStars(feedback.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 line-clamp-4">{feedback.comment}</p>
                <div className="mt-4 text-sm text-gray-500">
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>

          {feedbacks.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">
                No feedbacks available yet. Be the first to share your
                experience!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientFeedbacks;
