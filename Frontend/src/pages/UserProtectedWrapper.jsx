import React, { useContext, useEffect, useState } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProtectWrapper = ({ children }) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const { setUser } = useContext(UserDataContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            if (res.status === 200) {
                setUser(res.data);
                setIsLoading(false); // Only stop loading when we have the user
            }
        })
        .catch(err => {
            console.log(err);
            localStorage.removeItem('token');
            navigate('/login');
        });
    }, [token]);

    // CRITICAL: If we are still checking the token, DO NOT show the children
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};

export default UserProtectWrapper;