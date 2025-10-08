import { configureStore } from '@reduxjs/toolkit';
import movieoReducer from './movieoSlice';
import userReducer from './userSlice';
import toastReducer from './toastSlice';
import watchlistReducer from './watchlistSlice';

export const store = configureStore({
    reducer: {
        movieoData : movieoReducer,
        user: userReducer,
        toast: toastReducer,
        watchlist: watchlistReducer,
    },
});