# Echo Ride - Full Stack Uber Clone

A complete ride-sharing application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring real-time tracking, driver-passenger matching, and secure authentication.

## 🚀 Features

### User Features
- **Authentication**: Secure JWT-based registration and login
- **Real-time Location Search**: Autocomplete suggestions for pickup and destination
- **Fare Calculation**: Dynamic pricing based on distance and vehicle type
- **Vehicle Selection**: Choose between Car, Auto, or Moto
- **Live Ride Tracking**: Real-time updates on driver location and ride status
- **OTP Verification**: Secure ride start with 6-digit OTP
- **Ride History**: Track completed rides

### Captain (Driver) Features
- **Driver Authentication**: Separate registration with vehicle details
- **Live Location Broadcast**: Continuous GPS tracking via WebSockets
- **Ride Requests**: Receive nearby ride requests in real-time
- **Accept/Reject Rides**: Control over which rides to accept
- **OTP Verification**: Start rides by verifying passenger OTP
- **Earnings Dashboard**: Track earnings, trips, and online hours
- **Complete Rides**: Mark rides as finished

### Technical Features
- **Real-time Communication**: Socket.io for live updates
- **Secure Authentication**: JWT tokens with 24-hour expiration
- **Token Blacklisting**: Secure logout mechanism
- **Password Hashing**: Bcrypt for secure password storage
- **Input Validation**: Express-validator for all endpoints
- **Mock Maps API**: Distance, time, and autocomplete suggestions
- **State Machine**: Ride lifecycle (pending → accepted → ongoing → completed)

---

## 📁 Project Structure

```
uberapp/
├── backend/
│   ├── controllers/         # Request handlers
│   │   ├── user.controller.js
│   │   ├── captain.controller.js
│   │   ├── map.controller.js
│   │   └── ride.controller.js
│   ├── models/             # MongoDB schemas
│   │   ├── user.model.js
│   │   ├── captain.model.js
│   │   ├── ride.model.js
│   │   └── blacklistToken.model.js
│   ├── services/           # Business logic
│   │   ├── user.service.js
│   │   ├── captain.service.js
│   │   ├── maps.service.js
│   │   └── ride.service.js
│   ├── routes/             # API routes
│   │   ├── user.routes.js
│   │   ├── captain.routes.js
│   │   ├── maps.routes.js
│   │   └── ride.routes.js
│   ├── middlewares/        # Custom middleware
│   │   └── auth.middleware.js
│   ├── db/                 # Database connection
│   │   └── db.js
│   ├── socket.js           # WebSocket configuration
│   ├── app.js              # Express app setup
│   ├── server.js           # Server entry point
│   └── .env                # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── LocationSearchPanel.jsx
│   │   │   ├── VehicalePanel.jsx
│   │   │   ├── ConfirmedRide.jsx
│   │   │   ├── LookingForDriver.jsx
│   │   │   ├── WaitingForDriver.jsx
│   │   │   ├── CaptainDetails.jsx
│   │   │   ├── RidePopUp.jsx
│   │   │   ├── ConfirmRidePopUp.jsx
│   │   │   └── FinishRide.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── Start.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── UserLogin.jsx
│   │   │   ├── UserSignup.jsx
│   │   │   ├── UserLogout.jsx
│   │   │   ├── CaptainLogin.jsx
│   │   │   ├── CaptainSignup.jsx
│   │   │   ├── CaptainHome.jsx
│   │   │   ├── Riding.jsx
│   │   │   └── CaptainRiding.jsx
│   │   ├── context/        # React context
│   │   │   ├── UserContext.jsx
│   │   │   ├── CaptainContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env                # Environment variables
└── README.md
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
PORT=4000
DB_CONNECT=mongodb://0.0.0.0/uberapp
JWT_SECRET=EchoRide
```

4. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:4000`

### Frontend Setup

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
VITE_BASE_URL=http://localhost:4000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## 📡 API Endpoints

### User Routes (`/users`)
- `POST /users/register` - Register a new user
- `POST /users/login` - User login
- `GET /users/profile` - Get user profile (Protected)
- `GET /users/logout` - Logout user (Protected)

### Captain Routes (`/captains`)
- `POST /captains/register` - Register a new captain
- `POST /captains/login` - Captain login
- `GET /captains/profile` - Get captain profile (Protected)
- `GET /captains/logout` - Logout captain (Protected)

### Maps Routes (`/maps`)
- `GET /maps/get-coordinates?address=<address>` - Get coordinates (Protected)
- `GET /maps/get-distance-time?origin=<origin>&destination=<destination>` - Get distance & time (Protected)
- `GET /maps/get-suggestions?input=<input>` - Get autocomplete suggestions (Protected)

### Ride Routes (`/rides`)
- `POST /rides/create` - Create a new ride (User Protected)
- `GET /rides/get-fare?pickup=<pickup>&destination=<destination>` - Calculate fare (User Protected)
- `POST /rides/confirm` - Confirm ride (Captain Protected)
- `GET /rides/start-ride?rideId=<rideId>&otp=<otp>` - Start ride with OTP (Captain Protected)
- `POST /rides/end-ride` - End ride (Captain Protected)

---

## 🔐 Authentication

All protected routes require a JWT token in either:
- **Cookie**: `token`
- **Header**: `Authorization: Bearer <token>`

Token expires after 24 hours for both users and captains.

---

## 🌐 WebSocket Events

### Client → Server
- `join` - Join socket room with userId and userType
- `update-location-captain` - Update captain's live location

### Server → Client
- `new-ride` - Notify captain of new ride request
- `ride-confirmed` - Notify user that captain accepted
- `ride-started` - Notify user that ride has started
- `ride-ended` - Notify user that ride has ended

---

## 🎨 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Express-validator** - Input validation

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **Socket.io-client** - WebSocket client
- **GSAP** - Animations
- **Tailwind CSS** - Styling
- **Remix Icon** - Icons

---

## 🚗 How It Works

### User Journey
1. User signs up/logs in
2. Enters pickup and destination locations
3. Selects vehicle type (Car/Auto/Moto)
4. Confirms ride and gets fare estimate
5. System broadcasts request to nearby captains
6. Waits for captain acceptance
7. Receives captain details and OTP
8. Captain verifies OTP and starts ride
9. User tracks ride in real-time
10. Captain completes ride

### Captain Journey
1. Captain signs up/logs in with vehicle details
2. App broadcasts live location every 10 seconds
3. Receives nearby ride requests
4. Accepts or ignores ride
5. Gets pickup and destination details
6. Enters user's OTP to start ride
7. Completes ride when destination reached

---

## 🔧 Configuration

### MongoDB Connection
Update `backend/.env`:
```env
DB_CONNECT=mongodb://localhost:27017/uberapp
# or
DB_CONNECT=mongodb+srv://<username>:<password>@cluster.mongodb.net/uberapp
```

### Port Configuration
- Backend: `PORT=4000` (in backend/.env)
- Frontend: Default Vite port `5173`

---

## 🐛 Known Issues & Limitations

1. **Maps API**: Currently using mock data. Integrate Google Maps API or Mapbox for production.
2. **Payment Gateway**: Not implemented. Add Stripe/Razorpay for real payments.
3. **Distance Calculation**: Uses Haversine formula, not actual road distance.
4. **Captain Matching**: Broadcasts to all active captains, not radius-based filtering.
5. **Notifications**: No push notifications for mobile.

---

## 🚀 Future Enhancements

- [ ] Integrate real Maps API (Google Maps/Mapbox)
- [ ] Add payment gateway integration
- [ ] Implement rating and review system
- [ ] Add ride history and receipts
- [ ] Create admin dashboard
- [ ] Add surge pricing logic
- [ ] Implement push notifications
- [ ] Add chat between driver and passenger
- [ ] Create native mobile apps (React Native)
- [ ] Add ride scheduling feature
- [ ] Implement referral system

---

## 📝 License

This project is for educational purposes.

---

## 👨‍💻 Author

Built with ❤️ using Claude (Anthropic AI)

---

## 🙏 Acknowledgments

- UI inspiration from Uber
- Socket.io for real-time capabilities
- MERN Stack community

---

## 📞 Support

For issues and questions, please create an issue in the repository.
