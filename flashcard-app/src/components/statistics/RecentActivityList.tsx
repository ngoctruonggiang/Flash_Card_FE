import { motion } from "framer-motion";
import { Brain, Zap } from "lucide-react";
import { ActivityItem } from "@/src/hooks/useStatistics";

interface RecentActivityListProps {
  activities: ActivityItem[];
}

export const RecentActivityList = ({ activities }: RecentActivityListProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        🕐 Hoạt động gần đây
      </h2>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  activity.type === "study"
                    ? "bg-gradient-to-br from-blue-500 to-purple-500"
                    : "bg-gradient-to-br from-green-500 to-emerald-500"
                }`}
              >
                {activity.type === "study" ? (
                  <Brain className="w-5 h-5 text-white" />
                ) : (
                  <Zap className="w-5 h-5 text-white" />
                )}
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  {activity.type === "study" ? "Đã học" : "Đã tạo"} •{" "}
                  {activity.deck}
                </p>
                <p className="text-sm text-gray-500">{activity.date}</p>
              </div>
            </div>

            {activity.type === "study" && (
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <p className="font-bold text-gray-900">{activity.cards}</p>
                  <p className="text-gray-500">thẻ</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-green-600">
                    {activity.accuracy}%
                  </p>
                  <p className="text-gray-500">đúng</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-blue-600">{activity.time}m</p>
                  <p className="text-gray-500">thời gian</p>
                </div>
              </div>
            )}

            {activity.type === "created" && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                Mới tạo
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
