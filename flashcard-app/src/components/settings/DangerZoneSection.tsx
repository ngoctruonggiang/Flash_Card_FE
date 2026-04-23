import { Shield, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface DangerZoneSectionProps {
  handleDeleteAccount: () => void;
}

export const DangerZoneSection = ({
  handleDeleteAccount,
}: DangerZoneSectionProps) => {
  return (
    <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200">
      <div className="flex items-center space-x-3 mb-4">
        <Shield className="w-6 h-6 text-red-600" />
        <h2 className="text-xl font-bold text-red-900">Vùng nguy hiểm</h2>
      </div>

      <p className="text-red-700 mb-4">
        Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh
        viễn.
      </p>

      <motion.button
        onClick={handleDeleteAccount}
        className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all flex items-center space-x-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Trash2 className="w-4 h-4" />
        <span>Xóa tài khoản</span>
      </motion.button>
    </div>
  );
};
