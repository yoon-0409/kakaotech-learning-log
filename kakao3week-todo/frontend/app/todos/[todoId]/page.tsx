import { getTodo } from "@/app/actions";
import EditForm from "./EditForm";

interface Props {
  params: Promise<{ todoId: string }>;
}

export default async function TodoPage({ params }: Props) {
  const { todoId } = await params;
  const todo = await getTodo(Number(todoId));

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">수정</h1>
        <EditForm todo={todo} />
      </div>
    </div>
  );
}
