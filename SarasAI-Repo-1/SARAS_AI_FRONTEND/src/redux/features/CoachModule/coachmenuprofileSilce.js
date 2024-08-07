import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseURL';
import axiosInstance from '../../services/httpService';

// Get Today Available Ta
export const updateCoachmenuprofile = createAsyncThunk(
    'coachMenu/updateprofile',
    async data => {
        const response = await axiosInstance.put(
            `${baseUrl}/coach/coach-profile`,
            data
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

//get slots for ta from date to end date

const initialState = {
    profileData: [],
};

export const coachMenuSlice = createSlice({
    name: 'taAvialability',
    initialState,
    reducers: {},
    extraReducers: builder => {
        //for sessions ta for calendar

        // Get Today Available Ta
        builder.addCase(updateCoachmenuprofile.pending, state => {
            state.loading = true;
        });
        builder.addCase(updateCoachmenuprofile.fulfilled, (state, action) => {
            state.loading = false;
            state.profileData = action.payload?.data;
        });
        builder.addCase(updateCoachmenuprofile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export default coachMenuSlice.reducer;
