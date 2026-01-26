# Image Upload Setup Guide

## Prerequisites

You need to set up Cloudinary to enable image uploads in the blog editor.

## Steps to Configure Cloudinary

### 1. Get Your Cloudinary Cloud Name

1. Go to [Cloudinary Console](https://console.cloudinary.com/console)
2. Sign in with your Cloudinary account (or create one - it's free!)
3. Look at the **Dashboard** - you'll see your **Cloud Name**
4. Copy this value

### 2. Create Upload Preset

1. In Cloudinary Console, go to **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Name it: `agriculture_blog`
5. Set **Signing Mode** to `Unsigned` (for client-side uploads)
6. Click **Save**

### 3. Update `.env.local`

Edit `.env.local` in the `agriculture-blogs` folder:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
```

Replace `your_cloud_name_here` with your actual Cloudinary Cloud Name.

**Example:**
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxyz123abc
```

### 4. Restart Development Server

If you have the dev server running, restart it:

```bash
npm run dev
```

## Testing the Image Upload

1. Navigate to the Admin page (`/Admin`)
2. Fill in the blog form
3. Click the **Image button** (🖼️) in the editor toolbar
4. Select an image from your computer
5. The image should upload and appear in the editor

## Troubleshooting

### Still getting "Failed to upload image" error?

**Check these steps:**

1. **Is `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` set?**
   - Open `.env.local` and verify the value is there
   - It should be your actual cloud name (not placeholder text)
   - Save the file and restart the dev server

2. **Does the upload preset exist?**
   - Go to Cloudinary Console → Settings → Upload
   - Look for `agriculture_blog` preset
   - If it doesn't exist, create it following the steps above
   - Make sure it's set to `Unsigned` mode

3. **Check browser console for errors**
   - Open DevTools (F12)
   - Go to Console tab
   - Try uploading again
   - Look for error messages
   - Screenshot and share the error if needed

4. **Verify your Cloudinary account**
   - Make sure your Cloudinary account is active
   - Check if you have upload quota remaining
   - Some free accounts have limitations

## How Image Upload Works

1. **Client-side upload** - Your browser uploads directly to Cloudinary
2. **No server processing** - Faster uploads, no server overhead
3. **Secure URL** - Cloudinary provides a permanent, secure URL
4. **Auto-inserted** - The image appears in the editor immediately

## Important Notes

- ⚠️ Never commit `.env.local` to git (it's in `.gitignore`)
- 🔐 `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is public (it's in the name!)
- 🛡️ The upload preset is `Unsigned` for security with rate limiting
- 📸 Images are stored on Cloudinary's servers (not your server)

## Need Help?

- Cloudinary Docs: https://cloudinary.com/documentation
- Cloudinary Support: https://support.cloudinary.com/
- Check Cloudinary Console for usage statistics

---

**Status:** Once configured, image uploads will work perfectly! 🎉
