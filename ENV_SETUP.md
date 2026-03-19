# Environment Configuration

## Development Setup

Copy `.env.example` to `.env` and fill in the values:

```bash
cp api/.env.example api/.env
```

## Required Environment Variables

### Database
```
MONGODB_URI=mongodb+srv://nandanpoapt_db_user:NKkH11KMA3pV8rrn@birthday-aniversaey-web.4wsfwez.mongodb.net/birthday-anniversary-db
```

### JWT Configuration
```
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRE=7d
```

### Cloudinary (Image Storage)
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

To get Cloudinary credentials:
1. Sign up at https://cloudinary.com
2. Go to Dashboard → Settings → API Keys
3. Copy `Cloud Name`, `API Key`, and `API Secret`

### Base URL
```
BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

In production:
```
BASE_URL=https://yourapp.com
FRONTEND_URL=https://yourapp.com
```

### Node Environment
```
NODE_ENV=development
PORT=3001
```

## Complete .env File Template

```bash
# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database-name

# JWT
JWT_SECRET=your-secret-key-min-32-characters-long
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# URLs
BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# Server
NODE_ENV=development
PORT=3001
```

## Security Notes

⚠️ **DO NOT commit `.env` file to version control**

1. Change `JWT_SECRET` in production
2. Use strong, unique values for all secrets
3. Rotate API keys regularly
4. Never share credentials in code
5. Use environment-specific configurations

## Testing Credentials

For development/testing, you can use these test users:

### Master Admin Login
```json
{
  "email": "master@example.com",
  "password": "masterpass123",
  "role": "MASTER_ADMIN"
}
```

### Admin Login
```json
{
  "email": "admin@example.com",
  "password": "adminpass123",
  "role": "ADMIN"
}
```

## Installing Dependencies

```bash
# Install API dependencies
cd api
npm install

# Main dependencies installed:
- express (web server)
- mongoose (MongoDB ORM)
- jsonwebtoken (JWT auth)
- bcryptjs (password hashing)
- cloudinary (image storage)
- qrcode (QR code generation)
- multer (file upload)
- cors (cross-origin requests)
- dotenv (environment variables)
```

## Vercel Deployment Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-production-secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
BASE_URL=https://your-vercel-domain.vercel.app
FRONTEND_URL=https://your-frontend-domain
NODE_ENV=production
```

## Database Indexes

MongoDB automatically creates indexes defined in schemas for:
- Admin websites: `adminId + status`
- Website slugs: `slug`
- Website dates: `date`
- Website expiry: `expiresAt`
- License keys: `assignedTo`, `keyCode`, `status`

These indexes optimize query performance.
