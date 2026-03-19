# 🎉 Birthday & Anniversary Celebration Website Generator

A production-ready React application that allows admins to create personalized, shareable celebration websites for birthdays and anniversaries.

## 🚀 Features

### Admin Panel (`/admin`)
- ✅ Secure JWT-based authentication
- ✅ Protected protected routes
- ✅ Dashboard with wish management
- ✅ View, Edit, Delete, Activate/Deactivate wishes
- ✅ Copy public links and generate QR codes

### Birthday Wish Creation
- ✅ Multi-step smart form with conditional fields
- ✅ Smart relation system (Sister → Little/Elder, etc.)
- ✅ Age-group based template selection (0-5, 5-10, 10-15, 15-18, 18+)
- ✅ 12+ customizable birthday templates
- ✅ Support for all relations: Sister, Brother, Son, Daughter, Friend, Father, Mother, Wife, Husband

### Anniversary Wish Creation
- ✅ Couple-focused form
- ✅ 6 romantic anniversary templates
- ✅ Love message and special memory fields

### Public Wish Pages
- ✅ Shareable public links: `/wish/:slug`
- ✅ Animated template rendering
- ✅ Photo gallery with smooth transitions
- ✅ Auto-play background music (with consent)
- ✅ Video player support
- ✅ Social sharing: WhatsApp, Telegram, Direct Link, QR Code
- ✅ Confetti and balloon animations
- ✅ Fully responsive (mobile-first design)

### Media Management
- ✅ Multiple photo uploads
- ✅ Optional video upload (max 100MB)
- ✅ Background music upload (max 20MB)
- ✅ Cloudinary integration for media storage
- ✅ Automatic URL management

### Animations
- ✅ Page transitions with Framer Motion
- ✅ Confetti effect on page load
- ✅ Floating balloons
- ✅ Gallery swipe animations
- ✅ Text fade-in effects
- ✅ Respects prefers-reduced-motion

## 📋 Tech Stack

**Frontend:**
- React 18.2+ with Vite
- Tailwind CSS 3.3+
- Framer Motion (animations)
- React Router 6.20+

**Backend:**
- MongoDB Atlas (database)
- Cloudinary (file uploads)
- JWT (authentication)
- Node.js & Express (API server)

**Deployment:**
- Vercel (frontend & backend)

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ and npm 9+
- MongoDB Atlas account
- Cloudinary account
- Vercel account (for deployment)

### Step 1: Clone & Install

```bash
git clone <your-repo-url>
cd "BirthdayAniversary Web"
npm install
```

### Step 2: Backend Configuration

1. Create a MongoDB Atlas cluster.
2. Create a Cloudinary account and get your API credentials.
3. Configure your JWT secret for authentication.

### Step 3: Environment Variables

Create `.env.local` in the project root (for frontend):

```env
VITE_API_URL=http://localhost:3001/api
```

Create `.env` in the `api/` directory (for backend):

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 4: Environment Variables on Vercel

Make sure to add all variables from Step 3 to your Vercel project settings.

### Step 5: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

Default routes:
- Admin: `http://localhost:3000/admin`
- Login: `http://localhost:3000/login`

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── FileUploader.jsx
│   ├── PhotoGallery.jsx
│   ├── MusicPlayer.jsx
│   ├── ConfettiEffect.jsx
│   ├── FloatingBalloons.jsx
│   ├── SocialShareButtons.jsx
│   ├── QRCodeGenerator.jsx
│   ├── TemplateDispatcher.jsx
│   └── ProtectedRoute.jsx
├── pages/               # Page components
│   ├── Login.jsx
│   ├── AdminDashboard.jsx
│   ├── AdminWishesTable.jsx
│   ├── CreateBirthday.jsx
│   ├── CreateAnniversary.jsx
│   ├── WishPage.jsx
│   └── NotFound.jsx
├── templates/
│   ├── birthday/        # 30+ birthday templates
│   │   ├── SisterCuteTemplate1.jsx
│   │   ├── index.jsx    # All birthday templates export
│   │   └── ...
│   └── anniversary/     # 6 anniversary templates
│       ├── index.jsx    # All anniversary templates export
│       └── ...
├── services/            # API services (axios)
│   └── apiService.js
├── hooks/               # Custom hooks
│   ├── useAuth.js
│   ├── useResponsive.js
│   ├── useNotification.js
│   └── useFetch.js
├── utils/               # Utility functions
│   ├── constants.js
│   ├── generateSlug.js
│   ├── templateMapping.js
│   ├── validation.js
│   └── formatDate.js
├── index.css            # Global styles
├── App.jsx              # Main app & routing
└── main.jsx             # Entry point
```

## 🎨 Admin Features in Detail

### Dashboard Navigation
- **All Wishes** → View, filter, search all created wishes
- **Create Birthday** → Multi-step birthday form
- **Create Anniversary** → Anniversary wish form

### Wish Management
- **Status Toggle:** Activate/Deactivate wishes
- **Copy Link:** Quick copy public wish URL
- **QR Code:** Generate and download QR code
- **Delete:** Permanently delete wish and media
- **Filter:** By type (Birthday/Anniversary) and status

### Birthday Form (5 Steps)

**Step 1: Relation**
- Select: Sister, Brother, Son, Daughter, Friend, Father, Mother, Wife, Husband, Custom
- Conditional: Sister → Little/Elder; Brother → Little/Elder

**Step 2: Age Group** (if applicable)
- Applies to: Son, Daughter, Little Sister, Little Brother
- Options: 0-5, 5-10, 10-15, 15-18, 18+

**Step 3: Person Details**
- Name (required)
- Birth date (required)
- Birthday message (required, 5+ chars)

**Step 4: Media**
- Photos (required, multiple)
- Video (optional, max 100MB)
- Music (optional, max 20MB)

**Step 5: Theme & Template**
- Theme color picker
- Template selection (dynamically populated based on relation/age)

### Anniversary Form (4 Steps)

**Step 1: Couple Details**
- Husband's name
- Wife's name
- Marriage date

**Step 2: Messages**
- Love message (required)
- Special memory (optional)

**Step 3: Media**
- Photos (required)
- Video (optional)
- Music (optional)

**Step 4: Theme & Template**
- Theme color picker
- 6 romantic template options

## 🎯 Public Wish Page Features

- **Dynamic Template Rendering** based on saved template type
- **Photo Gallery** with smooth transitions and thumbnail navigation
- **Auto-Play Music** with play/pause controls and progress bar
- **Confetti Animation** on page load
- **Floating Balloons** (birthday pages)
- **Social Sharing Buttons:**
  - WhatsApp with personalized message
  - Telegram share
  - Copy link to clipboard
  - Download QR code
- **Fully Responsive** (mobile-first design)

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set environment variables (copy from `.env.local`)
   - Deploy

3. **Vercel Configuration** (already included in `vercel.json`)
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist"
   }
   ```

### Setup Custom Domain (Optional)

1. Go to Vercel project settings
2. Add custom domain
3. Update DNS records (depends on domain provider)

## 📱 Responsive Design Breakpoints

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

All components use mobile-first CSS and responsive utilities.

## 🔒 Security Features

✅ **Authentication:**
- Firebase Email/Password auth
- Protected admin routes
- Session persistence

✅ **Database Security:**
- Firestore security rules enforce permissions
- Public read access only for active wishes
- Write access restricted to authenticated users

✅ **File Upload Security:**
- Firebase Storage size limits (100MB video, 20MB music, 10MB photos)
- File type validation
- Automatic URL management

## 🎨 Customization Guide

### Adding New Birthday Templates

1. Create new component in `src/templates/birthday/`:
   ```jsx
   export const MyNewTemplate = ({ personName, message, photos, music, themeColor, slug }) => {
     return (
       <div>
         {/* Your template UI */}
       </div>
     );
   };
   ```

2. Add to `src/utils/templateMapping.js`:
   ```javascript
   sister: [
     { id: 'my-template', label: 'My Template', component: 'MyNewTemplate' }
   ]
   ```

3. Template dynamically loads on public wish page!

### Customizing Theme Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#your-color',      // Main accent color
  secondary: '#your-color',    // Hover states
  accent: '#your-color',       // Highlights
}
```

### Adding New Relations

1. Update `src/utils/constants.js`:
   ```javascript
   RELATION_CHOICES.push({ value: 'new-relation', label: 'New Relation' })
   ```

2. Add templates to `templateMapping.js`
3. Form automatically adapts!

## 🐛 Troubleshooting

### Build Issues

**Large chunk warning:**
- Normal for first build
- Can be optimized with code-splitting later

**Database errors:**
- Verify MongoDB connection string.
- Check if your IP is whitelisted in MongoDB Atlas.

**Dependency conflicts:**
- `.npmrc` file includes `legacy-peer-deps=true`
- If issues persist: `npm install --legacy-peer-deps`

## 📊 Database Schema

### Wishes Collection

```javascript
{
  id: string,               // Auto-generated
  type: 'birthday' | 'anniversary',
  
  // Birthday fields
  personName?: string,
  relation?: string,
  ageCategory?: string,
  ageGroup?: string,
  birthDate?: date,
  
  // Anniversary fields
  husbandName?: string,
  wifeName?: string,
  marriageDate?: date,
  specialMemory?: string,
  
  // Common fields
  message: string,
  photos: string[],         // URLs from Firebase Storage
  video?: string,           // URL from Firebase Storage
  music?: string,           // URL from Firebase Storage
  template: string,         // Template ID
  themeColor: string,       // Hex color
  slug: string,             // URL-safe slug
  status: 'active' | 'inactive',
  
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 📝 API Reference

The application uses a unified `apiService.js` to interact with the backend.

### Auth API
- `login(email, password)`
- `logout()`
- `getCurrentUser()`

### Website API
- `createWebsite(data)`
- `getAdminWebsites()`
- `getWebsite(id)`
- `updateWebsite(id, data)`
- `deleteWebsite(id)`

### Image API
- `uploadImage(file)`
- `uploadImages(files)`
uploadPhotos(files)                    // Upload multiple photos
uploadVideo(file)                      // Upload single video
uploadMusic(file)                      // Upload single audio
deleteFile(fileURL)                    // Delete from storage
deleteFiles(fileURLs)                  // Delete multiple files

### Auth Service

```javascript
loginUser(email, password)             // Login
logoutUser()                           // Logout
getCurrentUser()                       // Get current user
onAuthStateChangedListener(callback)  // Listen to auth changes
```

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add YourFeature'`)
4. Push to branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## 📄 License

MIT License - Feel free to use in personal and commercial projects

## 💬 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review Firebase docs for specific issues

## 🙏 Acknowledgments

- Firebase for excellent backend services
- Vercel for simple deployments
- Framer Motion for smooth animations
- Tailwind CSS for utility-first styling

---

**Made with 💖 for celebrating life's special moments!**

---

## 🎯 Quick Start Command

```bash
# Install dependencies
npm install

# Set up .env.local with Firebase credentials

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

Happy celebrating! 🎉🎂💑
