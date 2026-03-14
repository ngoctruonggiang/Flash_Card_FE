import { motion } from "framer-motion";
import { Upload, Download } from "lucide-react";

interface ImportExportMenuProps {
  handleImportCSV: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleExportCSV: () => void;
  handleExportJSON: () => void;
}

export const ImportExportMenu = ({
  handleImportCSV,
  handleImportJSON,
  handleExportCSV,
  handleExportJSON,
}: ImportExportMenuProps) => {
  return (
    <div className="flex items-center space-x-3">
      {/* Import Dropdown */}
      <div className="relative group">
        <motion.button
          className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-blue-500 transition-all flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Upload className="w-4 h-4" />
          <span>Import</span>
        </motion.button>

        {/* Dropdown Menu */}
        <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-2xl border-2 border-gray-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 w-48">
          <label className="block px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors">
            <input
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
            <div className="flex items-center space-x-2 text-gray-700">
              <span>📄</span>
              <span className="font-medium">Import CSV</span>
            </div>
          </label>

          <label className="block px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-t border-gray-100">
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
            <div className="flex items-center space-x-2 text-gray-700">
              <span>📋</span>
              <span className="font-medium">Import JSON</span>
            </div>
          </label>
        </div>
      </div>

      {/* Export Dropdown */}
      <div className="relative group">
        <motion.button
          className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-blue-500 transition-all flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </motion.button>

        {/* Dropdown Menu */}
        <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-2xl border-2 border-gray-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 w-48">
          <button
            onClick={handleExportCSV}
            className="w-full px-4 py-3 hover:bg-blue-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-2 text-gray-700">
              <span>📄</span>
              <span className="font-medium">Export CSV</span>
            </div>
          </button>

          <button
            onClick={handleExportJSON}
            className="w-full px-4 py-3 hover:bg-blue-50 transition-colors border-t border-gray-100 text-left"
          >
            <div className="flex items-center space-x-2 text-gray-700">
              <span>📋</span>
              <span className="font-medium">Export JSON</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
