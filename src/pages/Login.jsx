import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { LOGO_URL } from '../context/ThemeContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(mapAuthError(err.code))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="neo-card w-full max-w-sm p-7"
      >
        <div className="flex flex-col items-center mb-6">
          <img src={LOGO_URL} alt="Logo" className="w-16 h-16 rounded-full shadow-neo-light-sm dark:shadow-neo-dark-sm object-cover mb-3" />
          <h1 className="text-xl font-semibold">KIU Short Stories</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">লগইন করে চালিয়ে যাও</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="neo-inset w-full px-4 py-3 bg-transparent outline-none text-sm"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="neo-inset w-full px-4 py-3 bg-transparent outline-none text-sm"
          />

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button type="submit" disabled={busy} className="neo-btn primary-gradient text-white text-center font-medium disabled:opacity-60">
            {busy ? 'লগইন হচ্ছে...' : 'Login'}
          </button>
        </form>

        <p className="text-xs text-center mt-5 text-slate-500 dark:text-slate-400">
          অ্যাকাউন্ট নেই? <Link to="/register" className="text-primary font-medium">Register</Link>
        </p>
      </motion.div>
    </div>
  )
}

function mapAuthError(code) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'ইমেইল অথবা পাসওয়ার্ড ভুল'
    case 'auth/invalid-email':
      return 'ইমেইল সঠিক নয়'
    default:
      return 'কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করো'
  }
}
