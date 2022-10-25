import {RESULT_CODES, toDoListAPI, ToDoListType} from "../../api/api";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../common/utils/errors-utils";
import axios, {AxiosError} from 'axios';
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../app/store";

//thunks
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

// Slice
const slice = createSlice({
    name: 'todo',
    initialState: [] as ToDoListDomainType[],
    reducers: {
        changesFilter(state, action: PayloadAction<{ toDoListID: string, filterItem: FilterType }>) {
            const index = state.findIndex(el => el.id === action.payload.toDoListID)
            state[index].filter = action.payload.filterItem
        },
        changesTodoStatus(state, action: PayloadAction<{ todolistId: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(el => el.id === action.payload.todolistId)
            state[index].entityStatus = action.payload.entityStatus
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getTodoListTC.fulfilled, (state, action) => {
            return action.payload.map(el => ({...el, filter: 'all', entityStatus: "idle"}))
        });
        builder.addCase(deleteToDoListTC.fulfilled, (state, action) => {
            const index = state.findIndex(el => el.id === action.payload.todolistId)
            if (index > -1) {
                state.splice(index, 1)
            }
        });
        builder.addCase(createToDoListTC.fulfilled, (state, action) => {
            state.unshift({...action.payload, filter: 'all', entityStatus: "idle"})
        });
        builder.addCase(updateToDoListTC.fulfilled, (state, action) => {
            const index = state.findIndex(el => el.id === action.payload.todolistId)
            state[index].title = action.payload.title
        });
    }
})

export const todoListReducer = slice.reducer
export const changesFilterAC = slice.actions.changesFilter
export const changesTodoStatusAC = slice.actions.changesTodoStatus

// types
export type ToDoListDomainType = ToDoListType & {
    filter: FilterType
    entityStatus: RequestStatusType
}
export type FilterType = 'all' | 'active' | 'completed'