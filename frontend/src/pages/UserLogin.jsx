import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const UserLogin = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [userData,setUserData] = useState({})

    const submitHandelar = (e)=>{
      e.preventDefault();
      setUserData({
        email:email,
        password:password
      })
      console.log(userData);
      
      setEmail('')
      setPassword('')
    }



  return (
    <div className='p-7 flex flex-col h-screen justify-between'>
     <div>
       <form onSubmit={(e)=>{
        submitHandelar(e)
       }}>
         <img src="/echoride-logo.svg" alt="EchoRide Logo" className="w-32 h-20 mb-10" />
        <h3 className='text-lg font-semibold mb-2'>What's your email?</h3>
        <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base' placeholder="email@example.com" />
        <h3 className='text-lg font-semibold mb-2'>Enter your password?</h3>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base' placeholder="Password" />
        <button type="submit"  className='bg-[#111] text-white font-semibold mb-2 rounded px-4 py-2 w-full text-lg placeholder:text-base' >Login</button>
        
      </form>
      <p className='text-center'>New here?<Link to="/signup" className='text-blue-600 font-semibold'>Create new Account</Link></p>
     </div>
      
      <div>
        <Link to='/captain-login'
         className='bg-[#10b461] flex items-center justify-center text-white font-semibold mb-7 rounded px-4 py-2 w-full text-lg placeholder:text-base' >Sign in as Captain
         </Link>
      </div>

    </div>
  )
}

export default UserLogin
