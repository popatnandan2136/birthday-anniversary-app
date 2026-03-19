# Firebase Setup Guide

This guide walks you through setting up Firebase for the Birthday & Anniversary Celebration Website Generator.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project"
3. Enter project name: `birthday-anniversary-generator`
4. Accept terms and click "Create project"
5. Wait for Firebase to initialize

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**:
   - Click the Email/Password provider
   - Toggle "Enable" ON
   - Click "Save"

## Step 3: Create Admin User

1. Go to **Authentication** → **Users**
2. Click "Add user"
3. Enter test credentials:
   - Email: `admin@example.com`
   - Password: `password123` (use strong password in production)
4. Click "Add user"

## Step 4: Enable Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Select region (closest to your users)
4. Choose "Start in test mode" (we'll secure it next)
5. Click "Create"

## Step 5: Secure Firestore

1. Go to **Firestore Database** → **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /wishes/{document=**} {
      // Public read access for active wishes only
      allow read: if resource.data.status == 'active';
      
      // Authenticated users can write/delete
      allow write, delete: if request.auth != null && 
        (request.auth.uid == request.resource.data.userId ||
         isAdmin(request.auth.uid));
      
      // Admins have full access
      allow read, write, delete: if isAdmin(request.auth.uid);
    }
    
    // Helper function to check admin status
    function isAdmin(uid) {
      return exists(/databases/$(database)/documents/admins/$(uid));
    }
  }
}
```

3. Click "Publish"

**Optional:** Create admin document in Firestore:
- Collection: `admins`
- Document ID: `<user-uid-from-auth>`
- Create empty document

## Step 6: Enable Cloud Storage

1. Go to **Storage**
2. Click "Get started"
3. Start in test mode
4. Select a location (same region as Firestore recommended)
5. Create storage bucket

## Step 7: Secure Cloud Storage

1. Go to **Storage** → **Rules** tab
2. Replace default rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload
    match /photos/{allPaths=**} {
      allow read: if true;  // Public read
      allow write: if request.auth != null;  // Auth required
    }
    match /videos/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /music/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Publish rules

## Step 7.1: Configure CORS for Storage

To allow your Vercel-deployed application to upload photos to Firebase Storage, you must configure CORS (Cross-Origin Resource Sharing) for your storage bucket.

1.  Make sure you have the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) installed.
2.  In your terminal, run the following command from the root of this project:
   ```bash
   gsutil cors set cors.json gs://birthday-anniversary-app-2136.firebasestorage.app
   ```

This will apply the configuration in `cors.json` to your bucket, allowing requests from your Vercel production URL.

## Step 8: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click "Web" (</>) if no web app exists, otherwise select existing
4. Copy the Firebase config object

Your config should look like:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "project.firebaseapp.com",
  projectId: "project-id",
  storageBucket: "project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc...",
  measurementId: "G-ABC..."
};
```

## Step 9: Set Environment Variables

1. In project root, create/edit `.env.local`:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=project-id
VITE_FIREBASE_STORAGE_BUCKET=project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc...
VITE_FIREBASE_MEASUREMENT_ID=G-ABC...
```

**Important:** Never commit `.env.local` to GitHub!

## Step 10: Test the Setup

1. Run the dev server:
   ```bash
   npm install
   npm run dev
   ```

2. Visit login page:
   ```
   http://localhost:3000/login
   ```

3. Login with test credentials:
   - Email: `admin@example.com`
   - Password: `password123`

4. Should redirect to admin dashboard

## Step 11: Create First Wish (Optional)

1. Click "Create Birthday" in sidebar
2. Fill out multi-step form
3. Upload test photos
4. Create wish

5. Check Firestore:
   - Go to Firestore Database → wishes collection
   - Should see your new wish document

6. Test public page:
   - Copy the public link from admin panel
   - Visit in new browser tab (no need to login)

## Firebase Emulator Setup (Optional, for local testing)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize emulator
firebase init emulators

# Start emulator
firebase emulators:start
```

Then update `.env.local` to use emulator:
```env
VITE_USE_EMULATOR=true
# ... other vars
```

## Production Deployment

### Before Going Live:

1. **Update Firestore Rules:**
   - Remove "test mode" references
   - Update with production rules (see Step 5)

2. **Enable Email Verification:**
   - Authentication → Templates
   - Customize email verification messages

3. **Set Storage Limits:**
   - Set file size limits in rules
   - Monitor quota usage

4. **Enable Backups:**
   - Firestore → Backups & Restore
   - Enable automated daily backups

5. **Update Authentication:**
   - Add real admin emails
   - Set up password reset flow (optional)

### Firestore Indexes:

The app uses simple queries that may create indexes automatically. If you see index creation requests:

1. Go to **Firestore Database** → **Indexes**
2. Let Firebase create recommended indexes
3. Indexes will auto-populate for queries like:
   - By status (ascending)
   - By createdAt (descending)
   - By type and createdAt

## Troubleshooting

### "Firebase is not defined"
- Check `.env.local` has VITE_ prefix
- Restart dev server after editing .env

### Cannot upload files
- Check Storage rules are published
- Verify authenticated user has write permission
- Check file size limits (10MB photos, 100MB videos, 20MB audio)

### Wish not appearing in database
- Check Firestore is enabled
- Verify you're logged in (check auth state in console)
- Check browser doesn't have Content Security Policy violations

### Security rules permission denied
- Check `.env.local` has correct projectId
- Verify authenticated user exists in Firebase
- Check Admin document exists if using role-based access

## Next Steps

1. Customize templates in `/src/templates/`
2. Add more relations/age groups if needed
3. Customize theme colors in `tailwind.config.js`
4. Test with real data
5. Deploy to Vercel
6. Set up custom domain

---

For more help:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Guide](https://firebase.google.com/docs/auth)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Cloud Storage Guide](https://firebase.google.com/docs/storage)
