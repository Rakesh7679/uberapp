# Echo Ride - Next.js Complete Project

🎉 **Your React+Vite project has been successfully converted to Next.js 15!**

## 📦 What's Included

Complete Next.js 15 project with:
- ✅ All pages converted (login, signup, home, captain pages, etc.)
- ✅ All components (maps, ride panels, location search, etc.)
- ✅ React contexts (User, Captain, Socket)
- ✅ Middleware for route protection
- ✅ Axios configured with interceptors
- ✅ Tailwind CSS styling
- ✅ TypeScript support
- ✅ Socket.IO integration ready
- ✅ GSAP animations support
- ✅ React Toastify notifications

## 🚀 Quick Start Guide

### Step 1: Extract the Archive
```bash
tar -xzf uber-nextjs-project.tar.gz
cd uber-nextjs
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
The `.env.local` file is already set up:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Step 4: Start Backend (from original project)
In a separate terminal:
```bash
cd ../backend
npm install  # if not done already
npm start
```

Backend will run on: **http://localhost:4000**

### Step 5: Start Next.js Frontend
```bash
npm run dev
```

Frontend will run on: **http://localhost:3000**

## 📖 Project Structure

```
uber-nextjs/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Redirect to /start
│   │   ├── globals.css         # Global styles
│   │   ├── start/              # Landing page
│   │   ├── login/              # User login
│   │   ├── signup/             # User signup
│   │   ├── home/               # User dashboard
│   │   ├── account/            # User profile
│   │   ├── riding/             # Active ride tracking
│   │   ├── captain-login/      # Captain login
│   │   ├── captain-signup/     # Captain signup
│   │   ├── captain-home/       # Captain dashboard
│   │   ├── captain-riding/     # Captain ride tracking
│   │   └── user/logout/        # Logout
│   ├── components/             # React components
│   │   ├── UserProtectWrapper.tsx
│   │   ├── CaptainProtectWrapper.tsx
│   │   ├── LocationSearchPanel.tsx
│   │   ├── VehicalePanel.tsx
│   │   ├── ConfirmedRide.tsx
│   │   ├── LookingForDriver.tsx
│   │   ├── WaitingForDriver.tsx
│   │   ├── LiveMap.tsx
│   │   ├── CaptainDetails.tsx
│   │   ├── RidePopUp.tsx
│   │   ├── ConfirmRidePopUp.tsx
│   │   └── FinishRide.tsx
│   ├── context/                # React contexts
│   │   ├── UserContext.tsx
│   │   ├── CaptainContext.tsx
│   │   └── SocketContext.tsx
│   ├── lib/                    # Utilities
│   │   └── axios.ts            # Configured axios instance
│   └── middleware.ts           # Route protection middleware
├── public/                     # Static files
├── package.json                # Dependencies
├── next.config.js              # Next.js config
├── tsconfig.json               # TypeScript config
├── tailwind.config.js          # Tailwind config
├── postcss.config.js           # PostCSS config
└── README.md                   # This file
```

## 📱 Available Pages

### User Pages
- **`/start`** - Landing page with Get Started and Drive with Us buttons
- **`/login`** - User login page
- **`/signup`** - User registration page
- **`/home`** - User dashboard (protected)
- **`/account`** - User profile (protected)
- **`/riding`** - Active ride tracking (protected)
- **`/user/logout`** - Logout endpoint (protected)

### Captain Pages
- **`/captain-login`** - Captain login page
- **`/captain-signup`** - Captain registration with vehicle details
- **`/captain-home`** - Captain dashboard (protected)
- **`/captain-riding`** - Captain ride tracking (protected)

## 🔧 Key Features

### Authentication
- JWT token-based authentication
- Token stored in localStorage
- Automatic token injection via axios interceptors
- Protected routes with middleware and HOCs

### Real-time Features
- Socket.IO integration ready in SocketContext
- Event listeners configured for ride updates
- Support for both user and captain connections

### UI/UX
- Tailwind CSS for styling
- GSAP animations support integrated
- React Toastify for notifications
- Remixicon for icons
- Responsive design

### Maps & Location
- Leaflet integration ready
- React Leaflet components available
- Geolocation support

## 🛠️ Development

### Add a New Page
Create a folder in `src/app/` with a `page.tsx` file:
```typescript
'use client'

export default function NewPage() {
  return <div>New Page Content</div>
}
```

### Use User Context
```typescript
'use client'
import { useUser } from '@/context/UserContext'

export default function MyComponent() {
  const { user, setUser } = useUser()
  return <div>{user.email}</div>
}
```

### Use Captain Context
```typescript
'use client'
import { useCaptain } from '@/context/CaptainContext'

export default function MyComponent() {
  const { captain, setCaptain } = useCaptain()
  return <div>{captain?.email}</div>
}
```

### Use Socket
```typescript
'use client'
import { useSocket } from '@/context/SocketContext'

export default function MyComponent() {
  const { socket } = useSocket()
  // Use socket for real-time updates
  return <div>Socket Connected</div>
}
```

### Make API Calls
```typescript
'use client'
import api from '@/lib/axios'

export default function MyComponent() {
  const fetchData = async () => {
    try {
      const response = await api.get('/endpoint')
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }
  return <button onClick={fetchData}>Fetch</button>
}
```

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is already in use, Next.js will automatically use port 3001
```bash
npm run dev
# or specify port
PORT=3001 npm run dev
```

### Backend Connection Error
Ensure:
1. Backend is running on `http://localhost:4000`
2. `.env.local` has correct `NEXT_PUBLIC_API_URL`
3. CORS is enabled on backend

### Module Not Found Errors
Run `npm install` again:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📦 Build for Production

### Build
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## 📚 Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🔐 Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Backend (.env - use from original project)
```
PORT=4000
DB_CONNECT=mongodb://localhost:27017/uberapp
JWT_SECRET=EchoRide
```

## 📝 Important Notes

1. **Copy Logo**: Place `echoride-logo1.png` in `public/` folder
   - Source: original `frontend/dist/` or `frontend/public/`

2. **Backend Unchanged**: Backend code remains the same
   - Use the original backend from the project
   - All API endpoints are identical

3. **Token Management**: 
   - Tokens are stored in localStorage
   - Automatically included in API requests via axios interceptors
   - Clear localStorage on logout

4. **TypeScript**: 
   - Full TypeScript support
   - Type safety for all components
   - Proper context typing

## 🚀 Next Steps

1. ✅ Extract and install
2. ✅ Copy logo to public folder
3. ✅ Start backend server
4. ✅ Start Next.js development server
5. ✅ Test user login flow
6. ✅ Test captain login flow
7. 📝 Customize components as needed
8. 🚀 Build for production when ready

## 📞 Support

- Backend issues → Check original project README
- Next.js specific → Refer to [Next.js Documentation](https://nextjs.org/docs)
- React Contexts → Check `src/context/` files
- API calls → Check `src/lib/axios.ts`

---

**🎉 Your Next.js conversion is complete and ready to use!**

Built with ❤️ using Next.js 15
