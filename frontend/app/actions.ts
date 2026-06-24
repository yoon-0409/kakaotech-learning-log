"use server";

import { revalidatePath } from "next/cache";

// 서버에서만 쓰는 변수라 NEXT_PUBLIC_ 없어도 됨
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  date: string;
}

export async function getTodos(filter?: string, search?: string): Promise<Todo[]> {
  const params = new URLSearchParams();
  if (filter && filter !== "all") params.set("filter", filter);
  if (search) params.set("search", search);
  const qs = params.toString();

  const res = await fetch(`${BACKEND_URL}/todos${qs ? `?${qs}` : ""}`, {
    cache: "no-store", // 항상 최신 데이터
  });
  if (!res.ok) throw new Error("할 일 목록을 불러오지 못했습니다.");
  return res.json();
}

export async function getTodo(id: number): Promise<Todo> {
  const res = await fetch(`${BACKEND_URL}/todos/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("할 일을 불러오지 못했습니다.");
  return res.json();
}

export async function createTodo(text: string, date: string): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, date }),
  });
  if (!res.ok) throw new Error("할 일을 생성하지 못했습니다.");
  revalidatePath("/todos");
}

export async function toggleTodo(id: number, completed: boolean): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  if (!res.ok) throw new Error("상태를 변경하지 못했습니다.");
  revalidatePath("/todos");
}

export async function updateTodo(id: number, text: string): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("할 일을 수정하지 못했습니다.");
  revalidatePath("/todos");
  revalidatePath(`/todos/${id}`);
}

export async function deleteTodo(id: number): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/todos/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("할 일을 삭제하지 못했습니다.");
  revalidatePath("/todos");
}
