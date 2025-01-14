import axios from "axios";

// Create an Axios instance
const instance = axios.create({
  baseURL: "https://nexterday.iotkiit.in/",
  timeout: 10000, // 10 seconds timeout
});

// Add a request interceptor to set the token dynamically
instance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("societyToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add a response interceptor (optional, for handling errors or logging)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle specific error statuses here
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized! Please login again.");
    }
    return Promise.reject(error);
  }
);

export default instance;
