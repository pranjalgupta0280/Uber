# Uber2 Ride Sharing

A full-stack ride-sharing application built with React, Vite, Express, MongoDB, and Socket.IO. The app supports both user and captain workflows, including live ride requests, real-time driver notifications, OTP confirmation, and map-based distance/fare calculations.

## Project Structure

- `Backend/` — Express API, MongoDB models, authentication, ride management, and Socket.IO real-time communication.
- `Frontend/` — React + Vite application with separate views for riders and captains.

## Features

- User registration and login
- Captain registration and login
- Ride request creation with pickup and destination
- Closest active captain search using geolocation coordinates
- Live ride request notification to driver panel via Socket.IO
- Ride acceptance flow and OTP-based confirmation
- Real-time ride status updates for users and drivers
- Map suggestion and distance/fare calculation integration

## Screens and Image Placeholders

Add screenshots for each screen in `./docs/screens/` or the path you prefer.

1. **Start / Landing Screen**
   - ![Start Screen](./docs/screens/Screenshot%202026-04-18%20152041.png)
   - Placeholder: `docs/screens/start-screen.png`
   - ![Phone Layout](/docs/screens/Screenshot%202026-04-18%20152121.png)
2. **User Login Screen**
   - ![User Login](./docs/screens/Screenshot%202026-04-18%20151702.png)
   - Placeholder: `docs/screens/user-login.png`
3. **User Signup Screen**
   - ![User Signup](./docs/screens/Screenshot%202026-04-18%20151730.png)
   - Placeholder: `docs/screens/user-signup.png`
   - ![Phone Layout](/docs/screens/Screenshot%202026-04-18%20152150.png)
4. **User Home / Find a Trip**
   - ![User Home](./docs/screens/Screenshot%202026-04-18%20151742.png)
   - Placeholder: `docs/screens/user-home.png`
5. **User Ride Request / Confirmation Flow**
   - ![Ride Request Flow](./docs/screens/Screenshot%202026-04-18%20151846.png)
   - Placeholder: `docs/screens/ride-request-flow.png`
   - ![Ride location](./docs/screens/Screenshot%202026-04-18%20151925.png)
   - Placeholder: `docs/screens/ride-location.png`
   - ![Ride vehicle selection](./docs/screens/Screenshot%202026-04-18%20151941.png)
   - Placeholder: `docs/screens/ride-confirmation.png`
   - ![Ride confirmation](./docs/screens/Screenshot%202026-04-18%20152008.png)
   - Placeholder: `docs/screens/ride-confirmation.png`
6. **User Riding / Ride Status**
   - ![User Riding](./docs/screens/)
   - Placeholder: `docs/screens/user-riding.png`
7. **Captain Login Screen**
   - ![Captain Login](./docs/screens/captain-login.png)
   - Placeholder: `docs/screens/captain-login.png`
8. **Captain Signup Screen**
   - ![Captain Signup](./docs/screens/captain-signup.png)
   - Placeholder: `docs/screens/captain-signup.png`
9. **Captain Home / Driver Dashboard**
   - ![Captain Home](./docs/screens/Screenshot%202026-04-18%20152303.png)
   - ![Phone Layout](/docs/screens/Screenshot%202026-04-18%20152229.png)
   - Placeholder: `docs/screens/captain-home.png`
10. **Driver Ride Request Popup**
    - ![Driver Ride Request](./docs/screens/Screenshot%202026-04-18%20153326.png)
    - Placeholder: `docs/screens/driver-ride-request.png`
    - ![Phone Layout](/docs/screens/Screenshot%202026-04-18%20153354.png)
11. **Driver Confirm Ride / OTP Popup**
    - ![Driver Confirm Ride](./docs/screens/Screenshot%202026-04-18%20153414.png)
    - Placeholder: `docs/screens/driver-confirm-ride.png`
12. **Captain Riding / In-ride View**
    - ![Captain Riding](./docs/screens/Screenshot%202026-04-18%20154733.png)
    - Placeholder: `docs/screens/captain-riding.png`
    - ![Phone Layout](/docs/screens/Screenshot%202026-04-18%20154800.png)
13. **Database Schema**
    - ![Database Schema](./docs/screens/Screenshot%202026-04-18%20154949.png)
    - Placeholder:
    - ![Database Schema](./docs/screens/Screenshot%202026-04-18%20155003.png)
    - Placeholder:
    - ![Database Schema](./docs/screens/Screenshot%202026-04-18%20155015.png)
    - Placeholder:


> Tip: Create the `docs/screens/` folder and add PNG or JPG screenshots with the names above. Then the README will automatically show your images.

## Backend Overview

The backend is located in `Backend/` and includes:

- `server.js` — starts the HTTP server and initializes Socket.IO.
- `socket.js` — handles connection lifecycle, `join`, `goOnline`, `goOffline`, `newRideRequest`, `acceptRide`, `verifyRideOtp`, and `rejectRide` events.
- `app.js` — configures Express middleware and routes.
- `controllers/` — handles request logic for users, captains, rides, and map services.
- `models/` — Mongoose schemas for users, captains, rides, and token blacklist.
- `services/` — business logic for ride matching, fare calculation, address lookup, and map directions.

## Frontend Overview

The frontend is located in `Frontend/` and includes:

- `src/main.jsx` — app bootstrap with React Router, contexts, and socket provider.
- `src/App.jsx` — route definitions for user and captain flows.
- `src/pages/` — screens for login, signup, home, riding, and logout.
- `src/components/` — shared UI components for ride panels, popups, search, and status views.
- `src/context/` — React contexts for socket, user, and captain state.
- `src/index.css` — global Tailwind and responsive styling.

## Run Locally

### Backend

```bash
cd Backend
npm install
npm run start
```

The backend default port is `4000`.

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

The frontend runs on Vite and by default opens at `http://localhost:5173`.

## Environment Variables

### Backend `.env`

```env
PORT=4000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
GOOGLE_MAPS_API_KEY=<your-google-maps-api-key>
LOCATIONIQ_API_KEY=<your-locationiq-api-key>
```

### Frontend `.env`

```env
VITE_BASE_URL=http://localhost:4000
```

## How the Ride Flow Works

1. User logs in and opens the home screen.
2. User enters pickup and destination.
3. Frontend calls backend fare and ride creation endpoints.
4. Backend finds nearby active captains by location and sends `newRideRequest` via Socket.IO.
5. Active captain receives the ride popup and can accept or reject.
6. On acceptance, backend notifies the user with `rideAccepted`.
7. Captain confirms ride by entering OTP.
8. Once OTP is verified, backend sends `rideStarted` to the user.

## Notes

- The app uses Socket.IO for real-time notifications between users and captains.
- The passenger app is currently optimized for mobile layout but updated to look better on laptop screens.
- The driver view includes an online/offline toggle and geolocation updates.

## Next Steps

- Add screenshot files to `docs/screens/`
- Improve form validation and error handling
- Add ride history and cancellation support
- Add better map visualization for routes and live driver location
