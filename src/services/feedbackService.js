import axios from 'axios';

const API_URL =
  process.env.REACT_APP_API_URL || 'https://api.ombannatours.com/api';

export const getFeedbacks = async () => {
  try {
    const response = await axios.get(`${API_URL}/feedbacks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    throw error;
  }
};
