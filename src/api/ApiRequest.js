import axios from 'axios';

// API URL
export const API_URL = 'https://api.ombannatours.com/api/v1'; // Replace with your API URL

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Enable cookies for cross-origin requests
  headers: {
    'Content-Type': 'application/json',  // Example: Add content-type header
   
  }
});

// To log or view headers in the request (you can inspect the request in the console)
apiClient.interceptors.request.use((config) => {
  console.log("Request Headers:", config.headers);  // This will log the headers for each request
  return config;
}, (error) => {
  return Promise.reject(error);
});

