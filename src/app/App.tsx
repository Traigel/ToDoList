import React, {useCallback, useEffect} from 'react';
import './App.css';
import {createToDoListTC} from "../features/TodolistsList/todoList-reducer";
import {AppBarComponent} from "../features/AppBar/AppBar";
import {TodolistsList} from "../features/TodolistsList/TodolistsList";
import {Login} from "../features/Login/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import Container from "@mui/material/Container/Container";
import {initializeAppTC} from "./app-reducer";
import CircularProgress from "@mui/material/CircularProgress";
import {useAppDispatch} from "../common/hooks/useAppDispatch";
import {useAppSelector} from "../common/hooks/useAppSelector";
import {Error404} from '../common/components/Error404/Error404';
import {CustomizedSnackbars} from "../common/components/ErrorSnackbar/ErrorSnackbar";

export const App = () => {

    const dispatch = useAppDispatch()
    const isInitialized = useAppSelector(state => state.app.isInitialized)

    const newTodoListHandler = useCallback((titleValue: string) => dispatch(createToDoListTC({titleValue})), [dispatch])

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return <>
        <div className="App">
            <Container fixed>
                <AppBarComponent newTitleCallBack={newTodoListHandler}/>
                <CustomizedSnackbars/>
                <Routes>
                    <Route path={'/'} element={<TodolistsList/>}/>
                    <Route path={'/login'} element={<Login/>}/>
                    <Route path={'/error404'} element={<Error404/>}/>
                    <Route path={'*'} element={<Navigate to={'/error404'}/>}/>
                </Routes>
            </Container>
        </div>
    </>
}
