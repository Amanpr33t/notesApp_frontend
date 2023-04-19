import React from "react"
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react'
interface AlertType {
    alertData: {
        isAlert: boolean,
        title: string,
        description: string
    }

}

const AlertBar: React.FC<AlertType> = (props: AlertType) => {
    const { isAlert, title, description } = props.alertData
    return (
        <>
            {isAlert && <Alert status='error' w='100%' position='fixed' top='60px' zIndex='sticky'>
                <AlertIcon />
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription>{description}</AlertDescription>
            </Alert>}
        </>
    )
}
export default AlertBar


