import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

const FinishRide = (props) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [loading, setLoading] = useState(false)

    const endRide = async () => {
        setLoading(true)
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
                {
                    rideId: props.ride._id
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )

            if (response.status === 200) {
                navigate('/captain-home')
            }
        } catch (error) {
            console.error('Error ending ride:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='h-full flex flex-col justify-between overflow-y-auto'>
            <div>
                <h5
                    className='p-1 text-center w-full cursor-pointer text-gray-400 hover:text-black'
                    onClick={() => {
                        props.setFinishRidePanel(false)
                    }}
                >
                    <i className="text-3xl ri-arrow-down-wide-line"></i>
                </h5>
                <h3 className='text-2xl font-semibold mb-3'>Finish this Ride</h3>

                <div className='flex items-center justify-between p-3 border-2 border-yellow-400 bg-yellow-50 rounded-lg mt-2'>
                    <div className='flex items-center gap-3'>
                        <img
                            className='h-12 w-12 rounded-full object-cover'
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop"
                            alt="User"
                        />
                        <h2 className='text-lg font-medium capitalize'>
                            {props.ride?.user?.fullname?.firstname} {props.ride?.user?.fullname?.lastname}
                        </h2>
                    </div>
                    <h5 className='text-lg font-semibold'>2.2 KM</h5>
                </div>

                <div className='w-full mt-3'>
                    <div className='flex items-center gap-5 p-3 border-b-2 border-gray-200'>
                        <i className="ri-map-pin-user-fill text-lg text-gray-700"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Pickup</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2 border-gray-200'>
                        <i className="text-lg ri-map-pin-2-fill text-gray-700"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Destination</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line text-lg text-gray-700"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{props.ride?.fare}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash Payment</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='mt-6 mb-4'>
                <button
                    onClick={endRide}
                    disabled={loading}
                    className='w-full flex justify-center bg-green-600 text-white font-semibold p-4 rounded-lg text-lg hover:bg-green-700 transition-all'
                >
                    {loading ? 'Finishing...' : 'Finish Ride'}
                </button>

                <p className='text-xs text-red-600 mt-8 text-center'>
                    Click to confirm once passenger has reached destination and has paid.
                </p>
            </div>
        </div>
    )
}

export default FinishRide
