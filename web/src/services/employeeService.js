import axiosInstance from '../config/axios';

const BASE_URL = '/employee';

export const employeeService = {
  // Get all employees
  getAll: async () => {
    return await axiosInstance.get(BASE_URL);
  },

  // Search employees by Code or Name (returns array)
  search: async (query) => {
    return await axiosInstance.get(`${BASE_URL}/search`, {
      params: { query },
    });
  },

  // Get employee by ID
  getById: async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}`);
  },

  // Check if employee exists
  checkExists: async (data) => {
    return await axiosInstance.post(`${BASE_URL}/check-exists`, data);
  },

  // Create new employee
  create: async (data) => {
    return await axiosInstance.post(BASE_URL, data);
  },

  // Update employee
  update: async (id, data) => {
    return await axiosInstance.put(`${BASE_URL}/${id}`, data);
  },

  // Delete employee
  delete: async (id) => {
    return await axiosInstance.delete(`${BASE_URL}/${id}`);
  },
};