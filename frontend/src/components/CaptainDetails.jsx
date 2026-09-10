import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainDetails = ({ currentRideFare }) => {
    const { captain } = useContext(CaptainDataContext)
    const [stats, setStats] = useState(null)

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/stats`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then((response) => setStats(response.data)).catch((error) => {
            console.error('Captain stats error:', error)
        })
    }, [])

    return (
        <div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start gap-3'>
                    <img
                        className='h-12 w-12 rounded-full object-cover border-2 border-gray-300'
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop"
                        alt="Captain"
                    />
                    <div>
                        <h4 className='text-lg font-medium capitalize'>
                            {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                        </h4>
                        <p className='text-xs text-gray-500 capitalize'>
                            {captain?.vehicle?.vehicleType} • {captain?.vehicle?.plate}
                        </p>
                    </div>
                </div>
                <div>
                    <h4 className='text-xl font-semibold'>₹{stats?.earnings ?? 0}</h4>
                    <p className='text-xs text-gray-500 text-right'>Total earnings</p>
                    {currentRideFare && (
                        <p className='text-xs text-gray-500 text-right'>Current ride: ₹{currentRideFare}</p>
                    )}
                </div>
            </div>

            <div className='flex p-4 mt-6 bg-gray-100 rounded-xl justify-center gap-5 items-start'>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
                    <h5 className='text-lg font-medium'>{stats?.drivingHours ?? 0}</h5>
                    <p className='text-xs text-gray-600'>Driving Hours</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-speed-up-line"></i>
                    <h5 className='text-lg font-medium'>{stats?.distanceKm ?? 0} KM</h5>
                    <p className='text-xs text-gray-600'>Distance Covered</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
                    <h5 className='text-lg font-medium'>{stats?.totalTrips ?? 0}</h5>
                    <p className='text-xs text-gray-600'>Total Trips</p>
                </div>
            </div>
        </div>
    )
}

export default CaptainDetails
