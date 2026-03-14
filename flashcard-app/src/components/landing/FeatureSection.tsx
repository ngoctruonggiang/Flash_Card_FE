import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

interface FeatureSectionProps {
  features: Feature[];
}

export const FeatureSection = ({ features }: FeatureSectionProps) => {
  return (
    <motion.div
      className="container mx-auto px-4 sm:px-6 space-y-12 mb-24 md:mb-32"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
          Tại sao chọn{" "}
          <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FlashLearn?
          </span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Được xây dựng dựa trên nghiên cứu khoa học về trí nhớ và học tập
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div
              className={`w-14 h-14 bg-linear-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
            >
              <feature.icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
