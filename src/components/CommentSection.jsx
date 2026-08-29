import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { addComment, fetchComments } from '../services/posts'
import { formatRelativeTime } from '../utils/time'
import Avatar from './Avatar'

export default function CommentSection({ post, onCommentAdded }) {
  const { profile } = useAuth()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    let alive = true
    fetchComments(post.id).then((c) => {
      if (alive) {
        setComments(c)
        setLoading(false)
      }
    })
    return () => {
      alive = false
    }
  }, [post.id])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    const optimisticComment = {
      id: `temp-${Date.now()}`,
      authorUid: profile.uid,
      authorName: profile.anonymousName,
      authorGender: profile.gender,
      authorPhotoURL: profile.photoURL || null,
      text: text.trim(),
      createdAt: null,
    }
    setComments((prev) => [...prev, optimisticComment])
    setText('')
    try {
      await addComment(post.id, {
        authorUid: profile.uid,
        authorName: profile.anonymousName,
        authorGender: profile.gender,
        authorPhotoURL: profile.photoURL || null,
        text: optimisticComment.text,
      }, post.authorUid)
      onCommentAdded?.()
    } catch (e) {
      console.error(e)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mt-3 pt-3 border-t border-slate-300/40 dark:border-slate-600/40">
      {loading ? (
        <p className="text-xs text-slate-400 text-center py-2">LOADING...</p>
      ) : (
        <div className="flex flex-col gap-3 max-h-64 overflow-y-auto mb-3">
          {comments.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-1">প্রথম কমেন্টটা করো</p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              <Avatar gender={c.authorGender} seed={c.authorName} photoUrl={c.authorPhotoURL} size={30} />
              <div className="neo-inset rounded-2xl px-3 py-2 flex-1">
                <p className="text-xs font-semibold">{c.authorName}</p>
                <p className="text-sm break-words">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a Comment..."
          className="neo-inset flex-1 px-3 py-2 bg-transparent outline-none text-sm rounded-xl"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="neo-icon-btn disabled:opacity-50"
          aria-label="Send comment"
        >
          ➤
        </button>
      </form>
    </div>
  )
}
