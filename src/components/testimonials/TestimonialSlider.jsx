import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { apiClient } from '../../api/ApiRequest';

const TestimonialSlider = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await apiClient.get('/feedback');
      if (response.status === 200) {
        // Duplicate the feedbacks array for infinite scroll effect
        const originalFeedbacks = response.data.data || [];
        setFeedbacks([...originalFeedbacks, ...originalFeedbacks, ...originalFeedbacks]);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
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
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">What Our Customers Say</h2>
      <div className="relative overflow-hidden">
        <motion.div
          className="flex gap-6"
          initial={{ x: 0 }}
          animate={{ 
            x: [0, -33.33 * (feedbacks.length / 3) + '%']
          }}
          transition={{
            duration: 40,
            ease: "linear",
            repeat: Infinity,
          }}
          whileHover={{ animationPlayState: 'paused' }}
          style={{ cursor: 'grab' }}
        >
          {feedbacks.map((feedback, index) => (
            <motion.div
              key={index}
              className="min-w-[350px] bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col">
                <div className="flex items-center mb-4">
                  <img
                    src={`http://localhost:5000${feedback.user.avatar}`}
                    alt={feedback.user.email}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-100 mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{feedback.user.email}</h4>
                    <div className="flex mt-1">
                      {renderStars(feedback.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic mb-3 line-clamp-3">
                  "{feedback.comment}"
                </p>
                <div className="mt-auto">
                  <p className="text-sm text-gray-500">
                    {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TestimonialSlider; 