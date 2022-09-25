import {authAPI, LoginParamsType, MeType, RESULT_CODES} from "../../api/api";
import {Dispatch} from "redux";
import {setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../common/utils/errors-utils";
import axios from 'axios';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../app/store";

const initialState = {
    isLoggedIn: false,  // если true (залогинены) показывается TodoLists
    id: null as number | null,
    login: null as string | null,
    email: null as string | null
}

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn
        },
        setUserInfo(state, action: PayloadAction<{email: string | null, login: string | null, id: number | null}>) {
            state.id = action.payload.id
            state.login = action.payload.login
            state.email = action.payload.email
        }
    }
})

export const authReducer = slice.reducer
export const setIsLoggedInAC = slice.actions.setIsLoggedIn
export const setUserInfoAC = slice.actions.setUserInfo

// thunks
export const loginTC = (date: LoginParamsType): AppThunk => async (dispatch) => {
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
export const logoutTC = (): AppThunk => async (dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === RESULT_CODES.succeeded) {
            dispatch(setIsLoggedInAC({isLoggedIn: false}))
            dispatch(setAppStatusAC({status: "succeeded"}))
            // dispatch(setUserInfoAC({email: null, login: null, id: null}))
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
export type AuthInitialStateType = typeof initialState