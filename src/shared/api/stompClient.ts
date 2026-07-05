import { Client } from '@stomp/stompjs'
import { getAccessToken } from './tokenStorage'

export function createStompClient(): Client {
  const client = new Client({
    brokerURL: import.meta.env.VITE_WS_BASE_URL,
    reconnectDelay: 5000,
  })

  // 재연결 시에도 최신 access token을 CONNECT 프레임에 실어야 하므로 매 연결 시도 직전에 헤더를 채운다
  client.beforeConnect = () => {
    client.connectHeaders = { Authorization: `Bearer ${getAccessToken() ?? ''}` }
  }

  return client
}
