import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PhotoGallery from '../../components/PhotoGallery';
import MusicPlayer from '../../components/MusicPlayer';
import SocialShareButtons from '../../components/SocialShareButtons';
import QRCodeGenerator from '../../components/QRCodeGenerator';
import ConfettiEffect from '../../components/ConfettiEffect';

// Generic template factory for creating variations
const createBirthdayTemplate = (templateName, styles = {}) => {
  const Template = ({
    personName,
    message,
    photos = [],
    music,
    themeColor = '#ff69b4',
    slug,
  }) => {
    const [showQR, setShowQR] = useState(false);
    const defaultStyles = {
      primaryColor: themeColor,
      bgGradient: 'from-pink-50 to-purple-50',
      headerSize: 'text-5xl md:text-6xl',
      ...styles,
    };

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
            <div className="text-center mb-8">
              <motion.h1
                className={`${defaultStyles.headerSize} font-display font-bold mb-3`}
                style={{ color: themeColor }}
                initial={{ y: -20 }}
                animate={{ y: 0 }}
              >
                🎂 Happy Birthday 🎂
              </motion.h1>
              <motion.p
                className="text-3xl md:text-4xl font-semibold text-gray-700"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {personName}
              </motion.p>
            </div>

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

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white/90 backdrop-blur rounded-xl p-6 md:p-8 mb-8 shadow-xl border-2"
              style={{ borderColor: themeColor }}
            >
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center">
                💌 {message}
              </p>
            </motion.div>

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
                    title={`Birthday - ${personName}`}
                  />
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  };

  return Template;
};

// Create all birthday templates
export const SisterCuteTemplate2 = createBirthdayTemplate('SisterCuteTemplate2', {
  bgGradient: 'from-pink-100 via-pink-50 to-purple-100',
});

export const SisterCuteTemplate3 = createBirthdayTemplate('SisterCuteTemplate3', {
  bgGradient: 'from-red-50 to-pink-50',
});

export const SisterElegantTemplate1 = createBirthdayTemplate('SisterElegantTemplate1', {
  bgGradient: 'from-purple-50 to-indigo-50',
  headerSize: 'text-4xl md:text-5xl',
});

export const SisterElegantTemplate2 = createBirthdayTemplate('SisterElegantTemplate2', {
  bgGradient: 'from-blue-50 to-purple-50',
  headerSize: 'text-4xl md:text-5xl',
});

export const BrotherFunTemplate1 = createBirthdayTemplate('BrotherFunTemplate1', {
  bgGradient: 'from-blue-50 to-cyan-50',
});

export const BrotherFunTemplate2 = createBirthdayTemplate('BrotherFunTemplate2', {
  bgGradient: 'from-green-50 to-blue-50',
});

export const BrotherFunTemplate3 = createBirthdayTemplate('BrotherFunTemplate3', {
  bgGradient: 'from-yellow-50 to-orange-50',
});

export const BrotherCoolTemplate1 = createBirthdayTemplate('BrotherCoolTemplate1', {
  bgGradient: 'from-slate-50 to-blue-50',
  headerSize: 'text-4xl md:text-5xl',
});

export const BrotherCoolTemplate2 = createBirthdayTemplate('BrotherCoolTemplate2', {
  bgGradient: 'from-gray-50 to-blue-50',
  headerSize: 'text-4xl md:text-5xl',
});

export const CartoonBabyTemplate1 = createBirthdayTemplate('CartoonBabyTemplate1', {
  bgGradient: 'from-yellow-50 to-pink-50',
});

export const CartoonBabyTemplate2 = createBirthdayTemplate('CartoonBabyTemplate2', {
  bgGradient: 'from-purple-50 to-pink-50',
});

export const CartoonKidsTemplate1 = createBirthdayTemplate('CartoonKidsTemplate1', {
  bgGradient: 'from-green-50 to-cyan-50',
});

export const CartoonKidsTemplate2 = createBirthdayTemplate('CartoonKidsTemplate2', {
  bgGradient: 'from-orange-50 to-yellow-50',
});

export const CartoonBabyGirlTemplate1 = createBirthdayTemplate('CartoonBabyGirlTemplate1', {
  bgGradient: 'from-pink-100 to-rose-50',
});

export const CartoonBabyGirlTemplate2 = createBirthdayTemplate('CartoonBabyGirlTemplate2', {
  bgGradient: 'from-pink-50 to-purple-50',
});

export const CartoonKidsGirlTemplate1 = createBirthdayTemplate('CartoonKidsGirlTemplate1', {
  bgGradient: 'from-pink-100 to-orange-50',
});

export const CartoonKidsGirlTemplate2 = createBirthdayTemplate('CartoonKidsGirlTemplate2', {
  bgGradient: 'from-purple-100 to-pink-50',
});

export const TeenModernTemplate1 = createBirthdayTemplate('TeenModernTemplate1', {
  bgGradient: 'from-indigo-50 to-purple-50',
});

export const TeenModernTemplate2 = createBirthdayTemplate('TeenModernTemplate2', {
  bgGradient: 'from-blue-50 to-cyan-50',
});

export const TeenCoolTemplate1 = createBirthdayTemplate('TeenCoolTemplate1', {
  bgGradient: 'from-slate-50 to-gray-50',
});

export const TeenCoolTemplate2 = createBirthdayTemplate('TeenCoolTemplate2', {
  bgGradient: 'from-gray-100 to-slate-50',
});

export const TeenPinkTemplate1 = createBirthdayTemplate('TeenPinkTemplate1', {
  bgGradient: 'from-pink-100 to-rose-50',
});

export const TeenPinkTemplate2 = createBirthdayTemplate('TeenPinkTemplate2', {
  bgGradient: 'from-rose-50 to-pink-50',
});

export const TeenPrincessTemplate1 = createBirthdayTemplate('TeenPrincessTemplate1', {
  bgGradient: 'from-pink-200 to-purple-100',
});

export const TeenPrincessTemplate2 = createBirthdayTemplate('TeenPrincessTemplate2', {
  bgGradient: 'from-purple-100 to-pink-100',
});

export const AdultModernTemplate1 = createBirthdayTemplate('AdultModernTemplate1', {
  bgGradient: 'from-indigo-50 to-blue-50',
});

export const AdultModernTemplate2 = createBirthdayTemplate('AdultModernTemplate2', {
  bgGradient: 'from-slate-50 to-indigo-50',
});

export const AdultElegantTemplate1 = createBirthdayTemplate('AdultElegantTemplate1', {
  bgGradient: 'from-purple-50 to-pink-50',
});

export const AdultElegantTemplate2 = createBirthdayTemplate('AdultElegantTemplate2', {
  bgGradient: 'from-rose-50 to-pink-50',
});

export const FatherClassicTemplate1 = createBirthdayTemplate('FatherClassicTemplate1', {
  bgGradient: 'from-amber-50 to-orange-50',
});

export const FatherClassicTemplate2 = createBirthdayTemplate('FatherClassicTemplate2', {
  bgGradient: 'from-yellow-50 to-amber-50',
});

export const MotherLoveTemplate1 = createBirthdayTemplate('MotherLoveTemplate1', {
  bgGradient: 'from-rose-50 to-pink-50',
});

export const MotherLoveTemplate2 = createBirthdayTemplate('MotherLoveTemplate2', {
  bgGradient: 'from-pink-100 to-rose-50',
});

export const FriendPartyTemplate1 = createBirthdayTemplate('FriendPartyTemplate1', {
  bgGradient: 'from-purple-100 to-pink-100',
});

export const FriendPartyTemplate2 = createBirthdayTemplate('FriendPartyTemplate2', {
  bgGradient: 'from-blue-100 to-purple-100',
});

export const DefaultBirthdayTemplate = createBirthdayTemplate('DefaultBirthdayTemplate', {
  bgGradient: 'from-pink-50 to-purple-50',
});
