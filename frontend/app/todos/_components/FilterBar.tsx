"use client";

import { useRouter, useSearchParams } from "next/navigation";

const FILTERS = [
  { key: "all", label: "전체" },
  { key: "active", label: "진행중" },
  { key: "completed", label: "완료" },
];

export default function FilterBar({ currentFilter }: { currentFilter?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleFilter(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "all") {
      params.delete("filter");
    } else {
      params.set("filter", key);
    }
    router.push(`/todos?${params}`);
  }

  const active = currentFilter ?? "all";

  return (
    <div className="flex gap-2 mb-3 flex-wrap">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => handleFilter(f.key)}
          className={[
            "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
            active === f.key
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-500 hover:bg-gray-100 shadow-sm",
          ].join(" ")}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
