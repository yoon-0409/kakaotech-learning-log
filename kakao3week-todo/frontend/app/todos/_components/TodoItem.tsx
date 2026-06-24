"use client";

import Link from "next/link";
import { toggleTodo, deleteTodo } from "@/app/actions";
import type { Todo } from "@/app/actions";

export default function TodoItem({ todo }: { todo: Todo }) {
  return (
    <li className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm">
      <button
        onClick={() => toggleTodo(todo.id, !todo.completed)}
        className={[
          "w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors",
          todo.completed
            ? "bg-blue-500 border-blue-500"
            : "border-gray-300 hover:border-blue-400",
        ].join(" ")}
      >
        {todo.completed && (
          <span className="text-white text-xs leading-none">✓</span>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <span
          className={[
            "text-sm block truncate",
            todo.completed ? "line-through text-gray-400" : "text-gray-700",
          ].join(" ")}
        >
          {todo.text}
        </span>
        <span className="text-xs text-gray-400">{todo.date}</span>
      </div>

      <div className="flex gap-1 flex-shrink-0">
        <Link
          href={`/todos/${todo.id}`}
          className="text-xs text-gray-400 hover:text-gray-600 px-1"
        >
          수정
        </Link>
        <button
          onClick={() => deleteTodo(todo.id)}
          className="text-xs text-red-400 hover:text-red-600 px-1"
        >
          삭제
        </button>
      </div>
    </li>
  );
}
