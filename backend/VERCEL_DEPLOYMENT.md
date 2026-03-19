# Vercel Backend Deployment (API folder)

Create a new `api/vercel.json`:

```json
{
  "buildCommand": "npm install",
  "devCommand": "node index.js",
  "installCommand": "npm install",
  "framework": null,
  "nodeVersion": "18.x",
  "routes": [
    {
      "src": ".*",
      "dest": "index.js"
    }
  ]
}
```

## Steps to Deploy Backend:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy Backend (from api folder)**
   ```bash
   cd api
   vercel --prod
   ```

4. **Set Environment Variables in Vercel Dashboard:**
   - Go to Project Settings → Environment Variables
   - Add:
     - `MONGODB_URI` = your MongoDB connection string
     - `JWT_SECRET` = your secret key
     - `CLOUDINARY_CLOUD_NAME` = your Cloudinary cloud name
     - `CLOUDINARY_API_KEY` = your API key
     - `CLOUDINARY_API_SECRET` = your API secret
     - `NODE_ENV` = production
     - `API_URL` = https://your-backend-url.vercel.app
     - `FRONTEND_URL` = https://your-frontend-domain.vercel.app

5. **Get Backend URL**
   - After deployment, Vercel will provide: `https://your-project-name.vercel.app`
   - This is your BACKEND API URL

6. **Update Frontend**
   - In frontend Vercel settings, set:
     - `VITE_API_URL` = https://your-backend-url.vercel.app/api

7. **Redeploy Frontend**
   ```bash
   vercel --prod
   ```

## Verification:

Check if backend is running:
```bash
curl https://your-backend-url.vercel.app/api/health
```

Should return:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-03-19T..."
}
```
