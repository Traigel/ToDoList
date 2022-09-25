import {combineReducers} from "redux";
import {todoListReducer} from "../features/TodolistsList/todoList-reducer";
import {tasksReducer} from "../features/TodolistsList/TodoList/Tasks/tasks-reducer";
import thunk, {ThunkAction} from 'redux-thunk'
import {appReducer} from "./app-reducer";
import {authReducer} from "../features/Login/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    auth: authReducer,
    app: appReducer,
    todoList: todoListReducer,
    tasks: tasksReducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk)
})

// типизация state
export type AppRootStateType = ReturnType<typeof store.getState>

// все типы экшенов для всего приложения
export type AppRootActionsType = any

// типизация dispatch
export type AppDispatch = typeof store.dispatch

//типизация санки если она возвращает другую санку
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppRootActionsType>