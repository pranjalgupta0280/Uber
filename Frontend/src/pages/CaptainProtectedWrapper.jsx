import React, { useContext, useEffect, useState } from 'react';
import { CaptainDataContext } from '../context/CaptainContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CaptainProtectWrapper = ({ children }) => {
    // USE THE CORRECT KEY HERE
    const token = localStorage.getItem('captain-token'); 
    const navigate = useNavigate();
    const { setCaptain } = useContext(CaptainDataContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate('/captain-login');
            return;
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            if (res.status === 200) {
                setCaptain(res.data.captain);
                setIsLoading(false);
            }
        })
        .catch(err => {
            console.log(err);
            localStorage.removeItem('captain-token');
            navigate('/captain-login');
        });
    }, [token]);

    if (isLoading) {
        return <div>Loading Captain Profile...</div>;
    }

    return <>{children}</>;
};

export default CaptainProtectWrapper;