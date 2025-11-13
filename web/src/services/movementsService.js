import axiosInstance from '../config/axios';

const BASE_URL = '/movements';

export const movementService = {
  // Get all movements
  getAll: async () => {
    return await axiosInstance.get(BASE_URL);
  },

  // Search employees for movements
  search: async (query) => {
    return await axiosInstance.get(`${BASE_URL}/search`, {
      params: { query },
    });
  },

  // Get movement by ID
  getById: async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}`);
  },

  // Check if movement exists
  checkExists: async (data) => {
    return await axiosInstance.post(`${BASE_URL}/check-exists`, data);
  },

  // Create new movement
  create: async (data) => {
    return await axiosInstance.post(BASE_URL, data);
  },

  // Update movement
  update: async (id, data) => {
    return await axiosInstance.put(`${BASE_URL}/${id}`, data);
  },

  // Delete movement
  delete: async (id) => {
    return await axiosInstance.delete(`${BASE_URL}/${id}`);
  },
};
