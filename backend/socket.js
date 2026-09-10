const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');
const rideModel = require('./models/ride.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: [ 'GET', 'POST' ]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            const { userId, userType } = data;

            if (userType === 'user') {
                socket.join(`user:${userId}`);
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                socket.join('captains');
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });

        socket.on('update-location-captain', async (data) => {
            const { userId, rideId, location } = data;

            if (!location || !location.lat || !location.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    ltd: location.lat,
                    lng: location.lng
                }
            });

            if (rideId) {
                const ride = await rideModel.findOne({ _id: rideId, captain: userId });
                if (ride) sendMessageToUser(ride.user.toString(), {
                    event: 'captain-location',
                    data: location
                });
            }
        });

        socket.on('update-location-user', async (data) => {
            const { userId, rideId, location } = data;
            if (!location || !location.lat || !location.lng || !rideId) return;

            const ride = await rideModel.findOne({ _id: rideId, user: userId }).populate('captain');
            if (ride?.captain?.socketId) {
                sendMessageToSocketId(ride.captain.socketId, {
                    event: 'user-location',
                    data: location
                });
            }
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {
    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
}

const sendMessageToRoom = (room, messageObject) => {
    if (io) {
        io.to(room).emit(messageObject.event, messageObject.data);
    }
}

const sendMessageToUser = (userId, messageObject) => {
    if (io && userId) {
        io.to(`user:${userId}`).emit(messageObject.event, messageObject.data);
    }
}

module.exports = { initializeSocket, sendMessageToSocketId, sendMessageToRoom, sendMessageToUser };