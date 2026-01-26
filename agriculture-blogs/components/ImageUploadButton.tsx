'use client'

import { useState, useRef } from 'react'
import { Image as ImageIcon } from 'lucide-react'

type Props = {
  onImageUpload: (url: string) => void
}

export default function ImageUploadButton({ onImageUpload }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    
    const uploadPreset = 'agriculture_blog' // Ensure this preset exists in your Cloudinary settings

    if (!cloudName) {
      alert(
        'Cloudinary is not configured. Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to your .env.local file.'
      )
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', uploadPreset)

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      
      console.log('Uploading to:', uploadUrl)
      console.log('Cloud Name:', cloudName)
      console.log('Upload Preset:', uploadPreset)
      console.log('File:', file.name, file.size, file.type)

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      })

      console.log('Response Status:', response.status)
      const data = await response.json()
      console.log('Response Data:', data)

      if (!response.ok) {
        console.error('Cloudinary error:', data)
        throw new Error(
          data.error?.message || 
          `Upload failed: ${response.status} ${response.statusText}`
        )
      }

      if (data.secure_url) {
        console.log('Upload successful:', data.secure_url)
        onImageUpload(data.secure_url)
      } else {
        throw new Error('No secure_url in response')
      }
    } catch (error) {
      console.error('Image upload error:', error)
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      
      const detailedMsg = `Failed to upload image: ${errorMsg}

Please verify:

1. ✓ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is set in .env.local
   Current value: ${cloudName}

2. ✓ Upload preset "agriculture_blog" exists in Cloudinary
   Go to: https://console.cloudinary.com/console
   Settings → Upload → Upload presets
   Create: agriculture_blog (Unsigned mode)

3. ✓ Dev server has been restarted after .env.local changes
   (Ctrl+C and npm run dev)

If error persists, check browser console (F12) for detailed logs.`
      
      alert(detailedMsg)
    } finally {
      setIsLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    fileInputRef.current?.click()
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isLoading}
      />
      <button
        onClick={handleClick}
        disabled={isLoading}
        title="Add Image"
        className={`p-2 rounded-lg transition-colors ${
          isLoading
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
            : 'hover:bg-slate-200 text-slate-600'
        }`}
      >
        <ImageIcon size={18} />
      </button>
    </>
  )
}
