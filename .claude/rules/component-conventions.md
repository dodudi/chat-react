# 컴포넌트 작성 규칙

이 파일은 React 컴포넌트 작성 시 항상 따라야 할 규칙을 정의한다.

---

## 함수 선언 방식

컴포넌트는 `function` 선언문으로 작성한다. 화살표 함수 + `const`는 사용하지 않는다.

```tsx
// ✅ 올바른 예
export function MessageList({ messages }: MessageListProps) { ... }

// ❌ 잘못된 예
export const MessageList = ({ messages }: MessageListProps) => { ... }
```

---

## Export 방식

컴포넌트는 named export를 기본으로 한다. `App.tsx`, 라우트 페이지 컴포넌트 등 진입점 역할을 하는 파일에 한해 `export default`를 허용한다.

```tsx
// ✅ 올바른 예 — 일반 컴포넌트
export function MessageBubble({ message }: MessageBubbleProps) { ... }

// ✅ 올바른 예 — 라우트 진입점
export default function ChatPage() { ... }
```

named export를 기본으로 하는 이유: barrel 파일 없이도 자동完성·자동 import가 정확히 동작하고, 리네이밍 시 파일명과 불일치가 생기지 않는다.

---

## `React.FC` 사용 금지

`React.FC`, `React.FunctionComponent` 타입을 사용하지 않는다. Props 타입을 함수 매개변수에 직접 지정한다.

```tsx
// ✅ 올바른 예
function MessageBubble({ message }: MessageBubbleProps) { ... }

// ❌ 잘못된 예 — 암묵적 children, 불필요한 제네릭
const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => { ... }
```

`children`이 실제로 필요할 때만 Props 타입에 명시적으로 추가한다.

```tsx
type ModalProps = {
  children: React.ReactNode
}
```

---

## 컴포넌트 크기와 분리 기준

한 컴포넌트가 서로 다른 두 가지 이상의 책임(예: 데이터 페칭 + 리스트 렌더링 + 폼 처리)을 가지면 분리한다. 분리 기준은 "이 컴포넌트를 수정하는 이유가 몇 가지인가"이다.

```
// ✅ 올바른 예 — 책임별 분리
ChatRoom.tsx        (레이아웃 조립)
MessageList.tsx     (메시지 목록 렌더링)
MessageInput.tsx    (입력 폼 + 전송)

// ❌ 잘못된 예 — 하나의 컴포넌트에 목록 렌더링 + 폼 + 소켓 연결 관리가 뒤섞임
ChatRoom.tsx  (500+ lines, 모든 로직 포함)
```

데이터 페칭·소켓 연결 등 로직은 커스텀 훅으로 뽑아 컴포넌트에서는 호출만 한다 ([state-conventions.md](state-conventions.md) 참고).

---

## Props 구조 분해

Props는 함수 매개변수에서 구조 분해한다. `props.xxx` 형태로 접근하지 않는다.

```tsx
// ✅ 올바른 예
function MessageBubble({ message, isOwn }: MessageBubbleProps) { ... }

// ❌ 잘못된 예
function MessageBubble(props: MessageBubbleProps) {
  return <div>{props.message.text}</div>
}
```

---

## 조건부 렌더링

`&&` 단축 렌더링에서 좌변이 숫자가 될 수 있으면 반드시 boolean으로 변환한다 (`0`이 렌더링되는 버그 방지).

```tsx
// ✅ 올바른 예
{messages.length > 0 && <MessageList messages={messages} />}

// ❌ 잘못된 예 — messages.length가 0이면 화면에 "0"이 출력됨
{messages.length && <MessageList messages={messages} />}
```
