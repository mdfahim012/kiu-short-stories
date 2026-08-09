import { AnimatePresence, motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const FACEBOOK_URL = 'https://www.facebook.com/share/1EbdLWQdGx/'

export default function HamburgerMenu({ open, onClose }) {
  const { currentUser, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    onClose()
    navigate('/login')
  }

  const linkClass =
    'neo-card-sm flex items-center gap-3 px-4 py-3 text-sm font-medium hover:scale-[1.02] active:scale-[0.98] transition-transform'

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
          <motion.aside
            className="fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-base-light dark:bg-base-dark z-50 p-4 flex flex-col gap-3 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.28 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-lg">মেনু</span>
              <button className="neo-icon-btn" onClick={onClose} aria-label="Close menu">
                ✕
              </button>
            </div>

            <Link to="/" onClick={onClose} className={linkClass}>
              🏠 Home
            </Link>

            {currentUser && (
              <Link to="/profile" onClick={onClose} className={linkClass}>
                👤 Profile
              </Link>
            )}

            {!currentUser ? (
              <>
                <Link to="/login" onClick={onClose} className={linkClass}>
                  🔑 Login
                </Link>
                <Link to="/register" onClick={onClose} className={linkClass}>
                  📝 Register
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className={linkClass}>
                🚪 Logout
              </button>
            )}

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={linkClass}
            >
              {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>

            <div className="h-px bg-slate-300/40 dark:bg-slate-600/40 my-2" />

            <Link to="/about" onClick={onClose} className={linkClass}>
              ℹ️ About
            </Link>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noreferrer"
              onClick={onClose}
              className={linkClass}
            >
              📘 Contact (Facebook)
            </a>
            <Link to="/privacy" onClick={onClose} className={linkClass}>
              🔒 Privacy Policy
            </Link>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
