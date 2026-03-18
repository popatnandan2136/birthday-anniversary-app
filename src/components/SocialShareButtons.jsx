import React from 'react';
import { motion } from 'framer-motion';

export const SocialShareButtons = ({ wishSlug, personName, message = '' }) => {
  const wishUrl = `${window.location.origin}/wish/${wishSlug}`;
  const text = `Happy Wishes! Check out this special celebration for ${personName}: ${message.substring(0, 50)}...`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(wishUrl);
    alert('Link copied to clipboard!');
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(`Hey! 🎉 ${text} ${wishUrl}`);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleTelegram = () => {
    const encoded = encodeURIComponent(text);
    window.open(`https://t.me/share/url?url=${wishUrl}&text=${encoded}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-3 justify-center"
    >
      <button
        onClick={handleWhatsApp}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center gap-2"
      >
        💬 WhatsApp
      </button>
      <button
        onClick={handleTelegram}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center gap-2"
      >
        📱 Telegram
      </button>
      <button
        onClick={handleCopyLink}
        className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center gap-2"
      >
        📋 Copy Link
      </button>
    </motion.div>
  );
};

export default SocialShareButtons;
