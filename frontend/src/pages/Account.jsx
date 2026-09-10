import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'

const Account = () => {
  const { user, setUser } = useContext(UserDataContext)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then((response) => {
      setUser(response.data.user)
    }).catch((error) => {
      console.error('Profile error:', error)
    }).finally(() => setLoading(false))
  }, [setUser])

  const firstName = user?.fullname?.firstname || user?.fullname?.firstName || 'EchoRide'
  const lastName = user?.fullname?.lastname || user?.fullname?.lastName || 'User'

  return (
    <div className='min-h-screen bg-gray-50 text-gray-900'>
      <header className='flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 md:px-16'>
        <Link to='/home' className='text-2xl font-bold'>EchoRide</Link>
        <Link to='/home' className='text-sm font-semibold hover:underline'>Back to Ride</Link>
      </header>
      <main className='mx-auto max-w-2xl px-5 py-10'>
        <h1 className='text-3xl font-bold'>Account</h1>
        <p className='mt-2 text-gray-500'>Manage your EchoRide profile.</p>
        <section className='mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
          <div className='flex items-center gap-4 border-b border-gray-200 pb-6'>
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-gray-800 text-2xl font-semibold text-white'>
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className='text-xl font-semibold'>{loading ? 'Loading...' : `${firstName} ${lastName}`}</h2>
              <p className='text-gray-500'>{user?.email || 'No email available'}</p>
            </div>
          </div>
          <div className='mt-6 grid gap-3 sm:grid-cols-2'>
            <Link to='/home' className='rounded-xl bg-gray-100 px-4 py-3 text-center font-semibold hover:bg-gray-200'>Book a ride</Link>
            <Link to='/home/users/logout' className='rounded-xl bg-black px-4 py-3 text-center font-semibold text-white hover:bg-gray-800'>Log out</Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Account