# Deployment Guide - Vercel

Complete step-by-step guide to deploy the Birthday & Anniversary Celebration Website Generator to Vercel.

## Prerequisites

- ✅ Project setup complete (see README.md)
- ✅ Project setup complete (see README.md)
- ✅ MongoDB Atlas account
- ✅ Cloudinary account
- ✅ GitHub account
- ✅ Vercel account (free tier available)

## Step 1: Push to GitHub

### Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `birthday-anniversary-generator`
3. Description: "Personalized celebration website generator"
4. Make it **Public** (or Private if preferred)
5. Click "Create repository"

### Push Project to GitHub

```bash
cd "BirthdayAniversary Web"

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Birthday & Anniversary platform"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/birthday-anniversary-generator.git

# Push to main branch
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Fastest)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd "BirthdayAniversary Web"
vercel
```

Follow prompts:
- Scope: Your account
- Project name: `birthday-anniversary-generator`
- Framework: `Vite`
- Root directory: `./`
- Build: `npm run build`
- Output: `dist`

### Option B: Using Vercel Dashboard (Recommended for continuous deployment)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Import Project"
4. Select your GitHub repository
5. Click "Import"

### Configure Environment Variables

**On Vercel Dashboard:**

1. Go to your project
2. Settings → Environment Variables
3. Add the following variables:

**For Frontend:**
- `VITE_API_URL` = `/api` (unified deployment)

**For Backend:**
- `MONGODB_URI` = your_mongodb_connection_string
- `JWT_SECRET` = your_secure_jwt_secret
- `CLOUDINARY_CLOUD_NAME` = your_cloud_name
- `CLOUDINARY_API_KEY` = your_api_key
- `CLOUDINARY_API_SECRET` = your_api_secret

### Deploy

1. Click "Deploy" button
2. Wait for build to complete (~2-3 minutes)
3. Should see "Build successful" message
4. Your site is live! 🎉

## Step 3: Configure Custom Domain (Optional)

### Add Domain to Vercel

1. Go to project Settings → Domains
2. Enter your domain (e.g., `celebrations.com`)
3. Click "Add"
4. Follow DNS configuration instructions:
   - For `.com` domains through most registrars:
   - Add CNAME record pointing to `cname.vercel-dns.com`

### Typical DNS Configuration

| Type | Name | Value |
|------|------|-------|
| CNAME | www | cname.vercel-dns.com |
| A | @ | 76.76.19.89 |

**Note:** DNS changes take 24-48 hours to propagate

## Step 4: Test Deployment

### Verify Application Works

1. Visit your Vercel URL (e.g., `https://birthday-anniversary-generator.vercel.app`)
2. You should see the login page
3. Login with test credentials
4. Test admin features:
   - ✅ Create Birthday wish
   - ✅ Upload test photos
   - ✅ Create Anniversary wish
   - ✅ View wishes table
   - ✅ Copy public links
   - ✅ Generate QR codes

### Test Public Wish Page

1. Copy public link from admin panel
2. Open in incognito window (to test without login)
3. Should see animated wish page
4. Test all features:
   - ✅ Photo gallery
   - ✅ Music player
   - ✅ Social share buttons
   - ✅ QR code
   - ✅ Animations

## Step 5: Continuous Deployment

### Enable Auto-deploy

By default, Vercel automatically deploys on every push to main branch.

To control this:

1. Go to project Settings → Git
2. Choose deployment strategy:
   - **Automatic (default):** Deploy on every push
   - **Preview:** Only deploy on pull requests
   - **Manual:** Deploy only when triggered

### Deploy Previews

On every pull request, Vercel creates a preview URL:
- Test changes before merging
- Share previews with team
- Each preview is a full deployment

## Step 6: Monitoring & Maintenance

### Check Deployment Status

1. Go to project → Deployments tab
2. See history of all deployments
3. Click any deployment to view logs

### Analytics

1. Settings → Analytics
- View traffic
- Performance metrics
- Error tracking

## Performance Optimization

### Suggested optimizations for production:

1. **Enable Code Splitting:**
   Update `vite.config.js`:
   ```javascript
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
           'framer': ['framer-motion'],
         }
       }
     }
   }
   ```

2. **Image Optimization:**
   - Consider adding `next-image-export-optimizer` or similar
   - Compress images before upload

3. **Bundle Analysis:**
   ```bash
   npm install --save-dev rollup-plugin-analyze
   ```

## Secrets & Security

### Firebase Environment Variables

✅ **Always secure:**
- Never commit `.env.local`
- Use Vercel environment variables UI
- Different values for dev/prod if needed

✅ **Firebase Security Rules:**
- Verify rules are production-ready
- Test thoroughly before deploying
- Monitor Firestore activity

### Rate Limiting (Future Enhancement)

Consider adding rate limiting for:
- File uploads
- Form submissions
- API calls

## Rollback to Previous Deployment

If something goes wrong:

1. Go to Deployments tab
2. Find previous working deployment
3. Click menu (•••)
4. Select "Promote to Production"

Instant rollback! ⚡

## Troubleshooting Deployment

### Build Errors

```bash
# Check build locally first
npm run build

# View detailed error logs
npm run build --verbose
```

### Environment Variables Not Working

1. Verify variable names have `VITE_` prefix
2. Verify in Vercel Settings → Environment Variables
3. Redeploy after adding/changing variables

### Database Connection Issues

1. Check MongoDB credentials and connection string.
2. Verify Network Access in MongoDB Atlas (allow 0.0.0.0/0 for Vercel).

### Slow Initial load

- Normal for Vite production build
- ~2-3 second initial load on first visit
- Subsequent loads cached

## Scaling & Limits

### Vercel Limits (Free Tier)

- ✅ Unlimited deployments
- ✅ Unlimited bandwidth
- ✅ 12 concurrent builds
- ✅ 2.5 GB cache per week
- ✅ Custom domains included

### Firebase Limits (Spark Plan)

- ✅ 1GB Firestore storage
- ✅ 5GB Cloud Storage
- ✅ 50,000 reads/day
- ✅ 20,000 writes/day

**Upgrade to paid plans if you exceed these limits.**

## Maintenance Schedule

### Weekly
- Monitor error rates in Vercel Analytics
- Check Firebase quota usage

### Monthly
- Review storage usage
- Check for unusual activity
- Update dependencies: `npm update`

### Quarterly
- Security audit of rules
- Performance optimization
- User feedback review

## Common Post-Deployment Tasks

### Add Admin Users

1. Go to Firebase Console
2. Authentication → Users
3. Add new user email
4. User can immediately login

### Backup Data

1. Firestore → Backups
2. Enable automated daily backups
3. Or export manually: `gcloud firestore export`

### Monitor Usage

1. Vercel Dashboard → Analytics
2. Firebase Console → Usage
3. Set up alerts for quota limits

## Next Steps

1. ✅ Test all features thoroughly
2. ✅ Add real admin users
3. ✅ Setup email notifications (future feature)
4. ✅ Monitor performance
5. ✅ Gather user feedback
6. ✅ Plan future enhancements

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Deployment Guide](https://firebase.google.com/docs/hosting/deploying)
- [Vite Build Guide](https://vitejs.dev/guide/build)
- [Tailwind CSS Deployment](https://tailwindcss.com/docs/deployment)

## Environment Variables Checklist

Before deploying, verify:

- [ ] All `VITE_FIREBASE_*` variables set
- [ ] No hardcoded API keys in code
- [ ] `.env.local` is in `.gitignore`
- [ ] Firebase project is accessible from production domain
- [ ] CORS headers configured (if needed)

---

**Deployment Complete!** 🚀

Your Birthday & Anniversary platform is now live and ready to celebrate special moments!

To make updates:
```bash
# Make changes locally
# Test: npm run dev
# Build: npm run build
# Push to GitHub
git add .
git commit -m "Your message"
git push origin main
# Vercel automatically deploys!
```

Happy celebrating! 🎉
