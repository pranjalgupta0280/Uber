const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');
const rideModel = require('./models/ride.model');

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

        socket.on('acceptRide', async ({ rideId, captainId }) => {
            if (!rideId || !captainId) return;
            try {
                const ride = await rideModel.findByIdAndUpdate(rideId, { status: 'accepted' }, { new: true }).select('+otp').populate('user');
                const captain = await captainModel.findById(captainId).lean();
                if (ride && ride.user?.socketId) {
                    io.to(ride.user.socketId).emit('rideAccepted', {
                        rideId: ride._id,
                        pickup: ride.pickup,
                        destination: ride.destination,
                        fare: ride.fare,
                        otp: ride.otp,
                        captain: {
                            id: captainId,
                            name: `${captain.fullname.firstname} ${captain.fullname.lastname}`,
                            vehicle: captain.vehicle.vehicleType,
                            plate: captain.vehicle.plate,
                            color: captain.vehicle.color
                        }
                    });
                }
                socket.emit('rideAcceptedConfirmed', {
                    rideId: ride._id,
                    driverName: `${captain.fullname.firstname} ${captain.fullname.lastname}`,
                    pickup: ride.pickup,
                    destination: ride.destination,
                });
            } catch (error) {
                console.error('acceptRide failed:', error);
            }
        });

        socket.on('verifyRideOtp', async ({ rideId, otp, captainId }, callback) => {
            if (!rideId || !otp || !captainId) {
                return callback?.({ success: false, message: 'Ride, OTP and captain are required' });
            }
            try {
                const ride = await rideModel.findById(rideId).select('+otp').populate('user');
                if (!ride) {
                    return callback?.({ success: false, message: 'Ride not found' });
                }
                if (ride.otp !== otp) {
                    return callback?.({ success: false, message: 'OTP does not match' });
                }

                ride.status = 'ongoing';
                await ride.save();

                const captain = await captainModel.findById(captainId).lean();
                if (ride.user?.socketId) {
                    io.to(ride.user.socketId).emit('rideStarted', {
                        rideId: ride._id,
                        pickup: ride.pickup,
                        destination: ride.destination,
                        fare: ride.fare,
                        captainId,
                        captainName: captain ? `${captain.fullname.firstname} ${captain.fullname.lastname}` : null,
                        captainVehicle: captain?.vehicle?.vehicleType,
                        captainPlate: captain?.vehicle?.plate
                    });
                }

                if (socket) {
                    socket.emit('rideStartedConfirmed', {
                        rideId: ride._id,
                        message: 'OTP verified. Ride started.'
                    });
                }

                return callback?.({ success: true });
            } catch (error) {
                console.error('verifyRideOtp failed:', error);
                return callback?.({ success: false, message: 'Unable to verify OTP' });
            }
        });

        socket.on('rejectRide', async ({ rideId, captainId }) => {
            if (!rideId || !captainId) return;
            try {
                const ride = await rideModel.findByIdAndUpdate(rideId, { status: 'cancelled' }, { new: true }).populate('user');
                if (ride && ride.user?.socketId) {
                    io.to(ride.user.socketId).emit('rideRejected', {
                        rideId: ride._id
                    });
                }
            } catch (error) {
                console.error('rejectRide failed:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

function sendEventToSocketWithAck(socketId, event, data, timeout = 5000) {
    return new Promise((resolve, reject) => {
        if (!io) {
            return reject(new Error('Socket.io not initialized.'));
        }
        io.to(socketId).timeout(timeout).emit(event, data, (err, response) => {
            if (err) {
                return reject(new Error(`Acknowledgement timeout for event '${event}' to socket ${socketId}`));
            }
            resolve(response);
        });
    });
}

module.exports = { initializeSocket, sendEventToSocketWithAck };
