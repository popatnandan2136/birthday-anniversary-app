import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PhotoGallery from '../../components/PhotoGallery';
import MusicPlayer from '../../components/MusicPlayer';
import SocialShareButtons from '../../components/SocialShareButtons';
import QRCodeGenerator from '../../components/QRCodeGenerator';
import ConfettiEffect from '../../components/ConfettiEffect';

// Generic anniversary template factory
const createAnniversaryTemplate = (templateName, styles = {}) => {
  const Template = ({
    husbandName,
    wifeName,
    marriageDate,
    loveMessage,
    specialMemory,
    photos = [],
    music,
    themeColor = '#ff1493',
    slug,
  }) => {
    const [showQR, setShowQR] = useState(false);
    const defaultStyles = {
      primaryColor: themeColor,
      bgGradient: 'from-red-50 via-pink-50 to-rose-50',
      ...styles,
    };

    const yearsMarried = new Date().getFullYear() - new Date(marriageDate).getFullYear();

    return (
      <div>
        <ConfettiEffect active={true} />
        <div className={`min-h-screen bg-gradient-to-br ${defaultStyles.bgGradient} pt-8 pb-16`}>
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
                💑 Happy Anniversary 💑
              </motion.h1>
              <motion.p
                className="text-2xl md:text-3xl font-semibold text-gray-700 mb-2"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {husbandName} & {wifeName}
              </motion.p>
              <motion.p
                className="text-lg text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {yearsMarried} Years of Love & Togetherness 💕
              </motion.p>
            </div>

            {/* Photo Gallery */}
            {photos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
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
                transition={{ delay: 0.5 }}
                className="mb-8"
              >
                <MusicPlayer musicUrl={music} autoPlay={true} />
              </motion.div>
            )}

            {/* Messages */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-6 mb-8"
            >
              {loveMessage && (
                <div className="bg-white/90 backdrop-blur rounded-xl p-6 md:p-8 shadow-xl border-2"
                  style={{ borderColor: themeColor }}>
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center italic">
                    "💌 {loveMessage}"
                  </p>
                </div>
              )}

              {specialMemory && (
                <div className="bg-white/80 backdrop-blur rounded-xl p-6 md:p-8 shadow-lg border"
                  style={{ borderColor: themeColor, borderOpacity: 0.3 }}>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    📖 <span className="font-semibold">Special Memory:</span> {specialMemory}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Social Sharing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-8"
            >
              <SocialShareButtons
                wishSlug={slug}
                personName={`${husbandName} & ${wifeName}`}
                message={loveMessage}
              />
            </motion.div>

            {/* QR Code */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
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
                    title={`Anniversary - ${husbandName} & ${wifeName}`}
                  />
                </motion.div>
              )}
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-center mt-12 text-gray-600"
            >
              <p className="text-sm">May your love grow stronger with every passing year! 💕</p>
              <p className="text-xs mt-2">Made with 💖 using Celebrations</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  };

  return Template;
};

// Create all anniversary templates
export const WifeRomanticTemplate1 = createAnniversaryTemplate('WifeRomanticTemplate1', {
  bgGradient: 'from-pink-100 to-rose-50',
});

export const WifeRomanticTemplate2 = createAnniversaryTemplate('WifeRomanticTemplate2', {
  bgGradient: 'from-rose-100 to-pink-50',
});

export const HusbandRomanticTemplate1 = createAnniversaryTemplate('HusbandRomanticTemplate1', {
  bgGradient: 'from-red-50 to-pink-50',
});

export const HusbandRomanticTemplate2 = createAnniversaryTemplate('HusbandRomanticTemplate2', {
  bgGradient: 'from-pink-50 to-purple-50',
});

export const LoveStoryTimelineTemplate = createAnniversaryTemplate('LoveStoryTimelineTemplate', {
  bgGradient: 'from-purple-50 to-pink-50',
});

export const PhotoMemoryTemplate = createAnniversaryTemplate('PhotoMemoryTemplate', {
  bgGradient: 'from-indigo-50 to-pink-50',
});

export const DefaultAnniversaryTemplate = createAnniversaryTemplate('DefaultAnniversaryTemplate', {
  bgGradient: 'from-red-50 via-pink-50 to-rose-50',
});
