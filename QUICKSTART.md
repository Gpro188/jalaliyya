# 🚀 Quick Start Guide

Get the Jalaliyya PDF Viewer app running in 5 minutes!

## Prerequisites
- Node.js installed
- npm or yarn
- Expo Go app on your phone (iOS/Android)

## Step 1: Install Dependencies

```bash
cd PDF_Viewer_App
npm install
```

## Step 2: Start the App

```bash
npm start
```

## Step 3: Run on Device

**Option A: Physical Device (Recommended)**
1. Install **Expo Go** app from App Store or Play Store
2. Scan the QR code shown in terminal
3. App will load on your device

**Option B: Emulator/Simulator**
- Press `a` for Android emulator
- Press `i` for iOS simulator

## That's It! 🎉

The app should now be running. You can:
- Browse categories on the home screen
- View the beautiful custom icons
- Test the UI and navigation

---

## Optional: Setup Backend (For Admin Features)

To enable PDF upload/download functionality:

### 1. Create Supabase Account
- Go to https://supabase.com
- Sign up and create a new project

### 2. Setup Database & Storage
Follow the detailed guide: **[SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md)**

Quick steps:
1. Create `categories` table
2. Create `pdf_files` table
3. Create `pdfs` storage bucket (public)
4. Copy your project URL and anon key

### 3. Update Configuration

Edit `src/config/supabase.js`:

```javascript
const supabaseUrl = 'YOUR_PROJECT_URL';
const supabaseAnonKey = 'YOUR_ANON_KEY';
```

### 4. Restart the App

```bash
npm start
```

Now admin features will work:
- Upload PDFs
- Delete PDFs
- Manage categories
- Users can download PDFs

---

## Troubleshooting

**App won't start?**
```bash
# Clear cache and restart
npm start -- --clear
```

**Dependencies error?**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

**Supabase connection error?**
- Check your internet connection
- Verify credentials in `src/config/supabase.js`
- Check Supabase dashboard for project status

---

## Need Help?

- 📖 Full documentation: [README.md](./README.md)
- 🔧 Setup guide: [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md)
- 📝 Changes log: [CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md)

---

**Happy coding! 🎨📱**
