import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './providers/AuthProvider'
import { CurrentUserProvider } from './providers/CurrentUserProvider'
import { ChatSocketProvider } from './providers/ChatSocketProvider'
import { router } from './routes'

export default function App() {
  return (
    <AuthProvider>
      <CurrentUserProvider>
        <ChatSocketProvider>
          <RouterProvider router={router} />
        </ChatSocketProvider>
      </CurrentUserProvider>
    </AuthProvider>
  )
}
