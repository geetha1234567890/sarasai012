import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseURL';

export const createCoach = createAsyncThunk(
    'coachModule/createCoach',
    async data => {
        const response = await axios.post(
            `${baseUrl}/admin/manage_coaches`,
            data
        );
        return response.data;
    }
);

export const getCoach = createAsyncThunk('coachModule/getCoach', async () => {
    const response = await axios.get(`${baseUrl}/admin/manage_coaches`);
    return response.data;
});

export const updateCoach = createAsyncThunk(
    'coachModule/updateCoach',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${baseUrl}/admin/manage_coaches/${id}`,
                data
            );
            console.log('API Response: ', response.data);
            return response.data;
        } catch (error) {
            console.error(
                'API Error: ',
                error.response ? error.response.data : error.message
            );
            return rejectWithValue(
                error.response ? error.response.data : error.message
            );
        }
    }
);

export const deleteCoach = createAsyncThunk(
    'coachModule/deleteCoach',
    async id => {
        await axios.delete(`${baseUrl}/admin/manage_coaches/${id}`);
        return id;
    }
);

export const getCoachStudentBatchMapping = createAsyncThunk(
    'coachModule/getCoachStudentBatchMapping',
    async () => {
        const response = await axios.get(
            `${baseUrl}/admin/student-batch-mapping/getAllStudentWithBatches`
        );
        return response.data;
    }
);

export const getCoachBatchMapping = createAsyncThunk(
    'coachModule/getCoachBatchMapping',
    async () => {
        const response = await axios.get(`${baseUrl}/admin/batches`);
        console.log('Response : ', response);
        return response.data;
    }
);

export const showCoachMapping = createAsyncThunk(
    'coachModule/showCoachMapping',
    async () => {
        const response = await axios.get(
            `${baseUrl}/admin/CoachMapping/CoachswithActiveStudentnBatches`
        );
        return response.data;
    }
);
export const getCoachAssignStudents = createAsyncThunk(
    'coachModule/getCoachAssignStudents',
    async id => {
        const response = await axios.get(
            `${baseUrl}/admin/CoachMapping/${id}/AssignStudents`
        );
        return response.data;
    }
);
export const getCoachAssignBatches = createAsyncThunk(
    'coachModule/getCoachAssignBatches',
    async id => {
        const response = await axios.get(
            `${baseUrl}/admin/CoachMapping/${id}/AssignBatches`
        );
        return response.data;
    }
);

export const postCoachAssignStudents = createAsyncThunk(
    'coachModule/postCoachAssignStudents',
    async ({ id, data }) => {
        const response = await axios.post(
            `${baseUrl}/admin/CoachMapping/AssignStudents`,
            data
        );
        return response.data;
    }
);

export const postCoachAssignBatches = createAsyncThunk(
    'coachModule/postCoachAssignBatches',
    async ({ id, data }) => {
        const response = await axios.post(
            `${baseUrl}/admin/CoachMapping/AssignBatches`,
            data
        );
        return response.data;
    }
);

export const toggleCoachAssignStudentStatus = createAsyncThunk(
    'coachModule/toggleCoachAssignStudentStatus',
    async ({ id, studentId }) => {
        const response = await axios.put(
            `${baseUrl}/admin/CoachMapping/${id}/ActiveDeactiveAssignStudent`,
            { student_id: studentId }
        );
        return response.data;
    }
);

export const toggleCoachAssignBatchStatus = createAsyncThunk(
    'coachModule/toggleCoachAssignBatchStatus',
    async ({ id, batchId }) => {
        const response = await axios.put(
            `${baseUrl}/admin/CoachMapping/${id}/ActiveDeactiveAssignBatch`,
            { batch_id: batchId }
        );
        return response.data;
    }
);

export const deleteCoachAssignedStudent = createAsyncThunk(
    'coachModule/deleteCoachAssignedStudent',
    async id => {
        console.log('ID to delete STUDENT : ', id);
        const response = await axios.delete(
            `${baseUrl}/admin/CoachMapping/${id.id}/deleteStudent`
        );
        return response.data;
    }
);

export const deleteCoachAssignedBatch = createAsyncThunk(
    'coachModule/deleteCoachAssignedBatch',
    async id => {
        // console.log("ID to delete BATCH : ", id)
        const response = await axios.delete(
            `${baseUrl}/admin/CoachMapping/${id.id}/deleteBatch`
        );
        return response.data;
    }
);

const initialState = {
    coaches: [],
    coachStudentBatchMapping: [],
    coachBatchMapping: null,
    coachMapping: null,
    coachSchedule: null,
    assignedStudents: [],
    assignedBatches: [],
    loading: false,
    error: null,
    createCoachOpen: false,
    editCoachOpen: false,
    selectedCoach: null,
    coachSuccessPopup: false,
    assignCoachStudentOpen: false,
    assignCoachBatchOpen: false,
    coach_name: null,
    coachID: null,
};

export const coachSlice = createSlice({
    name: 'coachModule',
    initialState,
    reducers: {
        accessCoachName(state, action) {
            //   console.log("ACTION : ", action);
            //   console.log("ACTION PAYLOAD : ", action.payload);
            state.coach_name = action.payload.name;
            state.coachID = action.payload.id;
        },
        setSelectedCoach(state, action) {
            //   console.log("ACTION : ", action);
            state.selectedCoach = action.payload;
        },
        openCreateCoach(state) {
            state.createCoachOpen = true;
        },
        closeCreateCoach(state) {
            state.createCoachOpen = false;
        },
        openEditCoach(state) {
            state.editCoachOpen = true;
        },
        closeEditCoach(state) {
            state.editCoachOpen = false;
        },

        openCoachSuccessPopup(state) {
            state.coachSuccessPopup = true;
        },
        closeCoachSuccessPopup(state) {
            state.coachSuccessPopup = false;
        },
        openCoachAssignStudents(state) {
            state.assignCoachStudentOpen = true;
        },
        closeCoachAssignStudents(state) {
            state.assignCoachStudentOpen = false;
        },
        openCoachAssignBatches(state) {
            state.assignCoachBatchOpen = true;
        },
        closeCoachAssignBatches(state) {
            state.assignCoachBatchOpen = false;
        },
    },
    extraReducers: builder => {
        // Create COACH
        builder.addCase(createCoach.pending, state => {
            state.loading = true;
        });
        builder.addCase(createCoach.fulfilled, (state, action) => {
            state.loading = false;
            state.coaches = [...state.coaches, action.payload];
        });
        builder.addCase(createCoach.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // Get All COACH
        builder.addCase(getCoach.pending, state => {
            state.loading = true;
        });
        builder.addCase(getCoach.fulfilled, (state, action) => {
            state.loading = false;
            state.coaches = action.payload;
        });
        builder.addCase(getCoach.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // Update Coach
        builder.addCase(updateCoach.pending, state => {
            state.loading = true;
        });
        builder.addCase(updateCoach.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.coaches.findIndex(
                coach => coach.id === action.payload.id
            );
            if (index !== -1) {
                state.coaches[index] = action.payload;
            }
        });
        builder.addCase(updateCoach.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // Delete Coach
        builder.addCase(deleteCoach.pending, state => {
            state.loading = true;
        });
        builder.addCase(deleteCoach.fulfilled, (state, action) => {
            state.loading = false;
            state.coaches = state.coaches.filter(
                coach => coach.id !== action.payload
            );
        });
        builder.addCase(deleteCoach.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // Get Assigned Students
        builder.addCase(getCoachAssignStudents.pending, state => {
            state.loading = true;
        });
        builder.addCase(getCoachAssignStudents.fulfilled, (state, action) => {
            state.loading = false;
            state.assignedStudents = action.payload;
        });
        builder.addCase(getCoachAssignStudents.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // Get Assigned Batches
        builder.addCase(getCoachAssignBatches.pending, state => {
            state.loading = true;
        });
        builder.addCase(getCoachAssignBatches.fulfilled, (state, action) => {
            state.loading = false;
            state.assignedBatches = action.payload;
        });
        builder.addCase(getCoachAssignBatches.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // delete assigned Students
        builder.addCase(deleteCoachAssignedStudent.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            deleteCoachAssignedStudent.fulfilled,
            (state, action) => {
                state.loading = false;
                // state.assignedStudents = action.payload;
            }
        );
        builder.addCase(
            deleteCoachAssignedStudent.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            }
        );

        // delete assigned Batches
        builder.addCase(deleteCoachAssignedBatch.pending, state => {
            state.loading = true;
        });
        builder.addCase(deleteCoachAssignedBatch.fulfilled, (state, action) => {
            state.loading = false;
            // state.assignedStudents = action.payload;
        });
        builder.addCase(deleteCoachAssignedBatch.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // Show CA Mapping
        builder.addCase(showCoachMapping.pending, state => {
            state.loading = true;
        });
        builder.addCase(showCoachMapping.fulfilled, (state, action) => {
            console.log('Coach mapping action ', action.payload);
            state.loading = false;
            state.coachMapping = action.payload;
        });
        builder.addCase(showCoachMapping.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // get all students
        builder.addCase(getCoachStudentBatchMapping.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            getCoachStudentBatchMapping.fulfilled,
            (state, action) => {
                console.log('action ', action.payload);
                state.loading = false;
                state.coachStudentBatchMapping = action.payload;
            }
        );
        builder.addCase(
            getCoachStudentBatchMapping.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            }
        );

        // get All batches

        builder.addCase(getCoachBatchMapping.pending, state => {
            state.loading = true;
        });
        builder.addCase(getCoachBatchMapping.fulfilled, (state, action) => {
            state.loading = false;
            // console.log("MAPPING PAYLOAD :", action.payload )
            state.coachBatchMapping = action.payload?.batches;
        });
        builder.addCase(getCoachBatchMapping.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // Post Assign Students
        builder.addCase(postCoachAssignStudents.pending, state => {
            state.loading = true;
        });
        builder.addCase(postCoachAssignStudents.fulfilled, (state, action) => {
            state.loading = false;
            state.assignedStudents = action.payload;
        });
        builder.addCase(postCoachAssignStudents.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // Post Assign Batches
        builder.addCase(postCoachAssignBatches.pending, state => {
            state.loading = true;
        });
        builder.addCase(postCoachAssignBatches.fulfilled, (state, action) => {
            state.loading = false;
            state.assignedBatches = action.payload;
        });
        builder.addCase(postCoachAssignBatches.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // Toggle Assign Student Status
        builder.addCase(toggleCoachAssignStudentStatus.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            toggleCoachAssignStudentStatus.fulfilled,
            (state, action) => {
                state.loading = false;
                const updatedStudents = state.assignedStudents.map(student =>
                    student.id === action.payload.id
                        ? { ...student, is_active: action.payload.is_active }
                        : student
                );
                state.assignedStudents = updatedStudents;
            }
        );
        builder.addCase(
            toggleCoachAssignStudentStatus.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            }
        );

        // Toggle Assign Batch Status
        builder.addCase(toggleCoachAssignBatchStatus.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            toggleCoachAssignBatchStatus.fulfilled,
            (state, action) => {
                state.loading = false;
                const updatedBatches = state.assignedBatches.map(batch =>
                    batch.id === action.payload.id
                        ? { ...batch, is_active: action.payload.is_active }
                        : batch
                );
                state.assignedBatches = updatedBatches;
            }
        );
        builder.addCase(
            toggleCoachAssignBatchStatus.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            }
        );
    },
});

export const {
    openCreateCoach,
    closeCreateCoach,
    openEditCoach,
    closeEditCoach,
    setSelectedCoach,
    openCoachSuccessPopup,
    accessCoachName,
    closeCoachSuccessPopup,
    openCoachAssignStudents,
    closeCoachAssignStudents,
    openCoachAssignBatches,
    closeCoachAssignBatches,
} = coachSlice.actions;

export default coachSlice.reducer;
