import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authAPI, FieldsErrorsType, LoginParamsType, RESULT_CODES} from '../../api/api';
import {setAppStatusAC} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../common/utils/errors-utils';
import axios from 'axios';

const initialState = {
    isLoggedIn: false,  // если true (залогинены) показывается TodoLists
    id: null as number | null,
    login: null as string | null,
    email: null as string | null
}

// Thunks
export const loginTC = createAsyncThunk<undefined, LoginParamsType, { rejectValue: { errors: string[], fieldsErrors?: FieldsErrorsType[] } }>('auth/login', async (date, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await authAPI.login(date)
        if (res.data.resultCode === RESULT_CODES.succeeded) {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
            return;
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            handleServerNetworkError(error.message, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
        }
        return thunkAPI.rejectWithValue({errors: ['Error'], fieldsErrors: undefined})
    }
})
export const logoutTC = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === RESULT_CODES.succeeded) {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
            // thunkAPI.dispatch(setUserInfoAC({email: null, login: null, id: null}))
            return;
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            handleServerNetworkError(error.message, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
        }
        return thunkAPI.rejectWithValue({errors: ['Error'], fieldsErrors: undefined})
    }
})

export const asyncActions = {
    loginTC,
    logoutTC
}

// Slice
export const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn
        },
        setUserInfo(state, action: PayloadAction<{ email: string | null, login: string | null, id: number | null }>) {
            state.id = action.payload.id
            state.login = action.payload.login
            state.email = action.payload.email
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginTC.fulfilled, (state) => {
                state.isLoggedIn = true
            })
            .addCase(logoutTC.fulfilled, (state) => {
                state.isLoggedIn = false
            })
    },
})

export const authReducer = slice.reducer
export const setIsLoggedInAC = slice.actions.setIsLoggedIn
export const setUserInfoAC = slice.actions.setUserInfo

// type
export type AuthInitialStateType = typeof initialState