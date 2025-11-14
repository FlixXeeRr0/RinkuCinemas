import axiosInstance from '../config/axios';

const BASE_URL = '/reports';

export const reportService = {
  // Get available years for employee
  getYears: async (employeeId) => {
    return await axiosInstance.get(`${BASE_URL}/years/${employeeId}`);
  },

  // Get payroll report
  getPayroll: async (employeeId, month, year) => {
    return await axiosInstance.get(`${BASE_URL}/payroll/${employeeId}`, {
      params: { month, year },
    });
  },
};
