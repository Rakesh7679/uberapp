import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'



const UserSignup = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')
  const [ userData, setUserData ] = useState({})

  const navigate = useNavigate()



  const { user, setUser } = useContext(UserDataContext)




  const submitHandler = async (e) => {
    e.preventDefault()
    
    try {
      const newUser = {
        fullname: {
          firstname: firstName,
          lastname: lastName
        },
        email: email,
        password: password
      }

      console.log('Sending user data:', newUser)
      
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)

      if (response.status === 201) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        navigate('/home')
      }

      setEmail('')
      setFirstName('')
      setLastName('')
      setPassword('')

    } catch (error) {
      console.error('Registration error:', error)
      if (error.response) {
        console.error('Error response:', error.response.data)
        alert(`Error: ${error.response.data.message || error.response.data.error || 'Registration failed'}`)
      } else if (error.request) {
        console.error('Network error:', error.request)
        alert('Network error: Could not connect to server')
      } else {
        console.error('Error:', error.message)
        alert('An unexpected error occurred')
      }
    }
  }
  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white'>
      <div className='p-6 flex flex-col min-h-screen justify-between max-w-md mx-auto'>
        <div className='flex-1'>
          {/* Logo */}
          <div className='pt-4 pb-6'>
            <img src="/echoride-logo1.png" alt="EchoRide Logo" className="w-40 h-24" />
          </div>

          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Create Account</h1>
            <p className='text-gray-600'>Join EchoRide and start your journey</p>
          </div>

          {/* Form */}
          <form onSubmit={(e) => {
            submitHandler(e)
          }} className='space-y-5'>

            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Full Name
              </label>
              <div className='flex gap-3'>
                <input
                  required
                  className='flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-base'
                  type="text"
                  placeholder='First name'
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value)
                  }}
                />
                <input
                  required
                  className='flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-base'
                  type="text"
                  placeholder='Last name'
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value)
                  }}
                />
              </div>
            </div>

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
                className='w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-base'
                type="email"
                placeholder='email@example.com'
              />
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Password
              </label>
              <input
                className='w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-base'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
                required
                type="password"
                placeholder='Create a strong password'
              />
            </div>

            <button
              className='w-full bg-black text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:bg-gray-800 shadow-lg hover:shadow-xl transform hover:scale-[1.02] mt-6'
            >Create Account</button>

          </form>

          <p className='text-center mt-6 text-gray-600'>
            Already have an account? <Link to='/login' className='text-black font-semibold hover:underline'>Sign in</Link>
          </p>
        </div>

        <div className='pb-6'>
          <p className='text-xs text-gray-500 text-center leading-relaxed'>
            By continuing, you agree to our <span className='underline cursor-pointer'>Terms of Service</span> and <span className='underline cursor-pointer'>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserSignup

