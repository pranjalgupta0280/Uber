import React, { useState } from 'react'

const ConfirmRidePopUp = ({ rideRequest, socket, setConfirmRidePopupPanel, setRidePopupPanel }) => {
  const [otp, setOtp] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  const submitHandler = (e) => {
    e.preventDefault()
    setError(null)

    if (!otp) {
      setError('Enter OTP before confirming.')
      return
    }
    if (!rideRequest) {
      setError('No active ride request.')
      return
    }

    setStatus('processing')
    socket.emit('verifyRideOtp', {
      rideId: rideRequest.rideId,
      otp,
      captainId: rideRequest.captainId
    }, (response) => {
      if (response?.success) {
        setStatus('started')
        setError(null)
      } else {
        setStatus('idle')
        setError(response?.message || 'OTP verification failed')
      }
    })
  }

  return (
    <div>
      <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
        setConfirmRidePopupPanel(false)
      }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
      <h3 className='text-2xl font-semibold mb-5'>Enter OTP to Start Ride</h3>
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

        <div className='mt-6 w-full'>
          {status === 'started' ? (
            <div className='rounded-xl bg-emerald-50 p-6 text-center'>
              <h4 className='text-xl font-semibold text-emerald-800'>Ride started</h4>
              <p className='mt-2 text-sm text-emerald-700'>OTP verified successfully. Please begin the ride.</p>
              <button
                type='button'
                onClick={() => {
                  setConfirmRidePopupPanel(false)
                  setRidePopupPanel(false)
                }}
                className='w-full mt-5 bg-emerald-600 text-white font-semibold p-3 rounded-lg'
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submitHandler}>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                type='text'
                className='bg-[#eee] px-6 py-4 font-mono text-lg rounded-lg w-full mt-3'
                placeholder='Enter OTP'
              />
              {error && (
                <div className='mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700'>
                  {error}
                </div>
              )}
              <button
                type='submit'
                disabled={status === 'processing'}
                className={`w-full mt-5 text-lg flex justify-center font-semibold p-3 rounded-lg ${status === 'processing' ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-green-600 text-white'}`}
              >
                {status === 'processing' ? 'Verifying...' : 'Confirm'}
              </button>
              <button
                type='button'
                onClick={() => {
                  setConfirmRidePopupPanel(false)
                  setRidePopupPanel(false)
                }}
                className='w-full mt-2 bg-red-600 text-lg text-white font-semibold p-3 rounded-lg'
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConfirmRidePopUp
