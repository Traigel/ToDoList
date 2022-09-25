import {Dispatch} from "redux";
import {authAPI, RESULT_CODES} from "../api/api";
import {handleServerAppError, handleServerNetworkError} from "../common/utils/errors-utils";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import axios from 'axios';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "./store";

const initialState = {
    status: 'succeeded' as RequestStatusType,
    error: null as string | null,
    isInitialized: false // крутика работает пока приложение загружается
}

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppError(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setIsInitialized(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized
        }
    }
})

export const appReducer = slice.reducer
export const setAppStatusAC = slice.actions.setAppStatus
export const setAppErrorAC = slice.actions.setAppError
export const setIsInitializedAC = slice.actions.setIsInitialized

// thunks
export const initializeAppTC = (): AppThunk => async (dispatch) => {
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === RESULT_CODES.succeeded) {
            dispatch(setIsLoggedInAC({isLoggedIn: true}))
            // dispatch(setUserInAC(res.data.data))
        }
    } catch (error) {
    } finally {
        dispatch(setIsInitializedAC({isInitialized: true}))
    }
}

// type
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'