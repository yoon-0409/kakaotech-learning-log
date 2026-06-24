"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar({ defaultSearch }: { defaultSearch?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultSearch ?? "");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("search", value.trim());
    } else {
      params.delete("search");
    }
    router.push(`/todos?${params}`);
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2 mb-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="검색"
        className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-400 shadow-sm"
      />
      <button
        type="submit"
        className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 shadow-sm"
      >
        검색
      </button>
    </form>
  );
}
