import React, { useRef, useState, useEffect, useContext } from 'react'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehicalePanel from '../components/VehicalePanel'
import ConfirmedRide from '../components/ConfirmedRide'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'
import LiveMap from '../components/LiveMap'
import { SocketContext } from '../context/SocketContext'
import { UserDataContext } from '../context/UserContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const [vehiclePanel, setVehiclePanel] = useState(false)
  const [confirmRidePanel, setConfirmRidePanel] = useState(false)
  const [vehicleFound, setVehicleFound] = useState(false)
  const [waitingForDriver, setWaitingForDriver] = useState(false)
  const panelRef = useRef(null)
  const panelCloseRef = useRef(null)
  const vehiclePanelRef = useRef(null)
  const confirmRidePanelRef = useRef(null)
  const vehicleFoundRef = useRef(null)
  const waitingForDriverRef = useRef(null)
  const [pickupSuggestions, setPickupSuggestions] = useState([])
  const [destinationSuggestions, setDestinationSuggestions] = useState([])
  const [activeField, setActiveField] = useState(null)
  const [fare, setFare] = useState({})
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [ride, setRide] = useState(null)
  const [isLocating, setIsLocating] = useState(false)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [headerPanel, setHeaderPanel] = useState(null)
  const pickupSearchTimer = useRef(null)
  const destinationSearchTimer = useRef(null)
  const rideStatusPollRef = useRef(null)

  const navigate = useNavigate()
  const { socket } = useContext(SocketContext)
  const { user } = useContext(UserDataContext)

  useEffect(() => {
    const joinUser = () => socket.emit('join', { userType: 'user', userId: user._id })
    socket.on('connect', joinUser)
    if (socket.connected) joinUser()
    return () => socket.off('connect', joinUser)
  }, [socket, user?._id])

  useEffect(() => {
    const handleRideConfirmed = (confirmedRide) => {
      clearInterval(rideStatusPollRef.current)
      setVehicleFound(false)
      setWaitingForDriver(true)
      setRide(confirmedRide)
    }
    const handleRideStarted = (startedRide) => {
      clearInterval(rideStatusPollRef.current)
      setWaitingForDriver(false)
      navigate('/riding', { state: { ride: startedRide } })
    }

    socket.on('ride-confirmed', handleRideConfirmed)
    socket.on('ride-started', handleRideStarted)
    return () => {
      socket.off('ride-confirmed', handleRideConfirmed)
      socket.off('ride-started', handleRideStarted)
    }
  }, [navigate, socket])

  useEffect(() => () => clearInterval(rideStatusPollRef.current), [])

  const handlePickupChange = async (e) => {
    const input = e.target.value
    setPickup(input)
    clearTimeout(pickupSearchTimer.current)
    if (input.trim().length < 3) {
      setPickupSuggestions([])
      return
    }
    pickupSearchTimer.current = setTimeout(async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
          params: { input },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setPickupSuggestions(response.data)
      } catch {
        setPickupSuggestions([])
      }
    }, 700)
  }

  const handleDestinationChange = async (e) => {
    const input = e.target.value
    setDestination(input)
    clearTimeout(destinationSearchTimer.current)
    if (input.trim().length < 3) {
      setDestinationSuggestions([])
      return
    }
    destinationSearchTimer.current = setTimeout(async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
          params: { input },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setDestinationSuggestions(response.data)
      } catch {
        setDestinationSuggestions([])
      }
    }, 700)
  }

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser')
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`
          )
          const data = await response.json()
          setCurrentLocation({ lat: coords.latitude, lng: coords.longitude })
          setPickup(data.display_name || `${coords.latitude}, ${coords.longitude}`)
          setActiveField('pickup')
          setPanelOpen(false)
        } catch (error) {
          setCurrentLocation({ lat: coords.latitude, lng: coords.longitude })
          setPickup(`${coords.latitude}, ${coords.longitude}`)
        } finally {
          setIsLocating(false)
        }
      },
      (error) => {
        setIsLocating(false)
        alert(error.code === 1
          ? 'Location permission is blocked. Allow location access in the browser.'
          : 'Unable to get your current location')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }

  const selectMapDestination = async ({ lat, lng }) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      )
      const data = await response.json()
      setDestination(data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`)
    } catch {
      setDestination(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
    }
    setActiveField('destination')
    setPanelOpen(false)
  }

  const submitHandler = async (e) => {
    e.preventDefault()
  }

  async function findTrip() {
    setVehiclePanel(true)
    setPanelOpen(false)

    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
      params: { pickup, destination },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    setFare(response.data)
  }

  async function createRide() {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
      pickup,
      destination,
      vehicleType: selectedVehicle
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    const createdRide = response.data
    setRide(createdRide)
    clearInterval(rideStatusPollRef.current)
    rideStatusPollRef.current = setInterval(async () => {
      try {
        const statusResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides/status/${createdRide._id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        )
        const updatedRide = statusResponse.data
        if (updatedRide.status === 'accepted') {
          setVehicleFound(false)
          setWaitingForDriver(true)
          setRide(updatedRide)
        } else if (updatedRide.status === 'ongoing') {
          clearInterval(rideStatusPollRef.current)
          navigate('/riding', { state: { ride: updatedRide } })
        }
      } catch {
      }
    }, 2000)
  }

    useGSAP(() => {
      gsap.to(panelRef.current, {
        maxHeight: panelOpen ? '50vh' : '0px',
        duration: 0.5,
        ease: 'power3.out'
      })
      gsap.to(panelCloseRef.current, {
       opacity: panelOpen ? 1 : 0,
      })
    }, [panelOpen,panelCloseRef])

    useGSAP(() => {
      if(vehiclePanel){
        gsap.to(vehiclePanelRef.current, {
          transform: 'translateY(0%)'
        })
      } else {
        gsap.to(vehiclePanelRef.current, {
          transform: 'translateY(100%)'
        })
      }
    }, [vehiclePanel])

     useGSAP(() => {
      if(confirmRidePanel){
        gsap.to(confirmRidePanelRef.current, {
          transform: 'translateY(0%)'
        })
      } else {
        gsap.to(confirmRidePanelRef.current, {
          transform: 'translateY(100%)'
        })
      }
    }, [confirmRidePanel])

    useGSAP(() => {
      if(vehicleFound){
        gsap.to(vehicleFoundRef.current, {
          transform: 'translateY(0%)'
        })
      } else {
        gsap.to(vehicleFoundRef.current, {
          transform: 'translateY(100%)'
        })
      }
    }, [vehicleFound])

    useGSAP(() => {
      if(waitingForDriver){
        gsap.to(waitingForDriverRef.current, {
          transform: 'translateY(0%)'
        })
      } else {
        gsap.to(waitingForDriverRef.current, {
          transform: 'translateY(100%)'
        })
      }
    }, [waitingForDriver])

  return (
    <div className='h-screen relative overflow-hidden bg-white'>
      <header className='absolute top-0 left-0 right-0 z-[600] h-16 flex items-center justify-between bg-white/95 border-b border-gray-200 px-6 md:px-16'>
        <img src="/echoride-logo1.png" className='w-28 h-auto' alt="EchoRide" />
        <nav className='hidden md:flex items-center gap-8 text-sm font-semibold'>
          <button onClick={() => setHeaderPanel(null)} className='border-b-4 border-black py-5'>Ride</button>
          <button onClick={() => setHeaderPanel('rentals')} className='text-gray-500 hover:text-black'>Rentals</button>
          <button onClick={() => setHeaderPanel('parcel')} className='text-gray-500 hover:text-black'>Parcel</button>
        </nav>
        <div className='flex items-center gap-3'>
          <button onClick={() => setHeaderPanel('activity')} className='hidden sm:block rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold'>Activity</button>
          <button onClick={() => navigate('/account')} className='h-10 w-10 rounded-full bg-gray-700 text-white' title='Account'>
            <i className='ri-user-line'></i>
          </button>
        </div>
      </header>

      {headerPanel && (
        <div className='absolute right-6 top-20 z-[700] w-72 rounded-2xl border border-gray-200 bg-white p-5 shadow-xl'>
          <button onClick={() => setHeaderPanel(null)} className='float-right text-gray-500' title='Close'>
            <i className='ri-close-line text-xl'></i>
          </button>
          <h2 className='text-lg font-semibold'>
            {headerPanel === 'activity' && 'Activity'}
            {headerPanel === 'account' && 'Account'}
            {headerPanel === 'rentals' && 'Rentals'}
            {headerPanel === 'parcel' && 'Parcel'}
          </h2>
          <p className='mt-3 text-sm text-gray-600'>
            {headerPanel === 'activity' && 'Your recent rides will appear here.'}
            {headerPanel === 'account' && 'Manage your EchoRide account.'}
            {headerPanel === 'rentals' && 'Vehicle rentals are coming soon.'}
            {headerPanel === 'parcel' && 'Parcel delivery is coming soon.'}
          </p>
          {headerPanel === 'account' && (
            <Link to='/home/users/logout' className='mt-4 block rounded-lg bg-black px-4 py-2 text-center text-sm font-semibold text-white'>
              Log out
            </Link>
          )}
        </div>
      )}

      <div className='absolute right-0 top-16 h-[calc(100vh-4rem)] w-full bg-white p-4 md:w-[calc(100%-400px)] md:p-8'>
        <div className='h-full w-full overflow-hidden rounded-2xl border border-gray-200 shadow-sm'>
          <LiveMap
            pickup={pickup}
            destination={destination}
            currentLocation={currentLocation}
            onMapDoubleClick={selectMapDestination}
          />
        </div>
      </div>

      <div className={`absolute left-6 top-24 z-[500] w-[min(360px,calc(100%-3rem))] md:left-16 ${vehiclePanel || confirmRidePanel || vehicleFound || waitingForDriver ? 'hidden' : ''}`}>

        <div className='p-5 bg-white relative rounded-2xl shadow-xl border border-gray-200'>
          <h4 className='opacity-0 right-6 top-6 absolute text-2xl cursor-pointer' ref={panelCloseRef} onClick={()=>{
            setPanelOpen(false)
          }}>
            <i className="ri-arrow-down-wide-line text-3xl text-gray-400 hover:text-gray-600"></i>
          </h4>
           <h4 className='text-2xl font-bold mb-5'>Get a ride</h4>
           <div className='mb-3 flex items-center gap-3 rounded-lg bg-green-100 px-3 py-2 text-sm text-green-800'>
             <i className='ri-price-tag-3-fill'></i><span>100% off your next ride. Up to ₹50</span>
           </div>
        <form onSubmit={(e)=>{
          submitHandler(e)
        }}>
           <div className="line absolute h-16 w-1 top-[52%] -translate-y-1/2 left-9 bg-gray-400 rounded-full"></div>
          <div className='relative mb-3'>
            <i className="ri-map-pin-fill absolute left-4 top-1/2 -translate-y-1/2 text-xl text-black"></i>
            <input
              onClick={() => {
                setPanelOpen(true)
                setActiveField('pickup')
              }}
              value={pickup}
              onChange={handlePickupChange}
             className='bg-gray-100 pl-12 pr-12 py-3 text-base rounded-xl w-full border-2 border-gray-200 focus:border-black outline-none transition-all' type="text" placeholder='Add a pick-up location' />
            <button
              type='button'
              onClick={useCurrentLocation}
              disabled={isLocating}
              title='Use current location'
              className='absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 disabled:text-gray-400'
            >
              <i className={isLocating ? 'ri-loader-4-line animate-spin text-xl' : 'ri-crosshair-2-line text-xl'}></i>
            </button>
          </div>
          <div className='relative'>
            <i className="ri-map-pin-user-fill absolute left-4 top-1/2 -translate-y-1/2 text-xl text-red-500"></i>
            <input
              onClick={() => {
                setPanelOpen(true)
                setActiveField('destination')
              }}
              value={destination}
              onChange={handleDestinationChange}
             className='bg-gray-100 pl-12 pr-4 py-3 text-base rounded-xl w-full border-2 border-gray-200 focus:border-black outline-none transition-all' type="text" placeholder='Enter your destination' />
          </div>
        </form>
        <button
          onClick={findTrip}
          className='bg-black text-white font-semibold px-4 py-3.5 rounded-xl mt-4 w-full hover:bg-gray-800 transition-all shadow-lg'>
          Find a Ride
        </button>
         </div>

         <div ref={panelRef} className='absolute left-0 top-full mt-2 max-h-0 w-full overflow-y-auto rounded-2xl bg-white shadow-xl'>
          <LocationSearchPanel
            suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
            setPanelOpen={setPanelOpen}
            setVehiclePanelOpen={setVehiclePanel}
            setPickup={setPickup}
            setDestination={setDestination}
            activeField={activeField}
          />
         </div>
      </div>

      <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 bg-white p-3 translate-y-full px-3 py-10 pt-12'>
        <VehicalePanel
          selectVehicle={setSelectedVehicle}
          fare={fare}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanel={setVehiclePanel}
        />
        </div>

         <div ref={confirmRidePanelRef} className='fixed bottom-0 z-10 h-[calc(100dvh-5rem)] max-h-[92vh] w-full overflow-y-auto bg-white p-3 px-3 pb-10 pt-8 translate-y-full md:h-auto md:max-h-[90vh] md:py-10 md:pt-12'>
        <ConfirmedRide
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          selectedVehicle={selectedVehicle}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehicleFound={setVehicleFound}
        />
        </div>

        <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 bg-white p-3 translate-y-full px-3 py-10 pt-12'>
        <LookingForDriver
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          selectedVehicle={selectedVehicle}
          setVehicleFound={setVehicleFound}
        />
        </div>

        <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0 bg-white p-3 translate-y-full px-3 py-8'>
        <WaitingForDriver
          ride={ride}
          setVehicleFound={setVehicleFound}
          setWaitingForDriver={setWaitingForDriver}
          waitingForDriver={waitingForDriver}
        />
        </div>

    </div>
  )
}

export default Home
