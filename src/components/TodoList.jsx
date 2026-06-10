import TodoItem from './TodoItem';

export default function TodoList({ todos, showDate, onDelete, onToggle, onUpdate }) {
  if (todos.length === 0) {
    return (
      <div className="text-center text-gray-300 py-12 text-sm select-none">
        텅...
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          showDate={showDate}
          onDelete={onDelete}
          onToggle={onToggle}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}
