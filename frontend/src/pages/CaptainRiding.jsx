import React, { useRef, useState, useEffect, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import LiveMap from '../components/LiveMap'
import { SocketContext } from '../context/SocketContext'

const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false)
    const finishRidePanelRef = useRef(null)
    const location = useLocation()
    const ride = location.state?.ride
    const [currentLocation, setCurrentLocation] = useState(null)
    const [userLocation, setUserLocation] = useState(null)
    const { socket } = useContext(SocketContext)

    useEffect(() => {
        if (!navigator.geolocation) return

        const updateCurrentLocation = ({ coords }) => {
            const nextLocation = { lat: coords.latitude, lng: coords.longitude }
            setCurrentLocation(nextLocation)
            socket.emit('update-location-captain', { userId: ride?.captain?._id, rideId: ride?._id, location: nextLocation })
        }

        const watchId = navigator.geolocation.watchPosition(updateCurrentLocation, (error) => {
            console.error('Captain location error:', error.message)
        }, { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 })

        return () => navigator.geolocation.clearWatch(watchId)
    }, [ride?._id, ride?.captain?._id, socket])

    useEffect(() => {
        const handleUserLocation = (nextLocation) => setUserLocation(nextLocation)
        socket.on('user-location', handleUserLocation)
        return () => socket.off('user-location', handleUserLocation)
    }, [socket])

    useGSAP(() => {
        if (finishRidePanel) {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [finishRidePanel])

    return (
        <div className='h-screen relative flex flex-col justify-end'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
                <Link to='/captain-home' className='h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>

            <div className='h-4/5 p-4 md:absolute md:right-0 md:top-16 md:h-[calc(100vh-4rem)] md:w-[calc(100%-400px)] md:p-8'>
                <div className='h-full w-full overflow-hidden rounded-2xl border border-gray-200 shadow-sm'>
                    <LiveMap
                        pickup={ride?.pickup}
                        destination={ride?.destination}
                        currentLocation={currentLocation}
                        otherLocation={userLocation}
                        requireCurrentLocation
                    />
                </div>
            </div>

            <div className='h-1/5 p-6 bg-yellow-400 flex items-center justify-between relative' onClick={() => {
                setFinishRidePanel(true)
            }}>
                <h5 className='p-1 text-center w-[95%] absolute top-0 left-1/2 -translate-x-1/2'>
                    <i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i>
                </h5>
                <h4 className='text-xl font-semibold'>4 KM away</h4>
                <button className='bg-green-600 text-white font-semibold p-3 px-10 rounded-lg'>
                    Complete Ride
                </button>
            </div>

            <div ref={finishRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <FinishRide
                    ride={ride}
                    setFinishRidePanel={setFinishRidePanel}
                />
            </div>
        </div>
    )
}

export default CaptainRiding
