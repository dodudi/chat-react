# 테스트 규칙

이 파일은 Vitest + Testing Library로 테스트 작성 시 항상 따라야 할 규칙을 정의한다.

이 프로젝트에는 아직 테스트 러너가 설치되어 있지 않다. 설치 시 `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`을 devDependencies에 추가하고 이 규칙을 따른다.

---

## 파일 위치와 이름

테스트 파일은 테스트 대상과 같은 디렉토리에 `{대상}.test.tsx`(컴포넌트) 또는 `{대상}.test.ts`(훅/유틸)로 둔다. 별도의 `__tests__/` 디렉토리를 만들지 않는다.

```
// ✅ 올바른 예
features/chat/components/MessageInput.tsx
features/chat/components/MessageInput.test.tsx

// ❌ 잘못된 예
features/chat/__tests__/MessageInput.test.tsx
```

---

## 무엇을 테스트하는가

사용자가 관찰 가능한 동작을 테스트한다. 내부 state나 구현 디테일을 직접 검증하지 않는다.

```tsx
// ✅ 올바른 예 — 사용자 관점 (렌더링 결과, 상호작용 결과)
test('메시지를 입력하고 전송 버튼을 누르면 onSubmit이 호출된다', async () => {
  const onSubmit = vi.fn()
  render(<MessageInput onSubmit={onSubmit} />)

  await userEvent.type(screen.getByRole('textbox'), '안녕')
  await userEvent.click(screen.getByRole('button', { name: '전송' }))

  expect(onSubmit).toHaveBeenCalledWith('안녕')
})

// ❌ 잘못된 예 — 컴포넌트 내부 state를 직접 접근
expect(wrapper.state('text')).toBe('안녕')
```

---

## 쿼리 우선순위

`getByRole` > `getByLabelText` > `getByText` > `getByTestId` 순으로 우선 사용한다. `getByTestId`는 위 방법으로 접근 불가능할 때만 예외적으로 쓴다.

```tsx
// ✅ 올바른 예
screen.getByRole('button', { name: '전송' })

// ❌ 잘못된 예 — role/text로 충분히 구분 가능한데 testid 사용
screen.getByTestId('submit-button')
```

---

## 테스트 구조

`describe`로 대상을 묶고, `test`(또는 `it`) 설명은 한국어로 "~하면 ~한다" 형식을 쓴다. Given/When/Then은 빈 줄로만 구분하고 주석은 달지 않는다 (테스트 코드 자체가 이미 명확하므로).

```tsx
describe('MessageInput', () => {
  test('빈 문자열일 때는 전송 버튼이 비활성화된다', () => {
    render(<MessageInput onSubmit={vi.fn()} />)

    expect(screen.getByRole('button', { name: '전송' })).toBeDisabled()
  })
})
```

---

## Mocking

- axios 호출은 `features/{domain}/api/`의 함수를 `vi.mock`으로 모킹한다. axios 자체를 모킹하지 않는다.
- STOMP 소켓 연결이 필요한 컴포넌트는 `ChatSocketProvider`를 테스트용 mock provider로 감싸서 렌더링한다. 실제 WebSocket 연결을 시도하지 않는다.

```tsx
// ✅ 올바른 예
vi.mock('../api/friendApi', () => ({
  fetchFriends: vi.fn().mockResolvedValue([{ id: '1', name: '철수' }]),
}))

// ❌ 잘못된 예 — axios 전체를 모킹
vi.mock('axios')
```

---

## 커스텀 훅 테스트

`renderHook`을 사용한다. 훅을 테스트하기 위한 목적만으로 컴포넌트를 만들지 않는다.

```ts
// ✅ 올바른 예
const { result } = renderHook(() => useDebounce('hello', 300))
```
