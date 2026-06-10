const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getWeekDays(weekStart) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart + 'T12:00:00'); // 정오 고정 — 자정 파싱하면 날짜 밀림
    d.setDate(d.getDate() + i);
    return toDateKey(d);
  });
}

export default function WeekView({ todos, selectedDate, weekStart, onSelectDate, onWeekChange }) {
  const today = toDateKey(new Date());
  const weekDays = getWeekDays(weekStart);

  function moveWeek(delta) {
    const d = new Date(weekStart + 'T12:00:00');
    d.setDate(d.getDate() + delta * 7);
    onWeekChange(toDateKey(d));
  }

  const weekLabel = `${weekDays[0].slice(5).replace('-', '/')} ~ ${weekDays[6].slice(5).replace('-', '/')}`;

  return (
    <div className="bg-white rounded-xl px-3 py-3 mb-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => moveWeek(-1)} className="text-gray-400 hover:text-gray-700 px-2 py-1">‹</button>
        <span className="text-xs text-gray-400">{weekLabel}</span>
        <button onClick={() => moveWeek(1)} className="text-gray-400 hover:text-gray-700 px-2 py-1">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((dateKey, i) => {
          const count = todos.filter(t => t.date === dateKey).length;
          const isSelected = dateKey === selectedDate;
          const isToday = dateKey === today;
          return (
            <button
              key={dateKey}
              onClick={() => onSelectDate(dateKey)}
              className={[
                'flex flex-col items-center py-1.5 rounded-lg transition-colors',
                isSelected
                  ? 'bg-blue-500 text-white'
                  : isToday
                    ? 'text-blue-600 font-bold hover:bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-100',
              ].join(' ')}
            >
              <span className="text-xs">{DAY_LABELS[i]}</span>
              <span className="text-sm leading-tight">{dateKey.slice(-2)}</span>
              <span className={`text-xs mt-0.5 ${isSelected ? 'text-blue-200' : 'text-gray-300'}`}>
                {count > 0 ? count : '·'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
