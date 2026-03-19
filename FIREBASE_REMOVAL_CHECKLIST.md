# REMOVING FIREBASE - Complete Checklist

## Step 1: Delete Firebase Files

These folders/files can be safely deleted as they're no longer needed:

```bash
rm -rf src/firebase/
rm -f firebase.json
rm -f FIREBASE_SETUP.md
rm -f firestore.rules
rm -f storage.rules
rm -f service-account.json
rm -f write-sa.js
rm -f check-bucket.js
```

Or manually delete:
- ✅ `/src/firebase/` folder (authService.js, firebaseConfig.js, firestoreService.js, storageService.js)
- ✅ `firebase.json`
- ✅ `firestore.rules`
- ✅ `storage.rules`
- ✅ `service-account.json`
- ✅ `write-sa.js`
- ✅ `check-bucket.js`
- ✅ `FIREBASE_SETUP.md`

## Step 2: Remove Firebase from package.json

Already done. Verify these are removed:
```json
// REMOVED:
"firebase": "^10.7.0",
"firebase-admin": "^13.7.0",
"@google-cloud/storage": "^7.19.0"

// ADDED:
"axios": "^1.6.2"
```

## Step 3: Search for Firebase Imports in Code

Search for any remaining Firebase imports and replace them:

```bash
# Search for Firebase imports
grep -r "from.*firebase" src/
grep -r "import.*firebase" src/
```

Expected: None (should be empty)

## Step 4: Update Component Imports

Any components that imported from `../firebase/*` should now use:

```javascript
// OLD:
import { loginUser } from '../firebase/authService';
import { uploadPhoto } from '../firebase/storageService';
import { createWish } from '../firebase/firestoreService';

// NEW:
import { authAPI, eventsAPI } from '../services/apiService';
import { useAuth } from '../hooks/useAuth';
```

## Step 5: Files to Update (Priority Order)

### 🔴 CRITICAL - Must Update

1. **Login.jsx** - Authentication
   - Replace: `loginUser()` → `useAuth().login()`
   - Store token in localStorage (done automatically)

2. **pages/WishPage.jsx** - Display public wishes
   - Replace: `getWishBySlug()` → `eventsAPI.getPublicEventBySlug()`

3. **pages/AdminDashboard.jsx** - User dashboard
   - Replace: `getWishsByUserId()` → `eventsAPI.getUserEvents()`
   - Replace: `deleteWish()` → `eventsAPI.deleteEvent()`

4. **pages/CreateBirthday.jsx** - Create events
   - Replace: `uploadPhoto()` → Handled by `eventsAPI.createEvent()`
   - Replace: `createWish()` → `eventsAPI.createEvent()`

5. **pages/CreateAnniversary.jsx** - Same as CreateBirthday

6. **components/FileUploader.jsx** - Image uploads
   - Replace: `uploadPhoto()` → `eventsAPI` handles this
   - Just pass file to API

### 🟡 IMPORTANT - Should Update

7. **components/ProtectedRoute.jsx** - Auth checks
   - Already uses `useAuth()` hook
   - Verify it checks `user` from context

8. **src/main.jsx** - App entry
   - Verify `AuthProvider` is wrapping app
   - Should already be correct

9. **App.jsx** - Main app file
   - Verify routes are set up
   - Check protected routes

### 🟢 NICE TO HAVE - Optional

10. **AdminWishesTable.jsx** - Data table
    - Use `eventsAPI.getUserEvents()`

11. Other components using Firebase services

## Step 6: Verification

After updating:

1. **Check for Firebase references:**
   ```bash
   grep -r "firebase" src/ --include="*.js" --include="*.jsx"
   ```
   Should return: 0 results

2. **Check imports are correct:**
   ```bash
   grep -r "from.*apiService" src/ --include="*.jsx"
   grep -r "from.*useAuth" src/ --include="*.jsx"
   ```
   Should show your new imports

3. **Test locally:**
   ```bash
   npm install
   npm run dev
   ```
   - Test login/register
   - Test event creation with image
   - Test viewing public events

## Step 7: Environment Variables

Update `.env.local` to include:
```
VITE_API_URL=http://localhost:3001/api
```

## Step 8: Update .gitignore

Add Node environment files:
```
# Root .gitignore should include:
.env.local
.env.*.local
```

## Reference: Old Firebase Code Patterns → New Patterns

### Authentication

**OLD:**
```javascript
import { loginUser } from '../firebase/authService';
await loginUser(email, password);
```

**NEW:**
```javascript
import { useAuth } from '../hooks/useAuth';
const { login } = useAuth();
await login(email, password);
```

### Database Operations

**OLD:**
```javascript
import { createWish } from '../firebase/firestoreService';
const wishId = await createWish(wishData);
```

**NEW:**
```javascript
import { eventsAPI } from '../services/apiService';
const response = await eventsAPI.createEvent(wishData);
const eventId = response.data.event._id;
```

### Image Upload

**OLD:**
```javascript
import { uploadPhoto } from '../firebase/storageService';
const imageUrl = await uploadPhoto(file);
```

**NEW:**
```javascript
import { eventsAPI } from '../services/apiService';
// Image is uploaded as part of event creation
const response = await eventsAPI.createEvent(eventData, imageFile);
```

### Reading Data

**OLD:**
```javascript
import { getWishBySlug } from '../firebase/firestoreService';
const wish = await getWishBySlug(slug);
```

**NEW:**
```javascript
import { eventsAPI } from '../services/apiService';
const response = await eventsAPI.getPublicEventBySlug(slug);
const event = response.data.event;
```

## Troubleshooting

**Error: Cannot find module 'firebase'**
- Run: `npm install`
- Clear node_modules: `rm -rf node_modules && npm install`

**Error: Fire

base auth not initialized**
- Check that AuthProvider is wrapping app
- Check that AuthContext is not importing from old Firebase

**API calls returning 404**
- Verify backend is running (`npm run dev` in api/ folder)
- Check VITE_API_URL in .env.local
- Check backend port is 3001 (or update URL)

**Token-related errors**
- Token should auto-update in localStorage
- Check localStorage in browser DevTools
- Clear localStorage and login again if stale token

## Deployment Checklist

- [ ] All Firebase files deleted
- [ ] No Firebase imports in code
- [ ] Backend running locally
- [ ] Frontend API calls working
- [ ] Login/Register working
- [ ] Event creation working
- [ ] Image upload working
- [ ] Backend deployed to Vercel
- [ ] Frontend .env updated with VITE_API_URL
- [ ] Frontend deployed to Vercel
- [ ] Production testing complete

