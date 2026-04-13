import React from 'react'
import { Route,Routes } from 'react-router-dom'
import UserLogin from './pages/UserLogin'
import Home from './pages/Home'
import Start from './pages/Start'
import UserSignup from './pages/userSignup'
import Captainlogin from './pages/captainLogin'
import UserProtectWrapper from './pages/UserProtectedWrapper'
import UserLogout from './pages/UserLogout'
import CaptainSignup from './pages/captainSignup'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/Start' element={<Home/>}/>
        <Route path='/login' element={<UserLogin/>}/>
        <Route path='/signup' element={<UserSignup/>}/>
        <Route path='/captain-login' element={<Captainlogin/>}/>
        <Route path='/captain-signup' element={<CaptainSignup/>}/>
         <Route path='/home' element={
          <UserProtectWrapper>
            <Home />
          </UserProtectWrapper>
        } />
        <Route path='/user/logout' element={<UserProtectWrapper>
          <UserLogout />
        </UserProtectWrapper>
        } />
      </Routes>
    </div>
  )
}

export default App
