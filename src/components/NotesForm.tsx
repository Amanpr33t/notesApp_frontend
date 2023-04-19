import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { Input, Flex, Spinner, Text, Spacer, Button, Textarea, Tooltip } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import { useNavigate } from "react-router-dom"
import { useState, useRef } from "react";
import AlertBar from "./AlertBar"
import { EditActions } from "../store/slices/edit-slice"
import { AddNoteActions } from "../store/slices/addNote-slice"

const NotesForm: React.FC = () => {
    const dispatch = useDispatch()
    interface StateType {
        isEdit: {
            isEdit: boolean,
            content: string,
            heading: string,
            image: string,
            noteId: string
        }
    }
    const isEdit = useSelector((state: StateType) => state.isEdit.isEdit)
    const heading = useSelector((state: StateType) => state.isEdit.heading)
    const content = useSelector((state: StateType) => state.isEdit.content)
    const image = useSelector((state: StateType) => state.isEdit.image)
    const noteId = useSelector((state: StateType) => state.isEdit.noteId)

    const [imageSRC, setImageSRC] = useState<string>(image)
    const [buttonSpinner, setButtonSpinner] = useState<boolean>(false)
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
    const [headingError, setHeadingError] = useState<boolean>(false);
    const [contentError, setContentError] = useState<boolean>(false);
    const [imageUpload, setImageUpload] = useState<any>();
    const [file, setFile] = useState<any>()

    const headingRef = useRef<HTMLInputElement>(null)
    const contentRef = useRef<HTMLTextAreaElement>(null)

    const alertFunction = () => {
        setAlert({
            isAlert: true,
            title: 'Some error occured!',
            description: 'Please try again'
        })
    }

    const imageChangeHandler = (event: any) => {
        setFile(URL.createObjectURL(event.target.files[0]));
        setImageSRC(URL.createObjectURL(event.target.files[0]))
        setImageUpload(event.target.files[0])
    }

    const navigate = useNavigate()
    const closeClick = () => {
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
    const save = async () => {
        if (contentRef.current!.value === '' || headingRef.current!.value === '') {
            if (contentRef.current!.value === '') {
                setContentError(true)
            }
            if (headingRef.current!.value === '') {
                setHeadingError(true)
            }
        } else {
            setButtonSpinner(true)
            let note
            if (file) {
                const formData = new FormData();
                formData.append('file', imageUpload);
                formData.append('upload_preset', 'notesApp');
                formData.append('cloud_name', 'dilxvg0pp');
                const response = await fetch('https://api.cloudinary.com/v1_1/dilxvg0pp/image/upload', {
                    method: 'POST',
                    body: formData,
                })

                const data = await response.json()
                note = {
                    heading: headingRef.current!.value,
                    content: contentRef.current!.value,
                    image: data.secure_url
                }
            } else {
                note = {
                    heading: headingRef.current!.value,
                    content: contentRef.current!.value
                }
            }
            if (isEdit) {
                try {
                    const response = await fetch(`https://notesapp-backend-tqnj.onrender.com/notes/editNote/${noteId}`, {
                        method: 'PATCH',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                        },
                        body: JSON.stringify(note)
                    })
                    const data = await response.json()
                    setButtonSpinner(false)
                    if (data.status === 'ok') {
                        dispatch(AddNoteActions.setAddNote(false))
                        dispatch(EditActions.setEdit({
                            isEdit: false,
                            content: '',
                            heading: '',
                            image: '',
                            noteId: ''
                        }))
                        navigate('/notes')
                    } else {
                        alertFunction()
                    }
                } catch (error) {
                    alertFunction()
                    setButtonSpinner(false)
                }

            } else {
                try {
                    const response = await fetch('https://notesapp-backend-tqnj.onrender.com/notes/addNote', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                        },
                        body: JSON.stringify(note)
                    })
                    const data = await response.json()
                    setButtonSpinner(false)
                    if (data.status === 'ok') {
                        dispatch(AddNoteActions.setAddNote(false))
                        dispatch(EditActions.setEdit({
                            isEdit: false,
                            content: '',
                            heading: '',
                            image: '',
                            noteId: ''
                        }))
                        navigate('/notes')
                    } else {
                        alertFunction()
                    }
                } catch (error) {
                    alertFunction()
                    setButtonSpinner(false)
                }
            }
        }
    }
    if (alert) {
        setTimeout(() => {
            setAlert({
                isAlert: false,
                title: '',
                description: ''
            })
        }, 10000)
    }

    return (
        <>
            <Flex justify='center'>
                <AlertBar alertData={alert} />

                <Flex mt={alert.isAlert ? '135px' : '80px'} p='20px' flexDirection='column' borderRadius='10px' bg='gray.100' w={{ base: '100%', md: '750px' }}>
                    <Flex>
                        <Spacer></Spacer>
                        <CloseIcon onClick={closeClick} _hover={{ cursor: 'pointer' }} ></CloseIcon>
                    </Flex>
                    <Text fontSize='20px' fontWeight='400'>Heading</Text>

                    <Input id='headingInput' border='2px solid gray' defaultValue={isEdit ? heading : ''} ref={headingRef}></Input>
                    {headingError && <Text color='red' w='100%'>Enter heading</Text>}
                    <Text mt='13px' fontSize='20px' fontWeight='400'>Content</Text>
                    <Textarea overflowY='scroll' h='150px' border='2px solid gray' placeholder='Add your content here' defaultValue={isEdit ? content : ''} ref={contentRef} />
                    {contentError && <Text color='red'>Enter content</Text>}
                    <Flex flexDirection='row' mt='20px' align='center' justify='flex-start'>
                        <Tooltip label='Add image' fontSize='md'>
                            <input type="file" onChange={imageChangeHandler} />
                        </Tooltip>
                        <img style={{ width: '100px' }} src={isEdit ? imageSRC : file} alt="" />

                    </Flex>

                    <Flex justify='center'>< Button fontSize='20px' mt='20px' w='100px' bg='gray' onClick={save}>{isEdit ? 'Update' : 'Save'} {buttonSpinner && <Spinner ml='10px' />} </Button></Flex>

                </Flex>
            </Flex>
        </>
    )
}
export default NotesForm