import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatItem {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change: string;
  color: string;
  bgColor: string;
}

interface StatsGridProps {
  stats: StatItem[];
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className={`${stat.bgColor} rounded-2xl p-6 border-2 border-gray-100 hover:shadow-xl transition-all duration-300`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <div
            className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}
          >
            <stat.icon className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
          <p className="text-xs text-gray-500">{stat.change}</p>
        </motion.div>
      ))}
    </div>
  );
};
