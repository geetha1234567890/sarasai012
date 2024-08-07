import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseURL';

export const getTimezone = createAsyncThunk(
    'timezone/getTimezone',
    async () => {
        const response = await axios.get(`${baseUrl}/timezones`);
        return response.data;
    }
);

const initialState = {
    timezones: [],
    loading: false,
    error: null,
};

const timezoneSlice = createSlice({
    name: 'timezone',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getTimezone.pending, state => {
                state.loading = true;
            })
            .addCase(getTimezone.fulfilled, (state, action) => {
                state.loading = false;
                state.timezones = action.payload;
            })
            .addCase(getTimezone.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const {} = timezoneSlice.actions;

export default timezoneSlice.reducer;
