import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_KEY } from '../contants/api';
import { showToast } from './toastSlice';

export const submitRating = createAsyncThunk(
    'rating/submitRating',
    async ({ sessionId, mediaType, mediaId, rating }, { dispatch }) => {
        const response = await axios.post(`/${mediaType}/${mediaId}/rating?api_key=${API_KEY}&session_id=${sessionId}`, {
            value: rating,
        });
        dispatch(showToast({ message: 'Rating submitted successfully!', type: 'success' }));
        return response.data;
    }
);

const ratingSlice = createSlice({
    name: 'rating',
    initialState: {
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(submitRating.pending, (state) => {
                state.loading = true;
            })
            .addCase(submitRating.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(submitRating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default ratingSlice.reducer;
