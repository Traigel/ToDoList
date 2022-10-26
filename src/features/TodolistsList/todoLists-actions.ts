import {createAsyncThunk} from '@reduxjs/toolkit';
import {RESULT_CODES, toDoListAPI, ToDoListType} from '../../api/api';
import {setAppStatusAC} from '../../app/app-reducer';
import axios from 'axios';
import {handleServerAppError, handleServerNetworkError} from '../../common/utils/errors-utils';
import {changesTodoStatusAC} from './todoList-reducer';

export const getTodoListTC = createAsyncThunk<ToDoListType[]>('todolist/getTodoList', async (param, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await toDoListAPI.getToDoList()
        dispatch(setAppStatusAC({status: "succeeded"}))
        return res.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            handleServerNetworkError(error.message, dispatch)
            return rejectWithValue(null)
        }
        return rejectWithValue(null)
    }
})
export const deleteToDoListTC = createAsyncThunk<{ todolistId: string }, { todolistId: string }>('todolist/deleteToDoListTC', async (param, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: "loading"}))
    dispatch(changesTodoStatusAC({todolistId: param.todolistId, entityStatus: "loading"}))
    try {
        const res = await toDoListAPI.deleteToDoList(param.todolistId)
        if (res.data.resultCode === RESULT_CODES.succeeded) {
            dispatch(setAppStatusAC({status: "succeeded"}))
            return {todolistId: param.todolistId}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            handleServerNetworkError(error.message, dispatch)
            return rejectWithValue(null)
        }
        return rejectWithValue(null)
    } finally {
        dispatch(changesTodoStatusAC({todolistId: param.todolistId, entityStatus: "succeeded"}))
    }
})
export const createToDoListTC = createAsyncThunk<ToDoListType, { titleValue: string }>('todolist/createToDoList', async (param, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await toDoListAPI.createToDoList(param.titleValue)
        if (res.data.resultCode === RESULT_CODES.succeeded) {
            // dispatch(setAppStatusAC({status: "succeeded"}))
            return res.data.data.item
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            handleServerNetworkError(error.message, dispatch)
            return rejectWithValue(null)
        }
        return rejectWithValue(null)
    }
})
export const updateToDoListTC = createAsyncThunk<{ todolistId: string, title: string }, { todolistId: string, title: string }>('todolist/updateToDoList', async (param, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await toDoListAPI.updateToDoLists(param.todolistId, param.title)
        if (res.data.resultCode === RESULT_CODES.succeeded) {
            dispatch(setAppStatusAC({status: "succeeded"}))
            return {todolistId: param.todolistId, title: param.title}

        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            handleServerNetworkError(error.message, dispatch)
            return rejectWithValue(null)
        }
        return rejectWithValue(null)
    } finally {
        dispatch(changesTodoStatusAC({todolistId: param.todolistId, entityStatus: "succeeded"}))
    }
})