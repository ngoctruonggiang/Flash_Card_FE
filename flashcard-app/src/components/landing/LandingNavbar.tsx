import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const LandingNavbar = () => {
  const router = useRouter();

  return (
    <nav className="relative z-50 px-4 sm:px-6 py-4 md:py-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/">
          <motion.div
            className="flex items-center space-x-2 cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FlashLearn
            </span>
          </motion.div>
        </Link>

        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => router.push("/login")}
            className="w-34 px-6 py-2 text-gray-600 font-medium hover:text-blue-600 transition-colors border border-gray-600 rounded-xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Đăng nhập
          </motion.button>

          <motion.button
            onClick={() => router.push("/register")}
            className="w-34 px-6 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 border border-transparent"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Đăng ký
          </motion.button>
        </div>
      </div>
    </nav>
  );
};
