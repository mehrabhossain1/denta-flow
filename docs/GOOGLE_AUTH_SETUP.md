# Google OAuth Setup Guide

Google OAuth authentication has been implemented in the codebase. Follow these steps to complete the setup:

## 1. Create Google OAuth Credentials

### Step 1: Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project or select an existing one

### Step 2: Enable Google+ API (if required)
1. Navigate to **APIs & Services** > **Library**
2. Search for "Google+ API" or "Google Identity"
3. Click **Enable**

### Step 3: Create OAuth Consent Screen
1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** (for public apps) or **Internal** (for workspace apps)
3. Fill in the required information:
   - **App name**: OpenUser (or your app name)
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Click **Save and Continue**
5. On the Scopes page, you can skip adding scopes (default scopes are sufficient)
6. Click **Save and Continue**
7. Add test users if needed (for External apps in testing mode)
8. Click **Save and Continue**

### Step 4: Create OAuth 2.0 Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Choose **Web application**
4. Configure the OAuth client:
   - **Name**: OpenUser Web Client (or any name)
   - **Authorized JavaScript origins**: 
     - Development: `http://localhost:3000`
     - Production: `https://yourdomain.com`
   - **Authorized redirect URIs**:
     - Development: `http://localhost:3000/api/auth/callback/google`
     - Production: `https://yourdomain.com/api/auth/callback/google`
5. Click **Create**
6. Copy the **Client ID** and **Client Secret** (you'll need these for environment variables)

## 2. Configure Environment Variables

### Development (.env.local)
Add these variables to your `.env.local` file:

```env
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=your-client-secret
```

### Production (Netlify Environment Variables)
1. Go to your Netlify site dashboard
2. Navigate to **Site settings** > **Environment variables**
3. Add the following variables:
   - `VITE_GOOGLE_CLIENT_ID`: Your Google Client ID
   - `VITE_GOOGLE_CLIENT_SECRET`: Your Google Client Secret

**Important**: Make sure to update the authorized redirect URIs in Google Cloud Console to include your production domain.

## 3. Test the Integration

### Development Testing
1. Start your dev server: `pnpm dev`
2. Navigate to the sign-in page: `http://localhost:3000/auth/sign-in`
3. You should see a "Sign in with Google" button
4. Click it and test the authentication flow

### Production Testing
1. Deploy your app to Netlify
2. Update the authorized redirect URIs in Google Cloud Console with your production domain
3. Test the sign-in flow on your live site

## 4. Domain Verification (Production)

For production use, you should verify your domain in Google Search Console:
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your domain
3. Verify ownership using one of the provided methods
4. This improves trust and removes the "unverified app" warning

## 5. Publishing Your OAuth Consent Screen

For public use (External apps):
1. Go back to **APIs & Services** > **OAuth consent screen**
2. Click **PUBLISH APP**
3. Submit your app for verification if needed (for sensitive scopes)

**Note**: Apps in "Testing" mode are limited to 100 users. Publishing removes this limitation.

## Troubleshooting

### "Redirect URI mismatch" error
- Ensure the redirect URI in your Google Cloud Console exactly matches: `http://localhost:3000/api/auth/callback/google` (dev) or `https://yourdomain.com/api/auth/callback/google` (prod)
- Check for trailing slashes - they must match exactly

### "Google OAuth credentials not configured" warning in console
- This is normal if you haven't set the environment variables yet
- Google sign-in will not appear until credentials are configured

### Users see "This app isn't verified"
- This is normal for apps in testing mode
- Users can click "Advanced" > "Go to [App Name] (unsafe)" to proceed
- To remove this, verify your domain and publish your OAuth consent screen

### Sign-in works locally but not in production
- Make sure you've added your production domain to authorized origins
- Ensure redirect URIs include your production domain
- Check that environment variables are set in Netlify

## Security Notes

1. **Never commit credentials to git**: The `.env.local` file is gitignored
2. **Client Secret is sensitive**: Treat it like a password
3. **Rotate credentials**: If compromised, generate new credentials in Google Cloud Console
4. **Use separate credentials**: Consider using different OAuth clients for dev/staging/production

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Better Auth Social Providers](https://www.better-auth.com/docs/authentication/social)
- [Better Auth Configuration](https://www.better-auth.com/docs/configuration)
