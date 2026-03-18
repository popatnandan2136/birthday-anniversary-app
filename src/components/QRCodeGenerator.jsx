import React from 'react';
import QRCode from 'qrcode.react';
import { motion } from 'framer-motion';

export const QRCodeGenerator = ({ value, title = 'QR Code' }) => {
  const qrRef = React.useRef();

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${title}-qr-code.png`;
      link.click();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow"
    >
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <div
        ref={qrRef}
        className="bg-white p-4 rounded-lg border-2 border-gray-200"
      >
        <QRCode value={value} size={200} level="H" />
      </div>
      <button
        onClick={handleDownload}
        className="bg-primary hover:bg-secondary text-white font-semibold py-2 px-6 rounded-lg transition"
      >
        📥 Download QR Code
      </button>
    </motion.div>
  );
};

export default QRCodeGenerator;
