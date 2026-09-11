import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CaptainContext'

const Captainlogin = () => {

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const { captain, setCaptain } = React.useContext(CaptainDataContext)
  const navigate = useNavigate()



  const submitHandler = async (e) => {
    e.preventDefault();
    const captain = {
      email: email,
      password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captain)

    if (response.status === 200) {
      const data = response.data

      setCaptain(data.captain)
      localStorage.setItem('token', data.token)
      navigate('/captain-home')

    }

    setEmail('')
    setPassword('')
  }
  return (
    <div className='min-h-screen bg-gradient-to-b from-emerald-50 to-white'>
      <div className='p-6 flex flex-col min-h-screen justify-between max-w-md mx-auto'>
        <div className='flex-1'>
          {/* Logo */}
          <div className='pt-4 pb-8'>
            <img className='w-40 h-24' src="/echoride-logo1.png" alt="" />
          </div>

          {/* Header */}
          <div className='mb-8'>
            <div className='flex items-center gap-2 mb-2'>
              <i className="ri-steering-2-fill text-3xl text-emerald-600"></i>
              <h1 className='text-3xl font-bold text-gray-900'>Captain Login</h1>
            </div>
            <p className='text-gray-600'>Sign in to start accepting rides</p>
          </div>

          {/* Form */}
          <form onSubmit={(e) => {
            submitHandler(e)
          }} className='space-y-6'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Email Address
              </label>
              <input
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                className='w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-base'
                type="email"
                placeholder='email@example.com'
              />
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Password
              </label>
              <input
                className='w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-base'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
                required
                type="password"
                placeholder='Enter your password'
              />
            </div>

            <button
              className='w-full bg-emerald-500 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:bg-emerald-600 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
            >Sign In as Captain</button>

          </form>

          <p className='text-center mt-6 text-gray-600'>
            Join our fleet? <Link to='/captain-signup' className='text-emerald-600 font-semibold hover:underline'>Register as Captain</Link>
          </p>
        </div>

        {/* User Login Link */}
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
            to='/login'
            className='flex items-center justify-center bg-gray-900 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:bg-gray-800 shadow-lg'
          >
            <i className="ri-user-line mr-2 text-xl"></i>
            Sign in as User
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Captainlogin