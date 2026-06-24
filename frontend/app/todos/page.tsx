import Link from "next/link";
import { Suspense } from "react";
import { getTodos } from "@/app/actions";
import TodoItem from "./_components/TodoItem";
import FilterBar from "./_components/FilterBar";
import SearchBar from "./_components/SearchBar";

// Next.js 15에서 searchParams도 Promise
interface Props {
  searchParams: Promise<{ filter?: string; search?: string }>;
}

// Server Component — 데이터 fetching은 여기서
export default async function TodosPage({ searchParams }: Props) {
  const { filter, search } = await searchParams;
  const todos = await getTodos(filter, search);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Todo</h1>
          <Link
            href="/todos/new"
            className="bg-blue-500 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            + 추가
          </Link>
        </div>
        {/* useSearchParams 쓰는 컴포넌트는 Suspense로 감싸야 함 */}
        <Suspense fallback={null}>
          <SearchBar defaultSearch={search} />
          <FilterBar currentFilter={filter} />
        </Suspense>
        {todos.length === 0 ? (
          <div className="text-center text-gray-300 py-12 text-sm select-none">
            텅...
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
