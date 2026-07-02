# 주석 규칙

이 파일은 주석 작성 시 항상 따라야 할 규칙을 정의한다. 백엔드([chat-spring](C:\workspace\project\chat-spring))와 동일한 원칙을 TypeScript/React에 맞게 적용한다.

---

## 기본 원칙

주석은 기본적으로 작성하지 않는다. 잘 지어진 이름이 WHAT을 설명하므로, 주석은 이름만으로 전달할 수 없는 **WHY**만 담는다.

```tsx
// ✅ 올바른 예 — 이름으로 설명되지 않는 이유
// StrictMode에서 두 번 호출되는 걸 막기 위해 ref로 연결 여부를 추적
if (socketRef.current) return

// ❌ 잘못된 예 — 코드가 이미 설명하고 있음
// 메시지를 전송한다
sendMessage(text)

// ❌ 잘못된 예 — 작업 맥락은 커밋 메시지에 담는다
// 이슈 #42 대응
const MAX_RETRY = 3
```

---

## 작성 기준

아래 중 하나에 해당할 때만 작성한다:
- 숨겨진 제약 (브라우저/라이브러리 특이 동작, 백엔드 계약 등)
- 직관에 반하는 구현 선택 (더 단순해 보이는 방법을 쓰지 않은 이유)
- 미래 독자가 "왜 이렇게 했지?" 하고 바꾸려 할 만한 코드

```tsx
// ✅ 올바른 예 — 프레임워크 특이 동작
// React 18 StrictMode는 개발 모드에서 effect를 두 번 실행 — cleanup에서 소켓을 닫아야 중복 연결 방지
useEffect(() => {
  const socket = connect()
  return () => socket.close()
}, [])

// ✅ 올바른 예 — 백엔드 계약
// 백엔드가 최초 200개만 반환하므로 스크롤 시 이전 메시지는 별도 요청으로 페이지네이션
const { data } = await fetchMessages(channelId, { limit: 200 })
```

---

## JSDoc

컴포넌트·훅의 설계 의도나 비명확한 사용 제약이 있을 때만 작성한다. Props 목록을 나열하는 용도로 쓰지 않는다 (타입이 이미 문서화한다).

```tsx
// ✅ 올바른 예 — 사용 제약
/**
 * AuthProvider 하위에서만 사용 가능. 최상위 컴포넌트에서 직접 호출 금지.
 */
export function useAuth() { ... }

// ❌ 잘못된 예 — 타입으로 이미 드러나는 내용 반복
/**
 * @param message 메시지 객체
 * @param isOwn 내가 보낸 메시지인지 여부
 */
function MessageBubble({ message, isOwn }: MessageBubbleProps) { ... }
```

---

## 금지 사항

```tsx
// ❌ WHAT 주석
// 로딩 상태를 true로 설정
setIsLoading(true)

// ❌ 제거한 코드를 주석으로 보존 — git history로 확인
// const oldValue = computeOldWay()
const value = computeNewWay()

// ❌ TODO/FIXME 방치 — 해결하거나 이슈로 등록한다
// TODO: 나중에 에러 처리 추가
```
