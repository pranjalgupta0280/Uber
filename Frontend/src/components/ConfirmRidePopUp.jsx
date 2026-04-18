import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ConfirmRidePopUp = ({ rideRequest, setConfirmRidePopupPanel, socket }) => {
    const [otp, setOtp] = useState('')
    const navigate = useNavigate()

    const submitHandler = (e) => {
        e.preventDefault()
        
        if(otp.length !== 4) {
            alert('Please enter the 4-digit OTP')
            return;
        }

        // Emit to the backend to verify the OTP and officially start the ride
        socket.emit('verifyRideOtp', {
            rideId: rideRequest.rideId,
            otp: otp,
            captainId: rideRequest.captainId
        }, (response) => {
            if (response && response.success) {
                // OTP was correct, navigate to the active riding view
                setConfirmRidePopupPanel(false)
                navigate('/captain-riding', { state: { ride: rideRequest } })
            } else {
                // Provide feedback for invalid OTP
                alert(response?.message || 'Invalid OTP. Please try again.')
            }
        })
    }

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => setConfirmRidePopupPanel(false)}>
                <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className='text-2xl font-semibold mb-5'>Confirm this ride to Start</h3>

            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-3'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill text-xl"></i>
                        <div>
                            <h3 className='text-lg font-medium'>{rideRequest?.pickup?.split(',')[0] || 'Pickup location'}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{rideRequest?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-2-fill text-xl"></i>
                        <div>
                            <h3 className='text-lg font-medium'>{rideRequest?.destination?.split(',')[0] || 'Destination'}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{rideRequest?.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line text-xl"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Rs. {rideRequest?.fare ?? '0.00'}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                        </div>
                    </div>
                </div>

                {/* ---> OTP Input Form <--- */}
                <div className='mt-6 w-full'>
                    <form onSubmit={submitHandler}>
                        <input 
                            value={otp} 
                            onChange={(e) => setOtp(e.target.value)} 
                            type="text" 
                            maxLength={4}
                            placeholder="Enter 4-digit OTP"
                            className='bg-[#eee] px-6 py-4 font-mono text-2xl rounded-lg w-full mt-3 text-center tracking-[0.5em] font-bold' 
                        />
                        
                        <button className='w-full mt-5 bg-green-600 text-white font-semibold p-3 rounded-lg text-lg flex justify-center'>
                            Confirm & Start Ride
                        </button>
                        <button 
                            type="button"
                            onClick={() => setConfirmRidePopupPanel(false)} 
                            className='w-full mt-2 bg-red-500 text-white font-semibold p-3 rounded-lg text-lg'>
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ConfirmRidePopUp
