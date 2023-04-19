
import { Routes, Route, useNavigate } from "react-router-dom"
import { useEffect } from 'react';
import LoginSignup from './components/LoginSignup';
import Navbar from './components/Navbar';
import NotesForm from './components/NotesForm';
import NotesCard from './components/NotesCard';
import { useSelector } from "react-redux";
import './App.css'

function App() {

  const navigate = useNavigate()
  interface EditStateType {
    isEdit: {
      isEdit: boolean,
      content: string,
      heading: string,
      image: string,
      noteId: string
    }
  }

  const isEdit = useSelector((state: EditStateType) => state.isEdit.isEdit)

  interface AddNoteStateType {
    addNote: {
      isAddNote: boolean
    }
  }
  const isAddNote = useSelector((state: AddNoteStateType) => state.addNote.isAddNote)
  const authToken: string | null = localStorage.getItem('authToken')

  useEffect(() => {
    if (authToken !== null) {
      if (!isAddNote && !isEdit) {
        navigate('/notes')
      } else if (isAddNote || isEdit) {
        navigate('/add_edit_note')
      }
    } else if (authToken === null ) {
      navigate('/user')
    } 
  }, [authToken, navigate, isAddNote,isEdit])

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/user" element={<LoginSignup />} />
        <Route path="/add_edit_note" element={<NotesForm />} />
        <Route path="/notes" element={<NotesCard />} />
      </Routes>
    </>
  );
}

export default App;
