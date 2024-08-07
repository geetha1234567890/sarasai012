import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseURL';

// Get Today Available Ta
export const getTodayTaAvailability = createAsyncThunk(
    'taAvialability/getTodayTaAvailability',
    async () => {
        const response = await axios.get(
            `${baseUrl}/admin/TA-availability/get-today-available-ta`
        );
        return response.data;
    }
);

//get slots for ta from date to end date
export const getSlots = createAsyncThunk(
    'taAvialability/getSlots',
    async data => {
        const response = await axios.post(
            `${baseUrl}/admin/coach-slots/records`,
            data
        );
        return response.data;
    }
);

//for fetching sessions of ta for calendar
export const fetchTAScheduleById = createAsyncThunk(
    'taAvialability/fetchTAScheduleById',
    async id => {
        const response = await axios.get(`${baseUrl}/admin/taschedules/${id}`);
        return response.data;
    }
);

//for fetching slots of ta for calendar
export const fetchCoachSlots = createAsyncThunk(
    'taAvialability/fetchCoachSlots',
    async id => {
        const response = await axios.get(`${baseUrl}/admin/coach-slots/${id}`);
        return response.data;
    }
);

// Create Slots for TA
export const createSlots = createAsyncThunk(
    'taAvialability/createSlots',
    async data => {
        console.log('Data being sent:', data);
        const response = await axios.post(`${baseUrl}/admin/coach-slots`, data);
        return response.data;
    }
);

// Get Schedule Session for TA
export const getScheduleSession = createAsyncThunk(
    'taAvialability/getScheduleSession',
    async data => {
        const response = await axios.post(
            `${baseUrl}/admin/taschedules/get-schedules-records`,
            data
        );
        return response.data;
    }
);

// Get Available Slots
export const fetchAvailableSlots = createAsyncThunk(
    'taAvialability/fetchAvailableSlots',
    async data => {
        // console.log("ID : ", id);
        const response = await axios.post(
            `${baseUrl}/admin/coach-slots/getTACoachSlotForADate`,
            data
        );
        return response.data;
    }
);

// Delete Future Slots
export const deleteFutureSlots = createAsyncThunk(
    'taAvialability/deleteFutureSlots',
    async ({ id, data }) => {
        // console.log("ID : ", id);

        console.log('Data : ', data, id);
        const response = await axios.delete(
            `${baseUrl}/admin/coach-slots/${id}`,
            {
                data: data,
            }
        );
        return response.data;
    }
);

// Reason for Leave
export const reasonForLeave = createAsyncThunk(
    'taAvialability/reasonForLeave',
    async data => {
        const response = await axios.post(`${baseUrl}/admin/leave`, data);
        return response.data;
    }
);

const initialState = {
    todaysAvailableTa: [],

    markLeaveData: [],
    slotData: [],
    scheduleData: [],
    scheduledSlotsData: [], // Ensure this is correctly named and initialized
    scheduledSessionData: [], // Ensure this is correctly named and initialized
    availableSlotsData: [],
    reasonForLeaveData: [],

    scheduleNewSession: false,
    createNewSlotOpen: false,
    deleteFutureSlotOpen: false,

    markLeaveOpen: false,
    scheduledSlotsOpen: false,
    scheduledSessionOpen: false,
    cancelSessionOpen: false,
    resheduleSessionOpen: false,
    customResheduleSessionOpen: false,
    reasonForLeaveOpen: false,

    slotEventData: null, // To Cancel Session
    sessionEventData: null, // To Reschedule Session

    loading: false,
    error: null,
    schduldeCancelData: null,
};

export const taAvailabilitySlice = createSlice({
    name: 'taAvialability',
    initialState,
    reducers: {
        openCreateNewSlots(state) {
            state.createNewSlotOpen = true;
        },
        closeCreateNewSlots(state) {
            state.createNewSlotOpen = false;
        },
        openMarkLeave(state) {
            state.markLeaveOpen = true;
        },
        closeMarkLeave(state) {
            state.markLeaveOpen = false;
        },
        openScheduledSlots(state, action) {
            console.log('OPENSCHEDULE SLOTS : ', action.payload);
            state.scheduledSlotsOpen = true;
            state.markLeaveData = action.payload;
        },
        closeScheduledSlots(state) {
            state.scheduledSlotsOpen = false;
            state.markLeaveData = [];
        },
        openScheduledSession(state, action) {
            // console.log("Open Action slotEventData : ", action.payload)
            state.scheduledSessionOpen = true;
            state.slotEventData = action.payload;
        },
        closeScheduledSession(state) {
            state.scheduledSessionOpen = false;
        },
        openCancelSession(state, action) {
            state.cancelSessionOpen = true;
            console.log('ACTION : ', action.payload);
            state.schduldeCancelData = action.payload;
        },
        closeCancelSession(state) {
            state.cancelSessionOpen = false;
        },
        openReasonForLeave(state, action) {
            state.reasonForLeaveOpen = true;
            state.markLeaveData = action.payload;
        },
        closeReasonForLeave(state) {
            state.reasonForLeaveOpen = false;
        },
        openRescheduleSession(state, action) {
            console.log('Open Action sessionEventData : ', action.payload);
            state.resheduleSessionOpen = true;
            state.sessionEventData = action.payload;
        },
        closeRescheduleSession(state) {
            state.resheduleSessionOpen = false;
        },

        openStudentsRescheduleSession(state) {
            state.customResheduleSessionOpen = true;
        },
        closeStudentsRescheduleSession(state) {
            state.customResheduleSessionOpen = false;
        },
    },
    extraReducers: builder => {
        //for sessions ta for calendar
        builder.addCase(fetchTAScheduleById.pending, state => {
            state.loading = true;
        });
        builder.addCase(fetchTAScheduleById.fulfilled, (state, action) => {
            state.loading = false;
            state.scheduleData = action.payload;
        });
        builder.addCase(fetchTAScheduleById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        //for slots of ta for calendar
        builder.addCase(fetchCoachSlots.pending, state => {
            state.loading = true;
        });
        builder.addCase(fetchCoachSlots.fulfilled, (state, action) => {
            state.loading = false;
            state.slotData = action.payload; // Update state with fetched data
        });
        builder.addCase(fetchCoachSlots.rejected, (state, action) => {
            state.loading = false;
            state.slotData = [];
            state.error = action.error.message;
        });

        // Get Today Available Ta
        builder.addCase(getTodayTaAvailability.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTodayTaAvailability.fulfilled, (state, action) => {
            state.loading = false;
            state.todaysAvailableTa = action.payload?.data;
        });
        builder.addCase(getTodayTaAvailability.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Get Slots
        builder.addCase(getSlots.pending, state => {
            state.loading = true;
        });
        builder.addCase(getSlots.fulfilled, (state, action) => {
            state.loading = false;
            state.scheduledSlotsData = action.payload?.data;
        });
        builder.addCase(getSlots.rejected, (state, action) => {
            state.loading = false;
            state.scheduledSlotsData = null;
            state.error = action.error.message;
        });

        // Create Slots
        builder.addCase(createSlots.pending, state => {
            state.loading = true;
        });
        builder.addCase(createSlots.fulfilled, (state, action) => {
            state.loading = false;
            state.slotEventData = action.payload?.data;
        });
        builder.addCase(createSlots.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Get Schedule Session
        builder.addCase(getScheduleSession.pending, state => {
            state.loading = true;
        });
        builder.addCase(getScheduleSession.fulfilled, (state, action) => {
            state.loading = false;
            state.scheduledSessionData = action.payload?.data;
        });
        builder.addCase(getScheduleSession.rejected, (state, action) => {
            state.loading = false;
            state.scheduledSessionData = [];
            state.error = action.error.message;
        });

        // Get Available Slots
        builder.addCase(fetchAvailableSlots.pending, state => {
            state.loading = true;
        });
        builder.addCase(fetchAvailableSlots.fulfilled, (state, action) => {
            state.loading = false;
            console.log('AVIAIAIAI : ', action.payload?.data);
            state.availableSlotsData = action.payload?.data;
        });
        builder.addCase(fetchAvailableSlots.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.availableSlotsData = [];
        });

        // Delete Future Slots
        builder.addCase(deleteFutureSlots.pending, state => {
            state.loading = true;
        });
        builder.addCase(deleteFutureSlots.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(deleteFutureSlots.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Reason for Leave
        builder.addCase(reasonForLeave.pending, state => {
            state.loading = true;
        });
        builder.addCase(reasonForLeave.fulfilled, (state, action) => {
            state.loading = false;
            state.reasonForLeaveData = action.payload.data;
        });
        builder.addCase(reasonForLeave.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export const {
    openMarkLeave,
    closeMarkLeave,
    openScheduledSlots,
    closeScheduledSlots,
    openCreateNewSlots,
    closeCreateNewSlots,
    openScheduledSession,
    closeScheduledSession,
    openCancelSession,
    closeCancelSession,
    openReasonForLeave,
    closeReasonForLeave,
    openRescheduleSession,
    closeRescheduleSession,
    openStudentsRescheduleSession,
    closeStudentsRescheduleSession,
} = taAvailabilitySlice.actions;

export default taAvailabilitySlice.reducer;
