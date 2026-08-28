import { useState } from 'react'
import { motion } from 'framer-motion'
import Avatar from './Avatar'
import ReactionBar from './ReactionBar'
import CommentSection from './CommentSection'
import { formatRelativeTime } from '../utils/time'
import { deletePost, registerShare, updatePostCaption } from '../services/posts'

function CommentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.6" y1="10.5" x2="15.4" y2="6.5" />
      <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

export default function PostCard({ post, currentUid, currentName, currentGender, currentPhotoUrl, showOwnerMenu = false, onChanged }) {
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
          <Avatar gender={post.authorGender} seed={post.authorName} photoUrl={post.authorPhotoURL} size={42} />
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
        <div className="rounded-2xl overflow-hidden mb-3 neo-inset relative">
          {post.type === 'story' && post.storyNumber && (
            <span className="absolute top-2 left-2 z-10 bg-black/50 text-white text-[11px] px-2 py-1 rounded-full">
              গল্প নং {post.storyNumber}
            </span>
          )}
          <img
            src={post.imageUrl}
            alt="post"
            className="w-full max-h-[520px] object-cover opacity-0 transition-opacity duration-500"
            loading="lazy"
            onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
          />
        </div>
      )}

      <ReactionBar post={post} uid={currentUid} name={currentName} gender={currentGender} photoUrl={currentPhotoUrl} onChange={onChanged} />

      <div className="flex gap-2 mt-3">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => setShowComments((v) => !v)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
            showComments
              ? 'primary-gradient text-white shadow-neo-light-sm dark:shadow-neo-dark-sm'
              : 'neo-inset text-slate-600 dark:text-slate-300'
          }`}
        >
          <CommentIcon />
          <span>{commentCount}</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium neo-inset text-slate-600 dark:text-slate-300 transition-all"
        >
          <ShareIcon />
          <span>Share{shareCount ? ` (${shareCount})` : ''}</span>
        </motion.button>

        {post.imageUrl && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleDownload}
            className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl neo-inset text-slate-600 dark:text-slate-300"
            aria-label="Download image"
          >
            <DownloadIcon />
          </motion.button>
        )}
      </div>

      {showComments && (
        <CommentSection post={post} onCommentAdded={() => setCommentCount((c) => c + 1)} />
      )}
    </motion.article>
  )
}
