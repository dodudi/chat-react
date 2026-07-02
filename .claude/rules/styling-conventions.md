# 스타일링 규칙

이 파일은 Tailwind CSS를 이용한 스타일링 시 항상 따라야 할 규칙을 정의한다.

---

## 기본 원칙

스타일은 Tailwind 유틸리티 클래스로 작성한다. 컴포넌트별 `.css`/`.module.css` 파일은 새로 만들지 않는다. `index.css`에는 Tailwind 지시문과 전역 리셋·폰트 설정만 둔다.

```tsx
// ✅ 올바른 예
<div className="flex items-center gap-2 rounded-lg bg-white p-4 shadow">

// ❌ 잘못된 예 — 컴포넌트 전용 css 파일 생성
import './MessageBubble.css'
```

---

## 클래스 조합이 복잡해지면 컴포넌트로 분리한다

조건부 클래스가 3개 이상 얽히거나 같은 조합이 반복되면 별도 컴포넌트로 뽑는다. 문자열 템플릿으로 클래스를 직접 조립하지 않는다.

```tsx
// ✅ 올바른 예 — 반복되는 배지 스타일을 컴포넌트로 분리
function UnreadBadge({ count }: UnreadBadgeProps) {
  if (count === 0) return null
  return (
    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
      {count}
    </span>
  )
}

// ❌ 잘못된 예 — 여러 곳에서 동일한 긴 클래스 문자열 복붙
<span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">...</span>
```

조건부 클래스 조합에는 `clsx`(또는 동급 유틸)를 사용한다. 삼항 연산자를 클래스 문자열 안에 중첩하지 않는다.

```tsx
// ✅ 올바른 예
import clsx from 'clsx'

<div className={clsx('rounded-lg p-3', isOwn ? 'bg-blue-500 text-white' : 'bg-gray-100')} />

// ❌ 잘못된 예 — 중첩 삼항으로 가독성 저하
<div className={`rounded-lg p-3 ${isOwn ? 'bg-blue-500 text-white' : isPending ? 'bg-gray-300' : 'bg-gray-100'}`} />
```

---

## 커스텀 값보다 Tailwind 스케일을 우선한다

임의값(`w-[123px]` 등)은 디자인 스펙상 불가피할 때만 사용한다. 기본 스페이싱·컬러 스케일로 표현 가능하면 그것을 쓴다.

```tsx
// ✅ 올바른 예
<div className="p-4 gap-2">

// ❌ 잘못된 예 — 기본 스케일로 표현 가능한데 임의값 사용
<div className="p-[16px] gap-[8px]">
```

반복되는 커스텀 값(브랜드 컬러 등)은 `tailwind.config`의 theme extend에 등록하고 임의값으로 흩뿌리지 않는다.

---

## 반응형·상태 variant는 기본 클래스 뒤에 그룹으로 작성한다

```tsx
// ✅ 올바른 예 — 레이아웃 → 색상 → 반응형/상태 순
<button className="flex items-center rounded-md bg-blue-500 px-3 py-2 text-white hover:bg-blue-600 md:px-4">
```
