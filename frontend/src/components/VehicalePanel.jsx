import React from 'react'

const VehicalePanel = (props) => {
    return (
        <div>
            <h5
                className='p-1 text-center w-full cursor-pointer text-gray-400 hover:text-black'
                onClick={() => {
                    props.setVehiclePanel(false)
                }}
            >
                <i className="text-3xl ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className='text-2xl font-semibold mb-4'>Choose a Vehicle</h3>

            <div
                onClick={() => {
                    props.setConfirmRidePanel(true)
                    props.selectVehicle('car')
                }}
                className={`flex w-full justify-between mb-3 p-3 items-center border-2 rounded-xl cursor-pointer transition-all ${
                    props.selectedVehicle === 'car' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                }`}
            >
                <img className='h-12' src="https://i.pinimg.com/originals/93/c1/05/93c105244c0a3de81267a89cb13386f7.png" alt="Car" />
                <div className='w-1/2 ml-2'>
                    <h4 className='font-medium text-base'>Echo Car <span><i className="ri-user-3-fill"></i> 4</span></h4>
                    <h5 className='font-medium text-sm text-gray-600'>2 mins away</h5>
                    <p className='font-normal text-xs text-gray-500'>Affordable, compact rides</p>
                </div>
                <h2 className='text-lg font-semibold'>₹{props.fare?.car || 193}</h2>
            </div>

            <div
                onClick={() => {
                    props.setConfirmRidePanel(true)
                    props.selectVehicle('moto')
                }}
                className={`flex w-full justify-between mb-3 p-3 items-center border-2 rounded-xl cursor-pointer transition-all ${
                    props.selectedVehicle === 'moto' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                }`}
            >
                <img className='h-12' src="https://assets.entrepreneur.com/content/3x2/2000/1677656152-ANGEL1.png" alt="Moto" />
                <div className='w-1/2 ml-2'>
                    <h4 className='font-medium text-base'>Echo Moto <span><i className="ri-user-3-fill"></i> 1</span></h4>
                    <h5 className='font-medium text-sm text-gray-600'>3 mins away</h5>
                    <p className='font-normal text-xs text-gray-500'>Affordable motorcycle rides</p>
                </div>
                <h2 className='text-lg font-semibold'>₹{props.fare?.moto || 65}</h2>
            </div>

            <div
                onClick={() => {
                    props.setConfirmRidePanel(true)
                    props.selectVehicle('auto')
                }}
                className={`flex w-full justify-between mb-3 p-3 items-center border-2 rounded-xl cursor-pointer transition-all ${
                    props.selectedVehicle === 'auto' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                }`}
            >
                <img className='h-12' src="https://clipart-library.com/2023/Uber_Auto_312x208_pixels_Mobile.png" alt="Auto" />
                <div className='w-1/2 ml-2'>
                    <h4 className='font-medium text-base'>Echo Auto <span><i className="ri-user-3-fill"></i> 3</span></h4>
                    <h5 className='font-medium text-sm text-gray-600'>2 mins away</h5>
                    <p className='font-normal text-xs text-gray-500'>Affordable auto rickshaw</p>
                </div>
                <h2 className='text-lg font-semibold'>₹{props.fare?.auto || 118}</h2>
            </div>
        </div>
    )
}

export default VehicalePanel
