import axiosInstance from '../config/axios';

const BASE_URL = '/employee-type';

export const employeeTypeService = {
  // Get all employee types
  getAll: async () => {
    return await axiosInstance.get(BASE_URL);
  },

  // Get employee type by ID
  getById: async (id) => {
    return await axiosInstance.get(`${BASE_URL}/${id}`);
  },
};
