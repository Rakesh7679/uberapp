# Google Maps API Setup Guide

## Steps to Enable Real Map Integration

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - **Maps JavaScript API**
   - **Places API**
   - **Distance Matrix API**
   - **Geocoding API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key

### 2. Configure Backend

Add your API key to `backend/.env`:

```env
GOOGLE_MAPS_API=your_actual_google_maps_api_key_here
```

### 3. Configure Frontend

Replace `YOUR_GOOGLE_MAPS_API_KEY` in `frontend/index.html`:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_KEY&libraries=places" async defer></script>
```

### 4. Enable Live Map in Home Component

In `frontend/src/pages/Home.jsx`:

1. Import the LiveMap component:
```javascript
import LiveMap from '../components/LiveMap'
```

2. Replace the GIF with the LiveMap component (already commented in code):
```javascript
<LiveMap pickup={pickup} destination={destination} />
```

### 5. Restart Servers

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run dev
```

## Features You'll Get

✅ **Real-time location autocomplete** - As you type, get actual place suggestions
✅ **Live map display** - Interactive Google Maps
✅ **Route visualization** - See the route between pickup and destination
✅ **Accurate distance & time** - Real calculations based on actual routes
✅ **Place markers** - Visual markers for pickup and destination points

## Fallback Mode

If API key is not configured, the app uses **mock data**:
- Fake location suggestions
- Estimated distances
- GIF placeholder for map

This allows development without API costs!

## API Usage Notes

- Google Maps API has a **free tier** with $200/month credit
- Most small projects stay within free limits
- Monitor usage in Google Cloud Console

## Security Note

⚠️ **Restrict your API key** in Google Cloud Console:
- Application restrictions (HTTP referrers for frontend key)
- API restrictions (only enable needed APIs)
- Never commit API keys to git!

---

**Current Status:** App is in fallback mode using mock data. Follow steps above to enable real maps.
