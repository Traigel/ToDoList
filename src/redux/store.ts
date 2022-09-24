import {combineReducers} from "redux";
import {ToDoListActionType, todoListReducer} from "../reducers/todoList-reducer";
import {TaskActionType, tasksReducer} from "../reducers/tasks-reducer";
import thunk, {ThunkAction, ThunkDispatch} from 'redux-thunk'
import {AppActionsType, appReducer} from "../reducers/app-reducer";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import {authReducer} from "../reducers/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    auth: authReducer,
    app: appReducer,
    todoList: todoListReducer,
    tasks: tasksReducer
})

// export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk)
})

export type AppRootStateType = ReturnType<typeof rootReducer>

// все типы экшенов для всего app
type AppRootActionsType = ToDoListActionType | TaskActionType | AppActionsType

// типизация state
export type RootState = ReturnType<typeof store.getState>

// типизация dispatch
export type AppDispatch = ThunkDispatch<RootState, unknown, AppRootActionsType>

//типизация санки если она возвращает другую санку
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AppRootActionsType>

//типизация selector (везде применять useAppSelector)
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector
