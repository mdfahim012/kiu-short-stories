import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { uploadImageToImgbb } from '../services/upload'
import { createPost } from '../services/posts'

export default function CreatePostModal({ open, onClose, onPosted }) {
  const { profile } = useAuth()
  const [mode, setMode] = useState(null) // 'photo' | 'story' | null
  const [caption, setCaption] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  function reset() {
    setMode(null)
    setCaption('')
    setFile(null)
    setPreview(null)
    setError('')
    setBusy(false)
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleFileChange(e) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleSubmit() {
    if (!file) {
      setError('একটা ছবি বেছে নাও')
      return
    }
    setBusy(true)
    setError('')
    try {
      const imageUrl = await uploadImageToImgbb(file)
      await createPost({
        authorUid: profile.uid,
        authorName: profile.anonymousName,
        authorGender: profile.gender,
        caption,
        imageUrl,
      })
      onPosted?.()
      handleClose()
    } catch (e) {
      console.error(e)
      setError('পোস্ট করতে সমস্যা হয়েছে, আবার চেষ্টা করো')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 max-w-md mx-auto neo-card p-6 z-50 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Create Post</h2>
              <button className="neo-icon-btn w-9 h-9" onClick={handleClose}>
                ✕
              </button>
            </div>

            {!mode && (
              <div className="flex flex-col gap-3">
                <button onClick={() => setMode('photo')} className="neo-card-sm p-5 text-left">
                  <p className="font-medium mb-1">📷 Photo + Caption</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ফেসবুক-স্টাইল পোস্ট — একটা ছবি এবং ক্যাপশন
                  </p>
                </button>
                <button
                  onClick={() => setMode('story')}
                  className="neo-card-sm p-5 text-left opacity-60 cursor-not-allowed"
                >
                  <p className="font-medium mb-1">📝 Short Story Photo Card</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    শীঘ্রই আসছে — হাইলাইট টুল সহ সিগনেচার স্টোরি কার্ড
                  </p>
                </button>
              </div>
            )}

            {mode === 'photo' && (
              <div className="flex flex-col gap-4">
                {preview ? (
                  <div className="rounded-2xl overflow-hidden neo-inset">
                    <img src={preview} alt="preview" className="w-full max-h-72 object-cover" />
                  </div>
                ) : (
                  <label className="neo-inset flex flex-col items-center justify-center py-10 rounded-2xl cursor-pointer text-sm text-slate-500 dark:text-slate-400">
                    📷 ছবি বেছে নিতে ক্লিক করো
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                )}

                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="ক্যাপশন লিখো..."
                  rows={4}
                  className="neo-inset w-full p-3 bg-transparent outline-none text-sm rounded-2xl"
                />

                {error && <p className="text-red-500 text-xs text-center">{error}</p>}

                <div className="flex gap-2">
                  <button onClick={() => setMode(null)} className="neo-btn text-sm py-2.5">
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={busy}
                    className="flex-1 neo-btn primary-gradient text-white text-sm py-2.5 disabled:opacity-60"
                  >
                    {busy ? 'পোস্ট হচ্ছে...' : 'Post'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
