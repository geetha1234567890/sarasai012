import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseURL';

export const linkActivity = createAsyncThunk(
    'linkActivity/link',
    async (activityData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${baseUrl}/admin/coaching-templates/link-activity`,
                activityData
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const linkActivitySlice = createSlice({
    name: 'linkActivity',
    initialState: {
        loading: false,
        success: false,
        error: null,
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(linkActivity.pending, state => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(linkActivity.fulfilled, state => {
                state.loading = false;
                state.success = true;
            })
            .addCase(linkActivity.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    },
});

export default linkActivitySlice.reducer;
