import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LOGO_URL } from '../context/ThemeContext'
import Avatar from './Avatar'
import HamburgerMenu from './HamburgerMenu'
import NotificationsPanel from './NotificationsPanel'
import { fetchNotifications } from '../services/notifications'

export default function TopBar() {
  const { currentUser, profile } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!profile?.uid) return
    fetchNotifications(profile.uid).then((list) => {
      setUnreadCount(list.filter((n) => !n.read).length)
    })
  }, [profile?.uid])

  function toggleNotifications() {
    setNotifOpen((v) => {
      const next = !v
      if (next) setUnreadCount(0)
      return next
    })
  }

  return (
    <>
      <header className="sticky top-0 z-30 px-3 sm:px-6 py-3">
        <div className="neo-card flex items-center justify-between px-4 py-2.5 max-w-4xl mx-auto relative">
          {/* Left: circular logo */}
          <Link to="/" className="shrink-0">
            <div className="w-11 h-11 rounded-full overflow-hidden shadow-neo-light-sm dark:shadow-neo-dark-sm">
              <img src={LOGO_URL} alt="KIU Short Stories" className="w-full h-full object-cover" />
            </div>
          </Link>

          {/* Center: Home + Notification */}
          <nav className="flex items-center gap-2">
            <Link to="/" className="neo-btn text-sm py-2.5">
              🏠 <span className="hidden sm:inline">Home</span>
            </Link>
            <div className="relative">
              <button
                className="neo-icon-btn relative"
                aria-label="Notifications"
                onClick={toggleNotifications}
              >
                🔔
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <NotificationsPanel
                open={notifOpen}
                onClose={() => setNotifOpen(false)}
                uid={profile?.uid}
              />
            </div>
          </nav>

          {/* Right: Profile + Hamburger */}
          <div className="flex items-center gap-2">
            {currentUser && profile ? (
              <Link to="/profile" aria-label="Profile">
                <Avatar gender={profile.gender} seed={profile.anonymousName} photoUrl={profile.photoURL} size={40} />
              </Link>
            ) : (
              <Link to="/login" className="neo-icon-btn" aria-label="Login">
                👤
              </Link>
            )}
            <button
              className="neo-icon-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
