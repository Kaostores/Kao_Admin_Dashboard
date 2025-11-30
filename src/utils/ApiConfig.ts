import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const Instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});

// Set token in headers before each request
Instance.interceptors.request.use(
    (config) => {
        const token = cookies.get("Kao_cookie_admin");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
