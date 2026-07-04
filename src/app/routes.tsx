import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './providers/AuthProvider'
import { LoginPage } from '../features/auth/components/LoginPage'
import { CallbackPage } from '../features/auth/components/CallbackPage'
import { ChatLayout } from '../features/chat/components/ChatLayout'

function RequireAuth() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return <Outlet />
}

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/callback', element: <CallbackPage /> },
  {
    element: <RequireAuth />,
    children: [{ path: '/', element: <ChatLayout /> }],
  },
])
