import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseURL';

export const showTASchedule = createAsyncThunk(
    'coachScheduling/showTaSchedule',
    async () => {
        const response = await axios.get(`${baseUrl}/admin/taschedules`);
        return response.data;
    }
);

export const getTAScheduledSessions = createAsyncThunk(
    'coachScheduling/getTAScheduledSessions',
    async ({ id, data }) => {
        const response = await axios.post(
            `${baseUrl}/admin/taschedules/${id}`,
            data
        );
        return response.data;
    }
);

export const createCoachSchedule = createAsyncThunk(
    'coachScheduling/createCoachSchedule',
    async data => {
        const response = await axios.post(
            `${baseUrl}/admin/coachschedules`,
            data
        );
        return response.data;
    }
);

export const getCoachAvailableSlotsFromDate = createAsyncThunk(
    'coachScheduling/getCoachAvailableSlotsFromDate',
    async data => {
        const response = await axios.post(
            `${baseUrl}/admin/coach-slots/getTACoachSlotForADate`,
            data
        );
        return response.data;
    }
);

// Reschedule Session
export const rescheduleCoachSession = createAsyncThunk(
    'coachAvailability/rescheduleCoachSession',
    async ({ id, data }) => {
        const response = await axios.put(
            `${baseUrl}/admin/taschedules/${id}`,
            data
        );
        return response.data;
    }
);

// Cancel Scheduled Sessions
export const cancelCoachScheduledSession = createAsyncThunk(
    'coachAvailability/cancelCoachScheduledSession',
    async id => {
        const response = await axios.put(
            `${baseUrl}/admin/taschedules/${id}/cancel`
        );
        return response.data;
    }
);

const initialState = {
    coachAvailableSlots: [],
    coachScheduledSessions: [],

    loading: false,
    error: null,
    studentBatchMapping: [],
    studentBatchMappingLoading: false,
    studentBatchMappingError: null,
    scheduleCoachSessionOpen: false,
    students: [],
    batches: [],
    openCoachEditBatch: false,
    openCoachEditStudent: false,
    coachID: null,
    coachName: null,
    coachTimezone: null,
};

const coachScheduling = createSlice({
    name: 'coachScheduling',
    initialState,
    reducers: {
        openCoachScheduleSession(state, action) {
            console.log('Open Action : ', action.payload);
            state.coachID = action.payload.id;
            state.coachName = action.payload.name;
            state.coachTimezone = action.payload.timezone;
            if (action.payload.student) {
                state.students = action.payload.student;
            }
            if (action.payload.batches) {
                state.batches = action.payload.batches;
            }
            state.scheduleCoachSessionOpen = true;
        },
        closeCoachScheduleSession(state, action) {
            console.log('Close Action : ', action.payload);
            state.coachID = null;
            state.coachName = null;
            state.coachTimezone = null;
            state.students = [];
            state.batches = [];
            state.scheduleCoachSessionOpen = false;
        },
        openCoachEditBatch(state, action) {
            state.openCoachEditBatch = true;
        },
        closeCoachEditBatch(state, action) {
            state.openCoachEditBatch = false;
        },
        openCoachEditStudent(state, action) {
            state.openCoachEditStudent = true;
        },
        closeCoachEditStudent(state, action) {
            state.openCoachEditStudent = false;
        },
        clearAvailableSlots(state) {
            state.coachAvailableSlots = [];
        },
    },
    extraReducers: builder => {
        // Get TA Scheduled Sessions
        builder.addCase(getTAScheduledSessions.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTAScheduledSessions.fulfilled, (state, action) => {
            state.loading = false;
            state.coachScheduledSessions = action.payload.data;
        });
        builder.addCase(getTAScheduledSessions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Create TA Schedule
        builder.addCase(createCoachSchedule.pending, state => {
            state.loading = true;
        });
        builder.addCase(createCoachSchedule.fulfilled, (state, action) => {
            state.loading = false;
            state.coachScheduledSessions = action.payload.data;
        });
        builder.addCase(createCoachSchedule.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Get TA Available Slots From Date
        builder.addCase(getCoachAvailableSlotsFromDate.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            getCoachAvailableSlotsFromDate.fulfilled,
            (state, action) => {
                console.log('action', action.payload.data);
                state.loading = false;
                state.coachAvailableSlots = action.payload.data;
            }
        );
        builder.addCase(
            getCoachAvailableSlotsFromDate.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.coachAvailableSlots = [];
            }
        );

        // Cancel Scheduled Sessions
        builder.addCase(cancelCoachScheduledSession.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            cancelCoachScheduledSession.fulfilled,
            (state, action) => {
                state.loading = false;
                state.coachScheduledSessions = action.payload.data;
            }
        );
        builder.addCase(
            cancelCoachScheduledSession.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }
        );

        // Reschedule Session // TODO : Check this
        builder.addCase(rescheduleCoachSession.pending, state => {
            state.loading = true;
        });
        builder.addCase(rescheduleCoachSession.fulfilled, (state, action) => {
            state.loading = false;
            state.coachScheduledSessions = action.payload.data;
        });
        builder.addCase(rescheduleCoachSession.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export const {
    openCoachScheduleSession,
    closeCoachScheduleSession,
    openCoachEditBatch,
    closeCoachEditBatch,
    openCoachEditStudent,
    closeCoachEditStudent,
} = coachScheduling.actions;

export default coachScheduling.reducer;
