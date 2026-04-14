import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const CaptainLogout = () => {
    // ⚠️ CONSISTENCY CHECK: Ensure this matches the key used in CaptainSignup/Login
    const token = localStorage.getItem('captain-token') 
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            if (response.status === 200) {
                localStorage.removeItem('captain-token')
                navigate('/captain-login')
            }
        }).catch(err => {
            console.error("Captain logout failed:", err)
            // Failsafe: Clear local data and redirect anyway
            localStorage.removeItem('captain-token')
            navigate('/captain-login')
        })
    }, [navigate, token])

    return (
        <div className='h-screen flex items-center justify-center'>
            Captain Logging out...
        </div>
    )
}

export default CaptainLogout