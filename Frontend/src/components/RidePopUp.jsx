import React from 'react'

const RidePopUp = ({ rideRequest, socket, setRidePopupPanel, setConfirmRidePopupPanel }) => {
  const handleAccept = () => {
    if (!rideRequest) return;
    socket.emit('acceptRide', {
      rideId: rideRequest.rideId,
      captainId: rideRequest.captainId
    });
    setRidePopupPanel(false)
    setConfirmRidePopupPanel(true);
  };

  const handleReject = () => {
    if (rideRequest) {
      socket.emit('rejectRide', {
        rideId: rideRequest.rideId,
        captainId: rideRequest.captainId
      });
    }
    setRidePopupPanel(false);
  };

  return (
    <div>
      <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
        setRidePopupPanel(false)
      }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
      <h3 className='text-2xl font-semibold mb-5'>New Ride Available!</h3>

      <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4'>
        <div className='flex items-center gap-3 '>
          <div className='h-12 w-12 rounded-full bg-white flex items-center justify-center text-xl font-bold text-black'>
            {rideRequest?.user?.name?.[0] || 'U'}
          </div>
          <h2 className='text-lg font-medium'>{rideRequest?.user?.name || 'Passenger'}</h2>
        </div>
        <h5 className='text-lg font-semibold'>{rideRequest ? `${rideRequest.distance?.toFixed(1)} KM` : '--'}</h5>
      </div>

      <div className='flex gap-2 justify-between flex-col items-center'>
        <div className='w-full mt-5'>
          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>{rideRequest?.pickup?.split(',')[0] || 'Pickup address'}</h3>
              <p className='text-sm -mt-1 text-gray-600'>{rideRequest?.pickup?.split(',').slice(1).join(',') || '...'}</p>
            </div>
          </div>
          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>{rideRequest?.destination?.split(',')[0] || 'Destination'}</h3>
              <p className='text-sm -mt-1 text-gray-600'>{rideRequest?.destination?.split(',').slice(1).join(',') || '...'}</p>
            </div>
          </div>
          <div className='flex items-center gap-5 p-3'>
            <i className="ri-currency-line"></i>
            <div>
              <h3 className='text-lg font-medium'>Rs. {rideRequest?.fare ?? '0.00'}</h3>
              <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
            </div>
          </div>
        </div>
        <div className='mt-5 w-full '>
          <button onClick={handleAccept} className='bg-green-600 w-full text-white font-semibold p-2 px-10 rounded-lg'>Accept</button>
          <button onClick={handleReject} className='mt-2 w-full bg-gray-300 text-gray-700 font-semibold p-2 px-10 rounded-lg'>Ignore</button>
        </div>
      </div>
    </div>
  )
}

export default RidePopUp
