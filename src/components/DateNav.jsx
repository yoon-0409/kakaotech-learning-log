function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function DateNav({ selectedDate, onDateChange }) {
  function move(days) {
    const d = new Date(selectedDate + 'T12:00:00'); // 자정으로 파싱하면 UTC 오전 9시가 되어 전날 날짜로 잡힘
    d.setDate(d.getDate() + days);
    onDateChange(toDateKey(d));
  }

  return (
    <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 mb-3 shadow-sm">
      <button onClick={() => move(-1)} className="text-gray-400 hover:text-gray-700 text-xl px-1">‹</button>
      <input
        type="date"
        value={selectedDate}
        onChange={e => onDateChange(e.target.value)}
        className="text-center font-medium text-gray-700 border-none outline-none cursor-pointer bg-transparent"
      />
      <button onClick={() => move(1)} className="text-gray-400 hover:text-gray-700 text-xl px-1">›</button>
    </div>
  );
}
