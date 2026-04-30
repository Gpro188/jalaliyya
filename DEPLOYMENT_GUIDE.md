# 🚀 Deployment Guide - Jalaliyya PDF Viewer

This guide will walk you through deploying the app to Android and iOS app stores.

## Prerequisites Checklist

- [x] EAS CLI installed
- [ ] Expo account (free or paid)
- [ ] Supabase project set up
- [ ] App tested and working
- [ ] All PDFs uploaded to Supabase

---

## Step 1: Login to Expo

```bash
eas login
```

**Options:**
- Login with username/password
- Login with GitHub
- Login with Google

If you don't have an account:
1. Go to https://expo.dev
2. Click "Sign Up"
3. Create a free account
4. Then run `eas login` again

---

## Step 2: Configure EAS Build

The app already has `app.json` configured with:
- Project ID: `4fc57cbc-b48d-422a-9533-79adb505292`
- Owner: `dpro188s-organization`
- Android package: `com.jalaliyya.app`

If you need to reconfigure:

```bash
eas build:configure
```

---

## Step 3: Choose Your Build Type

### Option A: Android APK (For Testing/Direct Distribution)

**Best for:**
- Testing on physical devices
- Direct sharing via file/WhatsApp
- Sideloading

**Build Command:**
```bash
eas build --platform android --profile preview
```

### Option B: Android AAB (For Google Play Store)

**Best for:**
- Publishing to Google Play Store
- Production release

**Build Command:**
```bash
eas build --platform android --profile production
```

### Option C: iOS IPA (For Apple App Store)

**Requirements:**
- Apple Developer Account ($99/year)
- Mac computer (for local builds)
- Provisioning profiles

**Build Command:**
```bash
eas build --platform ios --profile production
```

---

## Step 4: Build the App

### Quick Build (Android APK)

```bash
eas build --platform android
```

**What happens:**
1. EAS will upload your code to Expo servers
2. Build starts in the cloud (takes 10-20 minutes)
3. You'll receive a download link
4. APK can be installed directly on Android devices

### Monitor Build Progress

```bash
eas build:list
```

Or check online: https://expo.dev/builds

---

## Step 5: Test the Build

### Android APK

1. Download the APK from the build link
2. Transfer to your Android device
3. Enable "Install from Unknown Sources"
4. Install the APK
5. Test all features

### iOS

1. Use TestFlight for beta testing
2. Or download IPA for local testing
3. Install via Xcode or Apple Configurator

---

## Step 6: Publish to App Stores

### Google Play Store

#### 1. Create Developer Account
- Go to https://play.google.com/console
- Pay one-time fee: $25
- Complete account setup

#### 2. Create App Listing
- Click "Create app"
- Fill in:
  - App name: "Jalaliyya"
  - Default language
  - App type: Application
  - Category: Education/Books

#### 3. Prepare Store Listing
- App icon (512x512)
- Screenshots (minimum 2)
- Short description (80 chars)
- Full description (4000 chars)
- Feature graphic (1024x500)

#### 4. Upload AAB File
```bash
# Build for production (AAB format)
eas build --platform android --profile production
```

#### 5. Submit for Review
- Go to Play Console
- Navigate to "Production" or "Internal Testing"
- Upload your AAB file
- Fill in content rating
- Set pricing (Free or Paid)
- Submit for review

**Review Time:** 1-7 days

---

### Apple App Store (iOS)

#### 1. Enroll in Apple Developer Program
- Go to https://developer.apple.com
- Enroll as Individual or Organization
- Annual fee: $99/year

#### 2. Create App in App Store Connect
- Go to https://appstoreconnect.apple.com
- Click "Apps" → "+" → "New App"
- Fill in:
  - Name: "Jalaliyya"
  - Primary language
  - Bundle ID: `com.jalaliyya.app`
  - SKU: `jalaliyya-001`

#### 3. Build iOS App
```bash
eas build --platform ios --profile production
```

#### 4. Upload to App Store Connect
```bash
eas submit --platform ios
```

#### 5. Complete App Information
- Screenshots (6.5" and 5.5" displays)
- App icon (1024x1024)
- Description
- Keywords
- Privacy policy URL
- Support URL

#### 6. Submit for Review
- Complete app privacy questionnaire
- Set content rating
- Submit for App Review

**Review Time:** 24-48 hours

---

## Step 7: Post-Launch

### Monitor Your App

1. **Google Play Console:**
   - Crash reports
   - User reviews
   - Install statistics
   - ANR (App Not Responding) reports

2. **App Store Connect:**
   - Sales and trends
   - App analytics
   - Crash reports
   - User reviews

### Updates

To release updates:

```bash
# Make your changes
# Update version in app.json
# Build new version
eas build --platform android --profile production

# Submit update
eas submit --platform android
```

---

## Alternative: OTA Updates (Over-The-Air)

For small JS/asset changes (no native code):

```bash
# Publish update
eas update --branch production --message "Updated PDF viewer"

# Users get update automatically on next app launch
```

**Benefits:**
- No app store review needed
- Instant updates
- Users don't need to download from store

**Limitations:**
- Can't change native code
- Can't add new permissions
- Can't change app icon

---

## Build Profiles

The app uses these profiles (create `eas.json` if not exists):

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## Common Issues & Solutions

### Build Fails

**Issue:** Build fails with dependency error
```bash
# Clear cache and rebuild
npm start -- --clear
eas build --platform android --clear-cache
```

**Issue:** Out of memory
```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 eas build --platform android
```

### Submission Fails

**Issue:** Google Play rejects AAB
- Check app bundle is signed correctly
- Verify package name matches
- Ensure version code is incremented

**Issue:** Apple rejects IPA
- Check provisioning profiles
- Verify bundle identifier
- Ensure icons are correct size

### App Crashes on Launch

1. Check device logs:
```bash
eas log --platform android
```

2. Common fixes:
- Verify Supabase credentials
- Check all assets are included
- Test on multiple devices

---

## Cost Estimation

### Free Options
- Expo account: Free
- EAS Build (free tier): 30 builds/month
- Google Play: $25 (one-time)

### Paid Options
- Apple Developer: $99/year
- Google Play: $25 (one-time)
- EAS Build (paid): $29/month (unlimited builds)

---

## Best Practices

### Before Building
1. ✅ Test thoroughly on physical devices
2. ✅ Update version number in `app.json`
3. ✅ Remove console.logs (or use production logging)
4. ✅ Test with slow internet connection
5. ✅ Verify all PDFs are uploaded
6. ✅ Check app icon and splash screen

### Security
1. ✅ Never commit sensitive keys
2. ✅ Use environment variables
3. ✅ Enable ProGuard for Android
4. ✅ Obfuscate code for iOS

### Performance
1. ✅ Optimize images
2. ✅ Minimize app size
3. ✅ Test on low-end devices
4. ✅ Monitor crash reports

---

## Quick Reference Commands

```bash
# Login
eas login

# Build Android APK
eas build --platform android --profile preview

# Build Android AAB (Play Store)
eas build --platform android --profile production

# Build iOS
eas build --platform ios --profile production

# Submit to Play Store
eas submit --platform android

# Submit to App Store
eas submit --platform ios

# View builds
eas build:list

# View logs
eas log --platform android

# OTA Update
eas update --branch production --message "Bug fixes"
```

---

## Need Help?

- **Expo Docs:** https://docs.expo.dev/build/introduction/
- **EAS Build:** https://docs.expo.dev/build-reference/apk/
- **Google Play:** https://developer.android.com/distribute
- **Apple App Store:** https://developer.apple.com/app-store/

---

## Next Steps

1. **Login to Expo:**
   ```bash
   eas login
   ```

2. **Build Android APK (for testing):**
   ```bash
   eass build --platform android
   ```

3. **Test on your device**

4. **Build for production:**
   ```bash
   eas build --platform android --profile production
   ```

5. **Submit to app stores**

---

**Ready to deploy? Let's do this! 🚀**

Run this command to start:
```bash
eas login
```
