# 상태관리 규칙

이 파일은 컴포넌트 상태·전역 상태 관리 시 항상 따라야 할 규칙을 정의한다. 이 프로젝트는 별도 상태관리 라이브러리를 쓰지 않고 React 내장 기능(`useState`, `useReducer`, `useContext`)만 사용한다.

---

## 상태 종류별 선택 기준

| 상태 종류 | 도구 | 예시 |
|-----------|------|------|
| 단일 컴포넌트 로컬 상태 | `useState` | 입력창 텍스트, 모달 열림 여부 |
| 여러 필드가 함께 바뀌는 복잡한 로컬 상태 | `useReducer` | 메시지 전송 폼의 상태 머신 (idle/sending/error) |
| 여러 feature가 공유하는 상태 | `useContext` + Provider | 로그인 사용자 정보, WebSocket 연결 상태 |
| 서버에서 받아온 데이터 | 필요한 컴포넌트/훅에서 직접 fetch | 메시지 목록, 채널 목록 |

---

## 서버 데이터를 전역 상태에 두지 않는다

API 응답은 전역 상태(Context)에 캐싱하지 않고, 해당 데이터가 필요한 커스텀 훅에서 직접 요청한다. 데이터 fetch 로직과 상태를 훅 안에 캡슐화한다.

```ts
// ✅ 올바른 예 — features/chat/hooks/useMessages.ts
export function useMessages(channelId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMessages(channelId).then(setMessages).finally(() => setIsLoading(false))
  }, [channelId])

  return { messages, isLoading }
}

// ❌ 잘못된 예 — 서버 데이터를 전역 Context에 저장
const MessagesContext = createContext<Message[]>([])
```

예외: 인증된 사용자 정보처럼 앱 전역에서 반복 조회되고 자주 바뀌지 않는 데이터는 Context에 둘 수 있다 ([api-conventions.md](api-conventions.md)의 인증 토큰 처리 참고).

---

## Context는 Provider와 훅을 함께 만든다

Context 객체를 컴포넌트에서 직접 `useContext(XxxContext)`로 꺼내 쓰지 않는다. 전용 훅을 만들어 `null` 체크를 캡슐화한다.

```tsx
// ✅ 올바른 예 — app/providers/AuthProvider.tsx
const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // ...
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

// ❌ 잘못된 예 — 컴포넌트마다 직접 useContext + null 체크 반복
const auth = useContext(AuthContext)
if (!auth) throw new Error(...)
```

---

## Context 분리 기준

자주 바뀌는 값과 거의 안 바뀌는 값을 하나의 Context에 함께 두지 않는다. 불필요한 리렌더링을 유발한다.

```
// ✅ 올바른 예 — 갱신 빈도로 분리
AuthContext          (로그인 사용자, 거의 안 바뀜)
ChatSocketContext    (연결 상태, 수신 메시지 스트림 — 자주 바뀜)

// ❌ 잘못된 예 — 하나의 Context에 다 몰아넣음
AppContext (user + socketStatus + messages + theme ...)
```

---

## Prop drilling 허용 범위

2단계까지는 props로 전달한다. 3단계 이상 내려가면 Context 도입을 고려한다.

```
// ✅ 올바른 예 — 2단계는 props로 충분
ChatRoom → MessageList → MessageBubble (props: message)

// ❌ 잘못된 예 — 4단계 이상 prop drilling
ChatRoom → Sidebar → ChannelGroup → ChannelItem → UnreadBadge (props: currentUserId)
// → useAuth() 훅으로 대체
```

---

## 파생 상태를 별도 state로 만들지 않는다

기존 state나 props로 계산 가능한 값은 `useState`로 따로 관리하지 않고 렌더링 중 계산한다.

```tsx
// ✅ 올바른 예
const unreadCount = messages.filter((m) => !m.isRead).length

// ❌ 잘못된 예 — messages와 동기화해야 하는 중복 상태
const [unreadCount, setUnreadCount] = useState(0)
useEffect(() => {
  setUnreadCount(messages.filter((m) => !m.isRead).length)
}, [messages])
```
