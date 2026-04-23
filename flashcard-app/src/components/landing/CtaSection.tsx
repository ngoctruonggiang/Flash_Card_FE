import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export const CtaSection = () => {
  const router = useRouter();

  return (
    <motion.div
      className="container mx-auto px-4 sm:px-6 mt-24 md:mt-32 py-16 md:py-20 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto relative bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl p-12 md:p-16 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Sẵn sàng bắt đầu hành trình học tập?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn người học đang cải thiện vốn từ vựng mỗi
            ngày
          </p>
          <motion.button
            onClick={() => router.push("/register")}
            className="px-10 py-5 bg-white text-blue-600 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Tạo tài khoản miễn phí →
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
