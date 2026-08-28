import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getUserReaction, toggleReaction } from '../services/posts'

const REACTIONS = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'haha', emoji: '😆', label: 'Haha' },
]

export default function ReactionBar({ post, uid, name, gender, photoUrl, onChange }) {
  const [myReaction, setMyReaction] = useState(null)
  const [busy, setBusy] = useState(false)
  const [counts, setCounts] = useState({
    like: post.likeCount || 0,
    love: post.loveCount || 0,
    haha: post.hahaCount || 0,
  })

  useEffect(() => {
    let alive = true
    getUserReaction(post.id, uid).then((r) => {
      if (alive) setMyReaction(r)
    })
    return () => {
      alive = false
    }
  }, [post.id, uid])

  const totalCount = counts.like + counts.love + counts.haha

  async function handleReact(type) {
    if (busy) return
    setBusy(true)
    const prev = myReaction
    const nextType = prev === type ? null : type

    // optimistic UI update for both selection and counts
    setMyReaction(nextType)
    setCounts((c) => {
      const next = { ...c }
      if (prev) next[prev] = Math.max(0, next[prev] - 1)
      if (nextType) next[nextType] = next[nextType] + 1
      return next
    })

    try {
      await toggleReaction(post.id, uid, type, post.authorUid, name, gender, photoUrl)
    } catch (e) {
      setMyReaction(prev) // revert on failure
      setCounts({ like: post.likeCount || 0, love: post.loveCount || 0, haha: post.hahaCount || 0 })
      console.error(e)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      {totalCount > 0 && (
        <div className="flex items-center gap-1 px-1 pb-2 text-xs text-slate-500 dark:text-slate-400">
          <span>
            {counts.like > 0 && '👍'}
            {counts.love > 0 && '❤️'}
            {counts.haha > 0 && '😆'}
          </span>
          <span>{totalCount}</span>
        </div>
      )}
      <div className="flex gap-2">
        {REACTIONS.map((r) => (
          <motion.button
            key={r.type}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleReact(r.type)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all ${
              myReaction === r.type
                ? 'primary-gradient text-white shadow-neo-light-sm dark:shadow-neo-dark-sm'
                : 'neo-inset text-slate-600 dark:text-slate-300'
            }`}
          >
            <span>{r.emoji}</span>
            <span className="hidden sm:inline">{r.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
