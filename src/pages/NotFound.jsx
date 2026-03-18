import React from 'react';

export const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</p>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <a
          href="/admin"
          className="inline-block bg-primary hover:bg-secondary text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
