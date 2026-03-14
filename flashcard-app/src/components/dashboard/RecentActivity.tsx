import { motion } from "framer-motion";
import { Flame, Calendar } from "lucide-react";

interface Activity {
  date: string;
  cards: number;
  accuracy: number;
  time: string;
}

interface RecentActivityProps {
  streak: number;
  activities: Activity[];
}

export const RecentActivity = ({ streak, activities }: RecentActivityProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Hoạt động gần đây
      </h2>

      <motion.div
        className="bg-white rounded-2xl p-6 border-2 border-gray-100 mb-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Chuỗi ngày học</p>
            <p className="text-2xl font-bold text-gray-900">{streak} ngày 🔥</p>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Hãy tiếp tục phấn đấu! Bạn đang làm rất tốt!
        </p>
      </motion.div>

      <motion.div
        className="bg-white rounded-2xl p-6 border-2 border-gray-100"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>7 ngày qua</span>
        </h3>

        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {activity.cards} thẻ
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(activity.date).toLocaleDateString("vi-VN", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-600">
                  {activity.accuracy}%
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
