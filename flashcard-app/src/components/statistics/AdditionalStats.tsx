import { Clock, Award } from "lucide-react";

interface AdditionalStatsProps {
  totalStudyTime: number;
  bestDay: string;
  formatTime: (minutes: number) => string;
}

export const AdditionalStats = ({
  totalStudyTime,
  bestDay,
  formatTime,
}: AdditionalStatsProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <span>Thời gian học tập</span>
        </h3>
        <p className="text-3xl font-bold text-gray-900 mb-2">
          {formatTime(totalStudyTime)}
        </p>
        <p className="text-sm text-gray-600">Tổng thời gian tháng này</p>
        <p className="text-sm text-blue-600 mt-2">
          Trung bình {formatTime(Math.floor(totalStudyTime / 30))}/ngày
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Award className="w-5 h-5 text-purple-600" />
          <span>Ngày học tốt nhất</span>
        </h3>
        <p className="text-3xl font-bold text-gray-900 mb-2">{bestDay}</p>
        <p className="text-sm text-gray-600">42 thẻ với độ chính xác 83%</p>
        <p className="text-sm text-purple-600 mt-2">Tiếp tục phát huy! 💪</p>
      </div>
    </div>
  );
};
