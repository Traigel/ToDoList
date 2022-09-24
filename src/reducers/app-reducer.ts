import {Dispatch} from "redux";
import {authAPI, RESULT_CODES} from "../api/api";
import {handleServerAppError, handleServerNetworkError} from "../components/utils/errors-utils";
import {setIsLoggedInAC} from "./auth-reducer";
import axios from 'axios';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: InitialStateType = {
    status: 'succeeded',
    error: null,
    isInitialized: false // крутика работает пока приложение загружается
}

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setIsInitializedAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized
        }
    }
})

export const appReducer = slice.reducer
export const setAppStatusAC = slice.actions.setAppStatusAC
export const setAppErrorAC = slice.actions.setAppErrorAC
export const setIsInitializedAC = slice.actions.setIsInitializedAC

// thunks
export const initializeAppTC = () => async (dispatch: Dispatch) => {
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
type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}
type SetStatusType = ReturnType<typeof setAppStatusAC>
type SetErrorType = ReturnType<typeof setAppErrorAC>
type SetIsInitializedType = ReturnType<typeof setIsInitializedAC>
export type AppActionsType = SetStatusType | SetErrorType | SetIsInitializedType
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'