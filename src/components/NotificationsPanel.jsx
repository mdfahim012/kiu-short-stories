import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { fetchNotifications, markAllNotificationsRead } from '../services/notifications'
import { formatRelativeTime } from '../utils/time'
import Avatar from './Avatar'

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
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed left-1/2 -translate-x-1/2 top-20 sm:top-24 w-[92vw] max-w-sm neo-card p-0 z-50 max-h-[75vh] overflow-hidden flex flex-col"
          >
            <div className="px-4 py-3 border-b border-slate-300/30 dark:border-slate-600/30">
              <p className="text-base font-semibold">Notifications</p>
            </div>

            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="flex flex-col gap-1 p-2">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3 px-2 py-3 animate-pulse">
                      <div className="w-11 h-11 rounded-full bg-slate-300/50 dark:bg-slate-600/50 shrink-0" />
                      <div className="flex-1">
                        <div className="h-2.5 w-full bg-slate-300/50 dark:bg-slate-600/50 rounded mb-2" />
                        <div className="h-2 w-16 bg-slate-300/40 dark:bg-slate-600/40 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-10 px-4">
                  🔔 এখনো কোনো নোটিফিকেশন নেই — কেউ তোমার পোস্টে রিয়্যাক্ট বা কমেন্ট করলে এখানে দেখা যাবে
                </p>
              ) : (
                <div className="flex flex-col p-1.5">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 px-2.5 py-2.5 rounded-xl transition-colors ${
                        n.read ? '' : 'bg-blue-50 dark:bg-blue-500/10'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <Avatar
                          gender={n.fromGender}
                          seed={n.fromName}
                          photoUrl={n.fromPhotoURL}
                          size={44}
                        />
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-[11px] shadow">
                          {n.type === 'reaction' ? REACTION_EMOJI[n.reactionType] || '👍' : '💬'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13.5px] leading-snug">
                          <span className="font-semibold">{n.fromName}</span>{' '}
                          {n.type === 'reaction' ? (
                            <>তোমার পোস্টে রিয়্যাক্ট করেছে</>
                          ) : (
                            <>কমেন্ট করেছে: "{n.text}"</>
                          )}
                        </p>
                        <p className="text-xs text-primary font-medium mt-0.5">
                          {formatRelativeTime(n.createdAt)}
                        </p>
                      </div>
                      {!n.read && <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
