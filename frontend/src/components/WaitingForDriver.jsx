import React from 'react'

const WaitingForDriver = (props) => {
    const vehicleImages = {
        car: 'https://i.pinimg.com/originals/93/c1/05/93c105244c0a3de81267a89cb13386f7.png',
        moto: 'https://assets.entrepreneur.com/content/3x2/2000/1677656152-ANGEL1.png',
        auto: 'https://clipart-library.com/2023/Uber_Auto_312x208_pixels_Mobile.png'
    }

    const captain = props.ride?.captain || {}
    const vehicleType = captain.vehicle?.vehicleType || props.selectedVehicle || 'car'

    return (
        <div>
            <h5
                className='p-1 text-center w-full cursor-pointer text-gray-400 hover:text-black'
                onClick={() => {
                    props.setWaitingForDriver(false)
                }}
            >
                <i className="text-3xl ri-arrow-down-wide-line"></i>
            </h5>

            <div className='flex items-center justify-between border-b pb-4 mb-3'>
                <img
                    className='h-16 object-contain'
                    src={vehicleImages[vehicleType] || vehicleImages.car}
                    alt={vehicleType}
                />
                <div className='text-right'>
                    <h2 className='text-lg font-semibold capitalize'>
                        {captain.fullname?.firstname} {captain.fullname?.lastname}
                    </h2>
                    <h4 className='text-xl font-bold -mt-1 -mb-1 tracking-wider'>
                        {captain.vehicle?.plate || 'WB 12 AB 1234'}
                    </h4>
                    <p className='text-xs text-gray-500 capitalize'>
                        {captain.vehicle?.color} {vehicleType}
                    </p>
                </div>
            </div>

            <div className='bg-yellow-100 border border-yellow-300 p-3 rounded-xl flex items-center justify-between my-2'>
                <div>
                    <span className='text-xs font-semibold text-yellow-800 uppercase tracking-wide'>Share OTP with driver</span>
                    <h3 className='text-2xl font-bold tracking-widest text-gray-900'>{props.ride?.otp || '------'}</h3>
                </div>
                <i className="ri-shield-keyhole-line text-3xl text-yellow-700"></i>
            </div>

            <div className='w-full mt-2'>
                <div className='flex items-center gap-5 p-3 border-b-2 border-gray-200'>
                    <i className="ri-map-pin-user-fill text-lg text-gray-700"></i>
                    <div>
                        <h3 className='text-lg font-medium'>Pickup</h3>
                        <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup || props.pickup}</p>
                    </div>
                </div>
                <div className='flex items-center gap-5 p-3 border-b-2 border-gray-200'>
                    <i className="text-lg ri-map-pin-2-fill text-gray-700"></i>
                    <div>
                        <h3 className='text-lg font-medium'>Destination</h3>
                        <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination || props.destination}</p>
                    </div>
                </div>
                <div className='flex items-center gap-5 p-3'>
                    <i className="ri-currency-line text-lg text-gray-700"></i>
                    <div>
                        <h3 className='text-lg font-medium'>₹{props.ride?.fare || props.fare?.[props.selectedVehicle] || '0'}</h3>
                        <p className='text-sm -mt-1 text-gray-600'>Cash Payment</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WaitingForDriver
