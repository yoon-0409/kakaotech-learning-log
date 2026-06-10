import { useState, useEffect } from 'react';
import DateNav from './components/DateNav';
import WeekView from './components/WeekView';
import FilterBar from './components/FilterBar';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';

// 1주차에서 toISOString() 쓰다가 오후 9시 넘으면 날짜 밀린다고 지적받아서 로컬 날짜로 바꿈
function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 주간 뷰 시작 날짜 계산 — getDay()는 0이 일요일이라 월요일 기준으로 맞춰야 함
function getMonday(dateKey) {
  const d = new Date(dateKey + 'T12:00:00');
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return toDateKey(d);
}

export default function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    return localStorage.getItem('selectedDate') ?? toDateKey(new Date());
  });

  const [filter, setFilter] = useState('all');

  const [weekStart, setWeekStart] = useState(() => {
    return localStorage.getItem('weekStart') ?? getMonday(toDateKey(new Date()));
  });

  // todos 바뀔 때마다 자동 저장 — 의존성 배열에 todos 넣어야 매번 실행됨
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('selectedDate', selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    localStorage.setItem('weekStart', weekStart);
  }, [weekStart]);

  function addTodo(text) {
    setTodos(prev => [...prev, {
      id: Date.now(),
      text,
      completed: false,
      date: selectedDate,
    }]);
  }

  function deleteTodo(id) {
    setTodos(prev => prev.filter(t => t.id !== id));
  }

  function toggleComplete(id) {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  }

  function updateTodo(id, newText) {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, text: newText } : t
    ));
  }

  const filteredTodos = todos.filter(t => {
    if (filter !== 'every' && t.date !== selectedDate) return false;
    if (filter === 'progress') return !t.completed;
    if (filter === 'complete') return t.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Todo</h1>
        <WeekView
          todos={todos}
          selectedDate={selectedDate}
          weekStart={weekStart}
          onSelectDate={setSelectedDate}
          onWeekChange={setWeekStart}
        />
        <DateNav selectedDate={selectedDate} onDateChange={setSelectedDate} />
        <FilterBar filter={filter} onFilterChange={setFilter} />
        <TodoInput onAdd={addTodo} />
        <TodoList
          todos={filteredTodos}
          showDate={filter === 'every'}
          onDelete={deleteTodo}
          onToggle={toggleComplete}
          onUpdate={updateTodo}
        />
      </div>
    </div>
  );
}
