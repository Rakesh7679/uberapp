import React from 'react'

const LocationSearchPanel = ({ suggestions = [], setPickup, setDestination, activeField, setPanelOpen, setVehiclePanelOpen }) => {

    const handleSuggestionClick = (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion.description || suggestion)
        } else if (activeField === 'destination') {
            setDestination(suggestion.description || suggestion)
        }
        setPanelOpen(false)
    }

    return (
        <div className='p-3'>
            {suggestions.length === 0 ? (
                <div className='text-gray-400 text-center py-6'>
                    <i className="ri-map-pin-line text-3xl mb-2 block"></i>
                    <p>Type to search locations</p>
                </div>
            ) : (
                suggestions.map((elem, idx) => (
                    <div
                        key={idx}
                        onClick={() => handleSuggestionClick(elem)}
                        className='flex gap-4 border-2 p-3 border-gray-100 hover:border-black active:border-black rounded-xl items-center my-2 justify-start cursor-pointer transition-all'
                    >
                        <h2 className='bg-[#eee] h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full text-lg text-gray-700'>
                            <i className="ri-map-pin-2-fill"></i>
                        </h2>
                        <h4 className='font-medium text-sm text-gray-800 line-clamp-2'>
                            {elem.description || elem}
                        </h4>
                    </div>
                ))
            )}
        </div>
    )
}

export default LocationSearchPanel
