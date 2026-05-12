import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, CheckCircle, Info } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "success" | "info" | "warning";
  singleButton?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  type = "danger",
  singleButton = false,
}) => {
  // Auto-close success modals after 1.5 seconds
  useEffect(() => {
    if (isOpen && type === "success" && singleButton) {
      const timer = setTimeout(() => {
        onConfirm();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, type, singleButton, onConfirm]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      default:
        return <Info className="w-6 h-6 text-blue-600" />;
    }
  };

  const getIconBgClass = () => {
    switch (type) {
      case "danger":
        return "bg-red-50";
      case "success":
        return "bg-green-50";
      case "warning":
        return "bg-yellow-50";
      default:
        return "bg-blue-50";
    }
  };

  const getConfirmButtonClass = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "success":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700 text-white";
      default:
        return "bg-blue-600 hover:bg-blue-700 text-white";
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full overflow-hidden z-10"
        >
          <div className="flex items-start space-x-4">
            <div className={`p-2 rounded-full ${getIconBgClass()}`}>
              {getIcon()}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 mb-6">{message}</p>

              <div className="flex justify-end space-x-3">
                {!singleButton && (
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                  >
                    {cancelText}
                  </button>
                )}
                <button
                  onClick={() => {
                    onConfirm();
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${getConfirmButtonClass()}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
