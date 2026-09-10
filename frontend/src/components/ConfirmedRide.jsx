import React from 'react'

const ConfirmedRide = (props) => {
    const vehicleImages = {
        car: 'https://i.pinimg.com/originals/93/c1/05/93c105244c0a3de81267a89cb13386f7.png',
        moto: 'https://assets.entrepreneur.com/content/3x2/2000/1677656152-ANGEL1.png',
        auto: 'https://clipart-library.com/2023/Uber_Auto_312x208_pixels_Mobile.png'
    }

    return (
        <div>
            <h5
                className='p-1 text-center w-full cursor-pointer text-gray-400 hover:text-black'
                onClick={() => {
                    props.setConfirmRidePanel(false)
                }}
            >
                <i className="text-3xl ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className='text-2xl font-semibold mb-4'>Confirm your Ride</h3>

            <div className='flex gap-2 justify-between flex-col items-center'>
                <img
                    className='h-24 object-contain mb-2'
                    src={vehicleImages[props.selectedVehicle] || vehicleImages.car}
                    alt={props.selectedVehicle}
                />
                <div className='w-full mt-2'>
                    <div className='flex items-center gap-5 p-3 border-b-2 border-gray-200'>
                        <i className="ri-map-pin-user-fill text-lg text-gray-700"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Pickup</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.pickup || 'Select pickup location'}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2 border-gray-200'>
                        <i className="text-lg ri-map-pin-2-fill text-gray-700"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Destination</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.destination || 'Select destination'}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line text-lg text-gray-700"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{props.fare?.[props.selectedVehicle] || '0'}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash Payment</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => {
                        props.setVehicleFound(true)
                        props.setConfirmRidePanel(false)
                        props.createRide()
                    }}
                    className='mt-5 mb-4 flex min-h-14 w-full shrink-0 items-center justify-center rounded-lg bg-green-600 px-4 py-4 font-semibold text-white shadow-lg transition-all hover:bg-green-700'
                >
                    Confirm Ride
                </button>
            </div>
        </div>
    )
}

export default ConfirmedRide
