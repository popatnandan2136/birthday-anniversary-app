import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { publicAPI } from '../services/apiService';
import TemplateDispatcher from '../components/TemplateDispatcher';
import { useNotification } from '../hooks/useNotification';

export const WishPage = () => {
  const { slug } = useParams();
  const { error: showError } = useNotification();
  const [wish, setWish] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWish();
  }, [slug]);

  const loadWish = async () => {
    setLoading(true);
    try {
      const data = await publicAPI.getWebsiteBySlug(slug);
      if (!data) {
        showError('Website not found or has been deactivated');
        setWish(null);
      } else {
        setWish(data);
      }
    } catch (err) {
      console.error('Error loading website:', err);
      showError('Failed to load website');
      setWish(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your special website...</p>
        </div>
      </div>
    );
  }

  if (!wish) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Oops! 😕</h1>
          <p className="text-gray-600 mb-4">This website is not available or has been deactivated.</p>
          <a
            href="/"
            className="inline-block bg-primary hover:bg-secondary text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <TemplateDispatcher
        type={wish.type}
        templateId={wish.template}
        wishData={wish}
      />
    </motion.div>
  );
};

export default WishPage;
