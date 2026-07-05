import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import type { IMessage, StompSubscription } from '@stomp/stompjs'
import { createStompClient } from '../../shared/api/stompClient'
import { useAuth } from './AuthProvider'

type SocketCallback = (message: IMessage) => void

type SocketSubscription = {
  destination: string
  callback: SocketCallback
  live?: StompSubscription
}

type ChatSocketContextValue = {
  subscribe: (destination: string, callback: SocketCallback) => () => void
}

const ChatSocketContext = createContext<ChatSocketContextValue | null>(null)

export function ChatSocketProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const clientRef = useRef(createStompClient())
  const subscriptionsRef = useRef(new Map<string, SocketSubscription>())

  useEffect(() => {
    const client = clientRef.current

    // 구독은 onConnect 안에서 등록해야 재연결 시에도 자동으로 복구된다
    client.onConnect = () => {
      subscriptionsRef.current.forEach((subscription) => {
        subscription.live = client.subscribe(subscription.destination, subscription.callback)
      })
    }

    if (isAuthenticated) {
      client.activate()
    } else {
      client.deactivate()
    }

    return () => {
      client.deactivate()
    }
  }, [isAuthenticated])

  const contextValue = useMemo<ChatSocketContextValue>(
    () => ({
      subscribe(destination, callback) {
        const client = clientRef.current
        const key = crypto.randomUUID()
        const subscription: SocketSubscription = { destination, callback }
        subscriptionsRef.current.set(key, subscription)

        if (client.connected) {
          subscription.live = client.subscribe(destination, callback)
        }

        return () => {
          subscriptionsRef.current.get(key)?.live?.unsubscribe()
          subscriptionsRef.current.delete(key)
        }
      },
    }),
    [],
  )

  return <ChatSocketContext.Provider value={contextValue}>{children}</ChatSocketContext.Provider>
}

export function useChatSocket() {
  const context = useContext(ChatSocketContext)
  if (!context) throw new Error('useChatSocket must be used within ChatSocketProvider')
  return context
}
