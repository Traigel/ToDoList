import React, {useEffect} from 'react';
import Grid from '@mui/material/Grid';
import Paper from "@mui/material/Paper";
import {ToDoList} from './TodoList/ToDoList';
import {Navigate} from "react-router-dom";
import {useSelector} from 'react-redux';
import {authSelectors} from '../Auth';
import {todoListsActions, todoListSelectors} from './index';
import {useActions} from '../../common/hooks/useActions';


export const TodolistsList = () => {

    const {getTodoListTC} = useActions(todoListsActions)
    const todoLists = useSelector(todoListSelectors.todoLists)
    const isLoggedIn = useSelector(authSelectors.isLoggedIn)

    useEffect(() => {
        if (!isLoggedIn) {
            return
        }
        getTodoListTC()
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