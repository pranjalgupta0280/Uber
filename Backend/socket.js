const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            const { userId, userType } = data;
            
            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });

        socket.on('goOnline', async ({ captainId }) => {
            console.log('goOnline event received', { captainId });
            if (!captainId) return;
            try {
                await captainModel.findByIdAndUpdate(captainId, { status: 'active' });
            } catch (error) {
                console.error('goOnline update failed:', error);
            }
        });

        socket.on('goOffline', async ({ captainId }) => {
            console.log('goOffline event received', { captainId });
            if (!captainId) return;
            try {
                await captainModel.findByIdAndUpdate(captainId, { status: 'inactive' });
            } catch (error) {
                console.error('goOffline update failed:', error);
            }
        });

        socket.on('updateCaptainLocation', async ({ captainId, location }) => {
            console.log('updateCaptainLocation event received', { captainId, location });
            if (!captainId || !location) return;
            try {
                await captainModel.findByIdAndUpdate(captainId, { location });
            } catch (error) {
                console.error('updateCaptainLocation failed:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

function sendMessageToSocketId(socketId, messageObject) {
    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
}

module.exports = { initializeSocket, sendMessageToSocketId };
