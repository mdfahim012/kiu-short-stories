import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/Avatar'

export default function Profile() {
  const { profile } = useAuth()

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
            <p className="text-lg font-semibold">{profile.postCount || 0}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total Posts</p>
          </div>
        </div>
      </motion.div>

      <div className="neo-card p-8 text-center text-slate-400 dark:text-slate-500 text-sm">
        📝 এই ইউজারের পোস্টগুলো ধাপ ২ তে এখানে দেখানো হবে
      </div>
    </div>
  )
}
