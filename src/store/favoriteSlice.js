import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_KEY } from '../contants/api';
import { showToast } from './toastSlice';

export const addToFavorites = createAsyncThunk(
    'favorites/addToFavorites',
    async ({ sessionId, accountId, mediaType, mediaId }, { dispatch }) => {
        const response = await axios.post(`/account/${accountId}/favorite?api_key=${API_KEY}&session_id=${sessionId}`, {
            media_type: mediaType,
            media_id: mediaId,
            favorite: true,
        });
        dispatch(showToast({ message: 'Added to favorites successfully!', type: 'success' }));
        return response.data;
    }
);

export const removeFromFavorites = createAsyncThunk(
    'favorites/removeFromFavorites',
    async ({ sessionId, accountId, mediaType, mediaId }, { dispatch }) => {
        const response = await axios.post(`/account/${accountId}/favorite?api_key=${API_KEY}&session_id=${sessionId}`, {
            media_type: mediaType,
            media_id: mediaId,
            favorite: false,
        });
        dispatch(showToast({ message: 'Removed from favorites successfully!', type: 'error' }));
        return response.data;
    }
);

export const fetchFavorites = createAsyncThunk(
    'favorites/fetchFavorites',
    async ({ sessionId, accountId }) => {
        const [moviesResponse, tvResponse] = await Promise.all([
            axios.get(`/account/${accountId}/favorite/movies?api_key=${API_KEY}&session_id=${sessionId}`),
            axios.get(`/account/${accountId}/favorite/tv?api_key=${API_KEY}&session_id=${sessionId}`)
        ]);
        const movies = moviesResponse.data.results.map(item => ({ ...item, media_type: 'movie' }));
        const tv = tvResponse.data.results.map(item => ({ ...item, media_type: 'tv' }));
        return [...movies, ...tv];
    }
);

const favoriteSlice = createSlice({
    name: 'favorites',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addToFavorites.pending, (state) => {
                state.loading = true;
            })
            .addCase(addToFavorites.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(addToFavorites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(removeFromFavorites.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeFromFavorites.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(item => item.id !== action.meta.arg.mediaId);
            })
            .addCase(removeFromFavorites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchFavorites.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchFavorites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default favoriteSlice.reducer;
