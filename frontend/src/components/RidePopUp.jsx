import React from 'react'

const RidePopUp = (props) => {
    const user = props.ride?.user || {}

    return (
        <div>
            <h5
                className='p-1 text-center w-full cursor-pointer text-gray-400 hover:text-black'
                onClick={() => {
                    props.setRidePopupPanel(false)
                }}
            >
                <i className="text-3xl ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className='text-2xl font-semibold mb-3'>New Ride Request!</h3>

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

            <div className='flex gap-2 justify-between flex-col items-center mt-3'>
                <div className='w-full'>
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

                <div className='flex w-full items-center justify-between gap-4 mt-4'>
                    <button
                        onClick={() => {
                            props.setRidePopupPanel(false)
                        }}
                        className='w-1/2 bg-gray-300 text-gray-800 font-semibold p-3 px-8 rounded-lg hover:bg-gray-400 transition-all'
                    >
                        Ignore
                    </button>
                    <button
                        onClick={() => {
                            props.confirmRide()
                        }}
                        className='w-1/2 bg-green-600 text-white font-semibold p-3 px-8 rounded-lg hover:bg-green-700 transition-all'
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RidePopUp
