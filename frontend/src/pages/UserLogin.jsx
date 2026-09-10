import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import axios from 'axios'
import { useContext } from 'react'

const UserLogin = () => {
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [userData,setUserData] = useState({})

    const { setUser } = useContext(UserDataContext)
    const navigate = useNavigate()

    const submitHandler = (e)=>{
      e.preventDefault();
      const userData = {
        email:email,
        password:password
      }
      const response = axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`,userData)
      response.then((res)=>{
        if(res.status === 200){
          setUser(res.data.user)
          localStorage.setItem('token', res.data.token)
          navigate('/home')
        }
      }).catch((error) => {
        console.error('Login error:', error)
        alert('Login failed. Please check your credentials.')
      })

    }

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
      <div className='p-6 flex flex-col min-h-screen justify-between max-w-md mx-auto'>
        <div className='flex-1'>
          {/* Logo */}
          <div className='pt-4 pb-8'>
            <img src="/echoride-logo1.png" alt="EchoRide Logo" className="w-40 h-24" />
          </div>

          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Welcome back</h1>
            <p className='text-gray-600'>Sign in to continue your journey</p>
          </div>

          {/* Form */}
          <form onSubmit={(e)=>{
            submitHandler(e)
          }} className='space-y-6'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className='w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-base'
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className='w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-base'
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className='w-full bg-black text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:bg-gray-800 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'>
              Sign In
            </button>
          </form>

          <p className='text-center mt-6 text-gray-600'>
            New here? <Link to="/signup" className='text-black font-semibold hover:underline'>Create an account</Link>
          </p>
        </div>

        {/* Captain Login Link */}
        <div className='pb-6'>
          <div className='relative my-8'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-4 bg-white text-gray-500'>or</span>
            </div>
          </div>

          <Link
            to='/captain-login'
            className='flex items-center justify-center bg-emerald-500 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:bg-emerald-600 shadow-lg'>
            <i className="ri-steering-2-fill mr-2 text-xl"></i>
            Sign in as Captain
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UserLogin
