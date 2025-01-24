import axios from "axios";

// Check for the presence of the API key
if (!process.env.REACT_APP_API_KEY) {
  throw new Error("Missing REACT_APP_API_KEY in environment variables");
}

// Base URL always points to the live production API
const baseURL = "https://cny2025backend-production.up.railway.app";

// Axios instance with fixed baseURL and headers
const axiosInstance = axios.create({
  baseURL,
  headers: { "X-API-Key": process.env.REACT_APP_API_KEY },
});

const useLanternsApi = () => {
  // Core function to handle all API calls
  const callApi = async ({ method, endpoint, data = {}, params = {} }) => {
    try {
      const response = await axiosInstance({
        method,
        url: endpoint,
        data,
        params,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "An unexpected error occurred.";
      console.error("API Error:", errorMessage); // Logs the actual issue for debugging
      throw errorMessage; // Sends the user-friendly error up the chain
    }
  };

  // Named wrapper functions for each endpoint
  const getAllLanterns = async () => callApi({ method: "GET", endpoint: "/lanterns/" });
  const getLanternById = async (id) => callApi({ method: "GET", endpoint: `/lanterns/${id}` });
  const createLantern = async (data) => callApi({ method: "POST", endpoint: "/lanterns/", data });
  const updateLantern = async (id, updates) =>
    callApi({ method: "PUT", endpoint: `/lanterns/${id}`, data: updates });
  const deleteLantern = async (id) => callApi({ method: "DELETE", endpoint: `/lanterns/${id}` });
  const searchLanterns = async (keyword) =>
    callApi({ method: "GET", endpoint: "/lanterns/search/", params: { keyword } });
  const getRandomLanterns = async (count = 20) =>
    callApi({ method: "GET", endpoint: "/lanterns/random/", params: { count } });
  const getLanternStats = async () => callApi({ method: "GET", endpoint: "/lanterns/stats/" });

  // Expose all methods
  return {
    getAllLanterns,
    getLanternById,
    createLantern,
    updateLantern,
    deleteLantern,
    searchLanterns,
    getRandomLanterns,
    getLanternStats,
  };
};

export default useLanternsApi;
