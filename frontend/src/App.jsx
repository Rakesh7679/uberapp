import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import UserLogin from './pages/UserLogin.jsx'
import UserSignup from './pages/UserSignup.jsx'
import CaptainLogin from './pages/CaptainLogin.jsx'
import CaptainSignup from './pages/CaptainSignup.jsx'
import Start from './pages/Start.jsx'
import UserProtectWrapper from './pages/UserProtectWrapper.jsx'
import UserLogout from './pages/UserLogout.jsx'


const App = () => {
  return (
    <div>
     <Routes>
      <Route path="/home" element={
        <UserProtectWrapper>
          <Home />
        </UserProtectWrapper>
      } />
      <Route path="/user/logout" element={
        <UserProtectWrapper>
          <UserLogout />
        </UserProtectWrapper>
      }/>
      <Route path="/home/users/logout" element={
        <UserProtectWrapper>
          <UserLogout />
        </UserProtectWrapper>
      }/>
      <Route path="/" element={<Start />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/signup" element={<UserSignup />} />
      <Route path="/captain-login" element={<CaptainLogin />} />
      <Route path="/captain-signup" element={<CaptainSignup />} />
     </Routes>
    </div>
  )
}

export default App
