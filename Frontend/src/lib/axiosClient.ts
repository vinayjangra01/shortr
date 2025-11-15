import axios from "axios";
import toast from "react-hot-toast";
import { config } from "@/config/config";


const axiosClient = axios.create({
  baseURL: config.BASE_URL,
  withCredentials: false,
  timeout: 15000,
});


axiosClient.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("token");

    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => response,

  (error) => {
    let message = "Something went wrong";

    if (!error.response) {
      toast.error("Network error. Please try again.");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case 400:
        message = data?.message || "Bad request";
        break;

      case 401:
        message = "Session expired. Please login again.";
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        break;

      case 403:
        message = "You are not allowed to perform this action.";
        break;

      case 404:
        message = "Resource not found.";
        break;

      case 500:
        message = "Server error. Please try again later.";
        break;

      default:
        message = data?.message || "Unexpected error occurred";
    }

    toast.error(message);
    return Promise.reject(error);
  }
);

export default axiosClient;
