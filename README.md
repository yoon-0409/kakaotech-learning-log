# React Todo App

`React (v18) + Vite + Tailwind CSS (v4)`로 구현한 날짜 기반 Todo 웹 앱.
1주차 Vanilla JS 앱을 Function Component 구조로 마이그레이션했다.

## 실행 방법

```bash
npm install
npm run dev
# → http://localhost:5173
```

## 파일 구조

```
kakao2week-todo/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx
│   ├── index.css
│   ├── App.jsx
│   └── components/
│       ├── WeekView.jsx
│       ├── DateNav.jsx
│       ├── FilterBar.jsx
│       ├── TodoInput.jsx
│       ├── TodoList.jsx
│       └── TodoItem.jsx
└── README.md
```

## 구현 기능

### 기본 기능

- **CRUD**: 할 일 생성 / 조회 / 인라인 수정 / 완료 토글 / 삭제
- **입력 검증**: 빈 값 추가 시 토스트 알림
- **상태별 필터링**: 전체 / 진행중 / 완료 / 전체보기 탭
- **일간 뷰**: 이전·다음 버튼 + `<input type="date">`로 날짜 직접 선택
- **로컬스토리지 연동**: `useEffect`로 todos 변경 시 자동 저장, 새로고침 후 데이터 유지

### 추가 구현 (도전 미션)

- **주간 뷰**: 이번 주 7일 날짜 목록 표시, 각 날짜의 Todo 개수 확인, 이전·다음 주 이동
- 오늘 날짜 강조, 선택된 날짜 하이라이트
- 주간 뷰 선택 주차(`weekStart`)도 로컬스토리지에 저장해 새로고침 후 유지

## 핵심 설계

state는 `App` 하나에 두고, 하위 컴포넌트는 props로 데이터와 핸들러를 받는 구조다.

```
todos / selectedDate / filter  (App state)
   → filteredTodos로 파생
   → TodoList → TodoItem 으로 props 전달
```

1주차와 철학이 같다: 데이터를 한 곳에만 두고, 화면은 그 데이터를 그대로 투영한다.
달라진 점은 "DOM을 직접 그린다" 대신 "state를 바꾸면 React가 다시 그린다"는 것뿐이다.

수정 기능은 `TodoItem` 내부의 `isEditing` state로 처리했다.
`isEditing`이 `true`이면 input을, `false`이면 span을 렌더링해 UI 전환이 자동으로 일어난다.
1주차에서 `prompt()`를 쓰던 걸 state 하나로 대체한 셈이다.

날짜 연산은 `new Date(dateKey + 'T12:00:00')` 형태로 정오 시각을 고정해서 처리한다.
자정(`T00:00:00`)으로 파싱하면 한국(UTC+9) 환경에서 UTC로 해석돼 날짜가 하루 밀리는 문제가 있다.

## 트러블슈팅

### 1. 오후 9시 이후에 추가한 Todo가 다음 날 항목으로 저장됨 (1주차 코드리뷰에서 지적)

1주차 코드에서 `toDateKey`를 아래처럼 작성했었다.

```js
function toDateKey(date) {
  return date.toISOString().split('T')[0];
}
```

`toISOString()`은 UTC 기준 시각을 반환하는데, 한국은 UTC+9이므로 오후 9시(UTC 자정)부터는
날짜가 하루 앞서진다. 즉 6월 10일 오후 11시에 추가한 Todo가 `2024-06-11`로 저장됐다.
코드리뷰에서 이 버그를 지적받아 2주차에서 로컬 날짜 기반으로 바꿨다.

```js
function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
```

### 2. 날짜 이동 버튼을 누르면 가끔 날짜가 두 칸 건너뜀

`new Date('2024-06-10')` 처럼 날짜 문자열만 넘기면 브라우저가 UTC 자정으로 파싱한다.
한국 시간(UTC+9)에서는 이 UTC 자정이 전날 오전 9시가 되어, `getDate()`가 전날 날짜를 반환했다.
거기서 +1을 해도 원래 날짜로 돌아오는 경우가 생겨 버튼이 동작을 안 하는 것처럼 보였다.
`'T12:00:00'`을 붙여 정오로 고정하니 해결됐다.

### 3. `isEditing` 상태에서 다른 Todo를 클릭해도 수정창이 닫히지 않음

`isEditing`을 각 `TodoItem` 내부 state로 관리했더니 아이템마다 독립적으로 편집 모드를 가질 수 있었다.
동시에 여러 개가 열려도 저장은 제대로 됐지만 UX가 어색했다.
`App`에 `editingId` state를 올려서 하나만 열리게 제한하는 방식을 고려했다가,
지금 규모에서는 굳이 props를 더 늘리는 게 오버엔지니어링이라 판단하고 현 구조를 유지했다.
실제로 써보니 두 개가 동시에 열리는 상황 자체가 거의 발생하지 않아 큰 문제는 아니었다.

### 4. Tailwind 클래스가 조건부로 이어붙인 문자열에 적용 안 됨

```jsx
// 동작하지 않음 - Tailwind가 빌드 시 이 패턴을 인식 못함
const cls = 'bg-' + (isSelected ? 'blue' : 'gray') + '-500';
```

Tailwind v4는 소스 코드에서 클래스 문자열을 정적으로 스캔해 CSS를 생성하는데,
동적으로 조합된 문자열은 스캔 대상에서 빠져 스타일이 적용되지 않았다.
클래스 전체를 삼항 연산자로 선택하는 방식(`isSelected ? 'bg-blue-500' : 'bg-gray-500'`)으로 고쳐 해결했다.

## 소감

1주차에서 `renderTodoList()`를 따라가면 화면이 어떻게 그려지는지 전부 보였는데,
React는 state가 바뀌면 알아서 처리해줘서 편하면서도 "지금 왜 이게 다시 그려졌지?"를 추적하기가 오히려 어려웠다.
흐름을 따라가는 대신 데이터 구조를 머릿속에 쥐고 있어야 한다는 느낌.

컴포넌트 분리 단위를 어디서 끊을지가 생각보다 어려웠다.
`DateNav`와 `WeekView`가 둘 다 `selectedDate`를 받아야 해서 `App`에서 props로 내려줬는데,
규모가 커지면 이런 props drilling이 금방 불편해질 것 같다. Context API가 왜 생겼는지 체감됐다.
