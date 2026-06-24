"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateTodo } from "@/app/actions";
import type { Todo } from "@/app/actions";

export default function EditForm({ todo }: { todo: Todo }) {
  const router = useRouter();
  const [text, setText] = useState(todo.text);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) {
      setError("할 일을 입력해주세요.");
      return;
    }
    await updateTodo(todo.id, text.trim());
    router.push("/todos");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError("");
        }}
        className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 shadow-sm"
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 bg-white border border-gray-200 rounded-xl py-2.5 text-sm text-gray-500 hover:bg-gray-100 shadow-sm"
        >
          취소
        </button>
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-blue-600 shadow-sm"
        >
          저장
        </button>
      </div>
    </form>
  );
}
