import {Dispatch} from "redux";
import {RESULT_CODES, toDoListAPI, ToDoListType} from "../api/api";
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../components/utils/errors-utils";
import {AxiosError} from 'axios';

const initialState: ToDoListDomainType[] = []

export const todoListReducer = (state = initialState, action: ToDoListActionType): ToDoListDomainType[] => {
    switch (action.type) {
        case "TODO/GET-TODOLIST": {
            return action.toDoLists.map(el => ({...el, filter: 'all', entityStatus: "idle"}))
        }
        case 'TODO/ADD-TODOLIST': {
            return [{...action.payload.toDoList, filter: 'all', entityStatus: "idle"}, ...state]
        }
        case 'TODO/CHANGE-TODOLIST-FILTER': {
            return state.map(el => el.id === action.payload.toDoListID ? {
                ...el,
                filter: action.payload.filterItem
            } : el)
        }
        case 'TODO/CHANGE-TODOLIST-NEW-TITLE': {
            return state.map(el => el.id === action.payload.toDoListID ? {...el, title: action.payload.newTitle} : el)
        }
        case 'TODO/DELETE-TODOLIST': {
            return state.filter(el => el.id !== action.payload.toDoListID)
        }
        case "TODO/CHANGE-TODOLIST-STATUS": {
            return state.map(el => el.id === action.payload.toDoListID ? {
                ...el,
                entityStatus: action.payload.entityStatus
            } : el)
        }
        default:
            return state
    }
}

//actions
export const getTodoListAC = (toDoLists: ToDoListType[]) => {
    return {type: 'TODO/GET-TODOLIST', toDoLists} as const
}
export const addTodoListAC = (toDoList: ToDoListType) => {
    return {type: 'TODO/ADD-TODOLIST', payload: {toDoList}} as const
}
export const deleteTodoListAC = (toDoListID: string) => {
    return {type: 'TODO/DELETE-TODOLIST', payload: {toDoListID}} as const
}
export const todoListNewTitleAC = (toDoListID: string, newTitle: string) => {
    return {type: 'TODO/CHANGE-TODOLIST-NEW-TITLE', payload: {toDoListID, newTitle}} as const
}
export const changesFilterAC = (toDoListID: string, filterItem: FilterType) => {
    return {type: 'TODO/CHANGE-TODOLIST-FILTER', payload: {toDoListID, filterItem}} as const
}
export const changesTodoStatusAC = (toDoListID: string, entityStatus: RequestStatusType) => {
    return {type: 'TODO/CHANGE-TODOLIST-STATUS', payload: {toDoListID, entityStatus}} as const
}

//thunks
export const getTodoListTC = (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    toDoListAPI.getToDoList()
        .then(res => {
            dispatch(getTodoListAC(res.data))
            dispatch(setAppStatusAC({status: "succeeded"}))
        })
        .catch((error) => {
            handleServerNetworkError(error.message, dispatch)
        })
}
export const createToDoListTC = (titleValue: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    toDoListAPI.createToDoList(titleValue)
        .then(res => {
            if (res.data.resultCode === RESULT_CODES.succeeded) {
                dispatch(addTodoListAC(res.data.data.item))
                dispatch(setAppStatusAC({status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error: AxiosError<{ error: string }>) => {
            const err = error.response ? error.response.data.error : error.message
            handleServerNetworkError(err, dispatch)
        })
}
export const deleteToDoListTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    dispatch(changesTodoStatusAC(todolistId, "loading"))
    toDoListAPI.deleteToDoList(todolistId)
        .then(res => {
            if (res.data.resultCode === RESULT_CODES.succeeded) {
                dispatch(deleteTodoListAC(todolistId))
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
            dispatch(changesTodoStatusAC(todolistId, "succeeded"))
        })

}
export const updateToDoListTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    toDoListAPI.updateToDoLists(todolistId, title)
        .then(res => {
            if (res.data.resultCode === RESULT_CODES.succeeded) {
                dispatch(todoListNewTitleAC(todolistId, title))
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
            dispatch(changesTodoStatusAC(todolistId, "succeeded"))
        })
}

// types
export type AddTodoListACType = ReturnType<typeof addTodoListAC>
type FilterAddACType = ReturnType<typeof changesFilterAC>
type TodoListNewTitleACType = ReturnType<typeof todoListNewTitleAC>
export type DeleteTodoListACType = ReturnType<typeof deleteTodoListAC>
export type GetTodoListACType = ReturnType<typeof getTodoListAC>
export type ChangesTodoStatusType = ReturnType<typeof changesTodoStatusAC>
export type ToDoListActionType = AddTodoListACType | FilterAddACType
    | TodoListNewTitleACType | DeleteTodoListACType | GetTodoListACType
    | ChangesTodoStatusType
export type FilterType = 'all' | 'active' | 'completed'
export type ToDoListDomainType = ToDoListType & {
    filter: FilterType
    entityStatus: RequestStatusType
}