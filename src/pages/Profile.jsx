import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/Avatar'
import PostCard from '../components/PostCard'
import { fetchPostsByAuthor } from '../services/posts'
import { uploadImageToImgbb } from '../services/upload'

export default function Profile() {
  const { profile, updateProfilePhoto } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const fileInputRef = useRef(null)

  const loadPosts = useCallback(async () => {
    if (!profile) return
    const mine = await fetchPostsByAuthor(profile.uid)
    setPosts(mine)
  }, [profile])

  useEffect(() => {
    setLoading(true)
    loadPosts().finally(() => setLoading(false))
  }, [loadPosts])

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPhoto(true)
    try {
      const url = await uploadImageToImgbb(file)
      await updateProfilePhoto(url)
    } catch (err) {
      console.error(err)
      alert('ছবি আপলোড করতে সমস্যা হয়েছে, আবার চেষ্টা করো')
    } finally {
      setUploadingPhoto(false)
      e.target.value = ''
    }
  }

  if (!profile) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="neo-card p-8 flex flex-col items-center text-center mb-6"
      >
        <div className="relative">
          <Avatar gender={profile.gender} seed={profile.anonymousName} photoUrl={profile.photoURL} size={96} />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingPhoto}
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full primary-gradient text-white flex items-center justify-center text-sm shadow-neo-light-sm dark:shadow-neo-dark-sm"
            aria-label="Change profile photo"
          >
            {uploadingPhoto ? (
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              '📷'
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>

        <h1 className="text-lg font-semibold mt-4">{profile.anonymousName}</h1>
        <div className="flex gap-8 mt-5">
          <div className="neo-inset px-5 py-3 rounded-2xl text-center">
            <p className="text-lg font-semibold">{profile.postCount || posts.length || 0}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total Posts</p>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[0, 1].map((i) => (
            <div key={i} className="neo-card p-4 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-slate-300/50 dark:bg-slate-600/50" />
                <div className="flex-1">
                  <div className="h-3 w-24 bg-slate-300/50 dark:bg-slate-600/50 rounded mb-2" />
                  <div className="h-2 w-16 bg-slate-300/40 dark:bg-slate-600/40 rounded" />
                </div>
              </div>
              <div className="h-48 w-full bg-slate-300/40 dark:bg-slate-600/40 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="neo-card p-10 text-center text-slate-400 dark:text-slate-500 text-sm">
          📝 তুমি এখনো কোনো পোস্ট করোনি
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUid={profile.uid}
            currentName={profile.anonymousName}
            currentGender={profile.gender}
            currentPhotoUrl={profile.photoURL}
            showOwnerMenu
            onChanged={loadPosts}
          />
        ))
      )}
    </div>
  )
}
