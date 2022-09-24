import {authAPI, LoginParamsType, MeType, RESULT_CODES} from "../api/api";
import {Dispatch} from "redux";
import {setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../components/utils/errors-utils";
import axios from 'axios';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: InitialStateType = {
    isLoggedIn: false,  // если true (залогинены) показывается TodoLists
    id: null,
    login: null,
    email: null
}

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{isLoggedIn: boolean}>) {
            state.isLoggedIn = action.payload.isLoggedIn
        },
    }
})

export const authReducer = slice.reducer
export const setIsLoggedInAC = slice.actions.setIsLoggedInAC

// thunks
export const loginTC = (date: LoginParamsType) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await authAPI.login(date)
        if (res.data.resultCode === RESULT_CODES.succeeded) {
            dispatch(setIsLoggedInAC({isLoggedIn: true}))
            dispatch(setAppStatusAC({status: "succeeded"}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            handleServerNetworkError(error.message, dispatch)
        }
    }
}
export const logoutTC = () => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === RESULT_CODES.succeeded) {
            dispatch(setIsLoggedInAC({isLoggedIn: false}))
            dispatch(setAppStatusAC({status: "succeeded"}))
            // dispatch(setUserInAC({email: null, login: null, id: null}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            handleServerNetworkError(error.message, dispatch)
        }
    }
}

// type
type InitialStateType = {
    isLoggedIn: boolean
    id: number | null
    email: string | null
    login: string | null
}