import {AuthInitialStateType, authReducer, setIsLoggedInAC, setUserInfoAC} from "./auth-reducer";


let initialState: AuthInitialStateType

beforeEach(() => {
    initialState = {
        isLoggedIn: false,
        id: null,
        login: null,
        email: null
    }
})

test('set is logged in', () => {
    const testAppReducer = authReducer(initialState, setIsLoggedInAC({isLoggedIn: true}))
    expect(testAppReducer.isLoggedIn).toBe(true)
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
