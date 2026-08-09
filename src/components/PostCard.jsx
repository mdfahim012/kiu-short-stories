import { useState } from 'react'
import { motion } from 'framer-motion'
import Avatar from './Avatar'
import ReactionBar from './ReactionBar'
import CommentSection from './CommentSection'
import { formatRelativeTime } from '../utils/time'
import { deletePost, registerShare, updatePostCaption } from '../services/posts'

export default function PostCard({ post, currentUid, showOwnerMenu = false, onChanged }) {
  const [showComments, setShowComments] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [captionDraft, setCaptionDraft] = useState(post.caption || '')
  const [busy, setBusy] = useState(false)
  const [commentCount, setCommentCount] = useState(post.commentCount || 0)
  const [shareCount, setShareCount] = useState(post.shareCount || 0)

  const isOwner = showOwnerMenu && post.authorUid === currentUid

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'KIU Short Stories',
          text: post.caption || 'একটা পোস্ট দেখো KIU Short Stories এ',
          url: post.imageUrl,
        })
      } else {
        await navigator.clipboard.writeText(post.imageUrl)
        alert('ছবির লিংক কপি হয়েছে!')
      }
      await registerShare(post.id)
      setShareCount((c) => c + 1)
    } catch (e) {
      // user cancelled share sheet - not an error
    }
  }

  async function handleDownload() {
    try {
      const res = await fetch(post.imageUrl, { mode: 'cors' })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `kiu-short-stories-${post.id}.jpg`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      window.open(post.imageUrl, '_blank')
    }
  }

  async function handleDelete() {
    if (!confirm('পোস্টটা ডিলিট করতে চাও? এটা আর ফিরিয়ে আনা যাবে না।')) return
    setBusy(true)
    try {
      await deletePost(post.id, post.authorUid)
      onChanged?.()
    } catch (e) {
      console.error(e)
      setBusy(false)
    }
  }

  async function handleSaveEdit() {
    setBusy(true)
    try {
      await updatePostCaption(post.id, captionDraft.trim())
      post.caption = captionDraft.trim()
      setEditing(false)
      onChanged?.()
    } catch (e) {
      console.error(e)
    } finally {
      setBusy(false)
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="neo-card p-4 mb-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar gender={post.authorGender} seed={post.authorName} size={42} />
          <div>
            <p className="text-sm font-semibold">{post.authorName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatRelativeTime(post.createdAt)}
            </p>
          </div>
        </div>

        {isOwner && (
          <div className="relative">
            <button
              className="neo-icon-btn w-9 h-9"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Post options"
            >
              ⋮
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 neo-card p-2 flex flex-col gap-1 z-10 w-32">
                <button
                  className="text-left px-3 py-2 text-sm rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
                  onClick={() => {
                    setEditing(true)
                    setMenuOpen(false)
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  className="text-left px-3 py-2 text-sm rounded-xl text-red-500 hover:bg-black/5 dark:hover:bg-white/5"
                  onClick={handleDelete}
                  disabled={busy}
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {editing ? (
        <div className="mb-3">
          <textarea
            value={captionDraft}
            onChange={(e) => setCaptionDraft(e.target.value)}
            rows={3}
            className="neo-inset w-full p-3 bg-transparent outline-none text-sm rounded-2xl"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSaveEdit}
              disabled={busy}
              className="neo-btn primary-gradient text-white text-sm py-2"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditing(false)
                setCaptionDraft(post.caption || '')
              }}
              className="neo-btn text-sm py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        post.caption && <p className="text-sm mb-3 whitespace-pre-wrap break-words">{post.caption}</p>
      )}

      {post.imageUrl && (
        <div className="rounded-2xl overflow-hidden mb-3 neo-inset">
          <img src={post.imageUrl} alt="post" className="w-full max-h-[520px] object-cover" loading="lazy" />
        </div>
      )}

      <ReactionBar post={post} uid={currentUid} onChange={onChanged} />

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => setShowComments((v) => !v)}
          className="flex-1 neo-btn text-sm py-2 flex items-center justify-center gap-1.5"
        >
          💬 {commentCount}
        </button>
        <button onClick={handleShare} className="flex-1 neo-btn text-sm py-2 flex items-center justify-center gap-1.5">
          ↗️ Share {shareCount ? `(${shareCount})` : ''}
        </button>
        {post.imageUrl && (
          <button onClick={handleDownload} className="neo-icon-btn" aria-label="Download image">
            ⬇️
          </button>
        )}
      </div>

      {showComments && (
        <CommentSection post={post} onCommentAdded={() => setCommentCount((c) => c + 1)} />
      )}
    </motion.article>
  )
}
