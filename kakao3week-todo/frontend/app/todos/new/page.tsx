import TodoForm from "./TodoForm";

export default function NewTodoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">새 할 일</h1>
        <TodoForm />
      </div>
    </div>
  );
}
