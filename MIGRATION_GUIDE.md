# Complete Migration Guide: Firebase → MongoDB + Node.js

## Overview
This guide walks through migrating the Birthday & Anniversary website from Firebase to MongoDB Atlas with a Node.js/Express backend.

---

## PART 1: Backend Setup

### 1.1 Environment Configuration

**Create `/api/.env` from the example:**

```bash
# Database
MONGODB_URI=mongodb+srv://nandanpoapt_db_user:NKkH11KMA3pV8rrn@birthday-aniversaey-web.4wsfwez.mongodb.net/

# JWT
JWT_SECRET=your-super-secure-jwt-secret-change-this-in-production
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=3001
NODE_ENV=development
API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173
```

### 1.2 Install Backend Dependencies

```bash
cd api
npm install
```

### 1.3 Setup Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Create free account
3. Get your Cloud Name, API Key, and API Secret from Dashboard
4. Add to `.env`

### 1.4 Start Backend Server

```bash
cd api
npm run dev
```

Expected output:
```
✓ Server running on port 3001
  API URL: http://localhost:3001
  Environment: development
```

---

## PART 2: Frontend Setup

### 2.1 Install New Dependencies

From the root directory:

```bash
npm install axios
```

Remove Firebase packages (already done in package.json):
- firebase
- firebase-admin
- @google-cloud/storage

### 2.2 Configure Frontend Environment

**Create `.env.local`:**

```bash
VITE_API_URL=http://localhost:3001/api
```

For production (Vercel):
```bash
VITE_API_URL=https://your-api-url.vercel.app/api
```

### 2.3 Update Frontend Imports

The following components have been updated to use API calls instead of Firebase:

**AuthContext** (src/contexts/AuthContext.jsx):
- Uses `authAPI` from `apiService.js` instead of Firebase Auth
- Manages JWT token in localStorage
- Provides `login`, `register`, `logout` methods

**API Service** (src/services/apiService.js):
- Centralized axios client
- Auto-includes JWT token in headers
- Handles token expiration (401 errors)

---

## PART 3: API Endpoints Reference

### Authentication

**Register**
```
POST /api/auth/register
Body: {
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  confirmPassword: "password123"
}
Response: { success: true, data: { token, user } }
```

**Login**
```
POST /api/auth/login
Body: {
  email: "john@example.com",
  password: "password123"
}
Response: { success: true, data: { token, user } }
```

**Get Current User**
```
GET /api/auth/me
Header: Authorization: Bearer {token}
Response: { success: true, data: { user } }
```

**Update Profile**
```
PUT /api/auth/update-profile
Header: Authorization: Bearer {token}
Body: {
  name: "Jane Doe",
  phoneNumber: "+1234567890"
}
Response: { success: true, data: { user } }
```

### Events/Wishes

**Create Event**
```
POST /api/events/create
Header: Authorization: Bearer {token}
Body: (FormData)
  personName: "Sister"
  eventType: "birthday"
  eventDate: "2024-12-25"
  message: "Happy Birthday!"
  templateType: "sister-cute"
  image: <File>

Response: { success: true, data: { event } }
```

**Get User's Events**
```
GET /api/events/user/{userId}
Header: Authorization: Bearer {token}
Response: { success: true, data: { events, count } }
```

**Get Event by ID**
```
GET /api/events/id/{eventId}
Header: Authorization: Bearer {token}
Response: { success: true, data: { event } }
```

**Get Public Event by Slug** (No auth required)
```
GET /api/events/slug/{slug}
Response: { success: true, data: { event } }
```

**Update Event**
```
PUT /api/events/{eventId}
Header: Authorization: Bearer {token}
Body: (FormData) - Same as create
Response: { success: true, data: { event } }
```

**Delete Event**
```
DELETE /api/events/{eventId}
Header: Authorization: Bearer {token}
Response: { success: true, message: "Event deleted successfully" }
```

---

## PART 4: Frontend Component Usage Examples

### Using Auth

```jsx
import { useAuth } from './hooks/useAuth';

function LoginComponent() {
  const { login, authError } = useAuth();

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      // Token automatically saved to localStorage
      // User logged in
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin(email, password);
    }}>
      {/* form fields */}
    </form>
  );
}
```

### Using Events API

```jsx
import { eventsAPI } from './services/apiService';
import { useAuth } from './hooks/useAuth';

function CreateEventComponent() {
  const { user } = useAuth();

  const handleCreateEvent = async (eventData, imageFile) => {
    try {
      const response = await eventsAPI.createEvent(eventData, imageFile);
      console.log('Event created:', response.data.event);
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  return (
    // Component JSX
  );
}
```

### Get Public Event for Display

```jsx
import { eventsAPI } from './services/apiService';
import { useEffect, useState } from 'react';

function WishPage({ slug }) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventsAPI.getPublicEventBySlug(slug);
        setEvent(response.data.event);
      } catch (error) {
        console.error('Failed to load event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div>
      <h1>{event.personName}</h1>
      <p>{event.message}</p>
      {event.imageUrl && <img src={event.imageUrl} alt={event.personName} />}
    </div>
  );
}
```

---

## PART 5: Vercel Deployment

### Backend Deployment

#### Option A: Vercel Serverless Functions

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy Backend:**
   ```bash
   cd api
   vercel --prod
   ```

3. **Configure Environment Variables in Vercel Dashboard:**
   - Go to your Vercel project settings
   - Add all variables from `.env`:
     - MONGODB_URI
     - JWT_SECRET
     - CLOUDINARY_CLOUD_NAME
     - CLOUDINARY_API_KEY
     - CLOUDINARY_API_SECRET
     - NODE_ENV=production
     - API_URL=https://your-api-domain.vercel.app
     - FRONTEND_URL=https://your-frontend-domain.vercel.app

4. **Update vercel.json** (already created):
   ```json
   {
     "buildCommand": "npm install",
     "devCommand": "node index.js",
     "installCommand": "npm install",
     "framework": null,
     "nodeVersion": "18.x"
   }
   ```

### Frontend Deployment

1. **Set Environment for Production:**
   ```bash
   # In Vercel Dashboard, add:
   VITE_API_URL=https://your-api-domain.vercel.app/api
   ```

2. **Deploy Frontend:**
   ```bash
   vercel --prod
   ```

3. **Vercel automatically runs:**
   - `npm run build` (builds Vite app)
   - Deploys static files to CDN

---

## PART 6: Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed with bcrypt),
  phoneNumber: String,
  avatar: String,
  isEmailVerified: Boolean,
  status: 'active' | 'inactive' | 'deleted',
  createdAt: Date,
  updatedAt: Date
}
```

### Events Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  personName: String,
  eventType: 'birthday' | 'anniversary',
  eventDate: Date,
  message: String,
  templateType: 'sister-cute' | 'elder-sister' | 'brother' | 'child-cartoon' | 'default',
  imageUrl: String,
  publicUrl: String,
  slug: String (unique),
  isPublic: Boolean,
  viewCount: Number,
  status: 'active' | 'archived' | 'deleted',
  metadata: {
    lastViewedAt: Date,
    lastEditedAt: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## PART 7: Security Best Practices

### JWT Token Management

**Token Storage (Frontend):**
```javascript
// Save after login
localStorage.setItem('authToken', response.data.token);

// Auto-included in API calls via interceptor
// Authorization: Bearer {token}

// Clear on logout
localStorage.removeItem('authToken');
```

**Token Expiration:**
- Tokens expire after 7 days (configurable via JWT_EXPIRE)
- API returns 401 if token invalid
- Frontend redirects to login on 401

### Password Security
- All passwords hashed with bcrypt (10 salt rounds)
- Never stored in plain text
- Never sent back to frontend after creation

### Environment Variables
- **Production:** Use Vercel Dashboard for secrets
- **Development:** Use `.env` file (NEVER commit to git)
- **Never:** Expose MongoDB URI, JWT_SECRET, or Cloudinary keys in frontend code

### CORS Configuration
- Backend only accepts requests from your frontend domain
- Update FRONTEND_URL in `.env` for each environment

---

## PART 8: Troubleshooting

### Backend Won't Start
```
Error: MONGODB_URI is not defined
→ Check `/api/.env` exists and has MONGODB_URI
```

### API Calls Failing with 401
```
Error: Invalid or expired token
→ Token expired or invalid
→ Clear localStorage and login again
→ Check if JWT_SECRET matches between frontend and backend
```

### Image Upload Fails
```
Error: Image upload failed
→ Check CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET
→ Check file size < 5MB
→ Check allowed MIME types (jpeg, png, gif, webp)
```

### CORS Errors
```
Error: CORS policy blocked request
→ Check FRONTEND_URL matches your actual frontend domain
→ Restart backend after changing CORS config
```

---

## PART 9: Migration Checklist

- [x] Backend folder structure created
- [x] MongoDB models defined (User, Event)
- [x] Authentication API with JWT implemented
- [x] Event CRUD API routes created
- [x] Image upload with Cloudinary integrated
- [x] Frontend API service created
- [x] AuthContext updated to use APIs
- [x] Firebase dependencies removed from package.json
- [ ] Update all page components to use new API
- [ ] Test login/register flow
- [ ] Test event creation with image upload
- [ ] Test public event viewing
- [ ] Deploy backend to Vercel
- [ ] Deploy frontend to Vercel
- [ ] Update all environment variables in production
- [ ] Test production URLs

---

## PART 10: Next Steps

1. **Update Components:** Modify `CreateBirthday.jsx`, `CreateAnniversary.jsx`, `WishPage.jsx`, etc. to use `eventsAPI` instead of Firestore
2. **Test Locally:** Run backend and frontend, test all features
3. **Deploy Backend:** Follow Vercel deployment steps
4. **Deploy Frontend:** Update `.env` with production API URL, deploy
5. **Monitor:** Check Vercel logs and MongoDB Atlas metrics

---

## Support Files

- **Backend:** `/api/index.js` - Main Express server
- **Models:** `/api/models/User.js`, `/api/models/Event.js`
- **Routes:** `/api/routes/auth.js`, `/api/routes/events.js`
- **Frontend API:** `/src/services/apiService.js`
- **Frontend Auth:** `/src/contexts/AuthContext.jsx`
- **Config:** `/api/config/database.js`, `/api/config/cloudinary.js`

