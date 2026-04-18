import React from 'react'

const WaitingForDriver = ({ status, ride, onClose }) => {
  const renderContent = () => {
    if (status === 'accepted') {
      return (
        <>
          <div className='flex items-center justify-between mt-4'>
            <img className='h-12' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="Vehicle" />
            <div className='text-right'>
              <h2 className='text-lg font-medium capitalize'>{ride?.captain?.name || 'Driver'}</h2>
              <h4 className='text-xl font-semibold -mt-1 -mb-1'>{ride?.captain?.plate || 'AB 12 CD 3456'}</h4>
              <p className='text-sm text-gray-600'>{ride?.captain?.vehicle || 'Car'}</p>
            </div>
          </div>
          <div className='flex flex-col items-center justify-center my-5 p-4 bg-gray-100 rounded-xl border-2 border-gray-200'>
            <p className='text-gray-600 font-medium mb-1'>Share this OTP with your driver</p>
            <h3 className='text-4xl font-bold tracking-[0.5em] text-green-600'>{ride?.otp ?? '----'}</h3>
          </div>
        </>
      )
    }

    if (status === 'started') {
      return (
        <>
          <div className='flex items-center justify-between mt-4 mb-5'>
            <img className='h-12' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="Vehicle" />
            <div className='text-right'>
              <h2 className='text-lg font-medium capitalize'>{ride?.captain?.name || 'Driver'}</h2>
              <h4 className='text-xl font-semibold -mt-1 -mb-1'>{ride?.captain?.plate || 'AB 12 CD 3456'}</h4>
              <p className='text-sm text-gray-600'>{ride?.captain?.vehicle || 'Car'}</p>
            </div>
          </div>
          <div className='w-full flex justify-center mb-5'>
            <div className='rounded-xl bg-emerald-100 px-6 py-2 text-emerald-800 text-lg font-semibold w-full text-center'>Ride in progress</div>
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
