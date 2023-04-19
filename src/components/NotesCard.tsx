import React, { useCallback, useEffect } from "react"
import ReactPaginate from 'react-paginate';
import { useSelector, useDispatch } from "react-redux"
import { Flex, Text, Card, CardBody, CardFooter, Image, Stack, Heading, Checkbox, Spinner, Tooltip } from '@chakra-ui/react'
import { AddIcon, DeleteIcon, EditIcon, CloseIcon } from '@chakra-ui/icons'
import { useNavigate } from "react-router-dom"
import { EditActions } from "../store/slices/edit-slice"
import { useState, useRef } from "react";
import AlertBar from "./AlertBar"
import ModalItem from "./Modal"
import { ModalOpenActions } from "../store/slices/modalClose-slice"
import './Paginate.css'
import { AddNoteActions } from "../store/slices/addNote-slice";

const NotesCard: React.FC = () => {
    const [notesAll, setNotesAll] = useState<any>()
    const [enableCheckboxes, setEnableCheckboxes] = useState<boolean>(false)
    const [checkedNotes, setCheckedNotes] = useState<string>('')
    const [mainSpinner, setMainSpinner] = useState<boolean>(false)
    const [deleteIconSpinner, setDeleteIconSpinner] = useState<boolean>(false)
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
    const [enableCards, setEnableCards] = useState<boolean>(false)
    interface ModalType {
        showModal: boolean,
        heading: string,
        content: string,
        image: string
    }
    const [modalContent, setModalContent] = useState<ModalType>({
        showModal: false,
        heading: '',
        content: '',
        image: ''
    })
    interface ModalOpenType {
        modalOpen: {
            isModalOpen: boolean
        }
    }
    const modalOpen = useSelector((state: ModalOpenType) => state.modalOpen.isModalOpen)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const checkboxRef = useRef<HTMLInputElement>(null)

    //code for pagination
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [postsPerPage] = useState<number>(9);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = notesAll !== undefined && notesAll.allNotes.slice(indexOfFirstPost, indexOfLastPost);
    interface selectedType {
        selected: number
    }
    const paginate = (input: selectedType) => {
        setCurrentPage(input.selected + 1);
    };

    const fetchAllNotes = useCallback(async () => {
        setMainSpinner(true)
        setEnableCards(false)
        const response = await fetch('http://localhost:3000/notes/getAllNotes', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        const data = await response.json()
        setNotesAll(data)
        setMainSpinner(false)
        setEnableCards(true)
        if (data && data.allNotes.length === 0) {
            setAlert({
                isAlert: true,
                title: 'No notes available!',
                description: ''
            })
        } else {
            setAlert({
                isAlert: false,
                title: '',
                description: ''
            })
        }
    }, [])

    useEffect(() => {
        fetchAllNotes()
    }, [fetchAllNotes])

    const addNote = (event: React.MouseEvent<SVGElement>) => {
        event.preventDefault()
        dispatch(EditActions.setEdit({
            isEdit: false,
            content: '',
            heading: '',
            image: '',
            noteId: ''
        }))
        dispatch(AddNoteActions.setAddNote(true))
        if (localStorage.getItem('authToken') === null) {
            navigate('/user')
        } else {
            navigate('/add_edit_note')
        }
    }

    const editNote = (note: noteType) => {
        dispatch(EditActions.setEdit({
            isEdit: true,
            content: note.content,
            heading: note.heading,
            image: note.image,
            noteId: note._id
        }))
        dispatch(AddNoteActions.setAddNote(false))
        if (localStorage.getItem('authToken') === null) {
            navigate('/user')
        } else {
            navigate('/add_edit_note')
        }
    }
    interface noteType {
        content: string,
        createdAt: Date,
        createdBy: string,
        heading: string,
        image: string,
        updatedAt: string,
        __v: number,
        _id: string
    }

    const deleteNote = async (note: noteType) => {
        try {
            setMainSpinner(true)
            const response = await fetch(`http://localhost:3000/notes/deleteNote/${note._id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            const data = await response.json()
            if (data.status === 'ok') {
                setMainSpinner(false)
                fetchAllNotes()
            } else {
                setAlert({
                    isAlert: true,
                    title: 'Some error occured!',
                    description: 'Please try again'
                })
                setMainSpinner(false)
            }

        } catch (error) {
            setAlert({
                isAlert: true,
                title: 'Some error occured!',
                description: 'Please try again'
            })
            setMainSpinner(false)
        }
    }

    const checkboxChange = (noteId: string) => {
        if (checkboxRef.current!.checked) {
            if (!checkedNotes.includes(noteId)) {
                setCheckedNotes(checkedNotes?.concat(`$${noteId}`))
            }
        } else {
            checkedNotes.split('$').slice(1).forEach((id, index) => {
                if (id === noteId) {
                    const halfBeforeTheUnwantedElement = checkedNotes.split('$').slice(1).slice(0, index)
                    const halfAfterTheUnwantedElement = checkedNotes.split('$').slice(1).slice(index + 1)
                    const newElement = halfBeforeTheUnwantedElement.concat(halfAfterTheUnwantedElement);
                    newElement.forEach((id, index) => {
                        newElement[index] = `$${newElement[index]}`
                    })
                    setCheckedNotes(newElement.join(''))
                    return
                }
            })
        }
    }

    const deleteSelectedNotes = async () => {
        try {
            setDeleteIconSpinner(true)
            const response = await fetch(`http://localhost:3000/notes/deleteSelectedNotes/${checkedNotes}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            const data = await response.json()
            if (data.status === 'ok') {
                setDeleteIconSpinner(false)
                fetchAllNotes()
                setEnableCheckboxes(false)
                navigate('/notes')
                setCheckedNotes('')
            } else {
                setAlert({
                    isAlert: true,
                    title: 'Some error occured!',
                    description: 'Please try again'
                })
                setMainSpinner(false)
            }

        } catch (error) {
            setAlert({
                isAlert: true,
                title: 'Some error occured!',
                description: 'Please try again'
            })
            setDeleteIconSpinner(false)
        }
    }

    const monthCreator = (date: Date) => {
        let month
        if (new Date(date).getMonth() === 1) {
            month = 'January'
        } else if (new Date(date).getMonth() === 2) {
            month = 'February'
        } else if (new Date(date).getMonth() === 3) {
            month = 'March'
        } else if (new Date(date).getMonth() === 4) {
            month = 'April'
        } else if (new Date(date).getMonth() === 5) {
            month = 'May'
        } else if (new Date(date).getMonth() === 6) {
            month = 'June'
        } else if (new Date(date).getMonth() === 7) {
            month = 'July'
        } else if (new Date(date).getMonth() === 8) {
            month = 'August'
        } else if (new Date(date).getMonth() === 9) {
            month = 'September'
        } else if (new Date(date).getMonth() === 10) {
            month = 'October'
        } else if (new Date(date).getMonth() === 11) {
            month = 'November'
        } else if (new Date(date).getMonth() === 12) {
            month = 'December'
        }
        return month
    }

    const cancelCheckClick = () => {
        setEnableCheckboxes(false)
        setCheckedNotes('')
    }

    const cardClick = (input: ModalType) => {
        setModalContent(input)
        dispatch(ModalOpenActions.setModalOpen(true))
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
            {mainSpinner && <Spinner position='fixed' top='120px' left='50%' zIndex='sticky' thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl'
            />}
            {alert.isAlert && <AlertBar alertData={alert} />}
            {notesAll !== undefined && <Flex flexDirection='row' position='fixed' top={alert.isAlert ? '120px' : '80px'} ml='20px' zIndex='sticky'>
                {!enableCheckboxes && <>
                    <Tooltip label='Add note' bg='gray' fontSize='md'>
                        <AddIcon bg='green.500' color='white' mr='20px' fontSize='15px' p='7px' w='40px' borderRadius='10px' h='40px' onClick={addNote} _hover={{ cursor: 'pointer' }}></AddIcon>
                    </Tooltip>
                    {notesAll !== undefined && notesAll.status === 'ok' && notesAll.count > 0 && <Tooltip label='Delete note' bg='gray' fontSize='md'>
                        <DeleteIcon bg='red.400' color='white' fontSize='15px' p='7px' w='40px' borderRadius='10px' h='40px' onClick={() => setEnableCheckboxes(true)} _hover={{ cursor: 'pointer' }}></DeleteIcon>
                    </Tooltip>} </>}
                {enableCheckboxes &&
                    <>
                        {checkedNotes !== '' && !deleteIconSpinner &&
                            <Tooltip label='Delete note' bg='gray' fontSize='md'>
                                <DeleteIcon bg='red.400' color='white' fontSize='15px' p='7px' w='40px' borderRadius='10px' mr='20px' h='40px' onClick={deleteSelectedNotes} _hover={{ cursor: 'pointer' }}></DeleteIcon>
                            </Tooltip>}
                        {checkedNotes !== '' && deleteIconSpinner && <Spinner mr='20px' thickness="4px" size='lg' />}
                        <Tooltip label='Close' bg='gray' fontSize='md'>
                            <CloseIcon bg='gray' color='white' fontSize='15px' p='7px' w='40px' borderRadius='10px' h='40px' onClick={cancelCheckClick} _hover={{ cursor: 'pointer' }}></CloseIcon>
                        </Tooltip>
                    </>}
            </Flex>}

            {modalOpen && <ModalItem modalContent={modalContent} />}

            {enableCards && <Flex flexWrap='wrap' justify='center' gap='30px' mt='135px' mb='50px'>
                {notesAll !== undefined && notesAll.status === 'ok' && notesAll.count > 0 && currentPosts.map((note: noteType) => {
                    return <Card bg='gray.100' w='350px' ml='5px' mr='5px' key={note._id}  >
                        <CardBody position='relative' >
                            {enableCheckboxes && <Checkbox position='absolute' size='lg' borderColor='gray' top='2px' right='2px' defaultChecked={false}
                                ref={checkboxRef} onChange={() => checkboxChange(note._id)}></Checkbox>}
                            <Flex justify='center'>
                                <Image
                                    src={note.image}
                                    alt='image'
                                    borderRadius='10px'
                                    maxW='100%'
                                    h='170px'
                                    onClick={() => {
                                        cardClick({
                                            showModal: true,
                                            heading: note.heading,
                                            content: note.content,
                                            image: note.image
                                        })
                                    }}
                                    _hover={{ cursor: 'pointer' }}
                                />
                            </Flex>
                            <Stack mt='3' spacing='3'>
                                <Heading size='md' h='50px' overflow='hidden' onClick={() => {
                                    cardClick({
                                        showModal: true,
                                        heading: note.heading,
                                        content: note.content,
                                        image: note.image
                                    })
                                }}
                                    _hover={{ cursor: 'pointer' }}>{note.heading}</Heading>
                                <Text h='75px' overflow='hidden'  >
                                    {note.content}
                                </Text>
                                <Flex justify='flex-end'>
                                    <Text >{new Date(note.createdAt).getDate()} {monthCreator(note.createdAt)} {new Date(note.createdAt).getFullYear().toString()} </Text>
                                </Flex>
                            </Stack>
                        </CardBody>
                        <CardFooter >
                            {!enableCheckboxes && <Flex align='center' justify='center' w='100%' gap='40px' mt='-25px'>
                                <Tooltip label='Edit' bg='gray' fontSize='md'>
                                    <EditIcon _hover={{ cursor: 'pointer' }} fontSize='20px' onClick={() => { editNote(note) }}></EditIcon>
                                </Tooltip>
                                <Tooltip label='Delete' bg='gray' fontSize='md'>
                                    <DeleteIcon onClick={() => { deleteNote(note) }} _hover={{ cursor: 'pointer' }} fontSize='20px'></DeleteIcon>
                                </Tooltip>

                            </Flex>}
                        </CardFooter>
                    </Card>
                })}
            </Flex>}
            <Flex justify='center'>
                {notesAll && <ReactPaginate
                    onPageChange={paginate}
                    pageCount={Math.ceil(notesAll.allNotes.length / postsPerPage)}
                    previousLabel={'Prev'}
                    breakLabel={'...'}
                    breakClassName={'break-class'}
                    nextLabel={'Next'}
                    containerClassName={'pagination'}
                    pageLinkClassName={'page-number'}
                    previousLinkClassName={'previous'}
                    nextLinkClassName={'next'}
                    activeLinkClassName={'active'}
                    renderOnZeroPageCount={null}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={1}
                />}
            </Flex>
        </>
    )
}
export default NotesCard