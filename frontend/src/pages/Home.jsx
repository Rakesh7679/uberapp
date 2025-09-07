import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <div className='bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1557404763-69708cd8b9ce?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen flex justify-between pt-8  flex-col w-full '>
        <img src="/echoride-logo.svg" alt="EchoRide Logo" className="w-32 h-20 ml-5" />
        <div className='bg-white pb-7 py-5 px-5'>
            <h2 className='text-2xl font-bold'>Get Started with EchoRide</h2>
            <Link to='/login' className=' flex items-center justify-center w-full bg-black py-3 text-white rounded mt-2'>Continue</Link>
        </div>

      </div>
    </div>
  )
}

export default Home
