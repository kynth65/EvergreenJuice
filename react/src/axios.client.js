import axios from "axios";

const axiosClient = axios.create({
    baseURL: `http://localhost:8000/api`,
});

// Request interceptor
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("ACCESS_TOKEN");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        try {
            const { response } = error;
            if (response?.status === 401) {
                localStorage.removeItem("ACCESS_TOKEN");
                window.location.reload();
            }
        } catch (e) {
            console.error("Error in interceptor:", e);
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
