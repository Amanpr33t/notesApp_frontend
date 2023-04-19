import {  configureStore} from "@reduxjs/toolkit";
import LoginSlice from "./slices/login-slice";
import EditSlice from "./slices/edit-slice";
import ToggleSlice from "./slices/toggle-slice";
import EmailPasswordErrorSlice from "./slices/emailPasswordError-slice";
import ModalOpenSlice from "./slices/modalClose-slice";
import AddNoteSlice from "./slices/addNote-slice";
const store= configureStore({
    reducer:{
     isLogin:LoginSlice.reducer,
     isEdit:EditSlice.reducer,
     toggle:ToggleSlice.reducer,
     emailPasswordError:EmailPasswordErrorSlice.reducer,
     modalOpen:ModalOpenSlice.reducer,
     addNote:AddNoteSlice.reducer
    }
})

export default store