

import { createSlice } from "@reduxjs/toolkit";

interface EmailPasswordErrorStateType {
    passwordError: boolean,
    emailError: boolean
}
const initialState: EmailPasswordErrorStateType = {
    passwordError: false,
    emailError: false
}


const EmailPasswordErrorSlice = createSlice({
    name: 'EmailPasswordError',
    initialState: initialState,
    reducers: {
        setEmailPasswordError(state: EmailPasswordErrorStateType, action: { payload: EmailPasswordErrorStateType }) {
            state.passwordError = action.payload.passwordError
            state.emailError = action.payload.emailError
        }
    }
})

export default EmailPasswordErrorSlice
export const EmailPasswordErrorActions = EmailPasswordErrorSlice.actions