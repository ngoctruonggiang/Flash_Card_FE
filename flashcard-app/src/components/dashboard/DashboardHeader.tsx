import { motion } from "framer-motion";

interface DashboardHeaderProps {
  userName: string;
}

export const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        Chào mừng trở lại, {userName}! 👋
      </h1>
      <p className="text-lg text-gray-600">
        Hôm nay là{" "}
        <span className="font-semibold">
          {new Date().toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        . Sẵn sàng học chưa?
      </p>
    </motion.div>
  );
};
