import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (token expired)
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// =====================
// AUTH API CALLS
// =====================
export const authAPI = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

// =====================
// WEBSITE API CALLS (Admin endpoints)
// =====================
export const websiteAPI = {
  // Create website
  createWebsite: async (websiteData) => {
    const response = await apiClient.post('/admin/website/create', websiteData);
    return response.data;
  },

  // Get all websites for current admin
  getAdminWebsites: async (page = 1, limit = 10, status = null) => {
    const params = new URLSearchParams({ page, limit });
    if (status) params.append('status', status);
    const response = await apiClient.get(`/admin/website/list?${params}`);
    return response.data;
  },

  // Get specific website details
  getWebsite: async (websiteId) => {
    const response = await apiClient.get(`/admin/website/${websiteId}`);
    return response.data;
  },

  // Update website
  updateWebsite: async (websiteId, updateData) => {
    const response = await apiClient.put(`/admin/website/${websiteId}`, updateData);
    return response.data;
  },

  // Delete website
  deleteWebsite: async (websiteId) => {
    const response = await apiClient.delete(`/admin/website/${websiteId}`);
    return response.data;
  },

  // Toggle website active/inactive
  toggleWebsite: async (websiteId) => {
    const response = await apiClient.put(`/admin/website/toggle/${websiteId}`);
    return response.data;
  },

  // Get license key status
  getLicenseStatus: async () => {
    const response = await apiClient.get('/admin/key/status');
    return response.data;
  },
};

// =====================
// PUBLIC API CALLS (No authentication required)
// =====================
export const publicAPI = {
  // Get website by slug (public access)
  getWebsiteBySlug: async (slug) => {
    // No auth required - use native fetch or special apiClient call
    const response = await axios.get(`${API_BASE_URL}/public/website/${slug}`);
    return response.data;
  },

  // Get popular websites
  getPopularWebsites: async (limit = 10) => {
    const response = await axios.get(`${API_BASE_URL}/public/popular?limit=${limit}`);
    return response.data;
  },

  // Get websites by type
  getWebsitesByType: async (type, page = 1, limit = 10) => {
    const response = await axios.get(
      `${API_BASE_URL}/public/websites/${type}?page=${page}&limit=${limit}`
    );
    return response.data;
  },
};

// =====================
// CLOUDINARY IMAGE UPLOAD
// =====================
export const imageAPI = {
  // Upload image to Cloudinary via backend
  uploadImage: async (file, folder = 'birthday-anniversary') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await apiClient.post('/admin/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload multiple images
  uploadImages: async (files, folder = 'birthday-anniversary') => {
    const uploadPromises = Array.from(files).map((file) =>
      imageAPI.uploadImage(file, folder)
    );
    const results = await Promise.all(uploadPromises);
    return results.map((r) => r.url);
  },
};

export default apiClient;
