import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PhotoGallery from '../../components/PhotoGallery';
import MusicPlayer from '../../components/MusicPlayer';
import SocialShareButtons from '../../components/SocialShareButtons';
import QRCodeGenerator from '../../components/QRCodeGenerator';
import ConfettiEffect from '../../components/ConfettiEffect';
import FloatingBalloons from '../../components/FloatingBalloons';

export const SisterCuteTemplate1 = ({
  personName,
  message,
  photos = [],
  music,
  themeColor = '#ff69b4',
  slug,
}) => {
  const [showQR, setShowQR] = useState(false);

  return (
    <div style={{ '--theme-color': themeColor }}>
      <ConfettiEffect active={true} />
      <FloatingBalloons active={true} />

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 pt-8 pb-16">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto px-4"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              className="text-5xl md:text-6xl font-display font-bold mb-3"
              style={{ color: themeColor }}
              initial={{ y: -20 }}
              animate={{ y: 0 }}
            >
              Happy Birthday
            </motion.h1>
            <motion.p
              className="text-3xl md:text-4xl font-semibold text-gray-700"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
            >
              🎉 {personName}! 🎉
            </motion.p>
          </div>

          {/* Photo Gallery */}
          {photos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <PhotoGallery photos={photos} />
            </motion.div>
          )}

          {/* Music Player */}
          {music && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <MusicPlayer musicUrl={music} autoPlay={true} />
            </motion.div>
          )}

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 backdrop-blur rounded-lg p-6 md:p-8 mb-8 shadow-lg"
          >
            <p
              className="text-lg md:text-xl text-gray-700 leading-relaxed text-center italic"
            >
              "{message}"
            </p>
          </motion.div>

          {/* Social Sharing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <SocialShareButtons
              wishSlug={slug}
              personName={personName}
              message={message}
            />
          </motion.div>

          {/* QR Code Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <button
              onClick={() => setShowQR(!showQR)}
              className="bg-primary hover:bg-secondary text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              {showQR ? '✕ Hide' : '📲 Show QR Code'}
            </button>
            {showQR && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8"
              >
                <QRCodeGenerator
                  value={`${window.location.origin}/wish/${slug}`}
                  title={`Birthday Wish - ${personName}`}
                />
              </motion.div>
            )}
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-12 text-gray-600"
          >
            <p className="text-sm">Made with 💖 using Celebrations</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SisterCuteTemplate1;
