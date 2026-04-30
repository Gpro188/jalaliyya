# Supabase Setup Guide for Jalaliyya PDF Viewer

## Overview
This guide will walk you through setting up Supabase for the Jalaliyya PDF Viewer app. Supabase is used for:
- Storing PDF metadata in a PostgreSQL database
- Hosting PDF files in cloud storage
- Enabling admin upload/delete functionality
- Allowing users to download and update PDFs

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign In"
3. Sign up using GitHub, Google, or email
4. Once logged in, click "New Project"

## Step 2: Create a New Project

1. Click **"New Project"**
2. Fill in the details:
   - **Name**: `Jalaliyya PDF Viewer` (or your preferred name)
   - **Database Password**: Create a strong password (save it securely!)
   - **Region**: Choose the closest region to your users
3. Click **"Create new project"**
4. Wait 2-3 minutes for the project to be created

## Step 3: Get Your Project Credentials

1. Go to your project dashboard
2. Click on **"Project Settings"** (gear icon in the sidebar)
3. Click on **"API"** under Configuration
4. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **API Keys**:
     - `anon` / `public` key (safe for mobile apps)
     - `service_role` key (keep this secret!)

5. **Copy these values** - you'll need them for the app

## Step 4: Update the App Configuration

1. Open the file: `src/config/supabase.js`
2. Replace the existing values with your credentials:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_PROJECT_URL'; // e.g., 'https://yourproject.supabase.co'
const supabaseAnonKey = 'YOUR_ANON_KEY'; // The anon/public key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## Step 5: Create Database Tables

### Option A: Using SQL Editor (Recommended)

1. In your Supabase dashboard, click **"SQL Editor"** in the sidebar
2. Click **"New query"**
3. Copy and paste the following SQL:

```sql
-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pdf_files table
CREATE TABLE pdf_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  url TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_files ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on pdf_files"
  ON pdf_files FOR SELECT
  USING (true);

-- Create policies for authenticated admin access
CREATE POLICY "Allow authenticated users to insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert pdf_files"
  ON pdf_files FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update pdf_files"
  ON pdf_files FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete pdf_files"
  ON pdf_files FOR DELETE
  TO authenticated
  USING (true);
```

4. Click **"Run"** or press `Ctrl+Enter`
5. You should see "Success. No rows returned"

### Option B: Using the Table Editor

1. Click **"Table Editor"** in the sidebar
2. Click **"New table"**
3. Create the `categories` table:
   - Name: `categories`
   - Columns:
     - `id` (uuid, primary key, default: `gen_random_uuid()`)
     - `name` (text, not null, unique)
     - `display_order` (int4, default: 0)
     - `created_at` (timestamptz, default: `now()`)
4. Repeat for `pdf_files` table:
   - Name: `pdf_files`
   - Columns:
     - `id` (uuid, primary key, default: `gen_random_uuid()`)
     - `title` (text, not null)
     - `category` (text, not null)
     - `url` (text, not null)
     - `version` (int4, default: 1)
     - `created_at` (timestamptz, default: `now()`)
     - `updated_at` (timestamptz, default: `now()`)

## Step 6: Create Storage Bucket

1. Click **"Storage"** in the sidebar
2. Click **"New bucket"**
3. Configure the bucket:
   - **Name**: `pdfs` (must be exactly this)
   - **Public bucket**: ✅ Enable (toggle ON)
   - **File size limit**: `50 MB` (or your preference)
   - **Allowed MIME types**: `application/pdf`
4. Click **"Create bucket"**

### Set Up Storage Policies

1. Click on the `pdfs` bucket you just created
2. Click **"Policies"** tab
3. Click **"New policy"**
4. For **public read access**:
   - Select: "For full customization"
   - Policy name: `Allow public read access`
   - Allowed operation: `SELECT`
   - Target roles: `anon` and `authenticated`
   - Policy definition: `true`
   - Click **"Review"** then **"Save policy"**

5. Create another policy for **authenticated uploads**:
   - Policy name: `Allow authenticated users to upload`
   - Allowed operation: `INSERT`
   - Target roles: `authenticated`
   - Policy definition: `true`
   - Click **"Review"** then **"Save policy"**

6. Create policy for **authenticated delete**:
   - Policy name: `Allow authenticated users to delete`
   - Allowed operation: `DELETE`
   - Target roles: `authenticated`
   - Policy definition: `true`
   - Click **"Review"** then **"Save policy"**

## Step 7: Test the Setup

### Using Supabase Dashboard

1. Go to **"Table Editor"**
2. Select the `categories` table
3. Click **"Insert row"**
4. Add a test category:
   - `name`: "Test Category"
   - `display_order`: 1
5. Click **"Save"**
6. Verify the row appears in the table

### Using the App

1. Run the app: `npm start` or `expo start`
2. Navigate to Admin section (from drawer menu)
3. Login with admin credentials
4. Try uploading a test PDF
5. Check if it appears in the dashboard
6. Go to Home screen, select the category
7. Verify the PDF is listed and can be downloaded

## Step 8: Secure Your Project (Production)

### Enable Email Auth for Admin (Optional but Recommended)

1. Go to **"Authentication"** > **"Providers"**
2. Enable **Email** provider
3. Configure email templates if needed
4. Create an admin user:
   - Go to **"Authentication"** > **"Users"**
   - Click **"Add user"**
   - Enter admin email and password

### Update RLS Policies for Admin Only

If you want to restrict uploads/deletes to specific admin users:

```sql
-- Create an admin_emails table
CREATE TABLE admin_emails (
  email TEXT PRIMARY KEY
);

-- Insert admin email
INSERT INTO admin_emails (email) VALUES ('your-admin@email.com');

-- Update pdf_files insert policy
DROP POLICY "Allow authenticated users to insert pdf_files" ON pdf_files;

CREATE POLICY "Allow only admins to insert pdf_files"
  ON pdf_files FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.email() IN (SELECT email FROM admin_emails)
  );
```

## Step 9: Monitor Usage

1. Go to **"Project Settings"** > **"Usage"**
2. Monitor:
   - Database size
   - Storage usage
   - Bandwidth
   - API requests

## Troubleshooting

### Common Issues

1. **"Bucket not found" error**
   - Make sure you created a bucket named exactly `pdfs`
   - Check the bucket name in `src/services/dbService.js`

2. **"Permission denied" error**
   - Verify RLS policies are set correctly
   - Check that the bucket is public for reads
   - Ensure storage policies allow the operations

3. **Upload fails silently**
   - Check the console logs in the app
   - Verify file size is under the limit
   - Ensure MIME type is `application/pdf`

4. **PDFs not showing in app**
   - Check database has records in `pdf_files` table
   - Verify category names match exactly
   - Check network connection

### Debug Mode

To enable detailed logging, check the console when running the app:
```bash
expo start
```

The app will log:
- Upload progress
- Database operations
- Storage operations
- Error messages

## Best Practices

1. **Backup Regularly**
   - Use Supabase's built-in backups
   - Export database periodically

2. **Monitor Storage**
   - Keep track of file sizes
   - Delete unused PDFs

3. **Use Categories Wisely**
   - Keep category names consistent
   - Use the exact names in the app's HomeScreen

4. **Test Before Deploying**
   - Always test uploads in development first
   - Verify PDFs download correctly on devices

## Support

- Supabase Docs: https://supabase.com/docs
- Expo Docs: https://docs.expo.dev
- React Native Docs: https://reactnative.dev/docs/getting-started

---

**Note**: The current configuration in `src/config/supabase.js` already has credentials set up. Replace them with your own if you're setting up a new project.
