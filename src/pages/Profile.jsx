import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/Avatar'
import PostCard from '../components/PostCard'
import { fetchPostsByAuthor } from '../services/posts'

export default function Profile() {
  const { profile } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const loadPosts = useCallback(async () => {
    if (!profile) return
    const mine = await fetchPostsByAuthor(profile.uid)
    setPosts(mine)
  }, [profile])

  useEffect(() => {
    setLoading(true)
    loadPosts().finally(() => setLoading(false))
  }, [loadPosts])

  if (!profile) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="neo-card p-8 flex flex-col items-center text-center mb-6"
      >
        <Avatar gender={profile.gender} seed={profile.anonymousName} size={96} />
        <h1 className="text-lg font-semibold mt-4">{profile.anonymousName}</h1>
        <div className="flex gap-8 mt-5">
          <div className="neo-inset px-5 py-3 rounded-2xl text-center">
            <p className="text-lg font-semibold">{profile.postCount || posts.length || 0}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total Posts</p>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="neo-card p-10 text-center text-slate-400 text-sm">লোড হচ্ছে...</div>
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
            showOwnerMenu
            onChanged={loadPosts}
          />
        ))
      )}
    </div>
  )
}
