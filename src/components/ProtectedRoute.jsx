import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="neo-card-sm w-12 h-12 animate-spin border-4 border-transparent border-t-current rounded-full text-primary" />
      </div>
    )
  }

  if (!currentUser) return <Navigate to="/login" replace />

  return children
}
