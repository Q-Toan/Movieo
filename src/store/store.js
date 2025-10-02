import { configureStore } from '@reduxjs/toolkit';
import movieoReducer from './movieoSlice';
import userReducer from './userSlice';

export const store = configureStore({
    reducer: {
        movieoData : movieoReducer,
        user: userReducer,
    },
});