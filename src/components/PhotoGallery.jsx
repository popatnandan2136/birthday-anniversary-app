import React from 'react';
import { motion } from 'framer-motion';

export const PhotoGallery = ({ photos = [], onPhotoClick }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  if (photos.length === 0) {
    return <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center text-gray-600">No photos</div>;
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden h-96 flex items-center justify-center group">
        <motion.img
          key={photos[selectedIndex]}
          src={photos[selectedIndex]}
          alt={`Photo ${selectedIndex + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full object-contain"
        />

        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              ◀
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              ▶
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
              {selectedIndex + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {photos.map((photo, idx) => (
            <motion.button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition ${
                idx === selectedIndex ? 'border-primary' : 'border-gray-300 hover:border-primary'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={photo} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
