import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Avatar from './Avatar'
import CreatePostModal from './CreatePostModal'

export default function CreatePostBox({ onPosted }) {
  const { profile } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="neo-card p-4 mb-5 flex items-center gap-3">
        <Avatar gender={profile?.gender} seed={profile?.anonymousName} photoUrl={profile?.photoURL} size={42} />
        <button
          onClick={() => setOpen(true)}
          className="neo-inset flex-1 text-left px-4 py-3 rounded-2xl text-sm text-slate-500 dark:text-slate-400"
        >
          আপনার লেখাটি এখানে পোস্ট করুন, {profile?.anonymousName}?
        </button>
      </div>
      <CreatePostModal open={open} onClose={() => setOpen(false)} onPosted={onPosted} />
    </>
  )
}
