import { useRouter } from "next/navigation";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({
  message = "Đang tải...",
}: LoadingStateProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

interface ErrorStateProps {
  message: string;
}

export const ErrorState = ({ message }: ErrorStateProps) => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Đã có lỗi xảy ra
        </h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Về Dashboard
        </button>
      </div>
    </div>
  );
};

export const EmptyState = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <div className="text-green-500 text-5xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Không có thẻ cần học
        </h2>
        <p className="text-gray-600 mb-6">
          Bạn đã hoàn thành tất cả các thẻ trong bộ này rồi!
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Về Dashboard
        </button>
      </div>
    </div>
  );
};
