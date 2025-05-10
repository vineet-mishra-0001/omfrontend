import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '../../api/ApiRequest';

const Testimonial = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await apiClient.get('/feedback');
      if (response.status === 200) {
        // Duplicate the feedbacks array to create infinite scroll effect
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
    <div className="bg-gradient-to-b from-gray-50 to-white py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">What Our Clients Say</h2>
          <p className="text-gray-600 mt-2">
            Read genuine feedback from our valued customers
          </p>
        </div>

        {feedbacks.length > 0 ? (
          <div className="relative">
            <motion.div
              className="flex gap-6"
              initial={{ x: 0 }}
              animate={{ 
                x: [0, -33.33 * (feedbacks.length / 3) + '%']
              }}
              transition={{
                duration: 30,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              {feedbacks.map((feedback, index) => (
                <motion.div
                  key={index}
                  className="min-w-[350px] bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col items-center">
                    <img
                      src={`http://localhost:5000${feedback.user.avatar}`}
                      alt={feedback.user.email}
                      className="w-16 h-16 rounded-full object-cover border-4 border-blue-100 mb-4"
                    />
                    <div className="flex mb-3">
                      {renderStars(feedback.rating)}
                    </div>
                    <p className="text-gray-600 text-center text-sm mb-4 line-clamp-3 italic">
                      "{feedback.comment}"
                    </p>
                    <div className="text-center">
                      <h4 className="text-blue-600 font-medium text-sm">
                        {feedback.user.email}
                      </h4>
                      <p className="text-gray-500 text-xs mt-1">
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
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No testimonials available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonial;
