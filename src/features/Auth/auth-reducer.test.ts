import {AuthInitialStateType, authReducer, loginTC, logoutTC, setUserInfoAC} from "./auth-reducer";

let initialState: AuthInitialStateType

beforeEach(() => {
    initialState = {
        isLoggedIn: false,
        id: null,
        login: null,
        email: null
    }
})

test('set is login', () => {
    const action = loginTC.fulfilled(undefined, 'requestId', {email: '123', password: '', rememberMe: false})
    const testAppReducer = authReducer(initialState, action)
    expect(testAppReducer.isLoggedIn).toBe(true)
})

test('set is logout', () => {
    const action = logoutTC.fulfilled(undefined, 'requestId', undefined)
    const testAppReducer = authReducer(initialState, action)
    expect(testAppReducer.isLoggedIn).toBe(false)
})

test('set user info', () => {
    const id = 123
    const login = 'User'
    const email = 'User@gmail.com'
    const testAppReducer = authReducer(initialState, setUserInfoAC({id, login, email}))
    expect(testAppReducer.id).toBe(123)
    expect(testAppReducer.login).toBe('User')
    expect(testAppReducer.email).toBe('User@gmail.com')
})
