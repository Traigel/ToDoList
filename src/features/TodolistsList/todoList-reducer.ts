import {Dispatch} from "redux";
import {RESULT_CODES, toDoListAPI, ToDoListType} from "../../api/api";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../common/utils/errors-utils";
import {AxiosError} from 'axios';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../app/store";

const initialState = [] as ToDoListDomainType[]

const slice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        getTodoList(state, action: PayloadAction<{ toDoLists: ToDoListType[] }>) {
            return action.payload.toDoLists.map(el => ({...el, filter: 'all', entityStatus: "idle"}))
        },
        addTodoList(state, action: PayloadAction<{ toDoList: ToDoListType }>) {
            state.unshift({...action.payload.toDoList, filter: 'all', entityStatus: "idle"})
        },
        deleteTodoList(state, action: PayloadAction<{ todolistId: string }>) {
            const index = state.findIndex(el => el.id === action.payload.todolistId)
            if (index > -1) {
                state.splice(index, 1)
            }
        },
        todoListNewTitle(state, action: PayloadAction<{ todolistId: string, title: string }>) {
            const index = state.findIndex(el => el.id === action.payload.todolistId)
            state[index].title = action.payload.title
        },
        changesFilter(state, action: PayloadAction<{ toDoListID: string, filterItem: FilterType }>) {
            const index = state.findIndex(el => el.id === action.payload.toDoListID)
            state[index].filter = action.payload.filterItem
        },
        changesTodoStatus(state, action: PayloadAction<{ todolistId: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(el => el.id === action.payload.todolistId)
            state[index].entityStatus = action.payload.entityStatus
        }
    }
})

export const todoListReducer = slice.reducer
export const getTodoListAC = slice.actions.getTodoList
export const addTodoListAC = slice.actions.addTodoList
export const deleteTodoListAC = slice.actions.deleteTodoList
export const todoListNewTitleAC = slice.actions.todoListNewTitle
export const changesFilterAC = slice.actions.changesFilter
export const changesTodoStatusAC = slice.actions.changesTodoStatus

//thunks
export const getTodoListTC = (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    toDoListAPI.getToDoList()
        .then(res => {
            dispatch(getTodoListAC({toDoLists: res.data}))
            dispatch(setAppStatusAC({status: "succeeded"}))
        })
        .catch((error) => {
            handleServerNetworkError(error.message, dispatch)
        })
}
export const createToDoListTC = (titleValue: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    toDoListAPI.createToDoList(titleValue)
        .then(res => {
            if (res.data.resultCode === RESULT_CODES.succeeded) {
                dispatch(addTodoListAC({toDoList: res.data.data.item}))
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
export const deleteToDoListTC = (todolistId: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    dispatch(changesTodoStatusAC({todolistId, entityStatus: "loading"}))
    toDoListAPI.deleteToDoList(todolistId)
        .then(res => {
            if (res.data.resultCode === RESULT_CODES.succeeded) {
                dispatch(deleteTodoListAC({todolistId}))
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
            dispatch(changesTodoStatusAC({todolistId, entityStatus: "succeeded"}))
        })

}
export const updateToDoListTC = (todolistId: string, title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    toDoListAPI.updateToDoLists(todolistId, title)
        .then(res => {
            if (res.data.resultCode === RESULT_CODES.succeeded) {
                dispatch(todoListNewTitleAC({todolistId, title}))
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
            dispatch(changesTodoStatusAC({todolistId, entityStatus: "succeeded"}))
        })
}

// types
export type ToDoListDomainType = ToDoListType & {
    filter: FilterType
    entityStatus: RequestStatusType
}
export type FilterType = 'all' | 'active' | 'completed'