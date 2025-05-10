// src/features/car/carSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiClient } from '../api/ApiRequest';

export const fetchCars = createAsyncThunk('car/fetchCars', async () => {
  const response = await apiClient.get('/cars'); // adjust API base URL if needed
  console.log('ddwdwdw', response.data)
  return response.data;
});


export const fetchReviewsByCarId = createAsyncThunk('car/fetchReviews', async (carId) => {
  const response = await apiClient.get(`/reviews/${carId}`); // adjust API base URL if needed
  return response.data;
});

export const fetchTours = createAsyncThunk('tour/fetchTours', async () => {
  const response = await apiClient.get('/tours'); // adjust API base URL if needed
  return response.data;
})


export const paginatedTours = createAsyncThunk('tour/paginatedTours', async (params) => {
  const response = await apiClient.get('/tours/limit', { params });
  return response.data;
});


const carSlice = createSlice({
  name: 'car',
  initialState: {
    cars: [],
    status: 'idle',
    reviews: [],
    paginateTours: [],
    tours: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cars = action.payload;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      /////////////////////
      .addCase(fetchReviewsByCarId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReviewsByCarId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsByCarId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      /////////////////////
      .addCase(fetchTours.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTours.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tours = action.payload;
      })
      .addCase(fetchTours.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      /////////////////////
      .addCase(paginatedTours.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(paginatedTours.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.paginateTours = action.payload;
      })
      .addCase(paginatedTours.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  },
});

export default carSlice.reducer;
