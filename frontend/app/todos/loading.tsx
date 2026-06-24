export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-6 animate-pulse" />
        <div className="flex flex-col gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 bg-white rounded-xl shadow-sm animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
