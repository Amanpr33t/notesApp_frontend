import React, { useRef, useEffect } from "react"
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useDisclosure, Flex, Image, Box } from '@chakra-ui/react'
import { useDispatch } from "react-redux"
import { ModalOpenActions } from "../store/slices/modalClose-slice"
interface ModalType {
    modalContent: {
        showModal: boolean,
        heading: string,
        content: string,
        image: string
    }
}

const ModalItem: React.FC<ModalType> = (props: ModalType) => {
    const dispatch = useDispatch()
    const modalRef = useRef<HTMLButtonElement>(null)
    const { showModal, heading, content, image } = props.modalContent
    useEffect(() => {
        if (showModal) {
            modalRef.current?.click()
        }
    })

    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <><Box zIndex='1'>
            <Button onClick={onOpen} ref={modalRef} >Open Modal</Button>

            <Modal isOpen={isOpen} onClose={() => {
                onClose()
                dispatch(ModalOpenActions.setModalOpen(false))
            }} >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Flex justify='center'>
                            <Image h='200px' maxW='100%' src={image} alt='' />
                        </Flex>

                        {heading}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {content}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={() => {
                            onClose()
                            dispatch(ModalOpenActions.setModalOpen(false))
                        }} >
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal></Box>
        </>
    )
}
export default ModalItem