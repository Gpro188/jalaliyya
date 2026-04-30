# Jalaliyya PDF Viewer App

A beautiful Islamic PDF reader app for accessing Qur'an, Moulid, Dikr, Dua, and other Islamic literature. Built with React Native and Expo.

## Features

### User Features
- 📚 **Category-Based Organization**: Browse PDFs by categories (Qur'an, Dikr, Dua, Swalath, Moulid, Baith, Ratheeb, Others)
- 🎨 **Beautiful Custom Icons**: Line-art style SVG icons for each category
- ⬇️ **Offline Reading**: Download PDFs for offline access
- 🔄 **Update Notifications**: Check for new PDF updates
- 💾 **Local Storage**: PDFs are cached locally for fast access
- 🌓 **Theme Support**: Multiple color themes
- ❤️ **Favorites**: Save your favorite PDFs
- 🔍 **Search**: Find PDFs quickly

### Admin Features
- 🔐 **Secure Admin Panel**: Password-protected admin dashboard
- 📤 **Upload PDFs**: Upload new PDFs with title and category
- 🗑️ **Delete PDFs**: Remove outdated PDFs
- 📂 **Category Management**: Create and delete categories
- 📊 **Dashboard**: View all uploaded PDFs

## Tech Stack

- **Frontend**: React Native with Expo SDK 54
- **Navigation**: React Navigation (Bottom Tabs, Drawer, Stack)
- **Backend**: Supabase (PostgreSQL + Storage)
- **State Management**: React Context API
- **Storage**: AsyncStorage + FileSystem
- **Animations**: React Native Reanimated
- **Icons**: Lucide React Native + Custom SVG Icons
- **PDF Viewing**: React Native WebView

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator / Android Emulator / Physical device with Expo Go app

## Installation

### 1. Clone the Repository

```bash
cd PDF_Viewer_App
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Supabase

The app uses Supabase for backend services. Follow the detailed setup guide:

📖 **[SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md)**

**Quick Setup:**
1. Create a Supabase account at https://supabase.com
2. Create a new project
3. Create database tables (`categories` and `pdf_files`)
4. Create a storage bucket named `pdfs` (public)
5. Update `src/config/supabase.js` with your credentials

### 4. Start the App

```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on physical device

## Project Structure

```
PDF_Viewer_App/
├── assets/                      # Images, icons, splash screens
├── src/
│   ├── components/
│   │   ├── icons/              # Custom SVG category icons
│   │   │   ├── QuranIcon.js
│   │   │   ├── DikrIcon.js
│   │   │   ├── DuaIcon.js
│   │   │   ├── SwalathIcon.js
│   │   │   ├── MoulidIcon.js
│   │   │   ├── BaithIcon.js
│   │   │   ├── RatheebIcon.js
│   │   │   └── OthersIcon.js
│   │   ├── PDFList.js
│   │   ├── PDFViewer.js
│   │   └── UpdatePopup.js
│   ├── config/
│   │   └── supabase.js         # Supabase configuration
│   ├── context/
│   │   └── ThemeContext.js     # Theme management
│   ├── navigation/
│   │   └── AppNavigator.js     # Navigation setup
│   ├── screens/
│   │   ├── HomeScreen.js       # Main home with categories
│   │   ├── CategoryScreen.js   # PDFs by category
│   │   ├── PdfViewerScreen.js  # PDF viewer
│   │   ├── AdminDashboard.js   # Admin panel
│   │   ├── AdminLogin.js       # Admin authentication
│   │   ├── SplashScreen.js     # App splash screen
│   │   ├── SettingsScreen.js   # App settings
│   │   ├── FavoritesScreen.js  # Favorite PDFs
│   │   ├── SearchScreen.js     # Search functionality
│   │   └── CounterScreen.js    # Dhikr counter
│   └── services/
│       ├── dbService.js        # Supabase database operations
│       ├── SyncService.js      # PDF sync and download
│       ├── localStorage.js     # Local storage management
│       ├── networkService.js   # Network connectivity
│       └── firebaseService.js  # (Legacy - not in use)
├── App.js                      # Main app entry
├── app.json                    # Expo configuration
├── package.json                # Dependencies
└── SUPABASE_SETUP_GUIDE.md    # Detailed setup guide
```

## Usage Guide

### For Users

1. **Browse Categories**: Tap on any category icon on the home screen
2. **View PDFs**: See all PDFs in that category
3. **Download**: Tap the download icon to save a PDF locally
4. **Read**: Tap on a downloaded PDF to open it
5. **Check for Updates**: Tap the refresh icon in the top bar to check for new PDFs
6. **Manage Favorites**: Access from the drawer menu
7. **Change Theme**: Go to Settings to change the app theme

### For Admins

1. **Access Admin Panel**: Open drawer menu → Admin
2. **Login**: Enter admin credentials
3. **Upload PDF**:
   - Tap "Upload New" button
   - Enter PDF title
   - Select category
   - Choose PDF file from device
   - Tap "Upload Document"
4. **Delete PDF**: Tap the trash icon next to any PDF
5. **Manage Categories**:
   - Add new categories in the "Manage Categories" section
   - Delete categories (warning: doesn't delete PDFs in that category)

## Category Icons

The app features custom line-art SVG icons for each category:

| Category | Icon Description |
|----------|------------------|
| **Qur'an** | Open book with stylized S curve representing script |
| **Dikr** | Single glowing bead / circular Tasbih motion path |
| **Dua** | Two palms joined with elegant thin lines |
| **Swalath** | Minimalist dome with crescent and heart |
| **Moulid** | Traditional lamp (Fanous) |
| **Baith** | Musical note integrated with Arabic calligraphy pen |
| **Ratheeb** | Geometric star (spiritual protection shield) |
| **Others** | Clean four-dot grid with sparkle |

## Database Schema

### categories table
```sql
- id: UUID (primary key)
- name: TEXT (unique, not null)
- display_order: INTEGER
- created_at: TIMESTAMP
```

### pdf_files table
```sql
- id: UUID (primary key)
- title: TEXT (not null)
- category: TEXT (not null)
- url: TEXT (not null)
- version: INTEGER (default: 1)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## Storage Structure

```
pdfs/ (bucket)
└── public/
    ├── 1234567890_file1.pdf
    ├── 1234567891_file2.pdf
    └── ...
```

## Environment Variables

Create a `.env` file if you want to store credentials securely (optional):

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

Then update `src/config/supabase.js` to use these variables.

## Building for Production

### Using EAS Build (Recommended)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure build:
```bash
eas build:configure
```

4. Build for Android:
```bash
eas build --platform android
```

5. Build for iOS:
```bash
eas build --platform ios
```

### Local Build

```bash
expo build:android
# or
expo build:ios
```

## Troubleshooting

### Common Issues

1. **Splash screen not showing**
   - Ensure `jalaliyya-logo.png` exists in `assets/` folder
   - Check that the image is not corrupted
   - Verify `SplashScreen.js` is properly imported in `AppNavigator.js`

2. **PDF upload fails**
   - Check Supabase storage bucket exists and is named `pdfs`
   - Verify storage policies allow uploads
   - Check file size is under limit (default 50MB)
   - Ensure MIME type is `application/pdf`
   - Check console logs for detailed error messages

3. **PDFs not showing in categories**
   - Verify database has records in `pdf_files` table
   - Check category names match exactly (case-sensitive)
   - Ensure network connection is active
   - Pull to refresh the category screen

4. **Download not working**
   - Check internet connection
   - Verify PDF URL is accessible
   - Check device storage permissions
   - Look at console logs for errors

5. **App crashes on startup**
   - Clear Metro cache: `expo start -c`
   - Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Check all dependencies are installed

### Debug Mode

Run the app with debug logging:
```bash
expo start --dev-client
```

Check logs in:
- Metro bundler terminal
- React Native Debugger
- Browser console (for web)

## Performance Optimization

- PDFs are cached locally to reduce network usage
- Lazy loading for category PDFs
- Optimized SVG icons for fast rendering
- Efficient state management with Context API

## Security

- Supabase Row Level Security (RLS) enabled
- Admin operations require authentication
- Public read-only access for users
- Secure file storage with signed URLs

## Future Enhancements

- [ ] Push notifications for new PDFs
- [ ] PDF bookmarks and annotations
- [ ] Audio recitations
- [ ] Multi-language support
- [ ] Dark mode
- [ ] PDF sharing
- [ ] Reading progress tracking
- [ ] Offline search

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is proprietary. All rights reserved.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the development team

## Acknowledgments

- Built with ❤️ for the Islamic community
- Powered by Expo and Supabase
- Custom icons designed for Jalaliyya

---

**Version**: 1.0.0  
**Last Updated**: 2026-04-23  
**Developed by**: Jalaliyya Team
