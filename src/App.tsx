
import { Routes, Route, useNavigate } from "react-router-dom"
import { useEffect } from 'react';
import LoginSignup from './components/LoginSignup';
import Navbar from './components/Navbar';
import NotesForm from './components/NotesForm';
import NotesCard from './components/NotesCard';
import './App.css'

function App() {
  const navigate= useNavigate()

  const authToken:string|null=localStorage.getItem('authToken')
 
  useEffect(()=>{
      if(authToken){
        navigate('/notes')
      }else{
        navigate('/user')
      }
  },[])
  
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/user" element={<LoginSignup />} />
        <Route path="/add_edit_note" element={<NotesForm/>} />
        <Route path="/notes" element={<NotesCard/>} />
      </Routes>
    </>
  );
}

export default App;
