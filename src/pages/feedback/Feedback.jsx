import React, { useState, useContext } from 'react';
import { Star, Send, Smile } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { apiClient } from '../../api/ApiRequest';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const {currentUser} = useContext(AuthContext);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await apiClient.post('/feedback', 
       {   
          rating,
          comment,
          userId: currentUser._id
       }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success('Thank you for your feedback!');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        className="focus:outline-none"
        onMouseEnter={() => setHoveredStar(star)}
        onMouseLeave={() => setHoveredStar(0)}
        onClick={() => setRating(star)}
      >
        <Star
          className={`w-8 h-8 transition-all ${
            star <= (hoveredStar || rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
        />
      </button>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="px-6 py-8 sm:p-10">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Feedback Matters</h1>
              <p className="text-gray-600">Help us improve your experience with Ombanna Tours</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  How would you rate your experience?
                </label>
                <div className="flex justify-center space-x-2">
                  {renderStars()}
                </div>
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Share your thoughts with us
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                  placeholder="Tell us about your experience..."
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!rating || !comment || isSubmitting}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-white transition-all ${
                    !rating || !comment || isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          <div className="bg-gray-50 px-6 py-4 sm:px-10">
            <p className="text-xs text-gray-500 text-center">
              Your feedback helps us provide better service to all our customers.
              We appreciate your time and honesty.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Feedback; 