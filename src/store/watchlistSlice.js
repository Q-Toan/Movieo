
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_KEY } from '../contants/api';
import { showToast } from './toastSlice';

export const addToWatchlist = createAsyncThunk(
    'watchlist/addToWatchlist',
    async ({ sessionId, accountId, mediaType, mediaId }, { dispatch }) => {
        const response = await axios.post(`/account/${accountId}/watchlist?api_key=${API_KEY}&session_id=${sessionId}`, {
            media_type: mediaType,
            media_id: mediaId,
            watchlist: true,
        });
        dispatch(showToast({ message: 'Added to watchlist success!', type: 'success' }));
        return response.data;
    }
);

export const removeFromWatchlist = createAsyncThunk(
    'watchlist/removeFromWatchlist',
    async ({ sessionId, accountId, mediaType, mediaId }, { dispatch }) => {
        const response = await axios.post(`/account/${accountId}/watchlist?api_key=${API_KEY}&session_id=${sessionId}`, {
            media_type: mediaType,
            media_id: mediaId,
            watchlist: false,
        });
        dispatch(showToast({ message: 'Removed from watchlist success!', type: 'error' }));
        return response.data;
    }
);

const watchlistSlice = createSlice({
    name: 'watchlist',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addToWatchlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(addToWatchlist.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(addToWatchlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(removeFromWatchlist.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeFromWatchlist.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(removeFromWatchlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default watchlistSlice.reducer;
