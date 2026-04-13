import React from 'react'
import { Route,Routes } from 'react-router-dom'
import UserLogin from './pages/userLogin'
import Home from './pages/Home'
import UserSignup from './pages/userSignup'
import Captainlogin from './pages/captainLogin'
import CaptainSignup from './pages/captainSignup'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<UserLogin/>}/>
        <Route path='/signup' element={<UserSignup/>}/>
        <Route path='/captain-login' element={<Captainlogin/>}/>
        <Route path='/captain-signup' element={<CaptainSignup/>}/>

      </Routes>
    </div>
  )
}

export default App
