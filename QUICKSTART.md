# 🚀 QUICK START GUIDE - MongoDB Migration

## 🎯 5-Minute Setup

### Backend (Local Development)

```bash
# 1. Navigate to api folder
cd api

# 2. Install dependencies
npm install

# 3. Create .env file (copy from .env.example)
cp .env.example .env

# 4. Edit .env and add:
# - MONGODB_URI (already provided)
# - CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET
# - JWT_SECRET (can be any strong string)

# 5. Start server
npm run dev
```

**Expected Output:**
```
✓ Server running on port 3001
  API URL: http://localhost:3001
```

### Frontend (Local Development)

```bash
# From root directory

# 1. Install dependencies
npm install

# 2. Create .env.local
echo "VITE_API_URL=http://localhost:3001/api" > .env.local

# 3. Start dev server
npm run dev
```

**Access:** http://localhost:5173

---

## ✅ Quick Verification

**Test Backend Health:**
```bash
curl http://localhost:3001/api/health
```

**Should return:**
```json
{
  "success": true,
  "message": "Server is running"
}
```

**Test Frontend:**
1. Open browser → http://localhost:5173
2. Try Register/Login
3. If successful, backend is connected!

---

## 🔧 What You Need (If Deploying)

### Cloudinary Setup (5 minutes)
1. Sign up at [cloudinary.com](https://cloudinary.com) (free tier available)
2. Go to Dashboard → get:
   - Cloud Name
   - API Key
   - API Secret
3. Add to `/api/.env`

### Vercel Deployment (10 minutes)

**Backend:**
```bash
cd api
npm install -g vercel
vercel --prod
```
- Add environment variables in Vercel Dashboard
- Copy backend URL (e.g., `https://my-api.vercel.app`)

**Frontend:**
```bash
# In root directory
echo "VITE_API_URL=https://my-api.vercel.app/api" > .env.local
vercel --prod
```

---

## 🛂 API Testing with cURL

### Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Response includes `token` and `user` object.

### Create Event (requires token)
```bash
curl -X POST http://localhost:3001/api/events/create \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "personName=Sister" \
  -F "eventType=birthday" \
  -F "eventDate=2024-12-25" \
  -F "message=Happy Birthday!" \
  -F "templateType=sister-cute" \
  -F "image=@/path/to/image.jpg"
```

---

## 📊 Database

### MongoDB Atlas Connection
The database is already created and accessible with:
```
mongodb+srv://nandanpoapt_db_user:NKkH11KMA3pV8rrn@birthday-aniversaey-web.4wsfwez.mongodb.net/
```

**View data:**
1. Go to [mongodb.com/cloud](https://mongodb.com/cloud)
2. Login
3. Collections → Users/Events
4. View data in real-time

---

## 🆘 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `MONGODB_URI not defined` | Check `/api/.env` exists with connection string |
| `Cannot POST /api/auth/register` | Ensure backend running on port 3001 |
| `CORS error` | Update FRONTEND_URL in `/api/.env` |
| `Image upload fails` | Verify Cloudinary credentials in `/api/.env` |
| `Token invalid` | Tokens expire after 7 days, login again |
| `API returns 404` | Check API endpoint path in frontend calls |

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `api/index.js` | Main Express server |
| `api/models/User.js` | User schema with password hashing |
| `api/models/Event.js` | Event/wish schema |
| `api/routes/auth.js` | Login/Register/Profile endpoints |
| `api/routes/events.js` | Create/Read/Update/Delete events |
| `src/services/apiService.js` | Frontend API client with axios |
| `src/contexts/AuthContext.jsx` | User authentication state management |
| `.env.local` | Frontend API URL configuration |

---

## 🎓 Key Concepts

### JWT Authentication
- User gets `token` after login
- Token automatically included in API headers
- Token expires after 7 days
- Frontend stores token in `localStorage`

### MongoDB Models
- **Users:** Store name, email, hashed password
- **Events:** Store person name, date, message, image, template type

### Image Upload
- Handled by Multer (temporary storage)
- Uploaded to Cloudinary (permanent storage)
- Returns URL stored in database

### API Structure
- REST endpoints: `/api/auth/*` and `/api/events/*`
- All responses follow format: `{ success: boolean, data: {...} }`
- Error handling with status codes and messages

---

## 📚 Documentation Files

- **MIGRATION_GUIDE.md** - Complete in-depth guide
- **MIGRATION_EXAMPLES.md** - Code examples for updating components
- **FIREBASE_REMOVAL_CHECKLIST.md** - What to delete/update
- **api/VERCEL_DEPLOYMENT.md** - Backend deployment steps

---

## 🚀 Next Steps

1. ✅ Backend setup (5 min)
2. ✅ Frontend setup (5 min)
3. 🔄 Update components to use new API (20 min per component)
4. ✅ Test locally (15 min)
5. ✅ Deploy to Vercel (20 min)

**Total Time:** ~2 hours for complete migration

---

## 🤝 Support

Got stuck? Check:
1. Backend logs: `npm run dev` output
2. Browser console: F12 → Console tab
3. Network tab: See API requests/responses
4. Vercel logs: Project Dashboard → Deployments → View logs

