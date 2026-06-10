import { useState } from 'react';

export default function TodoItem({ todo, showDate, onDelete, onToggle, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false); // true면 input, false면 span
  const [editText, setEditText] = useState(todo.text);

  function handleConfirm() {
    const trimmed = editText.trim();
    if (!trimmed) return;
    onUpdate(todo.id, trimmed);
    setIsEditing(false);
  }

  function handleCancel() {
    setEditText(todo.text);
    setIsEditing(false);
  }

  return (
    <li className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm">
      <button
        onClick={() => onToggle(todo.id)}
        className={[
          'w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors',
          todo.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-300 hover:border-blue-400',
        ].join(' ')}
      >
        {todo.completed && <span className="text-white text-xs leading-none">✓</span>}
      </button>

      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={e => setEditText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleConfirm();
            if (e.key === 'Escape') handleCancel();
          }}
          autoFocus
          className="flex-1 border-b border-blue-400 outline-none text-sm text-gray-700 py-0.5 bg-transparent"
        />
      ) : (
        <span className={[
          'flex-1 text-sm',
          todo.completed ? 'line-through text-gray-400' : 'text-gray-700',
        ].join(' ')}>
          {showDate && <span className="text-gray-400 mr-1">[{todo.date}]</span>}
          {todo.text}
        </span>
      )}

      <div className="flex gap-1 flex-shrink-0">
        {isEditing ? (
          <>
            <button onClick={handleConfirm} className="text-xs text-blue-500 hover:text-blue-700 px-1">저장</button>
            <button onClick={handleCancel} className="text-xs text-gray-400 hover:text-gray-600 px-1">취소</button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="text-xs text-gray-400 hover:text-gray-600 px-1">수정</button>
            <button onClick={() => onDelete(todo.id)} className="text-xs text-red-400 hover:text-red-600 px-1">삭제</button>
          </>
        )}
      </div>
    </li>
  );
}
