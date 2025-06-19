import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://todoapp-backend-production-2a47.up.railway.app/api", 
  timeout: 5000, 
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Ensure the key matches where you store the token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Add the token to the headers
  }
  return config;
});


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalUrl = error.config?.url;

    // Prevent redirect for failed login or register
    const isAuthRoute = originalUrl?.includes("/auth/login") || originalUrl?.includes("/auth/register");

    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      console.error("Unauthorized!");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);


export default apiClient;