# Quick Setup - Image Upload Configuration

## ⚡ Quick Start (2 Minutes)

### Step 1: Get Cloud Name
- Go to: https://console.cloudinary.com/console
- Copy your **Cloud Name** from the dashboard

### Step 2: Create Upload Preset
- Settings → Upload → Upload presets
- Click "Add upload preset"
- Name: `agriculture_blog`
- Signing Mode: `Unsigned`
- Click Save

### Step 3: Update `.env.local`
Edit `.env.local` and replace the placeholder:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=YOUR_ACTUAL_CLOUD_NAME
```

### Step 4: Restart Server
```bash
npm run dev
```

## ✅ Done!

Image upload in the blog editor will now work!

---

## Testing

1. Go to `/Admin`
2. Click the 🖼️ button in the editor toolbar
3. Select an image
4. It will upload to Cloudinary automatically

## Detailed Guide

See `IMAGE_UPLOAD_SETUP.md` for complete instructions and troubleshooting.
