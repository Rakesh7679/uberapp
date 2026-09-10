import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CaptainSignup = () => {

  const navigate = useNavigate()

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')

  const [ vehicleColor, setVehicleColor ] = useState('')
  const [ vehiclePlate, setVehiclePlate ] = useState('')
  const [ vehicleCapacity, setVehicleCapacity ] = useState('')
  const [ vehicleType, setVehicleType ] = useState('')


  const { captain, setCaptain } = React.useContext(CaptainDataContext)


  const submitHandler = async (e) => {
    e.preventDefault()
    const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType
      }
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData)

    if (response.status === 201) {
      const data = response.data
      setCaptain(data.captain)
      localStorage.setItem('token', data.token)
      navigate('/captain-home')
    }

    setEmail('')
    setFirstName('')
    setLastName('')
    setPassword('')
    setVehicleColor('')
    setVehiclePlate('')
    setVehicleCapacity('')
    setVehicleType('')

  }
  return (
    <div className='min-h-screen bg-gradient-to-b from-emerald-50 to-white overflow-y-auto'>
      <div className='p-6 flex flex-col min-h-screen justify-between max-w-md mx-auto'>
        <div className='flex-1'>
          {/* Logo */}
          <div className='pt-4 pb-6'>
            <img className='w-40 h-24' src="/echoride-logo1.png" alt="" />
          </div>

          {/* Header */}
          <div className='mb-8'>
            <div className='flex items-center gap-2 mb-2'>
              <i className="ri-steering-2-fill text-3xl text-emerald-600"></i>
              <h1 className='text-3xl font-bold text-gray-900'>Become a Captain</h1>
            </div>
            <p className='text-gray-600'>Join our fleet and start earning</p>
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
                  className='flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-base'
                  type="text"
                  placeholder='First name'
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value)
                  }}
                />
                <input
                  required
                  className='flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-base'
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
                placeholder='Create a strong password'
              />
            </div>

            <div className='pt-4'>
              <label className='block text-sm font-semibold text-gray-700 mb-3'>
                <i className="ri-car-line mr-1"></i>
                Vehicle Information
              </label>
              <div className='space-y-3'>
                <div className='flex gap-3'>
                  <input
                    required
                    className='flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-base'
                    type="text"
                    placeholder='Color'
                    value={vehicleColor}
                    onChange={(e) => {
                      setVehicleColor(e.target.value)
                    }}
                  />
                  <input
                    required
                    className='flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-base'
                    type="text"
                    placeholder='Plate Number'
                    value={vehiclePlate}
                    onChange={(e) => {
                      setVehiclePlate(e.target.value)
                    }}
                  />
                </div>
                <div className='flex gap-3'>
                  <input
                    required
                    className='flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-base'
                    type="number"
                    placeholder='Capacity'
                    value={vehicleCapacity}
                    onChange={(e) => {
                      setVehicleCapacity(e.target.value)
                    }}
                  />
                  <select
                    required
                    className='flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-base'
                    value={vehicleType}
                    onChange={(e) => {
                      setVehicleType(e.target.value)
                    }}
                  >
                    <option value="" disabled>Vehicle Type</option>
                    <option value="car">🚗 Car</option>
                    <option value="auto">🛺 Auto</option>
                    <option value="moto">🏍️ Moto</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              className='w-full bg-emerald-500 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:bg-emerald-600 shadow-lg hover:shadow-xl transform hover:scale-[1.02] mt-6'
            >Join as Captain</button>

          </form>

          <p className='text-center mt-6 text-gray-600'>
            Already a captain? <Link to='/captain-login' className='text-emerald-600 font-semibold hover:underline'>Sign in</Link>
          </p>
        </div>

        <div className='pb-6 pt-8'>
          <p className='text-xs text-gray-500 text-center leading-relaxed'>
            By continuing, you agree to our <span className='underline cursor-pointer'>Terms of Service</span> and <span className='underline cursor-pointer'>Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default CaptainSignup