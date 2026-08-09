import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { profile } = useAuth()

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="neo-card p-6 text-center mb-6"
      >
        <h1 className="text-xl font-semibold mb-1">
          স্বাগতম, {profile?.anonymousName || 'অতিথি'} 👋
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          নিউজ ফিড এবং Create Post ফিচার ধাপ ২ তে যুক্ত হবে।
        </p>
      </motion.div>

      <div className="neo-card p-8 text-center text-slate-400 dark:text-slate-500 text-sm">
        📰 Feed আসছে শীঘ্রই...
      </div>
    </div>
  )
}
