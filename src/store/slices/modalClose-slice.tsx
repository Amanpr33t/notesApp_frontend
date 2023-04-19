

import { createSlice } from "@reduxjs/toolkit";

interface ModalOpenStateType {
    isModalOpen: boolean
}
const initialState: ModalOpenStateType = {
    isModalOpen: false
}


const ModalOpenSlice = createSlice({
    name: 'ModalOpen',
    initialState: initialState,
    reducers: {
        setModalOpen(state: ModalOpenStateType, action: { payload:boolean }) {
            state.isModalOpen = action.payload
        }
    }
})

export default ModalOpenSlice
export const ModalOpenActions = ModalOpenSlice.actions