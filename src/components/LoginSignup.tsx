import React from "react"
import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux"
import { Input, Flex, Text, Button, Spinner } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import { ToggleActions } from "../store/slices/toggle-slice";
import AlertBar from "./AlertBar";

const LoginSignup: React.FC = () => {
    const dispatch = useDispatch()

    const [passwordError, setPasswordError] = useState<boolean>(false)
    const [emailError, setEmailError] = useState<boolean>(false)
    const [buttonSpinner, setButtonSpinner] = useState<boolean>(false)

    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    interface AlertType {
        isAlert: boolean,
        title: string,
        description: string
    }
    const [alert, setAlert] = useState<AlertType>({
        isAlert: false,
        title: '',
        description: ''
    });

    interface LoginStateType {
        isLogin: {
            isLogin: Boolean
        }
    }
    const isLogin = useSelector((state: LoginStateType) => state.isLogin.isLogin)

    interface ToggleStateType {
        toggle: {
            isToggle: Boolean
        }
    }
    const isToggle = useSelector((state: ToggleStateType) => state.toggle.isToggle)

    const alertTimeoutFunction = () => {
        setTimeout(() => {
            setAlert({
                isAlert: false,
                title: '',
                description: ''
            })
        }, 4000)
    }

    const navigate = useNavigate()
    if (localStorage.getItem('authToken') !== null) {
        navigate('/notes')
    }

    if (isToggle) {
        setAlert({
            isAlert: false,
            title: '',
            description: ''
        })
        setEmailError(false)
        setPasswordError(false)
        dispatch(ToggleActions.setToggle(false))
        if (document.getElementById('emailInput')) {
            emailRef.current!.value = ''
        }
        if (document.getElementById('passwordInput')) {
            passwordRef.current!.value = ''
        }
    }

    const buttonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (passwordRef.current!.value.length < 6 || !/\S+@\S+\.\S+/.test(emailRef.current!.value)) {
            if (!/\S+@\S+\.\S+/.test(emailRef.current!.value)) {
                setEmailError(true)
                setTimeout(() => {
                    setEmailError(false)
                }, 10000)
            } else {
                setEmailError(false)
            }
            if (passwordRef.current!.value.length < 6) {
                setPasswordError(true)
                setTimeout(() => {
                    setPasswordError(false)
                }, 10000)
            } else {
                setPasswordError(false)
            }
        } else {
            const userInfo = {
                email: emailRef.current!.value,
                password: passwordRef.current!.value
            }
            if (!isLogin) {
                setButtonSpinner(true)
                try {
                    const response = await fetch('https://notesapp-backend-tqnj.onrender.com/user/signup', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userInfo)
                    })
                    const data = await response.json()
                    setButtonSpinner(false)
                    if (data.status === 'ok') {
                        localStorage.setItem('authToken', data.authToken)
                        navigate('/notes')
                    } else if (data.status === 'emailExists') {
                        setAlert({
                            isAlert: true,
                            title: 'Email already exists!',
                            description: 'Please use another email.'
                        })
                        alertTimeoutFunction()
                    }
                } catch (error) {
                    setButtonSpinner(false)
                    setAlert({
                        isAlert: true,
                        title: 'Some error occured',
                        description: 'Please try again'
                    })
                    alertTimeoutFunction()
                }

            } else {
                try {
                    setButtonSpinner(true)
                    const response = await fetch('https://notesapp-backend-tqnj.onrender.com/user/login', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userInfo)
                    })
                    const data = await response.json()
                    setButtonSpinner(false)
                    if (data.status === 'ok') {
                        localStorage.setItem('authToken', data.authToken)
                        navigate('/notes')
                    } else if (data.status === 'invalid') {
                        setAlert({
                            isAlert: true,
                            title: 'Invalid credentials',
                            description: 'Please enter correct credentials'
                        })
                        alertTimeoutFunction()
                    } else {
                        setAlert({
                            isAlert: true,
                            title: 'Some error occured',
                            description: 'Please try again'
                        })
                        alertTimeoutFunction()
                    }
                } catch (error) {
                    setButtonSpinner(false)
                    setAlert({
                        isAlert: true,
                        title: 'Some error occured',
                        description: 'Please try again'
                    })
                    alertTimeoutFunction()
                }
            }
        }
    }


    return (
        <>
            <AlertBar alertData={alert} />
            <Flex pl='5px' pr='5px' position='fixed' top='137px' justify='center' width='100%' maxH='100vh'>
                <Flex p={'20px'} flexDirection='column' borderRadius='10px' w='500px' justify='center' bg='gray.200'>
                    <Text fontSize='20px' fontWeight='400' >Email</Text>
                    <Input id='emailInput' ref={emailRef} border='2px solid gray' ></Input>
                    {emailError && <Text fontSize='15px' fontWeight='400' color='red'>Invalid format. e.g. abcd@gmail.com</Text>}
                    <Text fontSize='20px' fontWeight='400' mt='10px'>Password</Text>
                    <Input id='passwordInput' ref={passwordRef} border='2px solid gray' autoComplete='off'></Input>
                    {passwordError && <Text fontSize='15px' fontWeight='400' color='red'>Password should contain atleast 6 characters</Text>}
                    <Flex justify='center' >
                        <Button onClick={buttonClick} mt='20px' bg='gray'>{isLogin ? 'Login' : 'Sign Up'} {buttonSpinner && <Spinner ml='10px' />}</Button>
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}
export default LoginSignup