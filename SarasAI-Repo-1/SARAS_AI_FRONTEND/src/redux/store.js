import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { studentsApi } from './services/students/studentsApi';
import { batchesApi } from './services/batches/batchesApi';
import { coursesApi } from './services/courses/coursesApi';
import taReducer from './features/taModule/taSlice';
import taSchedulingReducer from './features/taModule/taScheduling';
import taAvailabilityReducer from './features/taModule/taAvialability';
import coachTemplateReducer from './features/CoachModule/CoachTemplateSlice';
import wolSliceReducer from './features/coachingTools/wol/wolSlice';
import timezoneSliceReducer from './features/timezone/timezoneSlice';
import coachReducer from './features/CoachModule/coachSlice';
import coachAvailabilityReducer from './features/CoachModule/CoachAvailabilitySlice';
import coachSchedulingReducer from './features/CoachModule/coachSchedule';
import activityTypeReducer from './features/ActivityType/activityTypeSlice';
import coachMenuSliceReducer from './features/coach/coachmenuprofileSilce';
import taMenuSliceReducer from './features/teachingAssistant/tamenuSlice';
import loginReducer from './features/auth/loginSlice';

const store = configureStore({
    reducer: {
        login: loginReducer,
        taModule: taReducer,
        taAvailability: taAvailabilityReducer,
        taScheduling: taSchedulingReducer,
        taAvialability: taAvailabilityReducer,
        coachTemplate: coachTemplateReducer,
        wol: wolSliceReducer,
        timezone: timezoneSliceReducer,
        coachModule: coachReducer,
        coachAvailability: coachAvailabilityReducer,
        coachScheduling: coachSchedulingReducer,
        activityType: activityTypeReducer,
        coachMenu: coachMenuSliceReducer,
        taMenu: taMenuSliceReducer,
        [studentsApi.reducerPath]: studentsApi.reducer,
        [batchesApi.reducerPath]: batchesApi.reducer,
        [coursesApi.reducerPath]: coursesApi.reducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            .concat(studentsApi.middleware)
            .concat(batchesApi.middleware)
            .concat(coursesApi.middleware),
});

setupListeners(store.dispatch);

export default store;
