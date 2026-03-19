import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminDashboard from './AdminDashboard';
import FileUploader from '../components/FileUploader';
import { websiteAPI, imageAPI } from '../services/apiService';
import { useNotification } from '../hooks/useNotification';
import {
  RELATION_CHOICES,
  SISTER_TYPES,
  BROTHER_TYPES,
  AGE_GROUPS,
  RELATIONS_WITH_SUBTYPES,
  RELATIONS_WITH_AGE,
} from '../utils/constants';
import { getBirthdayTemplates } from '../utils/templateMapping';
import { validateName, validateMessage, validateDate, validateThemeColor } from '../utils/validation';

export const CreateBirthdayWish = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Relation
  const [relation, setRelation] = useState('');
  const [relationSubtype, setRelationSubtype] = useState('');

  // Step 2: Age Group (if applicable)
  const [ageGroup, setAgeGroup] = useState('');

  // Step 3: Person Details
  const [personName, setPersonName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [message, setMessage] = useState('');

  // Step 4: Media
  const [photos, setPhotos] = useState([]);
  const [video, setVideo] = useState([]);
  const [music, setMusic] = useState([]);

  // Step 5: Theme & Template
  const [themeColor, setThemeColor] = useState('#ff69b4');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [availableTemplates, setAvailableTemplates] = useState([]);

  const [errors, setErrors] = useState({});

  // Determine final relation for templates
  const getFinalRelation = () => {
    if (RELATIONS_WITH_SUBTYPES.includes(relation)) {
      return relationSubtype;
    }
    return relation;
  };

  // Update available templates when relation/age changes
  const updateAvailableTemplates = () => {
    const finalRelation = getFinalRelation();
    let templates = [];

    if (RELATIONS_WITH_AGE.includes(finalRelation) && ageGroup) {
      templates = getBirthdayTemplates(finalRelation, ageGroup);
    } else if (finalRelation) {
      templates = getBirthdayTemplates(finalRelation);
    }

    setAvailableTemplates(templates);
    if (templates.length > 0) {
      setSelectedTemplate(templates[0].id);
    }
  };

  React.useEffect(() => {
    updateAvailableTemplates();
  }, [relation, relationSubtype, ageGroup]);

  const validateStep = (stepNum) => {
    const newErrors = {};

    if (stepNum === 1) {
      if (!relation) newErrors.relation = 'Please select a relation';
      if (RELATIONS_WITH_SUBTYPES.includes(relation) && !relationSubtype) {
        newErrors.relationSubtype = 'Please select a subtype';
      }
    } else if (stepNum === 2) {
      if (RELATIONS_WITH_AGE.includes(getFinalRelation()) && !ageGroup) {
        newErrors.ageGroup = 'Please select an age group';
      }
    } else if (stepNum === 3) {
      if (!personName || !validateName(personName)) {
        newErrors.personName = 'Please enter a valid name (min 2 characters)';
      }
      if (!birthDate || !validateDate(birthDate)) {
        newErrors.birthDate = 'Please select a valid birth date';
      }
      if (!message || !validateMessage(message)) {
        newErrors.message = 'Please enter a message (min 5 characters)';
      }
    } else if (stepNum === 4) {
      if (photos.length === 0) newErrors.photos = 'Please upload at least one photo';
    } else if (stepNum === 5) {
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
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(5)) return;

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
        type: 'birthday',
        title: `${personName}'s Birthday`,
        personName,
        relation: getFinalRelation(),
        ageCategory: ageGroup ? ageGroup.split('-')[0] : 'adult',
        ageGroup: ageGroup || 'N/A',
        date: birthDate,
        message,
        template: selectedTemplate,
        imageUrl: photoUrls && photoUrls.length > 0 ? photoUrls[0] : null,
      };

      const response = await websiteAPI.createWebsite(websiteData);
      
      success('Birthday website created successfully!');
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
            <h2 className="text-2xl font-bold text-gray-800">Step 1: Select Relation</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Who is celebrating?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {RELATION_CHOICES.map((rel) => (
                  <button
                    key={rel.value}
                    onClick={() => {
                      setRelation(rel.value);
                      setRelationSubtype('');
                      setAgeGroup('');
                    }}
                    className={`p-3 rounded-lg font-medium transition ${
                      relation === rel.value
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {rel.label}
                  </button>
                ))}
              </div>
              {errors.relation && <p className="text-red-500 text-sm mt-2">{errors.relation}</p>}
            </div>

            {RELATIONS_WITH_SUBTYPES.includes(relation) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Specify {relation === 'sister' ? 'Sister Type' : 'Brother Type'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(relation === 'sister' ? SISTER_TYPES : BROTHER_TYPES).map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setRelationSubtype(type.value)}
                      className={`p-3 rounded-lg font-medium transition ${
                        relationSubtype === type.value
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
                {errors.relationSubtype && (
                  <p className="text-red-500 text-sm mt-2">{errors.relationSubtype}</p>
                )}
              </motion.div>
            )}
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
            <h2 className="text-2xl font-bold text-gray-800">Step 2: Age Group</h2>

            {RELATIONS_WITH_AGE.includes(getFinalRelation()) ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select age group
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {AGE_GROUPS.map((age) => (
                    <button
                      key={age.value}
                      onClick={() => setAgeGroup(age.value)}
                      className={`p-3 rounded-lg font-medium transition ${
                        ageGroup === age.value
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {age.label}
                    </button>
                  ))}
                </div>
                {errors.ageGroup && <p className="text-red-500 text-sm mt-2">{errors.ageGroup}</p>}
              </div>
            ) : (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-700">
                  Age group not applicable for {getFinalRelation()}. Proceeding to next step.
                </p>
              </div>
            )}
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
            <h2 className="text-2xl font-bold text-gray-800">Step 3: Person Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Person's Name
              </label>
              <input
                type="text"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition ${
                  errors.personName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Riya"
              />
              {errors.personName && <p className="text-red-500 text-sm mt-1">{errors.personName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition ${
                  errors.birthDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition ${
                  errors.message ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Write a heartfelt birthday message..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {message.length} / 500 characters
              </p>
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
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
            <h2 className="text-2xl font-bold text-gray-800">Step 4: Media Upload</h2>

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

      case 5:
        return (
          <motion.div
            key="step-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-800">Step 5: Theme & Template</h2>

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
                Select Template ({availableTemplates.length} available)
              </label>
              {availableTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableTemplates.map((template) => (
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
              ) : (
                <p className="text-gray-600">No templates available for this selection</p>
              )}
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
    <AdminDashboard activeTab="create-birthday">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 mx-1 rounded-full transition ${
                  s <= step ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">Step {step} of 5</p>
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

          {step < 5 ? (
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

export default CreateBirthdayWish;
