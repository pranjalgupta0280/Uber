import React from 'react'

const WaitingForDriver = ({ status, ride, onClose }) => {
  const renderContent = () => {
    if (status === 'accepted') {
      return (
        <>
          <div className='mb-4'>
            <h3 className='text-2xl font-semibold'>Driver accepted your ride</h3>
            <p className='text-sm text-gray-600 mt-2'>Share this OTP with your driver when they arrive.</p>
          </div>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-lg font-medium'>{ride?.captain?.name || 'Driver'}</h2>
              <p className='text-sm text-gray-600'>{ride?.captain?.vehicle || ''} · {ride?.captain?.plate || ''}</p>
            </div>
            <div className='rounded-xl bg-black px-4 py-3 text-white text-sm font-semibold'>OTP {ride?.otp ?? '----'}</div>
          </div>
        </>
      )
    }

    if (status === 'started') {
      return (
        <>
          <div className='mb-4'>
            <h3 className='text-2xl font-semibold'>Ride started</h3>
            <p className='text-sm text-gray-600 mt-2'>Your driver is on the way.</p>
          </div>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-lg font-medium'>{ride?.captain?.name || 'Driver'}</h2>
              <p className='text-sm text-gray-600'>{ride?.captain?.vehicle || ''} · {ride?.captain?.plate || ''}</p>
            </div>
            <div className='rounded-xl bg-emerald-100 px-4 py-3 text-emerald-800 text-sm font-semibold'>In progress</div>
          </div>
        </>
      )
    }

    return (
      <>
        <div className='mb-4'>
          <h3 className='text-2xl font-semibold'>Waiting for driver</h3>
          <p className='text-sm text-gray-600 mt-2'>Searching for the nearest available captain.</p>
        </div>
      </>
    )
  }

  return (
    <div>
      <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => onClose(false)}>
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      {renderContent()}

      <div className='flex gap-2 justify-between flex-col items-center'>
        <div className='w-full mt-5'>
          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>{ride?.pickup?.split(',')[0] || 'Pickup location'}</h3>
              <p className='text-sm -mt-1 text-gray-600'>{ride?.pickup?.split(',').slice(1).join(',') || '...'}</p>
            </div>
          </div>
          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>{ride?.destination?.split(',')[0] || 'Destination'}</h3>
              <p className='text-sm -mt-1 text-gray-600'>{ride?.destination?.split(',').slice(1).join(',') || '...'}</p>
            </div>
          </div>
          <div className='flex items-center gap-5 p-3'>
            <i className="ri-currency-line"></i>
            <div>
              <h3 className='text-lg font-medium'>Rs. {ride?.fare ?? '0.00'}</h3>
              <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaitingForDriver
