import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const FileUploader = ({ onFilesSelected, accept = 'image/*', multiple = false, maxFiles = 5 }) => {
  const [files, setFiles] = React.useState([]);
  const [dragActive, setDragActive] = React.useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const newFiles = Array.from(e.dataTransfer.files);
    handleFiles(newFiles);
  };

  const handleChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    handleFiles(newFiles);
  };

  const handleFiles = (newFiles) => {
    if (multiple) {
      if (files.length + newFiles.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onFilesSelected(updatedFiles);
    } else {
      setFiles(newFiles.slice(0, 1));
      onFilesSelected(newFiles.slice(0, 1));
    }
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition ${
          dragActive
            ? 'border-primary bg-pink-50'
            : 'border-gray-300 bg-gray-50 hover:border-primary'
        }`}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="cursor-pointer">
          <p className="text-lg font-semibold text-gray-700">📁 Click to upload or drag files</p>
          <p className="text-sm text-gray-600 mt-1">
            {multiple ? `Up to ${maxFiles} files allowed` : 'Select a file'}
          </p>
        </label>
      </div>

      {/* File Preview */}
      <AnimatePresence>
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </p>
            {files.map((file, idx) => (
              <motion.div
                key={`${file.name}-${idx}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
              >
                <div className="flex items-center flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
                  <span className="text-xs text-gray-600 ml-2">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  onClick={() => removeFile(idx)}
                  className="ml-2 text-red-500 hover:text-red-700 font-bold"
                >
                  ✕
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;
