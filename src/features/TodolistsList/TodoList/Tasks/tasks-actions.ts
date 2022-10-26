import {createAsyncThunk} from '@reduxjs/toolkit';
import {setAppStatusAC} from '../../../../app/app-reducer';
import {RESULT_CODES, TASK_PRIORITIES, TASK_STATUS, tasksAPI, TasksType} from '../../../../api/api';
import {changesTodoStatusAC} from '../../todoList-reducer';
import {handleServerAppError, handleServerNetworkError} from '../../../../common/utils/errors-utils';
import axios from 'axios';
import {AppRootStateType} from '../../../../app/store';
import {changesTaskStatusAC} from './tasks-reducer';

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

// Types

type UpdateModelType = {
    title?: string
    description?: string
    status?: TASK_STATUS
    priority?: TASK_PRIORITIES
    startDate?: string
    deadline?: string
}