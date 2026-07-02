# 네이밍 규칙

이 파일은 파일·컴포넌트·훅·타입 이름 작성 시 항상 따라야 할 규칙을 정의한다.

---

## 파일명

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase | `MessageList.tsx`, `ChatRoom.tsx` |
| 커스텀 훅 파일 | camelCase, `use` 접두사 | `useChatSocket.ts`, `useDebounce.ts` |
| 그 외 TS 파일 (api, utils, types) | camelCase | `chatApi.ts`, `formatTime.ts` |
| 타입 전용 파일 | `types.ts` | `features/chat/types.ts` |

```
// ✅ 올바른 예
features/chat/components/MessageInput.tsx
features/chat/hooks/useChatSocket.ts
features/chat/api/chatApi.ts

// ❌ 잘못된 예
features/chat/components/message-input.tsx   // kebab-case 금지 (컴포넌트)
features/chat/hooks/ChatSocket.ts             // use 접두사 누락
```

---

## 컴포넌트

컴포넌트 함수명은 파일명과 동일한 PascalCase를 사용한다.

```tsx
// ✅ 올바른 예 — MessageList.tsx
export function MessageList({ messages }: MessageListProps) { ... }

// ❌ 잘못된 예 — 파일명과 함수명 불일치
export function List({ messages }: MessageListProps) { ... }
```

---

## Props 타입

컴포넌트 Props 타입은 `{ComponentName}Props`로 짓고, 해당 컴포넌트 파일 상단에 `type`으로 선언한다. 다른 파일에서 재사용할 때만 export한다.

```tsx
// ✅ 올바른 예
type MessageListProps = {
  messages: Message[]
  onSelect: (id: string) => void
}

export function MessageList({ messages, onSelect }: MessageListProps) { ... }

// ❌ 잘못된 예 — interface와 type 혼용, I 접두사
interface IMessageListProps { ... }
```

`interface`가 아닌 `type`을 사용한다 (Props, 도메인 타입 모두 동일). 확장이 필요한 경우에만 `interface` + `extends`를 예외적으로 허용한다.

---

## 커스텀 훅

훅은 항상 `use`로 시작하고, 도메인 훅은 `use{Domain}...` 형태로 짓는다.

```ts
// ✅ 올바른 예
useChatSocket()      // features/chat/hooks
useAuthUser()         // features/auth/hooks
useDebounce(value)    // shared/hooks — 범용

// ❌ 잘못된 예
chatSocket()          // use 접두사 없음
getAuthUser()          // get 접두사는 훅이 아닌 일반 함수처럼 보임
```

---

## 이벤트 핸들러 props / 함수

Props로 전달하는 콜백은 `on{Event}`, 컴포넌트 내부에서 정의하는 핸들러는 `handle{Event}`로 짓는다.

```tsx
// ✅ 올바른 예
type MessageInputProps = {
  onSubmit: (text: string) => void   // prop
}

function MessageInput({ onSubmit }: MessageInputProps) {
  const handleSubmit = () => { ... }  // 내부 핸들러
  return <form onSubmit={handleSubmit}>...</form>
}
```

---

## Boolean 변수·props

`is`, `has`, `should` 접두사를 사용한다.

```ts
// ✅ 올바른 예
isLoading, hasError, shouldReconnect

// ❌ 잘못된 예
loading, error, reconnect   // boolean인지 함수인지 불명확
```

---

## 상수

모듈 최상위 상수는 `UPPER_SNAKE_CASE`를 사용한다.

```ts
// ✅ 올바른 예
const MAX_RECONNECT_ATTEMPTS = 5
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL
```
