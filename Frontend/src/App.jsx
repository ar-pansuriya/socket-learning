import { Route, Routes } from 'react-router'
import './App.css'
import Signup from './components/Signup'
import Login from './components/Login'
import ChatComponent from './components/ChatComponent';
import AuthMiddle from './hooks/AuthMiddle';




function App() {


  return (
    <>
      <Routes>
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/' element={<Login></Login>}></Route>
        <Route path='/signup' element={<Signup></Signup>}></Route>
        <Route element={<AuthMiddle />}>
          <Route path='/profile' element={<ChatComponent />}></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App




