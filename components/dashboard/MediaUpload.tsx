// components/dashboard/MediaUpload.tsx
'use client'
import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, Film, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface UploadedFile {
  url: string
  path: string
  type: 'image' | 'video'
  name: string
  size: number
}

interface MediaUploadProps {
  onUpload?: (files: UploadedFile[]) => void
  accept?: 'images' | 'videos' | 'all'
  maxFiles?: number
  bucket?: string
  folder?: string
}

export function MediaUpload({
  onUpload,
  accept = 'all',
  maxFiles = 5,
  bucket = 'products',
  folder = 'images',
}: MediaUploadProps) {
  const [files, setFiles]     = useState<UploadedFile[]>([])
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress]   = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const acceptTypes = {
    images: 'image/jpeg,image/png,image/webp',
    videos: 'video/mp4,video/quicktime,video/webm',
    all:    'image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm',
  }[accept]

  async function uploadFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', bucket)
    formData.append('folder', folder)

    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Upload failed')
    }
    return res.json() as Promise<UploadedFile & { name: string }>
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList) return
    const selected = Array.from(fileList).slice(0, maxFiles - files.length)
    if (!selected.length) return

    setUploading(true)
    setProgress(0)
    const uploaded: UploadedFile[] = []

    for (let i = 0; i < selected.length; i++) {
      try {
        const data = await uploadFile(selected[i])
        uploaded.push({ ...data, name: selected[i].name, size: selected[i].size })
        setProgress(Math.round(((i + 1) / selected.length) * 100))
      } catch (err: any) {
        toast.error(`❌ فشل رفع ${selected[i].name}: ${err.message}`)
      }
    }

    const newFiles = [...files, ...uploaded]
    setFiles(newFiles)
    onUpload?.(newFiles)
    setUploading(false)
    setProgress(0)
    if (uploaded.length) toast.success(`✅ تم رفع ${uploaded.length} ملف`)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [files])

  function removeFile(idx: number) {
    const updated = files.filter((_, i) => i !== idx)
    setFiles(updated)
    onUpload?.(updated)
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${dragging ? 'border-gold bg-gold/10' : 'border-white/20 hover:border-gold/50 hover:bg-gold/5'} ${uploading ? 'pointer-events-none opacity-60' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={acceptTypes}
          multiple={maxFiles > 1}
          onChange={(e) => handleFiles(e.target.files)}
        />

        {uploading ? (
          <div className="space-y-2">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-400 font-semibold">جارٍ الرفع إلى Supabase Storage...</p>
            <div className="w-full bg-navy-3 rounded-full h-2">
              <div className="bg-gradient-to-r from-gold to-brand-orange h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-gold font-bold">{progress}%</p>
          </div>
        ) : (
          <>
            <Upload size={28} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm font-bold">اسحب الملفات هنا أو اضغط للاختيار</p>
            <p className="text-xs text-gray-400 mt-1">
              {accept === 'images' && 'PNG, JPG, WebP — حد 10MB'}
              {accept === 'videos' && 'MP4, MOV, WebM — حد 100MB'}
              {accept === 'all' && 'صور وفيديو — حد 100MB'}
            </p>
            {maxFiles > 1 && (
              <p className="text-xs text-gray-500 mt-1">حد أقصى {maxFiles} ملفات</p>
            )}
          </>
        )}
      </div>

      {/* Preview grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {files.map((file, idx) => (
            <div key={idx} className="relative group aspect-square bg-navy-3 rounded-lg overflow-hidden border border-white/[0.07]">
              {file.type === 'image' ? (
                <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-gray-400">
                  <Film size={20} className="text-gold" />
                  <span className="text-[10px]">فيديو</span>
                </div>
              )}
              <button
                onClick={() => removeFile(idx)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500/80 rounded-full items-center justify-center hidden group-hover:flex transition"
              >
                <X size={10} className="text-white" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-[9px] text-center py-0.5 truncate px-1 hidden group-hover:block">
                {(file.size / 1024).toFixed(0)} KB
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Supabase code hint */}
      <div className="bg-navy-3 rounded-lg p-3 text-[11px] text-gray-400 border border-white/[0.05]">
        <span className="text-gold font-bold">Supabase Storage:</span>
        <code className="block text-blue-300 mt-1 leading-5">
          await supabase.storage.from('{bucket}').upload(path, file)<br />
          const url = supabase.storage.from('{bucket}').getPublicUrl(path)
        </code>
      </div>
    </div>
  )
}
