import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { baseUrl } from '../../../utils/baseURL';
import axios from 'axios';
import axiosInstance from '../../services/httpService';
const accessToken = localStorage.getItem('accessToken');

// Get Ta Profile
export const getTaMenuProfile = createAsyncThunk(
    'taMenu/getProfile',
    async () => {
        const response = await axiosInstance.get(`${baseUrl}/ta/ta-profile`);
        return response.data;
    }
);

// Update Ta Profile
export const updateTaMenuProfile = createAsyncThunk(
    'taMenu/updateProfile',
    async data => {
        const response = await axiosInstance.put(
            `${baseUrl}/ta/ta-profile`,
            data
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

// Get Ta Slots
export const getTaMenuSlots = createAsyncThunk('taMenu/getSlots', async () => {
    const response = await axiosInstance.get(`${baseUrl}/ta/calendar/slots`);
    console.log(response.data, 'response.data');
    return response.data;
});

// Create TA Slots
export const createTaMenuSlots = createAsyncThunk(
    'taMenu/createTaSlot',
    async data => {
        const response = await axiosInstance.post(
            `${baseUrl}/ta/calendar/create-slots`,
            data
        );
        return response.data;
    }
);

// Get TA Slots by Date
export const getTaMenuSlotsByDate = createAsyncThunk(
    'taMenu/createTaSlotByDate',
    async data => {
        const response = await axiosInstance.post(
            `${baseUrl}/ta/calendar/slots-by-date`,
            data
        );
        return response.data;
    }
);

// Get Ta Sessions
export const getTaMenuSessions = createAsyncThunk(
    'taMenu/getSessions',
    async () => {
        const response = await axiosInstance.get(
            `${baseUrl}/ta/calendar/sessions`
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

// ta menu call request
export const getTaCallRequests = createAsyncThunk(
    'taMenu/getCallRequests',
    async () => {
        const response = await axios.get(
            `${baseUrl}/ta/call-request/get-call-request`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

// ta approve call request
export const approveCallRequest = createAsyncThunk(
    'taMenu/approveCallRequest',
    async id => {
        const response = await axios.get(
            `${baseUrl}/ta/call-request/approve-call-request/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

//ta deny call
export const denyCallRequest = createAsyncThunk(
    'taMenu/denyCallRequest',
    async (id, reason) => {
        const response = await axios.put(
            `${baseUrl}/ta/call-request/denie-call-request/${id}`,
            {
                'reject-reason': reason,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

//ta scheduled Calls
export const getTaScheduledCalls = createAsyncThunk(
    'taMenu/getTaScheduledCalls',
    async date => {
        const response = await axios.post(
            `${baseUrl}/ta/schedule-call/get-schedule-call`,
            {
                date: date,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

// Create TA Sessions
export const createTaMenuSessions = createAsyncThunk(
    'taMenu/createTaMenuSessions',
    async data => {
        const response = await axiosInstance.post(
            `${baseUrl}/ta/calendar/create-sessions`,
            data
        );
        return response.data;
    }
);

//Get assigned students
export const getTaMenuAssignedStudents = createAsyncThunk(
    'coachMenu/getAssignedStudents',
    async () => {
        const response = await axiosInstance.get(`${baseUrl}/ta/get-students`);
        return response.data;
    }
);

// Get Assigned Batches
export const getTaMenuAssignedBatches = createAsyncThunk(
    'coachMenu/getAssignedBatches',
    async () => {
        const response = await axiosInstance.get(`${baseUrl}/ta/get-batches`);
        return response.data;
    }
);

const initialState = {
    taProfileData: [], // TA Profile Data
    taSlots: [], // TA Slots
    taSlotsByDate: [], // TA Slots by Date
    taSessions: [], // TA Sessions
    taCallRequests: [], //Ta call request
    taScheduledCalls: [], // scheduled call
    selectedTaStudents: [],
    selectedTaBatches: [],
    assignedTaStudents: [],
    assignedTaBatches: [],

    selectTaStudent: false,
    selectTaBatches: false,

    createTaSlotsPopup: false,
    createTaSessionPopup: false,
    createTaLeavePop: false,

    loading: false,
    error: null,
};

export const taMenuSlice = createSlice({
    name: 'taMenu',
    initialState,
    reducers: {
        openTaMenuCreateSlotsPopup: (state, action) => {
            state.createTaSlotsPopup = true;
            state.createTaSessionPopup = false;
        },
        closeTaMenuCreateSlotsPopup: (state, action) => {
            state.createTaSlotsPopup = false;
        },
        openTaMenuCreateSessionsPopup: (state, action) => {
            state.createTaSessionPopup = true;
            if (action.payload.student) {
                state.selectedTaStudents = action.payload.student;
            }
            if (action.payload.batches) {
                state.selectedTaBatches = action.payload.batches;
            }
            state.createTaSlotsPopup = false;
        },
        closeTaMenuCreateSessionsPopup: (state, action) => {
            state.createTaSessionPopup = false;
            state.selectedTaBatches = [];
            state.selectedTaStudents = [];
        },
        openTaMenuSelectStudents: (state, action) => {
            state.selectTaStudent = true;
        },
        closeTaMenuSelectStudents: (state, action) => {
            state.selectTaStudent = false;
        },
        openTaMenuSelectBatches: (state, action) => {
            state.selectTaBatches = true;
        },
        closeTaMenuSelectBatches: (state, action) => {
            state.selectTaBatches = false;
        },
    },
    extraReducers: builder => {
        // Get Ta Profile Data
        builder.addCase(getTaMenuProfile.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaMenuProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.taProfileData = action.payload.data;
        });
        builder.addCase(getTaMenuProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.taProfileData = [];
        });

        // update Ta Profile Data
        builder.addCase(updateTaMenuProfile.pending, state => {
            state.loading = true;
        });
        builder.addCase(updateTaMenuProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.taProfileData = action.payload.data;
        });
        builder.addCase(updateTaMenuProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Get Ta Slots
        builder.addCase(getTaMenuSlots.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaMenuSlots.fulfilled, (state, action) => {
            state.loading = false;
            state.taSlots = action.payload.data;
        });
        builder.addCase(getTaMenuSlots.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Get Ta Slots By Date
        builder.addCase(getTaMenuSlotsByDate.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaMenuSlotsByDate.fulfilled, (state, action) => {
            state.loading = false;
            state.taSlotsByDate = action.payload.data;
        });
        builder.addCase(getTaMenuSlotsByDate.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.taSlotsByDate = [];
        });

        // Create Ta Slots
        builder.addCase(createTaMenuSlots.pending, state => {
            state.loading = true;
        });
        builder.addCase(createTaMenuSlots.fulfilled, (state, action) => {
            state.loading = false;
            state.taSlots = action.payload.data;
        });
        builder.addCase(createTaMenuSlots.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Get Ta Sessions
        builder.addCase(getTaMenuSessions.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaMenuSessions.fulfilled, (state, action) => {
            state.loading = false;
            state.taSessions = action.payload.data;
        });
        builder.addCase(getTaMenuSessions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Create TA Sessions
        builder.addCase(createTaMenuSessions.pending, state => {
            state.loading = true;
        });
        builder.addCase(createTaMenuSessions.fulfilled, (state, action) => {
            state.loading = false;
            state.taSessions = action.payload.data;
        });
        builder.addCase(createTaMenuSessions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
        //get tamenu call requests
        builder.addCase(getTaCallRequests.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaCallRequests.fulfilled, (state, action) => {
            state.loading = false;
            state.taCallRequests = action.payload.data;
        });
        builder.addCase(getTaCallRequests.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.taCallRequests = [];
        });

        //approve call request
        builder.addCase(approveCallRequest.pending, state => {
            state.loading = true;
        });
        builder.addCase(approveCallRequest.fulfilled, (state, action) => {
            state.loading = false;
            state.taCallRequests = state.taCallRequests.map(request =>
                request.id === action.payload.data.id
                    ? { ...request, status: 'Approved' }
                    : request
            );
        });
        builder.addCase(approveCallRequest.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        //deny Call Request
        builder.addCase(denyCallRequest.pending, state => {
            state.loading = true;
        });
        builder.addCase(denyCallRequest.fulfilled, (state, action) => {
            state.loading = false;
            state.taCallRequests = state.taCallRequests.filter(
                request => request.id !== action.payload.data.id
            );
        });
        builder.addCase(denyCallRequest.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        //get coach scheduled calls
        builder.addCase(getTaScheduledCalls.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaScheduledCalls.fulfilled, (state, action) => {
            state.loading = false;
            state.taScheduledCalls = action.payload.data;
        });
        builder.addCase(getTaScheduledCalls.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.taScheduledCalls = [];
        });

        // get ta assigned students
        builder.addCase(getTaMenuAssignedStudents.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            getTaMenuAssignedStudents.fulfilled,
            (state, action) => {
                state.loading = false;
                state.assignedTaStudents = action.payload;
            }
        );
        builder.addCase(getTaMenuAssignedStudents.rejected, (state, action) => {
            state.loading = false;
            state.assignedTaStudents = [];
            state.error = action.error.message;
        });

        // Get ta Assigned Batches
        builder.addCase(getTaMenuAssignedBatches.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaMenuAssignedBatches.fulfilled, (state, action) => {
            state.loading = false;
            state.assignedTaBatches = action.payload;
        });
        builder.addCase(getTaMenuAssignedBatches.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.assignedTaBatches = [];
        });
    },
});

export const {
    openTaMenuCreateSlotsPopup,
    closeTaMenuCreateSlotsPopup,
    openTaMenuCreateSessionsPopup,
    closeTaMenuCreateSessionsPopup,
    openTaMenuSelectStudents,
    closeTaMenuSelectStudents,
    openTaMenuSelectBatches,
    closeTaMenuSelectBatches,
} = taMenuSlice.actions;
export default taMenuSlice.reducer;
