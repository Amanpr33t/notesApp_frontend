import { createSlice } from "@reduxjs/toolkit";

interface AddNoteStateType {
    isAddNote: boolean
}
const initialState: AddNoteStateType = {
    isAddNote: false
}


const AddNoteSlice = createSlice({
    name: 'AddNote',
    initialState: initialState,
    reducers: {
        setAddNote(state: AddNoteStateType, action: { payload:boolean }) {
            state.isAddNote = action.payload
        }
    }
})

export default AddNoteSlice
export const AddNoteActions = AddNoteSlice.actions