# API / WebSocket 통신 규칙

이 파일은 백엔드([chat-spring](C:\workspace\project\chat-spring)) 호출 시 항상 따라야 할 규칙을 정의한다.

---

## REST — axios

### 인스턴스는 하나만 둔다

`shared/api/client.ts`에 axios 인스턴스를 하나만 만들고, `baseURL`은 환경변수(`VITE_API_BASE_URL`)로 주입한다. 백엔드는 전역 context-path 없이 컨트롤러마다 `/api/v1/{domain}` prefix를 쓴다 (예: `/api/v1/users`, `/api/v1/friends`, `/api/v1/dm`, `/api/v1/servers`).

```ts
// ✅ 올바른 예 — shared/api/client.ts
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})
```

### JWT는 인터셉터에서 자동 첨부한다

요청 인터셉터에서 access token을 `Authorization: Bearer {token}` 헤더로 첨부한다. 컴포넌트나 개별 api 함수에서 토큰을 직접 다루지 않는다.

```ts
// ✅ 올바른 예
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ❌ 잘못된 예 — 호출부마다 토큰을 직접 헤더에 넣음
axios.get('/api/v1/users/me', { headers: { Authorization: `Bearer ${token}` } })
```

401 응답은 응답 인터셉터에서 공통 처리(리프레시 또는 로그인 페이지 이동)한다. 개별 api 함수에서 401을 각자 처리하지 않는다.

### 응답 언래핑

백엔드 응답은 항상 `{ code, message, data }` 형태다 (`success` boolean 필드 없음, 성공 시 `code: "200"`). 응답 인터셉터에서 `data` 필드만 꺼내 반환하고, 호출부는 unwrap된 값을 그대로 쓴다.

```ts
// ✅ 올바른 예 — shared/api/client.ts
apiClient.interceptors.response.use((response) => response.data.data)

// features/friend/api/friendApi.ts
export async function fetchFriends(): Promise<Friend[]> {
  return apiClient.get('/api/v1/friends')
}

// ❌ 잘못된 예 — 호출부마다 response.data.data를 반복 접근
const res = await apiClient.get('/api/v1/friends')
const friends = res.data.data
```

실패 응답(`code`가 `"200"`이 아님)은 axios가 HTTP status로 이미 에러를 던지는 경우 그대로 catch하고, 2xx인데 실패를 담은 경우를 위해 응답 인터셉터에서 `code !== "200"`이면 `reject`한다.

### api 함수는 도메인별로 분리한다

axios를 컴포넌트에서 직접 호출하지 않는다. `features/{domain}/api/`에 엔드포인트당 함수 하나씩 작성하고, 컴포넌트는 커스텀 훅을 통해서만 호출한다 ([state-conventions.md](state-conventions.md) 참고).

```
// ✅ 올바른 예
features/friend/api/friendApi.ts   → fetchFriends(), sendFriendRequest()
features/friend/hooks/useFriends.ts → useState + useEffect로 fetchFriends() 호출

// ❌ 잘못된 예 — 컴포넌트 안에서 apiClient.get(...) 직접 호출
```

---

## WebSocket — STOMP (`@stomp/stompjs`)

백엔드는 raw WebSocket이 아니라 **STOMP** 메시지 브로커([spring-messaging](C:\workspace\project\chat-spring), `@EnableWebSocketMessageBroker`)를 쓴다. 직접 STOMP 프레임을 파싱하지 않고 `@stomp/stompjs`를 사용한다.

### 엔드포인트와 인증

- 엔드포인트: `/ws` (SockJS) 또는 `/ws-plain` (raw STOMP-over-WebSocket). 브라우저 호환성 문제가 없다면 `/ws-plain`을 기본으로 쓴다.
- HTTP 핸드셰이크 자체는 인증이 없다 (`permitAll`). **JWT는 STOMP CONNECT 프레임의 `Authorization` 네이티브 헤더**로 전달해야 한다 (`Bearer {token}`). 쿼리 파라미터로 전달하지 않는다.
- Broker 구독 prefix: `/topic`, `/queue`. 클라이언트 발행 prefix: `/app`. 사용자 개인 큐 prefix: `/user`.

```ts
// ✅ 올바른 예 — shared/api/stompClient.ts
import { Client } from '@stomp/stompjs'

export function createStompClient(getToken: () => string) {
  return new Client({
    brokerURL: import.meta.env.VITE_WS_BASE_URL, // ws(s)://.../ws-plain
    connectHeaders: {
      Authorization: `Bearer ${getToken()}`,
    },
    reconnectDelay: 5000,
  })
}

// ❌ 잘못된 예 — 토큰을 쿼리 파라미터로 전달 (백엔드가 읽지 않음)
new WebSocket(`${WS_URL}?token=${token}`)
```

### 연결은 Provider 하나로 관리한다

STOMP 클라이언트 연결·해제·구독은 `app/providers/ChatSocketProvider.tsx` 한 곳에서 관리하고, 각 컴포넌트는 전용 훅(`useChatSocket`, `useChannelSubscription` 등)으로 구독/발행만 한다. 컴포넌트마다 개별적으로 `new Client(...)`를 생성하지 않는다.

```ts
// ✅ 올바른 예 — 훅에서는 Provider의 client를 구독만 함
export function useChannelMessages(channelId: string) {
  const client = useChatSocketClient()
  useEffect(() => {
    const sub = client.subscribe(`/topic/channels/${channelId}`, (msg) => { ... })
    return () => sub.unsubscribe()
  }, [client, channelId])
}
```

### 재연결 시 구독 복구

`onConnect` 콜백 안에서 구독을 등록한다 (재연결 시 자동 재실행됨). `activate()` 호출 전에 구독하지 않는다.

```ts
// ✅ 올바른 예
client.onConnect = () => {
  client.subscribe('/user/queue/notifications', handleNotification)
}
client.activate()
```
