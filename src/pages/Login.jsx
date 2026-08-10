import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { LOGO_URL } from '../context/ThemeContext'

export default function Login() {
  const { login, resetPassword } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
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

  async function handleForgotPassword() {
    setError('')
    setInfo('')
    if (!email) {
      setError('আগে উপরে তোমার ইমেইল লিখো, তারপর Forgot password চাপো')
      return
    }
    try {
      await resetPassword(email)
      setInfo('পাসওয়ার্ড রিসেট লিংক ইমেইলে পাঠানো হয়েছে — ইনবক্স (বা Spam) চেক করো')
    } catch (err) {
      setError(mapAuthError(err.code))
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

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="neo-inset w-full px-4 py-3 pr-11 bg-transparent outline-none text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-sm"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-xs text-primary text-right -mt-2"
          >
            Forgot password?
          </button>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          {info && <p className="text-green-600 dark:text-green-400 text-xs text-center">{info}</p>}

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
    case 'auth/too-many-requests':
      return 'অনেকবার চেষ্টা হয়েছে, কিছুক্ষণ পর আবার চেষ্টা করো'
    default:
      return 'কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করো'
  }
}
