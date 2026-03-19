import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/apiService';
import { useAuth } from '../hooks/useAuth';
import { useResponsive } from '../hooks/useResponsive';
import { useNotification } from '../hooks/useNotification';

export const AdminDashboard = ({ children, activeTab }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isMobile, isTablet } = useResponsive();
  const { success } = useNotification();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      success('Logged out successfully');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { id: 'wishes', label: 'All Wishes', icon: '📋', path: '/admin/wishes' },
    { id: 'create-birthday', label: 'Create Birthday', icon: '🎂', path: '/admin/create-birthday' },
    { id: 'create-anniversary', label: 'Create Anniversary', icon: '💑', path: '/admin/create-anniversary' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-50 h-screen bg-white shadow-lg transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0 md:w-0'
        } md:w-64 overflow-hidden`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold font-display text-primary">🎉 Celebrations</h1>
        </div>

        {/* Menu */}
        <nav className="mt-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setSidebarOpen(false);
              }}
              className={`w-full text-left px-6 py-3 font-medium transition ${
                activeTab === item.id
                  ? 'bg-pink-100 text-primary border-l-4 border-primary'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 border-t p-4 bg-gray-50">
          <p className="text-sm font-medium text-gray-700 truncate">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-gray-700 hover:text-gray-900"
          >
            <span className="text-2xl">☰</span>
          </button>
          <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
          <div className="text-right">
            <p className="text-sm text-gray-600">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
