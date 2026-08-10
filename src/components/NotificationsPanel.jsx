import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { fetchNotifications, markAllNotificationsRead } from '../services/notifications'
import { formatRelativeTime } from '../utils/time'

const REACTION_EMOJI = { like: '👍', love: '❤️', haha: '😆' }

export default function NotificationsPanel({ open, onClose, uid }) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!open || !uid) return
    let alive = true
    setLoading(true)
    fetchNotifications(uid).then(async (list) => {
      if (!alive) return
      setNotifications(list)
      setLoading(false)
      markAllNotificationsRead(uid, list).catch(() => {})
    })
    return () => {
      alive = false
    }
  }, [open, uid])

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            className="absolute right-3 sm:right-auto top-16 sm:top-auto sm:mt-2 w-[320px] max-w-[90vw] neo-card p-3 z-50 max-h-[70vh] overflow-y-auto"
          >
            <p className="text-sm font-semibold px-2 pb-2">Notifications</p>

            {loading ? (
              <p className="text-xs text-slate-400 text-center py-6">লোড হচ্ছে...</p>
            ) : notifications.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">এখনো কোনো নোটিফিকেশন নেই</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-3 py-2.5 rounded-2xl text-sm ${
                      n.read ? '' : 'neo-inset'
                    }`}
                  >
                    {n.type === 'reaction' ? (
                      <p>
                        <span className="font-medium">{n.fromName}</span> তোমার পোস্টে{' '}
                        {REACTION_EMOJI[n.reactionType] || '👍'} রিয়্যাক্ট করেছে
                      </p>
                    ) : (
                      <p>
                        <span className="font-medium">{n.fromName}</span> কমেন্ট করেছে:{' '}
                        <span className="text-slate-500 dark:text-slate-400">"{n.text}"</span>
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400 mt-0.5">{formatRelativeTime(n.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
