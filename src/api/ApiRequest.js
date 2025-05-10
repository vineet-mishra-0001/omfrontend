import axios from 'axios';

export const API_URL = 'http://localhost:5000/api/v1'; // Replace with your API URL

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
