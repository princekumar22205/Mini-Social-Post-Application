import axios from "axios";

const API = axios.create({
  baseURL: "https://mini-social-post-application-vodu.onrender.com/api"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  // Don't set Content-Type for FormData - let axios handle it
  if (req.data instanceof FormData) {
    delete req.headers["Content-Type"];
  }
  return req;
});

export default API;
