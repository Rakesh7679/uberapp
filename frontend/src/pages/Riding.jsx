import React, { useEffect, useContext, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import LiveMap from '../components/LiveMap'
import axios from 'axios'

const Riding = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { socket } = useContext(SocketContext)
    const ride = location.state?.ride
    const [currentLocation, setCurrentLocation] = useState(null)
    const [captainLocation, setCaptainLocation] = useState(null)
    const [rideEnded, setRideEnded] = useState(false)
    const completionPollRef = useRef(null)

    const finishUserRide = () => {
        if (rideEnded) return
        setRideEnded(true)
        clearInterval(completionPollRef.current)
        window.setTimeout(() => navigate('/home'), 1800)
    }

    useEffect(() => {
        if (!navigator.geolocation) return

        const updateLocation = ({ coords }) => {
            const nextLocation = { lat: coords.latitude, lng: coords.longitude }
            setCurrentLocation(nextLocation)
            socket.emit('update-location-user', { userId: ride?.user?._id, rideId: ride?._id, location: nextLocation })
        }
        const watchId = navigator.geolocation.watchPosition(updateLocation, () => {}, { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 })
        return () => navigator.geolocation.clearWatch(watchId)
    }, [ride?._id, ride?.user?._id, socket])

    useEffect(() => {
        const handleCaptainLocation = (nextLocation) => setCaptainLocation(nextLocation)
        socket.on('captain-location', handleCaptainLocation)
        return () => socket.off('captain-location', handleCaptainLocation)
    }, [socket])

    useEffect(() => {
        const handleRideEnded = () => {
            finishUserRide()
        }

        socket.on('ride-ended', handleRideEnded)
        return () => socket.off('ride-ended', handleRideEnded)
    }, [socket, navigate])

    useEffect(() => {
        if (!ride?._id) return

        completionPollRef.current = setInterval(async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/rides/status/${ride._id}`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                )
                if (response.data.status === 'completed') finishUserRide()
            } catch {
            }
        }, 2000)

        return () => clearInterval(completionPollRef.current)
    }, [ride?._id])

    return (
        <div className='h-screen'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img className='w-16' src="/echoride-logo1.png" alt="Logo" />
                <div className='h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-user-line"></i>
                </div>
            </div>
            <div className='h-1/2'>
                <LiveMap
                    pickup={ride?.pickup}
                    destination={ride?.destination}
                    currentLocation={currentLocation}
                    otherLocation={captainLocation}
                />
            </div>
            <div className='h-1/2 p-4'>
                <div className='flex items-center justify-between'>
                    <img className='h-16' src="https://i.pinimg.com/originals/93/c1/05/93c105244c0a3de81267a89cb13386f7.png" alt="Car" />
                    <div className='text-right'>
                        <h2 className='text-lg font-semibold'>Driver Name</h2>
                        <h4 className='text-xl font-bold -mt-1 -mb-1'>MP04 AB 1234</h4>
                        <p className='text-xs text-gray-500'>White Sedan</p>
                    </div>
                </div>

                <div className='flex flex-col gap-2 justify-between items-center mt-5'>
                    <div className='w-full'>
                        <div className='flex items-center gap-5 p-3 border-b-2 border-gray-200'>
                            <i className="text-lg ri-map-pin-2-fill text-gray-700"></i>
                            <div>
                                <h3 className='text-lg font-medium'>Destination</h3>
                                <p className='text-sm -mt-1 text-gray-600'>{ride?.destination || 'Your destination address'}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-5 p-3'>
                            <i className="ri-currency-line text-lg text-gray-700"></i>
                            <div>
                                <h3 className='text-lg font-medium'>₹{ride?.fare || 0}</h3>
                                <p className='text-sm -mt-1 text-gray-600'>Cash Payment</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`mt-6 p-4 rounded-lg flex items-center justify-center ${rideEnded ? 'bg-blue-50 border border-blue-300' : 'bg-green-50 border border-green-300'}`}>
                    <div className='flex items-center gap-3'>
                        <i className={`${rideEnded ? 'ri-checkbox-circle-line text-blue-700' : 'ri-car-line text-green-700 animate-pulse'} text-2xl`}></i>
                        <p className={`${rideEnded ? 'text-blue-800' : 'text-green-800'} font-medium`}>
                            {rideEnded ? 'Ride completed. Returning home...' : 'Your ride is in progress'}
                        </p>
                    </div>
                </div>

                <button disabled={rideEnded} className='w-full mt-5 bg-green-600 text-white font-semibold p-3 rounded-lg disabled:opacity-50'>
                    Contact Driver
                </button>
            </div>
        </div>
    )
}

export default Riding
