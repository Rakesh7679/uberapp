import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div className='flex'>
      <div className='bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1624724126923-e2c021df1311?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRyYWZmaWMlMjBsaWdodHxlbnwwfHwwfHx8MA%3D%3D)] h-screen flex justify-between pt-1  flex-col w-full '>
        <img src="/echoride-logo.svg" alt="EchoDrive Logo" className="w-50 h-32 " />
        <div className='bg-white pb-7 py-5 px-5'>
            <h2 className='text-2xl font-bold'>Get Started with EchoDrive</h2>
            <Link to='/login' className=' flex items-center justify-center w-full bg-black py-3 text-white rounded-lg mt-2'>Continue</Link>
        </div>

      </div>
    </div>
  )
}

export default Start
