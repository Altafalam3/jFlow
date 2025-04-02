/* eslint-disable no-undef */
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://0.0.0.0:8800",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  // console.log(token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;