import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    sessionId: localStorage.getItem('session_id') || null,
    isAuthenticated: !!localStorage.getItem('session_id'),
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setSessionId: (state, action) => {
            state.sessionId = action.payload;
            state.isAuthenticated = !!action.payload;
            if (action.payload) {
                localStorage.setItem('session_id', action.payload);
            } else {
                localStorage.removeItem('session_id');
            }
        },
        logout: (state) => {
            state.user = null;
            state.sessionId = null;
            state.isAuthenticated = false;
            localStorage.removeItem('session_id');
        },
    },
});

export const { setUser, setSessionId, logout } = userSlice.actions;

export default userSlice.reducer;
