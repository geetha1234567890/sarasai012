import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseURL';

// Show TA Schedule
export const showTASchedule = createAsyncThunk(
    'taScheduling/showTaSchedule',
    async () => {
        const response = await axios.get(`${baseUrl}/admin/taschedules`);
        return response.data;
    }
);

// Get TA Scheduled Sessions
export const getTAScheduledSessions = createAsyncThunk(
    'taScheduling/getTAScheduledSessions',
    async ({ id, data }) => {
        const response = await axios.post(
            `${baseUrl}/admin/taschedules/${id}`,
            data
        );
        return response.data;
    }
);

// Create TA Schedule
export const createTASchedule = createAsyncThunk(
    'taScheduling/createTASchedule',
    async data => {
        const response = await axios.post(`${baseUrl}/admin/taschedules`, data);
        return response.data;
    }
);

// Get TA Available Slots From Date
export const getTaAvailableSlotsFromDate = createAsyncThunk(
    'taScheduling/getTaAvailableSlotsFromDate',
    async data => {
        const response = await axios.post(
            `${baseUrl}/admin/coach-slots/getTACoachSlotForADate`,
            data
        );
        return response.data;
    }
);

// Reschedule Session
export const rescheduleSession = createAsyncThunk(
    'taAvialability/rescheduleSession',
    async ({ id, data }) => {
        const response = await axios.put(
            `${baseUrl}/admin/taschedules/${id}`,
            data
        );
        return response.data;
    }
);

// Cancel Scheduled Sessions
export const cancelScheduledSession = createAsyncThunk(
    'taAvialability/cancelScheduledSession',
    async id => {
        const response = await axios.put(
            `${baseUrl}/admin/taschedules/${id}/cancel`
        );
        return response.data;
    }
);

const initialState = {
    taAvailableSlots: [], // TA Available Slots
    taScheduledSessions: [], // TA Scheduled Sessions
    taSchedule: [], // TA Schedule
    studentBatchMapping: [], // Student Batch Mapping
    students: [], // Students
    batches: [], // Batches
    openEditBatch: false,
    openEditStudent: false,
    loading: false,
    error: null,

    studentBatchMappingLoading: false,
    studentBatchMappingError: null,
    scheduleSessionOpen: false,
    taID: null,
    taName: null,
    taTimezone: null,
};

const taScheduling = createSlice({
    name: 'taScheduling',
    initialState,
    reducers: {
        openScheduleSession(state, action) {
            console.log('Open Action : ', action.payload);
            state.taID =
                action.payload.id !== undefined
                    ? action.payload.id
                    : action.payload.ta_id;
            //state.taID = action.payload.id;
            state.taName = action.payload.name;
            state.taTimezone = action.payload.timezone;
            if (action.payload.student) {
                state.students = action.payload.student;
            }
            if (action.payload.batches) {
                state.batches = action.payload.batches;
            }
            state.scheduleSessionOpen = true;
        },
        closeScheduleSession(state, action) {
            console.log('Close Action : ', action.payload);
            state.taID = null;
            state.taName = null;
            state.taTimezone = null;
            state.students = [];
            state.batches = [];
            //state.openEditBatch = false;
            state.scheduleSessionOpen = false;
        },
        openEditBatch(state, action) {
            state.openEditBatch = true;
        },
        closeEditBatch(state, action) {
            state.openEditBatch = false;
        },
        openEditStudent(state, action) {
            state.openEditStudent = true;
        },
        closeEditStudent(state, action) {
            state.openEditStudent = false;
        },
        clearAvailableSlots(state) {
            state.taAvailableSlots = [];
        },
    },
    extraReducers: builder => {
        // Show TA Schedule
        builder.addCase(showTASchedule.pending, state => {
            state.loading = true;
        });
        builder.addCase(showTASchedule.fulfilled, (state, action) => {
            state.loading = false;
            state.taSchedule = action.payload.data;
        });
        builder.addCase(showTASchedule.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Get TA Scheduled Sessions
        builder.addCase(getTAScheduledSessions.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTAScheduledSessions.fulfilled, (state, action) => {
            state.loading = false;
            state.taScheduledSessions = action.payload.data;
        });
        builder.addCase(getTAScheduledSessions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Create TA Schedule
        builder.addCase(createTASchedule.pending, state => {
            state.loading = true;
        });
        builder.addCase(createTASchedule.fulfilled, (state, action) => {
            state.loading = false;
            state.taScheduledSessions = action.payload.data;
        });
        builder.addCase(createTASchedule.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Get TA Available Slots From Date
        builder.addCase(getTaAvailableSlotsFromDate.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            getTaAvailableSlotsFromDate.fulfilled,
            (state, action) => {
                state.loading = false;
                state.taAvailableSlots = action.payload.data;
            }
        );
        builder.addCase(
            getTaAvailableSlotsFromDate.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.taAvailableSlots = [];
            }
        );

        // Cancel Scheduled Sessions
        builder.addCase(cancelScheduledSession.pending, state => {
            state.loading = true;
        });
        builder.addCase(cancelScheduledSession.fulfilled, (state, action) => {
            state.loading = false;
            state.taScheduledSessions = action.payload.data;
        });
        builder.addCase(cancelScheduledSession.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Reschedule Session // TODO : Check this
        builder.addCase(rescheduleSession.pending, state => {
            state.loading = true;
        });
        builder.addCase(rescheduleSession.fulfilled, (state, action) => {
            state.loading = false;
            state.taScheduledSessions = action.payload.data;
        });
        builder.addCase(rescheduleSession.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export const {
    openScheduleSession,
    closeScheduleSession,
    openEditBatch,
    closeEditBatch,
    openEditStudent,
    closeEditStudent,
} = taScheduling.actions;

export default taScheduling.reducer;
