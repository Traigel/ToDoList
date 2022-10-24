import {addTodoListAC, changesTodoStatusAC, deleteTodoListAC, getTodoListAC} from "../../todoList-reducer";
import {RESULT_CODES, TASK_PRIORITIES, TASK_STATUS, tasksAPI, TasksType} from "../../../../api/api";
import {AppRootStateType, AppThunk} from "../../../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../../common/utils/errors-utils";
import {AxiosError} from 'axios';
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksTodoListType = {}

// Thunks
export const getTasksTC = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    const res = await tasksAPI.getTask(todolistId)
    thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
    return {todolistId, tasks: res.data.items}
})

// export const createTaskTC_ = createAsyncThunk('tasks/createTask', (param: {todolistId: string, title: string}, thunkAPI) => {
//     thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
//     thunkAPI.dispatch(changesTodoStatusAC({todolistId, entityStatus: "loading"}))
//     tasksAPI.createTask(todolistId, title)
//         .then(res => {
//             if (res.data.resultCode === RESULT_CODES.succeeded) {
//                 dispatch(addTitleTaskAC({task: res.data.data.item}))
//                 dispatch(setAppStatusAC({status: "succeeded"}))
//             } else {
//                 handleServerAppError<{ item: TasksType }>(res.data, dispatch)
//             }
//         })
//         .catch((error: AxiosError<{ error: string }>) => {
//             const err = error.response ? error.response.data.error : error.message
//             handleServerNetworkError(err, dispatch)
//         })
//         .finally(() => {
//             dispatch(changesTodoStatusAC({todolistId, entityStatus: "idle"}))
//         })
// })

export const createTaskTC = (todolistId: string, title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    dispatch(changesTodoStatusAC({todolistId, entityStatus: "loading"}))
    tasksAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === RESULT_CODES.succeeded) {
                dispatch(addTitleTaskAC({task: res.data.data.item}))
                dispatch(setAppStatusAC({status: "succeeded"}))
            } else {
                handleServerAppError<{ item: TasksType }>(res.data, dispatch)
            }
        })
        .catch((error: AxiosError<{ error: string }>) => {
            const err = error.response ? error.response.data.error : error.message
            handleServerNetworkError(err, dispatch)
        })
        .finally(() => {
            dispatch(changesTodoStatusAC({todolistId, entityStatus: "idle"}))
        })
}

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
    // else {
    //     handleServerAppError(res.data, thunkAPI.dispatch)
    // }
    // .catch((error: AxiosError<{ error: string }>) => {
    //     const err = error.response ? error.response.data.error : error.message
    //     handleServerNetworkError(err, thunkAPI.dispatch)
    // })
    // .finally(() => {
    //     thunkAPI.dispatch(changesTaskStatusAC({
    //         todolistId: param.todolistId,
    //         taskId: param.taskId,
    //         entityStatus: "idle"
    //     }))
    // })
})

export const updateTaskTC = (todolistId: string, taskId: string, model: UpdateModelType): AppThunk =>
    (dispatch, getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC({status: "loading"}))
        dispatch(changesTaskStatusAC({todolistId, taskId, entityStatus: "loading"}))
        const task = getState().tasks[todolistId].find(task => task.id === taskId)
        if (task) {
            tasksAPI.updateTask(todolistId, taskId, {
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
                ...model
            })
                .then(res => {
                    if (res.data.resultCode === RESULT_CODES.succeeded) {
                        dispatch(updateTaskAC({task: res.data.data.item}))
                        dispatch(setAppStatusAC({status: "succeeded"}))
                    } else {
                        handleServerAppError<{ item: TasksType }>(res.data, dispatch)
                    }

                })
                .catch((error: AxiosError<{ error: string }>) => {
                    const err = error.response ? error.response.data.error : error.message
                    handleServerNetworkError(err, dispatch)
                })
                .finally(() => {
                    dispatch(changesTaskStatusAC({todolistId, taskId, entityStatus: "idle"}))
                })
        }
    }

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTitleTask(state, action: PayloadAction<{ task: TasksType }>) {
            state[action.payload.task.todoListId].unshift({...action.payload.task, entityStatus: 'idle'})
        },
        updateTask(state, action: PayloadAction<{ task: TasksType }>) {
            const index = state[action.payload.task.todoListId].findIndex(el => el.id === action.payload.task.id)
            if (index > -1) {
                state[action.payload.task.todoListId][index] = {...action.payload.task, entityStatus: 'idle'}
            }
        },
        changesTaskStatus(state, action: PayloadAction<{ todolistId: string, taskId: string, entityStatus: RequestStatusType }>) {
            const index = state[action.payload.todolistId].findIndex(el => el.id === action.payload.taskId)
            state[action.payload.todolistId][index].entityStatus = action.payload.entityStatus
        },

    },
    extraReducers: (builder) => {  // не генерируют action creator
        builder.addCase(addTodoListAC, (state, action) => {
            state[action.payload.toDoList.id] = []
        });
        builder.addCase(deleteTodoListAC, (state, action) => {
            delete state[action.payload.todolistId]
        });
        builder.addCase(getTodoListAC, (state, action) => {
            action.payload.toDoLists.forEach((el => {
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
    }
})

export const tasksReducer = slice.reducer
export const addTitleTaskAC = slice.actions.addTitleTask
export const updateTaskAC = slice.actions.updateTask
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