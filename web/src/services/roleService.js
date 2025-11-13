import axiosInstance from '../config/axios';

const BASE_URL = '/role';

export const roleService = {
  // Get all roles
  getAll: async () => {
    return await axiosInstance.get(BASE_URL);
  },

  // Get role by ID
  getById: async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}`);
  },
};
