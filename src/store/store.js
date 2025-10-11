import { configureStore } from '@reduxjs/toolkit';
import movieoReducer from './movieoSlice';
import userReducer from './userSlice';
import toastReducer from './toastSlice';
import watchlistReducer from './watchlistSlice';
import ratingReducer from './ratingSlice';
import favoriteReducer from './favoriteSlice';

export const store = configureStore({
    reducer: {
        movieoData : movieoReducer,
        user: userReducer,
        toast: toastReducer,
        watchlist: watchlistReducer,
        rating: ratingReducer,
        favorites: favoriteReducer,
    },
});