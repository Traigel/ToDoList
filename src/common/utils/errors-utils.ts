import {Dispatch} from "redux";
import {setAppErrorAC, setAppStatusAC} from "../../app/app-reducer";
import {ResponseType} from "../../api/api";

export const handleServerNetworkError = (error: string, dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "failed"}))
    dispatch(setAppErrorAC({error}))
}

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: 'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status: "failed"}))
}