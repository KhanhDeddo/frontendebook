import { createSlice } from '@reduxjs/toolkit';

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    value: 'Initial Redux Data',
  },
  reducers: {
    updateData: (state, action) => {
      state.value = action.payload; // Cập nhật state
    },
  },
});

export const { updateData } = dataSlice.actions; // Export actions
export default dataSlice.reducer; // Export reducer