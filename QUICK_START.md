# Quick Start Guide - Birthday & Anniversary SaaS Backend

## 🚀 5-Minute Setup

### 1. Install Dependencies
```bash
cd "e:/BirthdayAniversary Web/api"
npm install
```

### 2. Configure Environment
```bash
# Copy example
cp .env.example .env

# Edit .env and add:
MONGODB_URI=mongodb+srv://nandanpoapt_db_user:NKkH11KMA3pV8rrn@birthday-aniversaey-web.4wsfwez.mongodb.net/birthday-anniversary-db
JWT_SECRET=your-super-secret-key-change-this
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
PORT=3001
```

### 3. Start Server
```bash
npm start
# or for development with auto-reload
npm run dev  # (if nodemon is installed)
```

✅ Server running on `http://localhost:3001`

---

## 🔑 Test the API (30 seconds)

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Login as Admin
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"adminpass123"}'
```

Save the token from response:
```bash
export TOKEN="<paste_token_here>"
```

### Create First Website
```bash
curl -X POST http://localhost:3001/api/admin/website/create \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type":"birthday",
    "title":"John Birthday",
    "personName":"John Smith",
    "relation":"brother",
    "ageCategory":"little",
    "ageGroup":"0-5",
    "date":"2024-12-15",
    "message":"Happy Birthday!",
    "template":"brother-adventure-1"
  }'
```

Response includes public URL and QR code! 🎉

---

## 📝 View the Data

### Get Your Websites
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/admin/website/list
```

### Check License Status
```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/admin/key/status
```

### View Public Website (No Login Needed)
```bash
curl http://localhost:3001/api/public/website/john-smith-a1b2c3d4
```

---

## 📚 Complete Documentation

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - All endpoints with examples
- **[SAAS_IMPLEMENTATION.md](./SAAS_IMPLEMENTATION.md)** - Architecture & features
- **[API_TESTING.md](./API_TESTING.md)** - 25+ curl examples
- **[ENV_SETUP.md](./ENV_SETUP.md)** - Environment configuration
- **[BACKEND_COMPLETION_SUMMARY.md](./BACKEND_COMPLETION_SUMMARY.md)** - Complete overview

---

## 🎯 Key Endpoints Reference

### Authentication
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/login` | ❌ | Admin login |
| GET | `/api/auth/me` | ✅ | Current user |
| POST | `/api/auth/logout` | ✅ | Logout |

### Admin Operations
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/admin/website/create` | ✅ | Create website |
| GET | `/api/admin/website/list` | ✅ | List your websites |
| PUT | `/api/admin/website/:id` | ✅ | Update website |
| DELETE | `/api/admin/website/:id` | ✅ | Delete website |
| GET | `/api/admin/key/status` | ✅ | License usage |

### Public (No Login)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/public/website/:slug` | ❌ | View website |
| GET | `/api/public/popular` | ❌ | Popular websites |
| GET | `/api/public/websites/:type` | ❌ | By type |

---

## 🔧 Troubleshooting

### "Cannot find module" error
```bash
# Install missing packages
npm install
```

### "Connection refused" to MongoDB
```bash
# Check MongoDB connection string in .env
# Should be: mongodb+srv://user:password@cluster.mongodb.net/db-name
# If still failing, check MongoDB Atlas IP whitelist
```

### Cloudinary errors
```bash
# Set Cloudinary env vars
export CLOUDINARY_CLOUD_NAME=your-cloud-name
export CLOUDINARY_API_KEY=your-api-key
export CLOUDINARY_API_SECRET=your-api-secret
```

### Token errors
```bash
# Use token correctly in header
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:3001/api/admin/website/list
```

---

## 🌐 Frontend Integration

### Step 1: User Logs In
```javascript
const login = async (email, password) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const { data } = await res.json();
  localStorage.setItem('token', data.token);
  return data;
};
```

### Step 2: Protected API Calls
```javascript
const apiCall = (url, options = {}) => {
  const token = localStorage.getItem('token');
  return fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
};
```

### Step 3: Create Website
```javascript
const createWebsite = (data) => {
  return apiCall('/api/admin/website/create', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(r => r.json());
};
```

### Step 4: Public Access
```javascript
// No auth needed!
const viewWebsite = async (slug) => {
  const res = await fetch(`/api/public/website/${slug}`);
  return res.json();
};
```

---

## 📋 Checklist for Running

- [ ] `.env` file created and configured
- [ ] `npm install` completed
- [ ] MongoDB connection working
- [ ] Server starts without errors
- [ ] Health check returns 200
- [ ] Can login with test credentials
- [ ] Can create a website
- [ ] Can view website publicly via slug
- [ ] QR code generated in response

---

## 🧪 Run All Tests

```bash
# Test with provided examples
bash api/test-api.sh  # (if exists)

# Or manually test key endpoints:

# 1. Health
curl http://localhost:3001/api/health

# 2. Login
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"adminpass123"}' \
  | jq -r '.data.token')

# 3. Get license status
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/admin/key/status

# 4. Create website
curl -X POST http://localhost:3001/api/admin/website/create \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...}'

# 5. View publicly
curl http://localhost:3001/api/public/website/john-smith-a1b2c3d4
```

---

## 🎬 Common Workflows

### Master Admin: Create Admin & License
```bash
# 1. Login as master admin
# 2. Create admin: POST /api/master/admin/create
# 3. Create license key: POST /api/master/key/create
# 4. Assign key to admin: POST /api/master/key/assign
```

### Admin: Create Website
```bash
# 1. Login: POST /api/auth/login
# 2. Check license: GET /api/admin/key/status
# 3. Create website: POST /api/admin/website/create
# 4. Share URL from response
```

### Public: View Website
```bash
# No login needed!
# GET /api/public/website/:slug
# View count incremented automatically
```

---

## 📦 Project Structure

```
API Setup:
api/
├── controllers/    (4 files - business logic)
├── models/        (3 files - database schemas)
├── routes/        (4 files - API endpoints)
├── middleware/    (auth, validation, errors)
├── utils/         (slugs, QR codes, templates)
├── config/        (database connection)
├── index.js       (Express server)
└── package.json   (dependencies)

Documentation:
├── API_DOCUMENTATION.md
├── SAAS_IMPLEMENTATION.md
├── API_TESTING.md
├── ENV_SETUP.md
└── BACKEND_COMPLETION_SUMMARY.md
```

---

## 🚢 Deploy to Vercel

1. Push code to GitHub
2. Connect to Vercel: `vercel`
3. Set environment variables in Vercel dashboard
4. Deploy: `vercel --prod`

---

## 💡 Tips

- Use Postman for easier testing (import curl commands)
- Keep token in localStorage for frontend
- QR code is generated automatically
- Slug is auto-generated from personName
- License usage tracked automatically
- View count incremented on public access

---

## 🆘 Need Help?

1. Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for endpoint details
2. See [API_TESTING.md](./API_TESTING.md) for more examples
3. Review [SAAS_IMPLEMENTATION.md](./SAAS_IMPLEMENTATION.md) for architecture
4. Check error message in response - all errors explain what went wrong

---

**Status:** ✅ Production-ready backend fully implemented

**Next:** Build React frontend to consume these APIs

**Questions?** See full documentation files above.

Happy coding! 🎉
