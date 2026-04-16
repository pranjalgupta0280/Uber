import React, { useRef, useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopup'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext' 


const CaptainHome = () => {
    const [ridePopupPanel, setRidePopupPanel] = useState(false)
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)
    const [rideRequest, setRideRequest] = useState(null)
    const [startedMessage, setStartedMessage] = useState(null)
    const [isOnline, setIsOnline] = useState(false)
    const [locationError, setLocationError] = useState(null)
    const watchIdRef = useRef(null)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)

    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)

    useEffect(() => {
        const captainId = captain?._id || captain?.id;
        if (!captainId) return;

        const joinCaptain = () => {
            socket.emit('join', { userId: captainId, userType: 'captain' })
        }

        if (socket.connected) {
            joinCaptain()
        }

        socket.on('connect', joinCaptain)

        return () => {
            socket.off('connect', joinCaptain)
        }
    }, [captain, socket])

    useEffect(() => {
        const handleNewRide = (data, callback) => {
            console.log('Received new ride request:', data);
            setRideRequest(data);
            setRidePopupPanel(true);
            if (callback) {
                callback({ received: true });
            }
        };

        const handleRideStartedConfirmed = ({ message }) => {
            setStartedMessage(message || 'Ride started successfully.')
            setTimeout(() => setStartedMessage(null), 5000)
        }

        socket.on('newRideRequest', handleNewRide);
        socket.on('rideStartedConfirmed', handleRideStartedConfirmed);

        return () => {
            socket.off('newRideRequest', handleNewRide);
            socket.off('rideStartedConfirmed', handleRideStartedConfirmed);
        };
    }, [socket]);

    const toggleOnline = () => {
        if (!isOnline && !navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser.');
            return;
        }
        if (isOnline) {
            setLocationError(null);
        }
        setIsOnline(prev => !prev);
    };

    useEffect(() => {
        const captainId = captain?._id || captain?.id;
        if (!captainId) return;

        if (isOnline) {
            socket.emit('goOnline', { captainId });

            watchIdRef.current = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log('Updating location:', { latitude, longitude, captainId });
                    socket.emit('updateCaptainLocation', {
                        captainId,
                        location: {
                            type: 'Point',
                            coordinates: [longitude, latitude] // lng, lat for GeoJSON
                        },
                    });
                },
                (error) => {
                    console.error('Error watching position:', error);
                    setLocationError(error.message || 'Unable to access GPS location.');
                    setIsOnline(false);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0,
                }
            );
        } else {
            if (watchIdRef.current) {
                navigator.geolocation.clearWatch(watchIdRef.current);
                watchIdRef.current = null;
            }
            socket.emit('goOffline', { captainId });
        }

        return () => {
            if (watchIdRef.current) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, [isOnline, socket, captain]);


    useGSAP(function () {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ridePopupPanel])

    useGSAP(function () {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [confirmRidePopupPanel])

    return (
          <div className='h-screen'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
                <Link to='/captain-home' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>
            <div className='h-3/5'>
                <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />
            </div>
            {startedMessage && (
              <div className='fixed left-1/2 top-20 z-20 w-[90%] -translate-x-1/2 rounded-xl bg-emerald-600 px-4 py-3 text-white shadow-lg'>
                {startedMessage}
              </div>
            )}
            <div className='h-2/5 p-6'>
                <CaptainDetails />
                <div className='mt-4 flex flex-col gap-3'>
                    <div className='flex items-center justify-between rounded-xl border border-gray-200 bg-slate-50 px-4 py-3'>
                        <span className='font-medium text-sm text-slate-700'>Status</span>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                            {isOnline ? 'Online' : 'Offline'}
                        </span>
                    </div>
                    {locationError && (
                        <div className='rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700'>
                            {locationError}
                        </div>
                    )}
                    <button
                        onClick={toggleOnline}
                        className={`w-full py-3 rounded-lg text-white font-semibold text-lg transition-colors ${
                            isOnline ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                        }`}
                    >
                        {isOnline ? 'Go Offline' : 'Go Online'}
                    </button>
                </div>
            </div>
            <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <RidePopUp
                    rideRequest={rideRequest}
                    socket={socket}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                />
            </div>
            <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <ConfirmRidePopUp
                    rideRequest={rideRequest}
                    socket={socket}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    setRidePopupPanel={setRidePopupPanel}
                />
            </div>
        </div>
    )
}

export default CaptainHome