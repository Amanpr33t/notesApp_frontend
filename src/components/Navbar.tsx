import React, { useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux"
import { Flex, Text, Spacer, Button } from '@chakra-ui/react'
import { LoginActions } from "../store/slices/login-slice"
import { useNavigate } from "react-router-dom"
import { ToggleActions } from "../store/slices/toggle-slice"
import { AddNoteActions } from '../store/slices/addNote-slice';
import { EditActions } from '../store/slices/edit-slice';

const Navbar: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    interface LoginStateType {
        isLogin: {
            isLogin: Boolean
        }
    }

    useEffect(() => {
        dispatch(ToggleActions.setToggle(true))
    })
    const isLogin = useSelector((state: LoginStateType) => state.isLogin.isLogin)
    const loginSignUpClick = () => {
        if (isLogin) {
            dispatch(LoginActions.setLogin(false))
        } else {
            dispatch(LoginActions.setLogin(true))
        }
    }
    const logoutClick = () => {
        dispatch(AddNoteActions.setAddNote(false))
        dispatch(EditActions.setEdit({
            isEdit: false,
            content: '',
            heading: '',
            image: '',
            noteId: ''
        }))
        localStorage.clear()
        dispatch(ToggleActions.setToggle(false))
        navigate('/user')
    }
    const homeClick = () => {
        dispatch(AddNoteActions.setAddNote(false))
        dispatch(EditActions.setEdit({
            isEdit: false,
            content: '',
            heading: '',
            image: '',
            noteId: ''
        }))
        if (localStorage.getItem('authToken') === null) {
            navigate('/user')
        } else {
            navigate('/notes')
        }
    }
    return (
        <>
            <Flex h='60px' bg='black' flexDirection='row' align='center' position='fixed' top='0px' width='100%' zIndex='sticky'>
                <Text pl='20px' fontSize='30px' fontWeight='600' onClick={homeClick} _hover={{ cursor: 'pointer' }} color='white'>NotesWeb</Text>
                <Spacer></Spacer>
                {localStorage.getItem('authToken') === null ?
                    <Button h='100%' color='white' bg='black' _hover={{bg:'rgb(66, 59, 59)',cursor:'pointer'}} fontSize='20px' onClick={loginSignUpClick}>{isLogin ? 'Sign Up' : 'Login'}</Button> :
                    <Button h='100%' color='white' bg='black' _hover={{bg:'rgb(66, 59, 59)',cursor:'pointer'}} fontSize='20px' onClick={logoutClick}>Logout</Button>
                }

            </Flex>
        </>
    )
}
export default Navbar