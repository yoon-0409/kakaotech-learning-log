const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'progress', label: '진행중' },
  { key: 'complete', label: '완료' },
  { key: 'every', label: '전체보기' },
];

export default function FilterBar({ filter, onFilterChange }) {
  return (
    <div className="flex gap-2 mb-3 flex-wrap">
      {FILTERS.map(f => (
        <button
          key={f.key}
          onClick={() => onFilterChange(f.key)}
          className={[
            'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
            filter === f.key
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-500 hover:bg-gray-100 shadow-sm',
          ].join(' ')}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
