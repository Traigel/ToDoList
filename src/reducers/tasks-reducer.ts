import {AddTodoListACType, changesTodoStatusAC, DeleteTodoListACType, GetTodoListACType} from "./todoList-reducer";
import {RESULT_CODES, TASK_PRIORITIES, TASK_STATUS, tasksAPI, TasksType} from "../api/api";
import {Dispatch} from "redux";
import {AppRootStateType} from "../redux/store";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../components/utils/errors-utils";
import {AxiosError} from 'axios';

const initialState: TasksTodoListType = {}

export const tasksReducer = (state = initialState, action: TaskActionType): TasksTodoListType => {
    switch (action.type) {
        case "TASKS/GET-TASKS": {
            return {
                ...state,
                [action.payload.toDoListID]: action.payload.tasks.map(el => ({...el, entityStatus: 'idle'}))
            }
        }
        case 'TASKS/ADD-TASK': {
            return {
                ...state,
                [action.payload.task.todoListId]: [{
                    ...action.payload.task,
                    entityStatus: 'idle'
                }, ...state[action.payload.task.todoListId]]
            }
        }
        case 'TASKS/DELETE-TASK': {
            return {
                ...state,
                [action.payload.toDoListID]: state[action.payload.toDoListID].filter(el => el.id !== action.payload.taskID)
            }
        }
        case 'TASKS/UPDATE-TASK' : {
            return {
                ...state,
                [action.payload.task.todoListId]: state[action.payload.task.todoListId].map(task => task.id === action.payload.task.id ? {
                    ...action.payload.task,
                    entityStatus: 'idle'
                } : task)
            }
        }
        case 'TODO/ADD-TODOLIST': {
            return {...state, [action.payload.toDoList.id]: []}
        }
        case 'TODO/DELETE-TODOLIST': {
            let {[action.payload.toDoListID]: remove, ...copyState} = {...state}
            return copyState
        }
        case "TODO/GET-TODOLIST": {
            const copyState = {...state}
            action.toDoLists.forEach(t => {
                copyState[t.id] = []
            })
            return copyState
        }
        case "TASKS/CHANGE-TASK-STATUS": {
            return {
                ...state,
                [action.payload.toDoListID]: state[action.payload.toDoListID].map(el => el.id === action.payload.taskID ? {
                    ...el,
                    entityStatus: action.payload.entityStatus
                } : el)
            }
        }
        default:
            return state
    }
}

//actions
export const getTasksAC = (toDoListID: string, tasks: TasksType[]) => {
    return {type: 'TASKS/GET-TASKS', payload: {toDoListID, tasks}} as const
}
export const addTitleTaskAC = (task: TasksType) => {
    return {type: 'TASKS/ADD-TASK', payload: {task}} as const
}
export const deleteTitleTaskAC = (toDoListID: string, taskID: string) => {
    return {type: 'TASKS/DELETE-TASK', payload: {toDoListID, taskID}} as const
}
export const updateTaskAC = (task: TasksType) => {
    return {type: 'TASKS/UPDATE-TASK', payload: {task}} as const
}
export const changesTaskStatusAC = (toDoListID: string, taskID: string, entityStatus: RequestStatusType) => {
    return {type: 'TASKS/CHANGE-TASK-STATUS', payload: {toDoListID, taskID, entityStatus}} as const
}

//thunks
export const getTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    tasksAPI.getTask(todolistId)
        .then(res => {
            dispatch(getTasksAC(todolistId, res.data.items))
            dispatch(setAppStatusAC({status: "succeeded"}))
        })
        .catch((error) => {
            handleServerNetworkError(error.message, dispatch)
        })
}
export const createTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    dispatch(changesTodoStatusAC(todolistId, "loading"))
    tasksAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === RESULT_CODES.succeeded) {
                dispatch(addTitleTaskAC(res.data.data.item))
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
            dispatch(changesTodoStatusAC(todolistId, "idle"))
        })
}
export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    dispatch(changesTaskStatusAC(todolistId, taskId, "loading"))
    tasksAPI.deleteTask(todolistId, taskId)
        .then(res => {
            if (res.data.resultCode === RESULT_CODES.succeeded) {
                dispatch(deleteTitleTaskAC(todolistId, taskId))
                dispatch(setAppStatusAC({status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error: AxiosError<{ error: string }>) => {
            const err = error.response ? error.response.data.error : error.message
            handleServerNetworkError(err, dispatch)
        })
        .finally(() => {
            dispatch(changesTaskStatusAC(todolistId, taskId, "idle"))
        })
}
export const updateTaskTC = (todolistId: string, taskId: string, model: UpdateModelType) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC({status: "loading"}))
        dispatch(changesTaskStatusAC(todolistId, taskId, "loading"))
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
                        dispatch(updateTaskAC(res.data.data.item))
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
                    dispatch(changesTaskStatusAC(todolistId, taskId, "idle"))
                })
        }
    }

// types
type UpdateModelType = {
    title?: string
    description?: string
    status?: TASK_STATUS
    priority?: TASK_PRIORITIES
    startDate?: string
    deadline?: string
}
type AddTitleTaskACType = ReturnType<typeof addTitleTaskAC>
type DeleteTitleTaskACType = ReturnType<typeof deleteTitleTaskAC>
type GetTasksACType = ReturnType<typeof getTasksAC>
type UpdateTaskACType = ReturnType<typeof updateTaskAC>
type ChangesTaskStatusType = ReturnType<typeof changesTaskStatusAC>
export type TaskActionType =
    AddTitleTaskACType
    | DeleteTitleTaskACType
    | AddTodoListACType
    | DeleteTodoListACType
    | GetTodoListACType
    | GetTasksACType
    | UpdateTaskACType
    | ChangesTaskStatusType
export type TasksTodoListType = {
    [toDoListID: string]: TasksDomainType[]
}
export type TasksDomainType = TasksType & {
    entityStatus: RequestStatusType
}