import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { LOGO_URL } from '../context/ThemeContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [gender, setGender] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!gender) {
      setError('অনুগ্রহ করে Gender সিলেক্ট করো')
      return
    }
    if (password.length < 6) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টার হতে হবে')
      return
    }
    setBusy(true)
    try {
      await register(email, password, gender)
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
          <h1 className="text-xl font-semibold">Create Account</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">
            নাম লাগবে না — তোমার একটা অ্যানোনিমাস পরিচয় অটোমেটিক তৈরি হবে
          </p>
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
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="neo-inset w-full px-4 py-3 bg-transparent outline-none text-sm"
          />

          <div className="flex gap-3">
            {['male', 'female'].map((g) => (
              <button
                type="button"
                key={g}
                onClick={() => setGender(g)}
                className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all ${
                  gender === g
                    ? 'primary-gradient text-white shadow-neo-light-sm dark:shadow-neo-dark-sm'
                    : 'neo-inset'
                }`}
              >
                {g === 'male' ? '👦 Male' : '👧 Female'}
              </button>
            ))}
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button type="submit" disabled={busy} className="neo-btn primary-gradient text-white text-center font-medium disabled:opacity-60">
            {busy ? 'তৈরি হচ্ছে...' : 'Register'}
          </button>
        </form>

        <p className="text-xs text-center mt-5 text-slate-500 dark:text-slate-400">
          অ্যাকাউন্ট আছে? <Link to="/login" className="text-primary font-medium">Login</Link>
        </p>
      </motion.div>
    </div>
  )
}

function mapAuthError(code) {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'এই ইমেইল দিয়ে আগেই একাউন্ট আছে'
    case 'auth/invalid-email':
      return 'ইমেইল সঠিক নয়'
    case 'auth/weak-password':
      return 'পাসওয়ার্ড দুর্বল, আরেকটু শক্তিশালী দাও'
    default:
      return 'কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করো'
  }
}
