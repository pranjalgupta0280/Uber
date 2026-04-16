import React, { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

// Make sure this environment variable points to your backend URL (e.g., http://localhost:4000)
const socketUrl = import.meta.env.VITE_BASE_URL || window.location.origin;
const socket = io(socketUrl, {
    transports: ['websocket', 'polling'],
});

const SocketProvider = ({ children }) => {
    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to socket server with id:', socket.id);
            // A simple test to confirm the connection is active
            socket.emit('ping');
        });

        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err.message);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        // Listener for the test event from the server
        socket.on('pong', () => {
            console.log('Received pong from server. Connection is working!');
        });

        return () => {
            socket.off('connect');
            socket.off('connect_error');
            socket.off('disconnect');
            socket.off('pong');
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
