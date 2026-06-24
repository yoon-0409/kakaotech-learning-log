# Next.js + FastAPI Todo App

`Next.js (v15) + TypeScript + Tailwind CSS (v4)` 프론트엔드와 `FastAPI + SQLite` 백엔드로 구성한 Todo 풀스택 앱.
2주차 로컬스토리지 기반 앱을 서버 API 기반 구조로 마이그레이션했다.

## 실행 방법

```bash
# 백엔드
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn main:app --reload
# → http://localhost:8000

# 프론트엔드 (별도 터미널)
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

환경변수는 아래 파일을 직접 생성해야 한다.

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
BACKEND_URL=http://localhost:8000

# backend/.env.local
DATABASE_URL=sqlite:///./todos.db
```

## 파일 구조

```
kakao3week-todo/
├── .gitignore
├── README.md
├── frontend/
│   ├── app/
│   │   ├── api/todos/
│   │   │   ├── route.ts           # GET, POST 프록시
│   │   │   └── [id]/route.ts      # PUT, DELETE 프록시
│   │   ├── todos/
│   │   │   ├── _components/
│   │   │   │   ├── FilterBar.tsx
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   └── TodoItem.tsx
│   │   │   ├── new/
│   │   │   │   ├── page.tsx
│   │   │   │   └── TodoForm.tsx
│   │   │   ├── [todoId]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── EditForm.tsx
│   │   │   ├── error.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── actions.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── next.config.mjs
│   ├── package.json
│   ├── postcss.config.mjs
│   └── tsconfig.json
└── backend/
    ├── main.py
    └── requirements.txt
```

## 구현 기능

### 기본 기능

- **CRUD**: Todo 생성(`/todos/new`) / 목록 조회 / 수정(`/todos/[id]`) / 삭제
- **입력 검증**: 빈 값 제출 시 에러 메시지
- **로딩 / 에러 처리**: `loading.tsx`, `error.tsx`로 각 상태 처리
- **FastAPI 연동**: SQLite DB에 저장, 새로고침 후에도 데이터 유지

### 도전 미션

- **상태별 필터링**: 전체 / 진행중 / 완료 탭 — 서버에서 필터링, URL 파라미터(`?filter=`)로 상태 유지
- **키워드 검색**: `?search=` 파라미터로 서버 검색, 필터와 동시 적용 가능

## 핵심 설계

```
클라이언트
  → (인터랙션) Client Component에서 Server Action 직접 호출
  → (외부 요청) fetch('/api/todos') → route.ts → FastAPI

서버
  → page.tsx (Server Component): actions.ts 통해 FastAPI 직접 조회
  → actions.ts: "use server" 함수들, revalidatePath()로 캐시 무효화
  → route.ts: 클라이언트 요청의 프록시 역할
```

2주차와 구조적으로 비슷하다. 데이터를 한 곳에서 관리하고 화면은 그 데이터를 투영한다는 원칙은 같다.
달라진 건 "브라우저 메모리(로컬스토리지)"에서 "서버 DB"로 데이터 위치가 바뀐 것이다.

Server Component와 Client Component 분리 기준:
- 데이터를 가져와서 보여주기만 하면 → Server Component (기본값)
- `onClick`, `onChange` 등 이벤트 핸들러가 필요하면 → `"use client"` 선언

## 트러블슈팅

### 1. Next.js 15에서 `params`와 `searchParams`가 Promise로 바뀜

Next.js 14까지는 `params.todoId`처럼 바로 접근했는데 15부터 타입이 `Promise`로 변경됐다.
`await params`를 안 하면 타입 에러가 나거나 undefined가 된다.

```ts
// Next.js 15
export default async function Page({ params }: { params: Promise<{ todoId: string }> }) {
  const { todoId } = await params;
}
```

### 2. `useSearchParams()`에서 Suspense 경계 에러

`useSearchParams()`를 쓰는 Client Component가 Suspense로 감싸져 있지 않으면 빌드 에러가 난다.
`FilterBar`와 `SearchBar`가 `useSearchParams`를 쓰는데, 이걸 `page.tsx`에서 그냥 렌더링했더니 에러가 발생했다.
`<Suspense fallback={null}>`으로 감싸서 해결했다.

### 3. Server Action에서 fetch가 안 됨

`actions.ts`에서 `BACKEND_URL`이 undefined로 찍혔다. `.env.local`을 `frontend/` 안에 만들어야 하는데
루트에 만들었던 게 원인이었다. Next.js는 `next.config.mjs`가 있는 디렉토리 기준으로 `.env.local`을 읽는다.

### 4. CORS 에러

초반에 Client Component에서 `fetch('http://localhost:8000/todos')`로 FastAPI를 직접 호출했더니
CORS 에러가 났다. `route.ts`를 프록시로 쓰거나 FastAPI에 CORS 미들웨어를 추가해야 한다.
지금은 둘 다 적용해뒀다.

## 소감

2주차까지는 모든 게 브라우저 안에서 돌아갔는데, 이번엔 코드가 실제로 두 군데에 올라간다는 게 실감됐다.
어떤 코드가 서버에서 실행되고 어떤 코드가 클라이언트에서 실행되는지 계속 신경 써야 했다.
`"use client"`를 붙이지 않으면 이벤트 핸들러가 안 되고, 붙이면 Server Action을 직접 import하지 못하는 등
경계가 생각보다 더 엄격했다.

Server Component의 장점은 데이터를 서버에서 바로 가져오니까 클라이언트에서 로딩 스피너를 따로 관리할 필요가 없다는 것이다.
`loading.tsx` 파일 하나만 있으면 Next.js가 알아서 처리해준다.
2주차에서 `useEffect`로 데이터 로딩을 처리하던 것과 비교하면 훨씬 단순해졌다.

근데 솔직히 언제 Server Component를 쓰고 언제 Client Component를 써야 하는지 아직 헷갈린다.
지금은 "버튼 있으면 Client"라는 단순한 기준으로 판단했는데, 더 복잡한 상황에서는 어떻게 할지 모르겠다.
