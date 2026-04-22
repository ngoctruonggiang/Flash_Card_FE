import { motion } from "framer-motion";
import { Brain, Zap } from "lucide-react";
import { ActivityItem } from "@/src/hooks/useStatistics";

interface RecentActivityListProps {
  activities: ActivityItem[];
}

export const RecentActivityList = ({ activities }: RecentActivityListProps) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-[600px]">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h2 className="text-xl font-bold text-gray-900">Hoạt động gần đây</h2>
        <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
          Xem tất cả
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group flex flex-col sm:flex-row items-start gap-4 p-4 rounded-2xl bg-gray-50/50 hover:bg-white hover:shadow-md hover:shadow-indigo-100/50 border border-transparent hover:border-indigo-100 transition-all duration-300"
          >
            <div className="flex w-full sm:w-auto items-center gap-4">
              {/* Icon */}
              <div
                className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                  activity.type === "study"
                    ? "bg-gradient-to-br from-indigo-500 to-blue-600 text-white"
                    : "bg-white border border-gray-200 text-amber-500"
                }`}
              >
                {activity.type === "study" ? (
                  <Brain className="w-6 h-6" />
                ) : (
                  <Zap className="w-6 h-6" />
                )}
              </div>

              {/* Mobile-only Title (for better alignment on small screens) */}
              <div className="sm:hidden flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate">
                  {activity.deck}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      activity.type === "study"
                        ? "bg-indigo-50 text-indigo-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {activity.type === "study" ? "Học tập" : "Đã tạo"}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{activity.date}</span>
                </div>
              </div>
            </div>

            {/* Content & Stats */}
            <div className="flex-1 min-w-0 w-full">
              {/* Desktop Title */}
              <div className="hidden sm:block mb-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900 truncate pr-4">
                    {activity.deck}
                  </h3>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      activity.type === "study"
                        ? "bg-indigo-50 text-indigo-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {activity.type === "study" ? "Học tập" : "Đã tạo"}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{activity.date}</span>
                </div>
              </div>

              {/* Stats for Study Session */}
              {activity.type === "study" && (
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 w-full sm:mt-0 mt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">
                      Thẻ
                    </span>
                    <span className="text-sm font-bold text-gray-700">
                      {activity.cards}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">
                      Đúng
                    </span>
                    <span className="text-sm font-bold text-emerald-600">
                      {activity.accuracy}%
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">
                      Thời gian
                    </span>
                    <span className="text-sm font-bold text-gray-700">
                      {activity.time}m
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
