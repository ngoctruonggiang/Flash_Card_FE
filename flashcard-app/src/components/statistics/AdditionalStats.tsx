import { Clock, Award, Calendar, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="space-y-6">
      {/* Total Study Time Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
            <Clock className="w-6 h-6 text-indigo-100" />
          </div>
          <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full text-indigo-50">
            Tháng này
          </span>
        </div>

        <div>
          <h3 className="text-indigo-100 text-sm font-medium mb-1">
            Thời gian học tập
          </h3>
          <p className="text-4xl font-bold tracking-tight mb-4">
            {formatTime(totalStudyTime)}
          </p>

          <div className="p-3 bg-black/20 rounded-xl">
            <div className="flex items-center justify-between text-xs text-indigo-100 mb-1">
              <span>Trung bình mỗi ngày</span>
              <span className="font-bold text-white">
                {formatTime(Math.floor(totalStudyTime / 30))}
              </span>
            </div>
            {/* Simple Progress Bar visual */}
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-indigo-300 w-2/3 rounded-full" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Best Day Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Award className="w-32 h-32 text-purple-600 rotate-12" />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900">Ngày học tốt nhất</h3>
        </div>

        <div className="relative z-10">
          <p className="text-3xl font-bold text-purple-900 mb-1">{bestDay}</p>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-[10px] text-purple-600"
                >
                  {i === 1 ? "🔥" : "⭐"}
                </div>
              ))}
            </div>
            <span className="font-medium text-purple-700">
              42 thẻ • 83% đúng
            </span>
          </div>

          <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
            Tiếp tục phát huy nhé! 💪
          </p>
        </div>
      </motion.div>
    </div>
  );
};
