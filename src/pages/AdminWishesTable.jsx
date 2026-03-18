import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdminDashboard from './AdminDashboard';
import { getAllWishes, toggleWishStatus, deleteWish } from '../firebase/firestoreService';
import { deleteFiles } from '../firebase/storageService';
import { useNotification } from '../hooks/useNotification';
import { formatDate, getRelativeTime } from '../utils/formatDate';
import { useResponsive } from '../hooks/useResponsive';

export const AdminWishesTable = () => {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedWish, setSelectedWish] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const { success, error: showError } = useNotification();
  const { isMobile } = useResponsive();

  useEffect(() => {
    loadWishes();
  }, [filter]);

  const loadWishes = async () => {
    setLoading(true);
    try {
      const { wishes: data, hasMore: more } = await getAllWishes(20);
      let filtered = data;
      if (filter !== 'all') {
        filtered = data.filter((w) => w.type === filter);
      }
      setWishes(filtered);
      setHasMore(more);
      setPage(0);
    } catch (err) {
      showError('Failed to load wishes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (wishId, currentStatus) => {
    try {
      const newStatus = await toggleWishStatus(wishId, currentStatus);
      setWishes((prev) =>
        prev.map((w) => (w.id === wishId ? { ...w, status: newStatus } : w))
      );
      success(`Wish ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
    } catch (err) {
      showError('Failed to update wish status');
    }
  };

  const handleDeleteWish = async (wishId) => {
    if (!window.confirm('Are you sure you want to delete this wish?')) return;

    try {
      const wish = wishes.find((w) => w.id === wishId);
      const filesToDelete = [
        ...(wish.photos || []),
        ...(wish.video ? [wish.video] : []),
        ...(wish.music ? [wish.music] : []),
      ];

      if (filesToDelete.length > 0) {
        await deleteFiles(filesToDelete);
      }

      await deleteWish(wishId);
      setWishes((prev) => prev.filter((w) => w.id !== wishId));
      success('Wish deleted successfully');
    } catch (err) {
      showError('Failed to delete wish');
      console.error(err);
    }
  };

  const handleCopyLink = (slug) => {
    const link = `${window.location.origin}/wish/${slug}`;
    navigator.clipboard.writeText(link);
    success('Link copied to clipboard');
  };

  if (loading) {
    return (
      <AdminDashboard activeTab="wishes">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading wishes...</p>
          </div>
        </div>
      </AdminDashboard>
    );
  }

  return (
    <AdminDashboard activeTab="wishes">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-800">All Wishes</h1>
          <div className="flex gap-2">
            {['all', 'birthday', 'anniversary'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === type
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Total Wishes</p>
            <p className="text-3xl font-bold text-primary">{wishes.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Active</p>
            <p className="text-3xl font-bold text-green-500">
              {wishes.filter((w) => w.status === 'active').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Inactive</p>
            <p className="text-3xl font-bold text-gray-500">
              {wishes.filter((w) => w.status === 'inactive').length}
            </p>
          </div>
        </div>

        {/* Table / Cards */}
        {wishes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No wishes yet. Create one to get started!</p>
          </div>
        ) : isMobile ? (
          // Mobile card view
          <div className="space-y-4">
            {wishes.map((wish) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg shadow p-4 space-y-3"
              >
                <div>
                  <h3 className="font-bold text-gray-800">
                    {wish.personName || wish.husbandName || 'Wish'}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">{wish.type}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      wish.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {wish.status.toUpperCase()}
                  </span>
                  <p className="text-xs text-gray-500">{getRelativeTime(wish.createdAt)}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleCopyLink(wish.slug)}
                    className="flex-1 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={() => handleToggleStatus(wish.id, wish.status)}
                    className="flex-1 px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs rounded transition"
                  >
                    {wish.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeleteWish(wish.id)}
                    className="flex-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // Desktop table view
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Wish Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {wishes.map((wish, idx) => (
                  <tr
                    key={wish.id}
                    className={`border-b hover:bg-gray-50 transition ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">
                        {wish.personName || wish.husbandName || 'Wish'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          wish.type === 'birthday'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {wish.type.charAt(0).toUpperCase() + wish.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(wish.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          wish.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {wish.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleCopyLink(wish.slug)}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition"
                          title="Copy Link"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => handleToggleStatus(wish.id, wish.status)}
                          className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs rounded transition"
                          title={wish.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {wish.status === 'active' ? '✓' : '✗'}
                        </button>
                        <button
                          onClick={() => handleDeleteWish(wish.id)}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </AdminDashboard>
  );
};

export default AdminWishesTable;
