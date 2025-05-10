// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import carReducer from '../redux/carSlice'; // Adjust the import path as necessary
export const store = configureStore({
  reducer: {
    car: carReducer,
  },
});
