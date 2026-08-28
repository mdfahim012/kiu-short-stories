import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LOGO_URL } from '../context/ThemeContext'

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 animate-fade-in">
        <img src={LOGO_URL} alt="" className="w-14 h-14 rounded-full opacity-90" />
        <div className="w-9 h-9 border-[3px] border-slate-300/40 dark:border-slate-600/40 border-t-current rounded-full animate-spin text-primary" />
      </div>
    )
  }

  if (!currentUser) return <Navigate to="/login" replace />

  return children
}
