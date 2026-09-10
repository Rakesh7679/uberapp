import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ConfirmRidePopUp = (props) => {
    const [otp, setOtp] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const user = props.ride?.user || {}

    const submitHandler = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
                params: {
                    rideId: props.ride._id,
                    otp: otp
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.status === 200) {
                props.setConfirmRidePopupPanel(false)
                props.setRidePopupPanel(false)
                navigate('/captain-riding', { state: { ride: response.data } })
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.')
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
                        props.setConfirmRidePopupPanel(false)
                    }}
                >
                    <i className="text-3xl ri-arrow-down-wide-line"></i>
                </h5>
                <h3 className='text-2xl font-semibold mb-3'>Confirm this ride to Start</h3>

                <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-2'>
                    <div className='flex items-center gap-3'>
                        <img
                            className='h-12 w-12 rounded-full object-cover'
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop"
                            alt="User"
                        />
                        <h2 className='text-lg font-medium capitalize'>
                            {user.fullname?.firstname} {user.fullname?.lastname}
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
                <form onSubmit={submitHandler}>
                    <input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        type="text"
                        maxLength={6}
                        className='bg-[#eee] px-6 py-4 font-mono text-lg rounded-lg w-full mt-3 text-center tracking-widest'
                        placeholder='Enter 6-digit OTP'
                        required
                    />

                    {error && (
                        <p className='text-red-500 text-sm mt-2 text-center font-medium'>{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className='w-full mt-5 text-lg flex justify-center items-center bg-green-600 text-white font-semibold p-3 rounded-lg hover:bg-green-700 transition-all'
                    >
                        {loading ? 'Verifying...' : 'Confirm & Start Ride'}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            props.setConfirmRidePopupPanel(false)
                            props.setRidePopupPanel(false)
                        }}
                        className='w-full mt-2 bg-red-600 text-lg text-white font-semibold p-3 rounded-lg hover:bg-red-700 transition-all'
                    >
                        Cancel Ride
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ConfirmRidePopUp
