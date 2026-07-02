# 디렉토리 구조 규칙

이 파일은 `src/` 하위 디렉토리 구조 작성 시 항상 따라야 할 규칙을 정의한다.

---

## 원칙 — 기능(도메인) 응집도 우선

디렉토리는 기술적 역할이 아닌 기능 도메인을 기준으로 나눈다.
"이 파일을 수정할 때 함께 수정하게 될 파일들이 같은 디렉토리에 있는가?"를 기준으로 판단한다.
백엔드([chat-spring](C:\workspace\project\chat-spring)) 패키지 구조와 동일한 원칙이다.

```
// ✅ 올바른 예 — 도메인별로 컴포넌트·훅·api 포함
features/chat/components/MessageList.tsx
features/chat/hooks/useChatSocket.ts
features/chat/api/chatApi.ts

// ❌ 잘못된 예 — 기술적 역할 버킷
components/MessageList.tsx
hooks/useChatSocket.ts
api/chatApi.ts
```

---

## 전체 구조

```
src/
├── app/                      앱 진입점, 전역 프로바이더, 라우터
│   ├── App.tsx
│   ├── routes.tsx
│   └── providers/            AuthProvider, ChatSocketProvider 등 전역 Context
│
├── features/
│   └── {domain}/              예: chat, auth, friend, dm, notification
│       ├── components/       해당 도메인 전용 컴포넌트
│       ├── hooks/             해당 도메인 전용 커스텀 훅
│       ├── api/               axios 요청 함수
│       └── types.ts           도메인 타입 (Request/Response 등)
│
├── shared/                    여러 feature가 공유하는 코드
│   ├── components/           범용 UI 컴포넌트 (Button, Modal, Avatar 등)
│   ├── hooks/                 범용 훅 (useDebounce 등)
│   ├── api/                   axios 인스턴스, 인터셉터, WebSocket 클라이언트
│   └── utils/                 순수 유틸 함수
│
└── main.tsx
```

도메인명은 백엔드 도메인(User, Server, Channel, Message, Friend, DM, Notification)과 최대한 맞춘다. 프론트엔드에서만 필요한 도메인(예: `auth`)은 추가로 만들 수 있다.

---

## 도메인 내부 서브디렉토리 규칙

| 서브디렉토리 | 포함 대상 |
|-------------|----------|
| `components/` | 해당 도메인에서만 쓰는 컴포넌트 |
| `hooks/` | 해당 도메인 전용 커스텀 훅 (`use{Domain}...`) |
| `api/` | axios 요청 함수, 이 도메인의 REST 엔드포인트 호출부 |
| `types.ts` | 이 도메인의 Request/Response, 엔티티 타입 |

서브디렉토리는 필요한 것만 만든다. 컴포넌트가 하나뿐이면 `components/` 디렉토리 없이 `features/{domain}/{Component}.tsx`로 둬도 된다.

---

## 공유 코드 판단 기준

두 개 이상의 feature에서 동일한 코드가 필요해지는 시점에 `shared/`로 옮긴다. 미리 `shared/`에 만들어두지 않는다 (YAGNI).

```
// ✅ 올바른 예 — chat과 dm이 모두 메시지 말풍선을 재사용하게 되어 이동
shared/components/MessageBubble.tsx

// ❌ 잘못된 예 — 아직 chat에서만 쓰는데 미리 shared로 이동
shared/components/ChatOnlyFeatureButton.tsx
```

---

## 금지 사항

```
// ❌ 최상위 기술 계층 디렉토리 금지
src/components/
src/hooks/
src/api/

// ❌ feature 내부에 다시 기술 계층을 여러 겹 만들지 않음
features/chat/presentation/components/ui/MessageList.tsx
```
