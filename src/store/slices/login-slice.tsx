

import { createSlice } from "@reduxjs/toolkit";

interface LoginStateType {
    isLogin: boolean
}
const initialState: LoginStateType = {
    isLogin: false
}


const LoginSlice = createSlice({
    name: 'Login',
    initialState: initialState,
    reducers: {
        setLogin(state: LoginStateType, action: { payload:boolean }) {
            state.isLogin = action.payload
        }
    }
})

export default LoginSlice
export const LoginActions = LoginSlice.actions