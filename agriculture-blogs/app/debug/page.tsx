'use client'

export default function DebugPage() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug: Environment Check</h1>
        
        <div className="bg-slate-800 rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Cloudinary Configuration</h2>
            <div className="bg-slate-700 p-4 rounded font-mono text-sm">
              <p>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: <span className={cloudName ? 'text-green-400' : 'text-red-400'}>{cloudName || 'NOT SET'}</span></p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Upload URL (if configured)</h2>
            {cloudName ? (
              <div className="bg-slate-700 p-4 rounded font-mono text-sm break-all">
                <p>https://api.cloudinary.com/v1_1/{cloudName}/image/upload</p>
              </div>
            ) : (
              <div className="bg-red-900 p-4 rounded text-red-200">
                Environment variable not set. Check .env.local file.
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Steps to Fix</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-300">
              <li>Make sure .env.local exists in agriculture-blogs folder</li>
              <li>Add: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=delyixlmn</li>
              <li>Restart the dev server (Ctrl+C and npm run dev)</li>
              <li>Create the upload preset "agriculture_blog" in Cloudinary if not exists</li>
            </ol>
          </div>

          <div>
            <a href="/Admin" className="inline-block mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">
              Go to Admin Page
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
