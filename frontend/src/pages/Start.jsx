import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div className='relative h-screen w-full overflow-hidden'>
      {/* Background with overlay */}
      <div className='absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black'>
        <div className='absolute inset-0 bg-[url(https://images.unsplash.com/photo-1624724126923-e2c021df1311?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRyYWZmaWMlMjBsaWdodHxlbnwwfHwwfHx8MA%3D%3D)] bg-cover bg-center opacity-40'></div>
      </div>

      {/* Content */}
      <div className='relative z-10 h-full flex flex-col justify-between p-8'>
        {/* Logo */}
        <div className='pt-4'>
          <img src="/echoride-logo1.png" alt="EchoRide Logo" className="w-48 h-28 drop-shadow-2xl" />
        </div>

        {/* Bottom content */}
        <div className='space-y-6 pb-8'>
          <div className='space-y-3'>
            <h1 className='text-4xl md:text-5xl font-bold text-white leading-tight'>
              Your ride,<br />on demand
            </h1>
            <p className='text-gray-300 text-lg'>
              Safe, reliable rides at the tap of a button
            </p>
          </div>

          <div className='space-y-3'>
            <Link
              to='/login'
              className='flex items-center justify-center w-full bg-white text-black font-semibold py-4 rounded-xl transition-all duration-300 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'>
              Get Started
            </Link>

            <Link
              to='/captain-login'
              className='flex items-center justify-center w-full bg-transparent border-2 border-white text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:bg-white hover:text-black'>
              Drive with Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Start
