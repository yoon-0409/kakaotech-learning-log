"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTodo } from "@/app/actions";

// 2주차에서 가져온 로컬 날짜 변환 함수
function toLocalDateKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function TodoForm() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [date, setDate] = useState(toLocalDateKey());
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) {
      setError("할 일을 입력해주세요.");
      return;
    }
    await createTodo(text.trim(), date);
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
        placeholder="할 일을 입력하세요"
        className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 shadow-sm"
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 shadow-sm"
      />
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
          추가
        </button>
      </div>
    </form>
  );
}
