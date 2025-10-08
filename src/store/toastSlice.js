import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: '',
  type: '',
  isVisible: false,
};

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.isVisible = true;
    },
    hideToast: (state) => {
      state.isVisible = false;
      state.message = '';
      state.type = '';
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;

export default toastSlice.reducer;
