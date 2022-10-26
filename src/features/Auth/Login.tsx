import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {FormikHelpers, useFormik} from 'formik';
import {Navigate} from "react-router-dom";
import {useAppDispatch} from "../../common/hooks/useAppDispatch";
import {useSelector} from 'react-redux';
import {authSelectors} from './index';
import {loginTC} from './auth-reducer';

type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}

type FormLoginType = {
    email: string
    password: string
    rememberMe: boolean
}

export const Login = () => {

    const dispatch = useAppDispatch()
    const isLoggedIn = useSelector(authSelectors.isLoggedIn)

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate: (values) => {     //валидация, обработка ошибок
            const errors: FormikErrorType = {}
            if (!values.email) {
                errors.email = 'Error email'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }
            if (values.password.length < 2) {
                errors.password = 'Password must be more than two characters'
            }
            return errors
        },
        onSubmit: async (values: FormLoginType, formikHelpers: FormikHelpers<FormLoginType>) => {
            const res = await dispatch(loginTC(values))
            if (loginTC.rejected.match(res)) {
                if (res.payload?.fieldsErrors?.length) {
                    const error = res.payload?.fieldsErrors[0]
                    formikHelpers.setFieldError('email', error.error)
                }
            }
            // formik.resetForm();
        },
    });

    if (isLoggedIn) {
        return <Navigate to={'/'}/>
    }

    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'}> here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField
                            label="Email"
                            margin="normal"
                            {...formik.getFieldProps('email')}
                        />
                        <div style={{color: 'red'}}>
                            {formik.touched.email && formik.errors.email && formik.errors.email}
                        </div>
                        <TextField
                            type="password"
                            label="Password"
                            margin="normal"
                            {...formik.getFieldProps('password')}
                        />
                        <div style={{color: 'red'}}>
                            {formik.touched.password && formik.errors.password && formik.errors.password}
                        </div>
                        <FormControlLabel
                            label={'Remember me'}
                            control={<Checkbox
                                checked={formik.values.rememberMe}
                                {...formik.getFieldProps('rememberMe')}
                            />}
                        />
                        <Button
                            type={'submit'}
                            variant={'contained'}
                            color={'primary'}
                        >Login</Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}