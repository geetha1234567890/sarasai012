import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseURL';
import { toast } from 'react-toastify';

//const url = 'https://sarasaibackend.happymushroom-c450e4c1.centralindia.azurecontainerapps.io/api/login';

// login api
export const login = createAsyncThunk('login', async data => {
    const response = await axios.post(`${baseUrl}`, data);
    return response.data;
});

const initialState = {
    userData: {},
    login: false,
    role: null,
    accessToken: null,
    loading: false,
    error: [],
};

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setLogin: (state, action) => {
            console.log('action.payload :', action.payload);
            state.login = action.payload.login;
            state.role = action.payload.role;
            state.accessToken = action.payload.accessToken;
        },
    },
    extraReducers: builder => {
        //user login
        builder.addCase(login.pending, state => {
            state.loading = true;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.userData = action.payload;
            state.login = true;
            state.role = action.payload.role;
            state.accessToken = action.payload.access_token;
            localStorage.setItem('login', true);
            localStorage.setItem('accessToken', action.payload.access_token);
            localStorage.setItem('role', action.payload.role);
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.userData = [];
            state.login = false;
        });
    },
});

export const { setLogin } = loginSlice.actions;

export default loginSlice.reducer;
