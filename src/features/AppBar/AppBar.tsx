import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {NewTitle} from "../../components/NewTitle/NewTitle";
import style from './AppBar.module.css'
import Container from "@mui/material/Container/Container";
import Grid from "@mui/material/Grid";
import {memo} from "react";
import LinearProgress from "@mui/material/LinearProgress";
import {AppDispatch, useAppSelector} from "../../redux/store";
import {useDispatch} from "react-redux";
import {logoutTC} from "../../reducers/auth-reducer";

type ButtonAppBarPropsType = {
    newTitleCallBack: (title: string) => void
}

export const AppBarComponent = memo((props: ButtonAppBarPropsType) => {

    const dispatch = useDispatch<AppDispatch>()
    const status = useAppSelector(state => state.app.status)
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const login = useAppSelector(state => state.auth.login)

    const LogoutHandler = () => {
        dispatch(logoutTC())
    }

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        <Container fixed>
                            {isLoggedIn
                                ? <Grid container spacing={2}>
                                    <Grid item style={{marginTop: '5px'}}>
                                        New ToDoList
                                    </Grid>
                                    <Grid item>
                                        <NewTitle
                                            newTitleCallBack={props.newTitleCallBack}
                                            classNameInput={style.input}
                                            classNameButton={style.button}
                                            colorButton={"success"}
                                        />
                                    </Grid>
                                </Grid>
                                : <Grid container spacing={2}>
                                    <Grid item style={{marginTop: '5px'}}>
                                        Welcome to todo list app
                                    </Grid>
                                </Grid>
                            }
                        </Container>
                    </Typography>
                    {isLoggedIn && <Button color="inherit" onClick={LogoutHandler}>Logout</Button>}
                </Toolbar>
            </AppBar>
            <div style={{height: '5px'}}>
                {status === 'loading' && <LinearProgress/>}
            </div>
        </Box>
    );
})