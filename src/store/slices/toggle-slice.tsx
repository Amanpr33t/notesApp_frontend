

import { createSlice } from "@reduxjs/toolkit";

interface ToggleStateType {
    isToggle: boolean
}
const initialState: ToggleStateType = {
    isToggle: false
}


const ToggleSlice = createSlice({
    name: 'Toggle',
    initialState: initialState,
    reducers: {
        setToggle(state: ToggleStateType, action: { payload:boolean }) {
            state.isToggle = action.payload
        }
    }
})

export default ToggleSlice
export const ToggleActions = ToggleSlice.actions