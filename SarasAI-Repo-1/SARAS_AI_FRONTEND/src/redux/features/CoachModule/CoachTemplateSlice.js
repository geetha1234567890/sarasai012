import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseURL';

export const getAllCoachTemplates = createAsyncThunk(
    'coachTemplate/getAllCoachTemplates',
    async () => {
        const response = await axios.get(`${baseUrl}/admin/coaching-templates`);
        return response.data;
    }
);

export const createCoachTemplate = createAsyncThunk(
    'coachTemplate/createCoachTemplate',
    async data => {
        const response = await axios.post(
            `${baseUrl}/admin/store-template`,
            data
        );
        return response.data;
    }
);

export const getAllCoachTemplateModules = createAsyncThunk(
    'coachTemplate/getAllCoachTemplateModules',
    async () => {
        const response = await axios.get(
            `${baseUrl}/admin/coaching-templates/modules/${templateId}`
        );
        const modules = response.data.data.filter(
            module => module.template_id === templateId
        );
        return modules;
    }
);

export const createCoachTemplateModule = createAsyncThunk(
    'coachTemplate/createCoachTemplateModule',
    async data => {
        const response = await axios.post(
            `${baseUrl}/admin/coaching-templates/store-modules`,
            data
        );
        return response.data;
    }
);
export const getCoachTemplateModuleId = createAsyncThunk(
    'coachTemplate/getCoachTemplateModuleId',
    async id => {
        const response = await axios.get(
            `${baseUrl}/admin/coaching-templates/modules/${id}`
        );
        return response.data;
    }
);

export const updateCoachTemplateModule = createAsyncThunk(
    'coachTemplate/updateCoachTemplateModule',
    async data => {
        const response = await axios.post(
            `${baseUrl}/admin/coaching-templates/update-modules`,
            data
        );
        return response.data;
    }
);

export const updateCoachActivity = createAsyncThunk(
    'coachTemplate/updateCoachActivity',
    async ({ data }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${baseUrl}/admin/coaching-templates/activity-status`,
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

export const createCoachTemplateActivity = createAsyncThunk(
    'coachTemplate/createCoachTemplateActivity',
    async data => {
        const response = await axios.post(
            `${baseUrl}/admin/coaching-templates/store-activity`,
            data
        );
        return response.data;
    }
);

export const updateEditActivity = createAsyncThunk(
    'coachTemplate/updateEditActivity',
    async ({ data }, { rejectWithValue }) => {
        console.log('DATA : ', data);
        try {
            const response = await axios.post(
                `${baseUrl}/admin/coaching-templates/update-activity`,
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

const initialState = {
    coachesTemplateList: [],
    coachTemplates: [],
    coachTemplatesId: [],
    moduleID: null,
    editModuleData: null,
    editActivityData: null,
    loading: false,
    error: null,
    createCoachTemplateOpen: false,
    editCoachTemplateOpen: false,
    selectedCoachTemplate: null,
    selectedModule: null,
    openModulePopUp: false,
    openActivityPopUp: false,
    openEditModulePopUp: false,
    openEditActivityPopUp: false,
    assignStudentOpen: false,
    assignBatchOpen: false,
    template_name: null,
    templateId: null,
    createCoachTemplateOpen: false,
    editCoachTemplateOpen: false,
    createCoachModule: null,
    modulesData: [],
    newlyCreateTemplate: null,
};

export const coachTemplateSlice = createSlice({
    name: 'coachTemplate',
    initialState,
    reducers: {
        accessCoachTemplateName(state, action) {
            //   console.log("ACTION : ", action);
            //   console.log("ACTION PAYLOAD : ", action.payload);
            state.template_name = action.payload.name;
            state.templateId = action.payload.id;
        },
        setSelectedCoachTemplate(state, action) {
            state.selectedCoachTemplate = action.payload;
        },
        removeSelectedCoachTemplate(state) {
            state.selectedCoachTemplate = null;
        },
        setSelectedModule(state, action) {
            state.selectedModule = action.payload;
        },
        removeSelectedModule(state) {
            state.selectedModule = null;
        },
        openCreateTemplateCoach(state) {
            state.createCoachTemplateOpen = true;
        },
        closeCreateTemplateCoach(state) {
            state.createCoachTemplateOpen = false;
        },
        openEditTemplateCoach(state) {
            console.log('CLICKED !');
            state.editCoachTemplateOpen = true;
        },
        closeEditTemplateCoach(state) {
            state.editCoachTemplateOpen = false;
        },
        openTemplateModulePopup(state) {
            state.openModulePopUp = true;
        },
        closeTemplateModulePopup(state) {
            state.openModulePopUp = false;
        },
        openTemplateActivityPopup(state, action) {
            state.openActivityPopUp = true;
            console.log('Action payload : ', action.payload);
            state.moduleID = action.payload;
        },
        closeTemplateActivityPopup(state) {
            state.openActivityPopUp = false;
        },
        openEditModulePopup(state, action) {
            state.openEditModulePopUp = true;
            console.log('EDIT MODULE DATA  : ', action.payload);
            state.editModuleData = action.payload;
        },
        closeEditModulePopup(state) {
            state.openEditModulePopUp = false;
        },
        openEditActivityPopup(state, action) {
            state.openEditActivityPopUp = true;
            console.log('EDIT Activity DATA  : ', action.payload);
            state.editActivityData = action.payload;
        },
        closeEditActivityPopup(state) {
            state.openEditActivityPopUp = false;
        },
    },
    extraReducers: builder => {
        // getAllCoachTemplates
        builder
            .addCase(getAllCoachTemplates.pending, state => {
                state.loading = true;
            })
            .addCase(getAllCoachTemplates.fulfilled, (state, action) => {
                console.log('ACTION  getAllCOachTemplate: ', action.payload);
                state.loading = false;
                state.coachTemplates = action.payload.data;
            })
            .addCase(getAllCoachTemplates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        // createCoachTemplate
        builder
            .addCase(createCoachTemplate.pending, state => {
                state.loading = true;
            })
            .addCase(createCoachTemplate.fulfilled, (state, action) => {
                console.log('action .payload', action.payload);
                state.loading = false;
                state.coachTemplates.push(action.payload.data);
                state.selectedCoachTemplate = action.payload.data.id;
                state.template_name = action.payload.data.name;
            })
            .addCase(createCoachTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        // getAllCoachTemplateModules
        builder
            .addCase(getAllCoachTemplateModules.pending, state => {
                state.loading = true;
            })
            .addCase(getAllCoachTemplateModules.fulfilled, (state, action) => {
                state.loading = false;
                console.log('MODULE DATA  : ', action.payload);
                state.modulesData = action.payload?.data;
            })
            .addCase(getAllCoachTemplateModules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        // createCoachTemplateModule
        builder
            .addCase(createCoachTemplateModule.pending, state => {
                state.loading = true;
            })
            .addCase(createCoachTemplateModule.fulfilled, (state, action) => {
                console.log('ACTION CreateCoachTemplate : ', action.payload);
                state.loading = false;
                state.createCoachModule = action.payload.data;
            })
            .addCase(createCoachTemplateModule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        // getCoachTemplateModuleId
        builder
            .addCase(getCoachTemplateModuleId.pending, state => {
                state.loading = true;
            })
            .addCase(getCoachTemplateModuleId.fulfilled, (state, action) => {
                // console.log("ACtion playlod", action.payload)
                state.loading = false;
                state.coachTemplatesId = action.payload.data;
                // state.template_name = action.payload.data.name
            })
            .addCase(getCoachTemplateModuleId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        // updateCoachTemplateModule
        builder
            .addCase(updateCoachTemplateModule.pending, state => {
                state.loading = true;
            })
            .addCase(updateCoachTemplateModule.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.coachTemplates.findIndex(
                    coachTemplate => coachTemplate.id === action.payload.id
                );
                if (index !== -1) {
                    state.coachTemplates[index] = action.payload;
                }
            })
            .addCase(updateCoachTemplateModule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        // Update Coach Activity
        builder
            .addCase(updateCoachActivity.pending, state => {
                state.loading = true;
            })
            .addCase(updateCoachActivity.fulfilled, (state, action) => {
                state.loading = false;
                // state.coachTemplates.push(action.payload.data);
            })
            .addCase(updateCoachActivity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        // Update Coach edit Activity
        builder
            .addCase(updateEditActivity.pending, state => {
                state.loading = true;
            })
            .addCase(updateEditActivity.fulfilled, (state, action) => {
                state.loading = false;
                // state.coachTemplates.push(action.payload.data);
                state.editActivityData = action.payload?.data;
            })
            .addCase(updateEditActivity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });

        // createCoachTemplateActivity
        builder
            .addCase(createCoachTemplateActivity.pending, state => {
                state.loading = true;
            })
            .addCase(createCoachTemplateActivity.fulfilled, (state, action) => {
                state.loading = false;
                state.coachTemplates.push(action.payload.data);
            })
            .addCase(createCoachTemplateActivity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const {
    setSelectedCoachTemplate,
    removeSelectedCoachTemplate,
    setSelectedModule,
    removeSelectedModule,
    openCreateTemplateCoach,
    closeCreateTemplateCoach,
    openEditTemplateCoach,
    closeEditTemplateCoach,
    accessCoachTemplateName,
    openTemplateModulePopup,
    closeTemplateModulePopup,
    openTemplateActivityPopup,
    closeTemplateActivityPopup,
    openEditModulePopup,
    closeEditModulePopup,
    openEditActivityPopup,
    closeEditActivityPopup,
} = coachTemplateSlice.actions;

export default coachTemplateSlice.reducer;
