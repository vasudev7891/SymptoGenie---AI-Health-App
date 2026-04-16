# Google Maps Setup Guide for SymptoGenie

## Overview
The Hospital Finder feature uses Google Maps to display hospital locations. Without an API key, the app shows a friendly fallback UI with a list of hospitals, but the interactive map won't work.

## Getting Your Google Maps API Key

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account (create one if needed - it's free)

### Step 2: Create a New Project
1. Click the project dropdown at the top
2. Click "NEW PROJECT"
3. Name your project: `SymptoGenie` (or any name)
4. Click "CREATE"
5. Wait for the project to be created (it may take a minute)

### Step 3: Enable Maps JavaScript API
1. In the left sidebar, click "APIs and Services" → "Library"
2. Search for "Maps JavaScript API"
3. Click on it
4. Click the blue "ENABLE" button
5. Wait for it to enable (1-2 minutes)

### Step 4: Create an API Key
1. Go to "APIs and Services" → "Credentials"
2. Click "+ CREATE CREDENTIALS" → "API Key"
3. A new API key will be created and displayed in a popup
4. Copy the key (it looks like: `AIzaSyB...`)

### Step 5: Restrict Your API Key (Security)
1. In the Credentials page, find your newly created key
2. Click on it to edit
3. Under "Application restrictions", select "HTTP referrers (web sites)"
4. Click "Add an item"
5. Add this referrer: `http://localhost:3000/*`
6. Click "Save"

### Step 6: Add the Key to Your .env File
1. Open: `frontend/.env`
2. Find this line:
   ```
   VITE_GOOGLE_MAPS_API_KEY=
   ```
3. Paste your API key after the `=`:
   ```
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyB...your-key-here...
   ```
4. Save the file

### Step 7: Restart Your Frontend Server
1. Stop your frontend dev server (if running)
2. Run: `npm run dev`
3. Go to http://localhost:3000
4. Navigate to "Find Hospitals"
5. The interactive map should now work! 🎉

## Troubleshooting

### Map still not showing?
- Make sure you've **enabled** the Maps JavaScript API (step 3)
- Check that you've **restarted** the frontend server after adding the key
- Make sure the key is in `frontend/.env` (not backend/.env)
- Check your browser console for specific error messages

### "Invalid API Key" Error?
- Your API key might not be correct
- Make sure you copied the **entire** API key without extra spaces
- Try creating a new API key and replacing the old one

### API Key Limit Exceeded?
- Google Cloud provides $200/month free credit for Maps API
- If you exceed this, you'll need to set up billing
- For development, this should be more than enough

## Production Deployment

When deploying to production:
1. Create a new project in Google Cloud Console
2. Restrict the API key to your actual domain (not localhost)
3. Use a different API key for production (more secure)
4. Set environment variables on your hosting platform

## Important Notes

- 🔒 **Never commit your API key to version control** (it's in .gitignore by default)
- 🆓 **Google Maps is free** with $200/month credit
- 🛡️ **Always use HTTP referrer restrictions** for security
- 📱 The app works fine without Google Maps - the hospital list still shows all hospitals!

## Need Help?

If you're still having issues:
1. Check the browser developer console (F12) for error messages
2. Verify the key is in the correct file: `frontend/.env`
3. Make sure the Maps JavaScript API is enabled
4. Try creating a fresh API key

Good luck! 🎉
