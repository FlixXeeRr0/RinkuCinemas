import axios from "axios";
import { toast } from "react-toastify";
import { ERROR, SUCCESS } from "./mensajes";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  ({ data, status }) => {
    if (status === 201 || status === 204) {
      toast.success(SUCCESS);
    }
    return data;
  },
  (error) => {
    const response = error.response;
    let isMessage = false;

    if (
      response &&
      typeof response.data === "string" &&
      response.data.trim() !== ""
    ) {
      if (!response.data.includes("html")) isMessage = true;
    }

    toast.error(isMessage ? response?.data : ERROR, {
      toastId: `AXIOS_ERROR_${response?.status || 500}`,
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;
