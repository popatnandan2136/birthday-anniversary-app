# SaaS Platform Implementation Guide

## Project Overview

This is a production-ready SaaS platform for creating shareable Birthday & Anniversary websites. The system implements:

- **Multi-role authentication** (MASTER_ADMIN, ADMIN, PUBLIC_USER)
- **License key management** with usage limits
- **Dynamic website generation** based on relation + age category
- **QR code generation** for sharing
- **Image storage** via Cloudinary
- **Public shareable URLs** with slug-based access
- **View tracking** and analytics

## Architecture

### Tech Stack
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT + bcryptjs
- **Image Storage:** Cloudinary
- **QR Codes:** qrcode package
- **File Handling:** Multer (for temp storage)
- **Deployment:** Vercel (serverless)

### Folder Structure
```
api/
├── controllers/
│   ├── authController.js         # Login, logout, current user
│   ├── masterAdminController.js  # Admin & license key management
│   ├── adminController.js        # Website CRUD & license validation
│   └── publicController.js       # Public website access
├── models/
│   ├── User.js                   # User with roles (MASTER_ADMIN, ADMIN, PUBLIC_USER)
│   ├── LicenseKey.js             # License key with usage tracking
│   └── Website.js                # Website with relation/age/expiry
├── routes/
│   ├── auth.js                   # Authentication routes
│   ├── masterAdmin.js            # Master admin endpoints
│   ├── admin.js                  # Admin endpoints
│   └── public.js                 # Public endpoints
├── middleware/
│   ├── auth.js                   # JWT verification & role checking
│   ├── errorHandler.js           # Global error handling
│   └── validation.js             # Input validation
├── utils/
│   ├── templateMapping.js        # Template selection logic
│   ├── slugGenerator.js          # URL slug generation
│   ├── licenseKeyGenerator.js    # License key code generation
│   ├── qrCodeGenerator.js        # QR code generation
│   ├── cloudinaryService.js      # Image upload & optimization
│   └── jwtUtils.js               # JWT helper functions
├── config/
│   └── database.js               # MongoDB connection
├── index.js                      # Express app setup
└── package.json                  # Dependencies

```

## Key Features Implementation

### 1. Multi-Role Authentication

**Three User Roles:**
- `MASTER_ADMIN` - System administrator, manages all admins and license keys
- `ADMIN` - Website creator, can create/edit websites within license limits
- `PUBLIC_USER` - End users, no API access

**Login flow:**
```javascript
POST /api/auth/login
→ Verify email & password
→ Check role is ADMIN or MASTER_ADMIN
→ Generate JWT token (7 day expiry)
→ Return user + token
```

### 2. License Key System

**Features:**
- Each admin gets assigned a license key
- Daily license shows: `used/maxWebsites` (e.g., 3/5)
- Automatic expiry date handling
- Cannot create websites without valid license
- License limits are enforced server-side

**License validation flow:**
```
User creates website
→ Check admin has license key
→ Check key.status = 'active' & not expired
→ Check usedCount < maxWebsites
→ If valid: Create website & increment usedCount
→ If invalid: Return 403 error
```

### 3. Website Model

**Fields:**
- Basic: type, title, personName, relation, date, message
- Age: ageCategory (little/elder/child/teen/adult), ageGroup
- Media: imageUrl (Cloudinary), template (dynamic)
- URLs: slug (unique), publicUrl
- Status: isActive, status (active/inactive/expired/deleted)
- Analytics: viewCount, metadata (QR code, timestamps)
- Relationships: adminId, keyId

**Automatic Features:**
- Slug generation from personName
- QR code generation on creation
- Auto-status update if expires
- View count increment on public access

### 4. Template System

**21 templates** across 12 relation types with 3 age variants:
- Siblings: little_sister, elder_sister, little_brother, elder_brother
- Parents: father, mother
- Children: son (little/normal), daughter (little/normal)
- Others: friend, wife, husband
- Age categories: 0-5, 5-10, 10-15, 15-18, 18+

**Template selection:**
```javascript
getTemplatesForRelation('sister', 'little')
→ ['sister-cute-1', 'sister-princess-2', 'sister-balloon-3']

getTemplateDesign('sister-cute-1')
→ {
    name: 'Cute Sister',
    colors: ['#FF69B4', '#FFB6C1'],
    features: ['confetti', 'balloons'],
    bgColor: '#FFF0F5'
  }
```

### 5. Public Website Access

**No authentication required:**
```
GET /api/public/website/:slug
→ Check website exists & isActive
→ Check status = 'active' & not expired
→ Increment viewCount
→ Return limited public fields (no admin data)
```

**Public fields returned:**
- title, personName, type, relation
- date, message, template, imageUrl
- ageCategory, ageGroup, viewCount

### 6. QR Code Generation

**Automatic on website creation:**
```javascript
publicUrl = `${BASE_URL}/public/website/${slug}`
qrCode = generateQRCodeBase64(publicUrl)
// Store in website.metadata.qrCodeUrl
```

**Output formats:**
- Base64 PNG (for database storage)
- Data URL (for direct <img> tags)
- File output (for downloads)

## API Workflow Examples

### Example 1: Admin Creating Website

```bash
# Step 1: Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"pass123"}'

# Returns token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Step 2: Check license status
curl -X GET http://localhost:3001/api/admin/key/status \
  -H "Authorization: Bearer eyJhbGciOi..." \
  -H "Content-Type: application/json"

# Step 3: Create website
curl -X POST http://localhost:3001/api/admin/website/create \
  -H "Authorization: Bearer eyJhbGciOi..." \
  -H "Content-Type: application/json" \
  -d '{
    "type":"birthday",
    "title":"John'\''s Birthday",
    "personName":"John Smith",
    "relation":"brother",
    "ageCategory":"little",
    "date":"2024-12-15",
    "message":"Happy birthday!",
    "imageUrl":"https://res.cloudinary.com/...",
    "template":"brother-adventure-1"
  }'

# Returns:
# {
#   "success": true,
#   "data": {
#     "slug": "john-smith-a1b2c3d4",
#     "publicUrl": "http://localhost:3000/public/website/john-smith-a1b2c3d4",
#     "qrCode": "data:image/png;base64,iVBORw0KGgoo..."
#   }
# }
```

### Example 2: Get Admin's Websites

```bash
curl -X GET "http://localhost:3001/api/admin/website/list?page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGciOi..." \
  -H "Content-Type: application/json"
```

### Example 3: Public Access (No Auth)

```bash
curl http://localhost:3001/api/public/website/john-smith-a1b2c3d4
# Returns website data without auth required
```

## Database Setup

### MongoDB Collections

**Users Collection**
```json
{
  "email": "admin@example.com",
  "password": "hashed_password",
  "name": "Admin Name",
  "role": "ADMIN",
  "phoneNumber": "1234567890",
  "status": "active",
  "isAdmin": true,
  "avatar": "url",
  "isEmailVerified": false,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**License Keys Collection**
```json
{
  "keyCode": "BDAY-a1b2c3d4-abc123",
  "maxWebsites": 5,
  "usedCount": 2,
  "assignedTo": "admin_id",
  "expiresAt": "2025-12-31T00:00:00Z",
  "status": "active",
  "notes": "Assigned to John",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Websites Collection**
```json
{
  "adminId": "admin_id",
  "keyId": "key_id",
  "type": "birthday",
  "title": "John's Birthday",
  "personName": "John Smith",
  "relation": "brother",
  "ageCategory": "little",
  "ageGroup": "0-5",
  "date": "2024-12-15T00:00:00Z",
  "message": "Happy birthday!",
  "template": "brother-adventure-1",
  "imageUrl": "https://res.cloudinary.com/...",
  "slug": "john-smith-a1b2c3d4",
  "isActive": true,
  "status": "active",
  "expiresAt": "2025-01-15T00:00:00Z",
  "viewCount": 42,
  "metadata": {
    "qrCodeUrl": "data:image/png;base64,...",
    "createdAt": "2024-01-01T00:00:00Z",
    "lastEditedAt": "2024-01-05T00:00:00Z"
  }
}
```

## Error Handling

**Middleware error handling:**
- 400: Invalid input/missing fields
- 401: No token or invalid token
- 403: Insufficient permissions
- 404: Resource not found
- 409: Resource conflict (duplicate)
- 500: Server error

**Example error response:**
```json
{
  "success": false,
  "message": "Website limit reached. Maximum: 5, Used: 5",
  "error": "Details (dev only)"
}
```

## Security Implementation

1. **Password Hashing**: bcryptjs with 10 salt rounds
2. **JWT Tokens**: 7-day expiry, signed with secret
3. **Role-based Access**: Middleware checks role before endpoint access
4. **Input Validation**: express-validator + custom validators
5. **CORS**: Restricted to frontend URL
6. **Database Indexing**: Optimized queries on frequently searched fields
7. **Cloudinary Security**: API keys in environment variables

## Deployment on Vercel

### Steps
1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy serverless functions

### Vercel-specific setup
- `api/index.js` exports Express app
- MongoDB maintains persistent connection (connection pooling)
- Environment variables auto-loaded from Vercel

### Deploy command
```bash
vercel deploy --prod
```

## Testing Checklist

- [ ] Master admin can create admins
- [ ] Master admin can create license keys
- [ ] Admin can login with valid credentials
- [ ] Admin can create website with valid license
- [ ] Website creation increments license usage
- [ ] Website creation generates unique slug
- [ ] Website creation generates QR code
- [ ] Public access works without auth
- [ ] Public access increments viewCount
- [ ] License expiry blocks website creation
- [ ] Website expiry auto-updates status
- [ ] Admin can toggle website active/inactive
- [ ] Admin can update website details
- [ ] Admin can delete website (decrements usage)
- [ ] Slug uniqueness is enforced
- [ ] Invalid token returns 401

## Frontend Integration

### Login Example (React)
```javascript
const login = async (email, password) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    return data.data;
  }
};
```

### Protected Fetch
```javascript
const fetchProtected = (url, options = {}) => {
  const token = localStorage.getItem('token');
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
};
```

### Get Admin Websites
```javascript
const getWebsites = async (page = 1) => {
  return fetchProtected(`/api/admin/website/list?page=${page}`).then(r => r.json());
};
```

### Create Website
```javascript
const createWebsite = async (websiteData) => {
  return fetchProtected('/api/admin/website/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(websiteData)
  }).then(r => r.json());
};
```

## Next Steps

1. ✅ Database models created
2. ✅ Authentication middleware implemented
3. ✅ Controllers created
4. ✅ Routes implemented
5. ⏳ Frontend integration
6. ⏳ Full system testing
7. ⏳ Cloudinary integration testing
8. ⏳ Production deployment

## Support & Troubleshooting

**Common Issues:**

1. **"No license key assigned"**
   - Solution: Master admin needs to create key and assign to admin

2. **"Website limit reached"**
   - Solution: Delete unused websites or request license upgrade

3. **Cloudinary upload fails**
   - Check CLOUDINARY_* environment variables
   - Verify image format is supported

4. **QR code not generating**
   - Ensure BASE_URL is set correctly in .env
   - Check qrcode package is installed

5. **Token expired (401)**
   - Token expires after 7 days
   - User needs to login again
