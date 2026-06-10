import { useState } from 'react';

export default function TodoInput({ onAdd }) {
  const [text, setText] = useState('');
  const [showToast, setShowToast] = useState(false);

  function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed) {
      if (showToast) return;
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1500);
      return;
    }
    onAdd(trimmed);
    setText('');
  }

  return (
    <div className="relative mb-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="할 일을 입력하세요"
          className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 shadow-sm"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm"
        >
          추가
        </button>
      </div>
      {showToast && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-10 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
          할 일을 입력해주세요.
        </div>
      )}
    </div>
  );
}
