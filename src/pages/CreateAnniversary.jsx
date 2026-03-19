import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminDashboard from './AdminDashboard';
import FileUploader from '../components/FileUploader';
import { websiteAPI, imageAPI } from '../services/apiService';
import { useNotification } from '../hooks/useNotification';
import { ANNIVERSARY_TEMPLATE_MAP } from '../utils/templateMapping';
import {
  validateName,
  validateMessage,
  validateDate,
  validateThemeColor,
} from '../utils/validation';

export const CreateAnniversaryWish = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Anniversary details
  const [husbandName, setHusbandName] = useState('');
  const [wifeName, setWifeName] = useState('');
  const [marriageDate, setMarriageDate] = useState('');
  const [loveMessage, setLoveMessage] = useState('');
  const [specialMemory, setSpecialMemory] = useState('');

  // Media
  const [photos, setPhotos] = useState([]);
  const [video, setVideo] = useState([]);
  const [music, setMusic] = useState([]);

  // Theme & Template
  const [themeColor, setThemeColor] = useState('#ff1493');
  const [selectedTemplate, setSelectedTemplate] = useState('wife-romantic-1');

  const [errors, setErrors] = useState({});

  const validateStep = (stepNum) => {
    const newErrors = {};

    if (stepNum === 1) {
      if (!husbandName || !validateName(husbandName)) {
        newErrors.husbandName = 'Please enter husband\'s name';
      }
      if (!wifeName || !validateName(wifeName)) {
        newErrors.wifeName = 'Please enter wife\'s name';
      }
      if (!marriageDate || !validateDate(marriageDate)) {
        newErrors.marriageDate = 'Please select a valid marriage date';
      }
    } else if (stepNum === 2) {
      if (!loveMessage || !validateMessage(loveMessage)) {
        newErrors.loveMessage = 'Please enter a love message (min 5 characters)';
      }
      if (specialMemory && specialMemory.length < 5) {
        newErrors.specialMemory = 'Special memory must be at least 5 characters';
      }
    } else if (stepNum === 3) {
      if (photos.length === 0) newErrors.photos = 'Please upload at least one photo';
    } else if (stepNum === 4) {
      if (!validateThemeColor(themeColor)) {
        newErrors.themeColor = 'Please select a valid color';
      }
      if (!selectedTemplate) newErrors.selectedTemplate = 'Please select a template';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(4)) return;

    setLoading(true);

    try {
      let photoUrls = [];
      let videoUrl = null;
      let musicUrl = null;

      // Upload photos
      if (photos.length > 0) {
        const uploadedPhotos = await imageAPI.uploadImages(photos);
        photoUrls = uploadedPhotos;
      }

      // Upload video (optional)
      if (video && video.length > 0) {
        try {
          const uploadedVideo = await imageAPI.uploadImage(video[0]);
          videoUrl = uploadedVideo.url || uploadedVideo;
        } catch (err) {
          console.warn('Video upload failed:', err);
        }
      }

      // Upload music (optional)
      if (music && music.length > 0) {
        try {
          const uploadedMusic = await imageAPI.uploadImage(music[0]);
          musicUrl = uploadedMusic.url || uploadedMusic;
        } catch (err) {
          console.warn('Music upload failed:', err);
        }
      }

      // Create website with API
      const websiteData = {
        type: 'anniversary',
        title: `${husbandName} & ${wifeName}'s Anniversary`,
        personName: `${husbandName} & ${wifeName}`,
        relation: 'spouse',
        ageCategory: 'adult',
        ageGroup: 'N/A',
        date: marriageDate,
        message: loveMessage + (specialMemory ? `\n\nSpecial Memory: ${specialMemory}` : ''),
        template: selectedTemplate,
        imageUrl: photoUrls && photoUrls.length > 0 ? photoUrls[0] : null,
      };

      await websiteAPI.createWebsite(websiteData);
      success('Anniversary website created successfully!');
      navigate('/admin/wishes', { replace: true });
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Failed to create website. Please try again.';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800">Step 1: Couple Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Husband's Name
              </label>
              <input
                type="text"
                value={husbandName}
                onChange={(e) => setHusbandName(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition ${
                  errors.husbandName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Rahul"
              />
              {errors.husbandName && (
                <p className="text-red-500 text-sm mt-1">{errors.husbandName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wife's Name
              </label>
              <input
                type="text"
                value={wifeName}
                onChange={(e) => setWifeName(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition ${
                  errors.wifeName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Priya"
              />
              {errors.wifeName && (
                <p className="text-red-500 text-sm mt-1">{errors.wifeName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marriage Date
              </label>
              <input
                type="date"
                value={marriageDate}
                onChange={(e) => setMarriageDate(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition ${
                  errors.marriageDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.marriageDate && (
                <p className="text-red-500 text-sm mt-1">{errors.marriageDate}</p>
              )}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800">Step 2: Messages</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Love Message</label>
              <textarea
                value={loveMessage}
                onChange={(e) => setLoveMessage(e.target.value)}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition ${
                  errors.loveMessage ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Write a heartfelt love message..."
              />
              <p className="text-xs text-gray-500 mt-1">{loveMessage.length} / 500 characters</p>
              {errors.loveMessage && (
                <p className="text-red-500 text-sm mt-1">{errors.loveMessage}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Memory (Optional)
              </label>
              <textarea
                value={specialMemory}
                onChange={(e) => setSpecialMemory(e.target.value)}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition ${
                  errors.specialMemory ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Share a special memory..."
              />
              {errors.specialMemory && (
                <p className="text-red-500 text-sm mt-1">{errors.specialMemory}</p>
              )}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800">Step 3: Media</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Photos</label>
              <FileUploader
                onFilesSelected={setPhotos}
                accept="image/*"
                multiple={true}
                maxFiles={10}
              />
              {errors.photos && <p className="text-red-500 text-sm mt-2">{errors.photos}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Video (Optional)
              </label>
              <FileUploader
                onFilesSelected={setVideo}
                accept="video/*"
                multiple={false}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Background Music (Optional)
              </label>
              <FileUploader
                onFilesSelected={setMusic}
                accept="audio/*"
                multiple={false}
              />
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800">Step 4: Theme & Template</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Theme Color</label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="w-16 h-16 border rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              {errors.themeColor && <p className="text-red-500 text-sm mt-2">{errors.themeColor}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Template ({ANNIVERSARY_TEMPLATE_MAP.length} available)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ANNIVERSARY_TEMPLATE_MAP.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-4 rounded-lg border-2 transition text-left ${
                      selectedTemplate === template.id
                        ? 'border-primary bg-pink-50'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                  >
                    <p className="font-semibold text-gray-800">{template.label}</p>
                    <p className="text-sm text-gray-600">ID: {template.id}</p>
                  </button>
                ))}
              </div>
              {errors.selectedTemplate && (
                <p className="text-red-500 text-sm mt-2">{errors.selectedTemplate}</p>
              )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <AdminDashboard activeTab="create-anniversary">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 mx-1 rounded-full transition ${
                  s <= step ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">Step {step} of 4</p>
        </div>

        {/* Step Content */}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handlePrev}
            disabled={step === 1 || loading}
            className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            ← Previous
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={loading}
              className="flex-1 bg-primary hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              {loading ? 'Creating...' : '✓ Create Website'}
            </button>
          )}
        </div>
      </motion.div>
    </AdminDashboard>
  );
};

export default CreateAnniversaryWish;
