import { motion } from "framer-motion";
import { WeeklyData } from "@/src/hooks/useStatistics";

interface WeeklyChartProps {
  weeklyData: WeeklyData[];
  maxCards: number;
}

export const WeeklyChart = ({ weeklyData, maxCards }: WeeklyChartProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        📈 Biểu đồ tuần này
      </h2>

      <div className="grid grid-cols-7 gap-4">
        {weeklyData.map((day, index) => (
          <motion.div
            key={day.day}
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="mb-2">
              <div
                className="w-full bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-xl mx-auto transition-all duration-500"
                style={{
                  height: `${(day.cards / maxCards) * 120 + 20}px`,
                  opacity: day.cards === 0 ? 0.3 : 1,
                }}
              ></div>
            </div>
            <p className="text-xs font-bold text-gray-900">{day.cards}</p>
            <p className="text-xs text-gray-500 mt-1">{day.day}</p>
            {day.cards > 0 && (
              <>
                <p className="text-xs text-green-600 mt-1">{day.accuracy}%</p>
                <p className="text-xs text-blue-600">{day.time}m</p>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
