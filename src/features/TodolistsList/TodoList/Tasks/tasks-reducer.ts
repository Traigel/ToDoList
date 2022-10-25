import {
    changesTodoStatusAC, createToDoListTC, deleteToDoListTC,
    getTodoListTC
} from "../../todoList-reducer";
import {RESULT_CODES, TASK_PRIORITIES, TASK_STATUS, tasksAPI, TasksType} from "../../../../api/api";
import {AppRootStateType, AppThunk} from "../../../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../../common/utils/errors-utils";
import axios, {AxiosError} from 'axios';
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksTodoListType = {}

// Thunks
export const getTasksTC = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    const res = await tasksAPI.getTask(todolistId)
    thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
    return {todolistId, tasks: res.data.items}
})

export const createTaskTC = createAsyncThunk<TasksType, { todolistId: string, title: string }>('tasks/createTask', async (param, {
    dispatch, rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: "loading"}))
    dispatch(changesTodoStatusAC({todolistId: param.todolistId, entityStatus: "loading"}))
    try {
        const res = await tasksAPI.createTask(param.todolistId, param.title)
        if (res.data.resultCode === RESULT_CODES.succeeded) {
            dispatch(setAppStatusAC({status: "succeeded"}))
            return res.data.data.item
        } else {
            handleServerAppError<{ item: TasksType }>(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            handleServerNetworkError(error.message, dispatch)
            return rejectWithValue(null)
        }
        return rejectWithValue(null)
    } finally {
        dispatch(changesTodoStatusAC({todolistId: param.todolistId, entityStatus: "idle"}))
    }
})

export const deleteTaskTC = createAsyncThunk('tasks/deleteTask', async (param: { todolistId: string, taskId: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    thunkAPI.dispatch(changesTaskStatusAC({
        todolistId: param.todolistId,
        taskId: param.taskId,
        entityStatus: "loading"
    }))
    const res = await tasksAPI.deleteTask(param.todolistId, param.taskId)
    thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
    thunkAPI.dispatch(changesTaskStatusAC({
        todolistId: param.todolistId,
        taskId: param.taskId,
        entityStatus: "idle"
    }))
    return {todolistId: param.todolistId, taskId: param.taskId}
})

export const updateTaskTC = createAsyncThunk('tasks/updateTask', async (param: { todolistId: string, taskId: string, model: UpdateModelType }, {
    dispatch, rejectWithValue, getState
}) => {
    dispatch(setAppStatusAC({status: "loading"}))
    dispatch(changesTaskStatusAC({todolistId: param.todolistId, taskId: param.taskId, entityStatus: "loading"}))
    const state = getState() as AppRootStateType
    const task = state.tasks[param.todolistId].find(task => task.id === param.taskId)
    if (task) {
        try {
            const res = await tasksAPI.updateTask(param.todolistId, param.taskId, {
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
                ...param.model
            })
            if (res.data.resultCode === RESULT_CODES.succeeded) {
                dispatch(setAppStatusAC({status: "succeeded"}))
                return res.data.data.item
            } else {
                handleServerAppError<{ item: TasksType }>(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                handleServerNetworkError(error.message, dispatch)
                return rejectWithValue(null)
            }
        } finally {
            dispatch(changesTaskStatusAC({todolistId: param.todolistId, taskId: param.taskId, entityStatus: "idle"}))
        }
    }
    return rejectWithValue(null)
})

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        changesTaskStatus(state, action: PayloadAction<{ todolistId: string, taskId: string, entityStatus: RequestStatusType }>) {
            const index = state[action.payload.todolistId].findIndex(el => el.id === action.payload.taskId)
            state[action.payload.todolistId][index].entityStatus = action.payload.entityStatus
        },

    },
    extraReducers: (builder) => {  // не генерируют action creator
        builder.addCase(createToDoListTC.fulfilled, (state, action) => {
            state[action.payload.id] = []
        });
        builder.addCase(deleteToDoListTC.fulfilled, (state, action) => {
            delete state[action.payload.todolistId]
        });
        builder.addCase(getTodoListTC.fulfilled, (state, action) => {
            action.payload.forEach((el => {
                state[el.id] = []
            }))
        });
        builder.addCase(getTasksTC.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks.map(el => ({...el, entityStatus: 'idle'}))
        });
        builder.addCase(deleteTaskTC.fulfilled, (state, action) => {
            const index = state[action.payload.todolistId].findIndex(el => el.id === action.payload.taskId)
            if (index > -1) {
                state[action.payload.todolistId].splice(index, 1)
            }
        });
        builder.addCase(createTaskTC.fulfilled, (state, action) => {
            state[action.payload.todoListId].unshift({...action.payload, entityStatus: 'idle'})
        });
        builder.addCase(updateTaskTC.fulfilled, (state, action) => {
            const index = state[action.payload.todoListId].findIndex(el => el.id === action.payload.id)
            if (index > -1) {
                state[action.payload.todoListId][index] = {...action.payload, entityStatus: 'idle'}
            }
        });
    }
})

export const tasksReducer = slice.reducer
export const changesTaskStatusAC = slice.actions.changesTaskStatus

// types
type UpdateModelType = {
    title?: string
    description?: string
    status?: TASK_STATUS
    priority?: TASK_PRIORITIES
    startDate?: string
    deadline?: string
}

export type TasksTodoListType = {
    [toDoListID: string]: TasksDomainType[]
}

export type TasksDomainType = TasksType & {
    entityStatus: RequestStatusType
}