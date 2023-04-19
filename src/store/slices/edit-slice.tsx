import { createSlice } from "@reduxjs/toolkit";

interface EditStateType {
    isEdit: boolean,
    content: string,
    heading: string,
    image: string,
    noteId: string
}
const initialState: EditStateType = {
    isEdit: false,
    content: '',
    heading: '',
    image: '',
    noteId: ''
}


const EditSlice = createSlice({
    name: 'Edit',
    initialState: initialState,
    reducers: {
        setEdit(state: EditStateType, action: { payload: EditStateType }) {
            state.isEdit = action.payload.isEdit
            state.content = action.payload.content
            state.heading = action.payload.heading
            state.image = action.payload.image
            state.noteId = action.payload.noteId
        }
    }
})

export default EditSlice
export const EditActions = EditSlice.actions