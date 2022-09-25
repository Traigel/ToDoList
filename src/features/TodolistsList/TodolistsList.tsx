import React, {useEffect} from 'react';
import Grid from '@mui/material/Grid';
import Paper from "@mui/material/Paper";
import {ToDoList} from './TodoList/ToDoList';
import {getTodoListTC} from "./todoList-reducer";
import {useDispatch} from "react-redux";
import {Navigate} from "react-router-dom";
import {useAppDispatch} from "../../common/hooks/useAppDispatch";
import {useAppSelector} from "../../common/hooks/useAppSelector";


export const TodolistsList = () => {

    const dispatch = useAppDispatch()
    const todoLists = useAppSelector(state => state.todoList)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

    useEffect(() => {
        if (!isLoggedIn) {
            return
        }
        dispatch(getTodoListTC)
    }, [])

    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return (
        <Grid container spacing={3} style={{paddingTop: "15px"}}>
            {todoLists.map(tl => {
                return (
                    <Grid key={tl.id} item xs={4}>
                        <Paper elevation={6} style={{padding: "10px"}}>
                            <ToDoList todoList={tl}/>
                        </Paper>
                    </Grid>
                )
            })}
        </Grid>
    )
}