import { AppRootStateType } from "../../app/store"

export const isLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn