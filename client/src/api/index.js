import axios from "axios";

// TEMP: Hardcode baseURL to make sure it's working. After it works, switch back to process.env
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,  // Or process.env.REACT_APP_API_URL when ready
});

// 🔍 Add this interceptor for debugging outgoing requests
API.interceptors.request.use((config) => {
  console.log("➡️ API Request to:", config.baseURL + config.url);
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Optional: Add a response interceptor to debug responses too
API.interceptors.response.use((response) => {
  console.log("✅ API Response:", response);
  return response;
}, (error) => {
  console.error("❌ API Error:", error.response || error.message);
  return Promise.reject(error);
});

// AUTH Routes
export const UserSignUp = async (data) => API.post("/user/signup", data);
export const UserSignIn = async (data) => API.post("/user/signin", data);

// AUTHORIZED Routes
export const getDashboardDetails = async (token) =>
  await API.get("/user/dashboard", {
    headers: { Authorization: `Bearer ${token}` }
  });

export const getWorkouts = async (token, date) => {
  const queryParam = date ? `?date=${date}` : "";
  return await API.get(`/user/workouts${queryParam}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const postWorkout = async (token, data) =>
  await API.post("/user/workouts", data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const deleteWorkout = async (token, id) =>
  await API.delete(`/user/dashboard/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const getProfile = async (token) =>
  await API.get("/user/profile", {
    headers: { Authorization: `Bearer ${token}` }
  });
